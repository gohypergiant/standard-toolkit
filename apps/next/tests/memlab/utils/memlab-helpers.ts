/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { appendFileSync, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

const require = createRequire(import.meta.url);
//not exported as ESM from memlab
const { findLeaksBySnapshotFilePaths } = require('memlab');

import type { ISerializedInfo } from 'memlab';

/**
 * Configuration for memory leak detection thresholds
 */
export interface MemLabConfig {
  /** Maximum allowed memory growth in MB before warning */
  maxMemoryGrowthMB: number;
  /** Maximum allowed retained objects before warning */
  maxRetainedObjects: number;
  /** Directory to store heap snapshots */
  snapshotDir: string;
}

/**
 * Result of memory leak analysis
 */
export interface MemLabResult {
  /** Total memory growth in bytes */
  memoryGrowthBytes: number;
  /** Total memory growth in MB */
  memoryGrowthMB: number;
  /** Number of retained objects */
  retainedObjects: number;
  /** Number of detached DOM elements */
  detachedDOMElements: number;
  /** Leak traces from memlab analysis */
  leakTraces: ISerializedInfo[];
  /** Whether thresholds were exceeded */
  thresholdExceeded: boolean;
  /** Warning messages if any */
  warnings: string[];
  /** Path to snapshot files */
  snapshotPaths: string[];
}

/**
 * Default memlab configuration
 */
export const DEFAULT_CONFIG: MemLabConfig = {
  maxMemoryGrowthMB: 10,
  maxRetainedObjects: 1000,
  snapshotDir: './tests/memlab/snapshots',
};

/**
 * Helper to capture heap snapshot via CDP (Chrome DevTools Protocol) using memlab's streaming pattern
 * Appends chunks as they arrive (memlab's official pattern from E2EUtils.ts)
 */
function captureHeapSnapshot(cdpSession: any, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let chunkCount = 0;

    const cleanup = () => {
      cdpSession.off('HeapProfiler.addHeapSnapshotChunk', onChunk);
    };

    const onChunk = (params: { chunk: string }) => {
      try {
        // Use synchronous append to write chunks immediately as they arrive
        // This matches memlab's official pattern from E2EUtils.ts
        appendFileSync(filePath, params.chunk, 'UTF-8');
        chunkCount++;
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    // Register listener for snapshot chunks
    cdpSession.on('HeapProfiler.addHeapSnapshotChunk', onChunk);

    // Set a timeout to detect when chunking is complete
    // CDP does not send a "done" event
    // Memlab uses a 30-second wait period
    const checkInterval = setInterval(async () => {
      if (chunkCount > 0 && existsSync(filePath)) {
        try {
          // Verify the snapshot is complete by checking if it ends with '}'
          const content = await readFile(filePath, 'utf-8');
          if (content.trim().endsWith('}')) {
            clearInterval(checkInterval);
            cleanup();
            console.log(`  Captured ${chunkCount} chunks`);
            resolve();
          }
        } catch (error) {
          // Continue waiting if file isn't ready yet
        }
      }
    }, 500);

    // Safety timeout after 60 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      cleanup();
      if (chunkCount === 0) {
        reject(new Error('No heap snapshot chunks received after 60 seconds'));
      } else {
        // If we got chunks but never saw the closing }, still resolve
        console.warn(
          `  Warning: Snapshot may be incomplete (${chunkCount} chunks received)`,
        );
        resolve();
      }
    }, 60000);
  });
}

/**
 * Format a single leak trace in memlab CLI style
 * Based on: https://facebook.github.io/memlab/docs/guides/guides-detached-dom#3-debug-leak-trace
 */
function formatLeakTrace(leak: ISerializedInfo, idx: number): string[] {
  const lines: string[] = [];

  // Header with leak number
  lines.push('');
  lines.push(`──────────────────────────────────────────────────────────────`);
  lines.push(`Leak Trace #${idx}`);
  lines.push(`──────────────────────────────────────────────────────────────`);

  // Memlab stores leak traces with keys like:
  // "0: [Window](native) @76989 $retained-size:18700   $snapshotIdTag:1 "
  // "1:   --3 (element)--->  [HTMLDocument](native) @77003 $retained-size:25408   $snapshotIdTag:1 "

  // Find all keys that start with numbers (these are the trace steps)
  const traceKeys = Object.keys(leak)
    .filter((k) => /^\d+:/.test(k))
    .sort((a, b) => {
      const aNum = Number.parseInt(a.split(':')[0], 10);
      const bNum = Number.parseInt(b.split(':')[0], 10);
      return aNum - bNum;
    });

  if (traceKeys.length > 0) {
    lines.push('');
    lines.push('Retention Path:');

    // Extract the path description from each key
    traceKeys.forEach((key, i) => {
      // The key itself contains the path information
      // Example: "1:   --3 (element)--->  [HTMLDocument](native) @77003"
      let pathInfo = key.split('$')[0].trim(); // Remove $ metadata

      // Extract just the node description after the arrow
      const arrowMatch = pathInfo.match(/--.*?--->\s*(.+)/);
      if (arrowMatch) {
        pathInfo = arrowMatch[1];
      } else {
        // For the first entry (no arrow), extract the bracketed content
        const bracketMatch = pathInfo.match(/\[(.*?)\]/);
        if (bracketMatch) {
          pathInfo = `[${bracketMatch[1]}]`;
        }
      }

      // Add size information if available
      const sizeMatch = key.match(/\$retained-size:(\d+)/);
      if (sizeMatch) {
        const sizeKB = (Number.parseInt(sizeMatch[1], 10) / 1024).toFixed(1);
        pathInfo += ` [${sizeKB} KB]`;
      }

      // Add ID if available
      const idMatch = key.match(/@(\d+)/);
      if (idMatch) {
        pathInfo += ` @${idMatch[1]}`;
      }

      const indent = '  '.repeat(i);
      const connector = i === 0 ? '' : '↓ ';
      lines.push(`${indent}${connector}${pathInfo}`);
    });

    // Find the leaked object (the last one with $memLabTag:leaked or $highlight)
    const leakedKey = traceKeys.find(
      (k) => k.includes('$memLabTag:leaked') || k.includes('$highlight'),
    );
    if (leakedKey) {
      const leakedMatch = leakedKey.match(/\[(.*?)\]/);
      if (leakedMatch) {
        lines.push('');
        lines.push('Summary:');
        lines.push(`  Leaked Object: ${leakedMatch[1]}`);

        const sizeMatch = leakedKey.match(/\$retained-size:(\d+)/);
        if (sizeMatch) {
          lines.push(
            `  Retained Size: ${(Number.parseInt(sizeMatch[1], 10) / 1024).toFixed(2)} KB`,
          );
        }
      }
    }
  }

  return lines;
}

/**
 * Format memory leak results for logging
 *
 * @param result - Memory leak analysis result
 * @returns Formatted string
 */
export function formatMemLabResult(result: MemLabResult): string {
  const lines = [
    '=== Memory Leak Analysis ===',
    `Memory Growth: ${result.memoryGrowthMB.toFixed(2)} MB`,
    `Retained Objects: ${result.retainedObjects}`,
    `Detached DOM Elements: ${result.detachedDOMElements}`,
    `Threshold Exceeded: ${result.thresholdExceeded ? 'YES' : 'NO'}`,
  ];

  if (result.leakTraces.length > 0) {
    lines.push(`\nLeak Traces Found: ${result.leakTraces.length}`);

    // Show detailed info for first 3 leaks
    result.leakTraces.slice(0, 3).forEach((leak, idx) => {
      lines.push(...formatLeakTrace(leak, idx + 1));
    });

    if (result.leakTraces.length > 3) {
      lines.push(
        `\n  ... and ${result.leakTraces.length - 3} more (see leak-traces.json)`,
      );
    }
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  - ${warning}`);
    });
  }

  return lines.join('\n');
}

/**
 * Take a heap snapshot using CDP (Chrome DevTools Protocol)
 * Uses memlab's official Playwright integration pattern
 * MemLab's snapshot functions expect Puppeteer's CDP session
 * Playwright has a different CDP API structure
 * This function uses the Playwright CDP API directly
 *
 * @param page - Playwright page instance
 * @param snapshotNumber - Snapshot number (1=baseline, 2=target, 3=final)
 * @param snapshotDir - Directory to store snapshot files
 * @returns Snapshot metadata including file path
 */
export async function takeHeapSnapshot(
  page: Page,
  snapshotNumber: 1 | 2 | 3,
  snapshotDir = './tests/memlab/snapshots',
): Promise<{
  snapshotNumber: number;
  filePath: string;
  jsHeapSizeUsed: number;
}> {
  const snapshotNames = {
    1: 'baseline',
    2: 'target',
    3: 'final',
  };
  console.log(
    `\n📸 Taking ${snapshotNames[snapshotNumber]} snapshot (s${snapshotNumber})...`,
  );
  // Ensure snapshot directory exists
  await mkdir(snapshotDir, { recursive: true });

  // Create CDP session
  const cdpSession = await page.context().newCDPSession(page);

  try {
    // Get current memory metrics
    const metrics = await page.evaluate(() => {
      if ('memory' in performance && performance.memory) {
        return {
          jsHeapSizeUsed: (performance.memory as any).usedJSHeapSize,
        };
      }
      return null;
    });

    // Use memlab's s1/s2/s3 naming convention
    const filePath = join(snapshotDir, `s${snapshotNumber}.heapsnapshot`);

    // Create empty file (will be appended to by captureHeapSnapshot)
    await writeFile(filePath, '', 'UTF-8');

    await cdpSession.send('HeapProfiler.enable');

    // Set up listener and capture snapshot
    const capturePromise = captureHeapSnapshot(cdpSession, filePath);

    // Trigger the snapshot
    await cdpSession.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: true,
    });

    // Wait for all chunks to be written
    await capturePromise;

    await cdpSession.send('HeapProfiler.disable');
    const jsHeapSizeUsed = metrics?.jsHeapSizeUsed || 0;
    console.log(
      `✓ ${snapshotNames[snapshotNumber]} snapshot size: ${MemoryUtils.formatMB(jsHeapSizeUsed)}`,
    );

    return {
      snapshotNumber,
      filePath,
      jsHeapSizeUsed,
    };
  } finally {
    await cdpSession.detach();
  }
}

/**
 * Analyze heap snapshots using memlab's official Playwright integration API
 *
 * @param snapshotDir - Directory containing s1.heapsnapshot, s2.heapsnapshot, s3.heapsnapshot
 * @param baseline - Baseline snapshot metrics
 * @param target - Target snapshot metrics
 * @param final - Final snapshot metrics
 * @param config - Optional configuration
 * @returns Detailed analysis result with leak traces
 */
export async function analyzeHeapSnapshots(
  snapshotDir: string,
  baseline: { jsHeapSizeUsed: number },
  target: { jsHeapSizeUsed: number },
  final: { jsHeapSizeUsed: number },
  config: Partial<MemLabConfig> = {},
): Promise<MemLabResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Calculate basic memory growth
  const growthBytes = final.jsHeapSizeUsed - baseline.jsHeapSizeUsed;
  const growthMB = growthBytes / (1024 * 1024);

  // Use memlab to analyze heap snapshots for leaks
  let leakTraces: ISerializedInfo[] = [];
  let detachedDOMElements = 0;

  try {
    console.log('🔍 Running memlab analysis...');

    // Use findLeaksBySnapshotFilePaths instead of BrowserInteractionResultReader
    // to avoid worker process conflicts in Playwright
    const baselineSnapshotPath = join(snapshotDir, 's1.heapsnapshot');
    const targetSnapshotPath = join(snapshotDir, 's2.heapsnapshot');
    const finalSnapshotPath = join(snapshotDir, 's3.heapsnapshot');

    leakTraces = await findLeaksBySnapshotFilePaths(
      baselineSnapshotPath,
      targetSnapshotPath,
      finalSnapshotPath,
      {
        workDir: snapshotDir,
        consoleMode: 'SILENT' as any,
      },
    );

    console.log(`✓ Found ${leakTraces.length} leak trace(s)`);

    // Count detached DOM elements from leak traces
    detachedDOMElements = leakTraces.filter((leak) => {
      const type = leak.type?.toLowerCase() || '';
      const name = leak.name?.toLowerCase() || '';
      return (
        type.includes('detached') ||
        type.includes('dom') ||
        name.includes('detached') ||
        name.includes('htmlelement') ||
        name.includes('htmldivelement')
      );
    }).length;

    if (detachedDOMElements > 0) {
      console.log(
        `⚠️  Identified ${detachedDOMElements} detached DOM element(s)`,
      );
    }
  } catch (error: any) {
    console.warn(
      '⚠️  Memlab analysis encountered an issue:',
      error?.message || error,
    );
    console.warn('Continuing with basic heap size analysis only...');
  }

  // Generate warnings
  const warnings: string[] = [];
  let thresholdExceeded = false;

  if (growthMB > finalConfig.maxMemoryGrowthMB) {
    warnings.push(
      `Memory growth of ${growthMB.toFixed(2)} MB exceeds threshold of ${finalConfig.maxMemoryGrowthMB} MB`,
    );
    thresholdExceeded = true;
  }

  if (detachedDOMElements > 0) {
    warnings.push(
      `Found ${detachedDOMElements} detached DOM element(s) - potential memory leak`,
    );
    thresholdExceeded = true;
  }

  if (leakTraces.length > finalConfig.maxRetainedObjects) {
    warnings.push(
      `Found ${leakTraces.length} retained objects, exceeds threshold of ${finalConfig.maxRetainedObjects}`,
    );
    thresholdExceeded = true;
  }

  // Save detailed leak traces to JSON file for analysis
  if (leakTraces.length > 0) {
    try {
      const leakReportPath = join(snapshotDir, 'leak-traces.json');
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalLeaks: leakTraces.length,
          memoryGrowthMB: growthMB,
          detachedDOMElements,
          thresholdExceeded,
        },
        snapshots: {
          baseline: baseline.jsHeapSizeUsed,
          target: target.jsHeapSizeUsed,
          final: final.jsHeapSizeUsed,
        },
        leakTraces,
      };
      await writeFile(
        leakReportPath,
        JSON.stringify(reportData, null, 2),
        'UTF-8',
      );
      console.log(`📄 Detailed leak report saved to: ${leakReportPath}`);
    } catch (error) {
      console.warn('⚠️  Failed to save leak trace report:', error);
    }
  }

  return {
    memoryGrowthBytes: growthBytes,
    memoryGrowthMB: growthMB,
    retainedObjects: leakTraces.length,
    detachedDOMElements,
    leakTraces,
    thresholdExceeded,
    warnings,
    snapshotPaths: [
      join(snapshotDir, 's1.heapsnapshot'),
      join(snapshotDir, 's2.heapsnapshot'),
      join(snapshotDir, 's3.heapsnapshot'),
    ],
  };
}

/**
 * Memory unit conversion utilities
 */
export const MemoryUtils = {
  bytesToKB: (bytes: number): number => bytes / 1024,
  bytesToMB: (bytes: number): number => bytes / (1024 * 1024),
  bytesToGB: (bytes: number): number => bytes / (1024 * 1024 * 1024),

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  },

  formatMB(bytes: number, decimals = 2): string {
    return `${(bytes / (1024 * 1024)).toFixed(decimals)} MB`;
  },
};

/**
 * Log memory leak test results with consistent formatting
 *
 * @param result - The MemLab analysis result
 * @param options - Optional configuration for logging
 */
export function logMemLabResult(
  result: MemLabResult,
  options: {
    /** Whether to fail the test on warnings (default: false) */
    failOnWarnings?: boolean;
  } = {},
): void {
  const { failOnWarnings = false } = options;

  // Log formatted results
  console.log(`\n${formatMemLabResult(result)}`);

  // Handle warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Memory leak warnings:');
    result.warnings.forEach((warning) => {
      console.warn(`   ${warning}`);
    });

    if (failOnWarnings) {
      console.error('\n❌ Test failed due to memory leak warnings.');
    } else {
      console.warn('\n📊 Test configured to report warnings without failing.');
    }
  } else {
    console.log('\n✅ No memory leaks detected');
  }
}

/**
 * Force garbage collection in the browser
 * Note: Requires Chrome/Chromium to be launched with --js-flags=--expose-gc
 *
 * @param page - Playwright page instance
 * @param waitMs - Optional wait time after GC (default: 0)
 * @returns Promise that resolves when GC is complete
 */
export async function forceGarbageCollection(
  page: Page,
  waitMs = 0,
): Promise<void> {
  await page.evaluate(() => {
    if (window.gc) {
      window.gc();
    }
  });

  if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }
}
