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
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

const require = createRequire(import.meta.url);
//not exported as ESM from memlab
const { BrowserInteractionResultReader, findLeaks } = require('memlab');

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
  /** Leak traces from memlab analysis */
  leakTraces: Awaited<ReturnType<typeof findLeaks>>;
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
  maxMemoryGrowthMB: 0.5,
  maxRetainedObjects: 1,
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
        // This matches memlab's pattern from E2EUtils.ts
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
            console.log(`   Captured ${chunkCount} chunks`);
            resolve();
          }
        } catch (_error) {
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
  snapshotDir = DEFAULT_CONFIG.snapshotDir,
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
          jsHeapSizeUsed: performance.memory.usedJSHeapSize,
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
      `   ...${snapshotNames[snapshotNumber]} snapshot size: ${MemoryUtils.formatMB(jsHeapSizeUsed)}`,
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
 * Analyze heap snapshots using memlab's BrowserInteractionResultReader and findLeaks API
 * This method uses the memlab API for analyzing snapshots with proper directory structure
 *
 * @param snapshotDir - Directory containing s1.heapsnapshot, s2.heapsnapshot, s3.heapsnapshot
 * @param baseline - Baseline snapshot metrics
 * @param target - Target snapshot metrics
 * @param final - Final snapshot metrics
 * @param config - Optional configuration
 * @returns Detailed analysis result with leak traces
 */
export async function analyzeHeapSnapshots(
  baseline: { jsHeapSizeUsed: number },
  target: { jsHeapSizeUsed: number },
  final: { jsHeapSizeUsed: number },
  config: Partial<MemLabConfig> = {},
): Promise<MemLabResult> {
  //const { copyFile, mkdir: mkdirAsync } = await import('node:fs/promises');
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { snapshotDir } = finalConfig;

  // Calculate basic memory growth
  const growthBytes = final.jsHeapSizeUsed - baseline.jsHeapSizeUsed;
  const growthMB = growthBytes / (1024 * 1024);

  const baselineSnapshotPath = join(snapshotDir, 's1.heapsnapshot');
  const targetSnapshotPath = join(snapshotDir, 's2.heapsnapshot');
  const finalSnapshotPath = join(snapshotDir, 's3.heapsnapshot');

  // Use BrowserInteractionResultReader + findLeaks for leak detection
  let leakTraces: Awaited<ReturnType<typeof findLeaks>> = [];

  try {
    // Create the memlab-expected directory structure
    const workDir = join(snapshotDir, 'memlab-workdir');
    const dataCurDir = join(workDir, 'data', 'cur');
    await mkdir(dataCurDir, { recursive: true });

    // Copy snapshot files to the expected location
    const snapshotFiles = [
      's1.heapsnapshot',
      's2.heapsnapshot',
      's3.heapsnapshot',
    ];

    for (const filename of snapshotFiles) {
      const srcPath = join(snapshotDir, filename);
      const destPath = join(dataCurDir, filename);
      if (existsSync(srcPath)) {
        await copyFile(srcPath, destPath);
      }
    }

    // Use BrowserInteractionResultReader + findLeaks
    const reader = new BrowserInteractionResultReader(workDir);
    leakTraces = await findLeaks(reader);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.warn('!  Memlab analysis encountered an issue:', errorMessage);
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
    } catch (error) {
      console.warn('!  Failed to save leak trace report:', error);
    }
  }

  return {
    memoryGrowthBytes: growthBytes,
    memoryGrowthMB: growthMB,
    retainedObjects: leakTraces.length,
    leakTraces,
    thresholdExceeded,
    warnings,
    snapshotPaths: [
      baselineSnapshotPath,
      targetSnapshotPath,
      finalSnapshotPath,
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

    return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
  },

  formatMB(bytes: number, decimals = 2): string {
    return `${(bytes / (1024 * 1024)).toFixed(decimals)} MB`;
  },
};
