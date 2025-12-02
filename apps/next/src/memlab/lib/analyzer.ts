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

import * as fs from 'node:fs';
import * as path from 'node:path';
import memlabApiDefault, { ConsoleMode, findLeaks } from '@memlab/api';
import { designToolkitFilter } from '../filters';
import {
  compareWithBaseline,
  formatBaselineComparison,
  getGitCommitHash,
  loadBaseline,
  saveBaseline,
  updateBaseline,
} from './baseline';
import { DEFAULT_MAX_RETAINED_SIZE, LEAK_PATTERNS } from './constants';
import { formatBytes } from './heap-snapshot';
import { validateThresholdJson } from './threshold-validator';
import { TimeoutError, withTimeout } from './timeout';
import type {
  AnalysisOptions,
  AnalysisResult,
  ComponentThreshold,
  LeakInfo,
  MemlabReport,
  ThresholdConfig,
} from './types';

/**
 * Default threshold configuration
 */
const DEFAULT_THRESHOLD: ComponentThreshold = {
  maxLeakedObjects: 0,
  maxRetainedSize: DEFAULT_MAX_RETAINED_SIZE,
};

// =============================================================================
// THRESHOLD CACHING
// =============================================================================

/** Cached threshold configuration */
let cachedThresholds: ThresholdConfig | null = null;

/** Path of the cached threshold file */
let cachedThresholdsPath: string | null = null;

/**
 * Get thresholds from cache or load from file
 *
 * @param thresholdFile - Path to threshold configuration file
 * @returns Threshold configuration (from cache if available)
 */
function getCachedThresholds(thresholdFile: string): ThresholdConfig {
  // Return cached if same file
  if (cachedThresholds && cachedThresholdsPath === thresholdFile) {
    return cachedThresholds;
  }

  // Load and validate
  if (!fs.existsSync(thresholdFile)) {
    return {
      global: DEFAULT_THRESHOLD,
      components: {},
    };
  }

  try {
    const content = fs.readFileSync(thresholdFile, 'utf-8');
    const validation = validateThresholdJson(content);

    if (!validation.valid) {
      console.warn('⚠️ Threshold config validation errors:');
      for (const error of validation.errors) {
        console.warn(`   ❌ ${error}`);
      }
      return {
        global: DEFAULT_THRESHOLD,
        components: {},
      };
    }

    // Log warnings but continue
    if (validation.warnings.length > 0) {
      for (const warning of validation.warnings) {
        console.warn(`   ⚠️ ${warning}`);
      }
    }

    cachedThresholds = JSON.parse(content);
    cachedThresholdsPath = thresholdFile;
    return cachedThresholds!;
  } catch (error) {
    console.warn(`⚠️ Failed to load threshold config: ${error}`);
    return {
      global: DEFAULT_THRESHOLD,
      components: {},
    };
  }
}

/**
 * Clear the threshold cache (useful for testing)
 */
export function clearThresholdCache(): void {
  cachedThresholds = null;
  cachedThresholdsPath = null;
}

// =============================================================================
// LEAK PARSING HELPERS
// =============================================================================

/**
 * Extract description and type from a leak key using regex patterns
 */
function parseLeakKeyDescription(
  key: string,
  current: { description: string; type: string | undefined },
): { description: string; type: string | undefined } {
  const detachedMatch = key.match(LEAK_PATTERNS.detached);
  if (detachedMatch?.[1]) {
    return {
      description: `Detached <${detachedMatch[1]}>`,
      type: 'detached-dom',
    };
  }

  const objectMatch = key.match(LEAK_PATTERNS.object);
  if (objectMatch?.[1] && !current.description.startsWith('Detached')) {
    return {
      description: objectMatch[1],
      type: objectMatch[2] ?? current.type,
    };
  }

  return current;
}

/**
 * Extract retained size from a leak key
 */
function parseLeakKeyRetainedSize(key: string, currentSize: number): number {
  const retainedMatch = key.match(LEAK_PATTERNS.retainedSize);
  if (retainedMatch?.[1]) {
    return Math.max(currentSize, Number.parseInt(retainedMatch[1], 10));
  }
  return currentSize;
}

/**
 * Extract retained size and type from nested tags object
 */
function parseLeakTags(
  value: unknown,
  current: { retainedSize: number; type: string | undefined },
): { retainedSize: number; type: string | undefined } {
  if (!value || typeof value !== 'object' || !('tags' in value)) {
    return current;
  }

  const tags = (value as { tags?: { retainedSize?: number; type?: string } })
    .tags;
  return {
    retainedSize: tags?.retainedSize
      ? Math.max(current.retainedSize, tags.retainedSize)
      : current.retainedSize,
    type: current.type ?? tags?.type,
  };
}

/**
 * Parse a raw leak object from MemLab into our LeakInfo type
 *
 * @param leak - Raw leak object from MemLab with descriptive keys
 * @returns Parsed LeakInfo with name, retainedSize, and type
 */
function parseLeakInfo(leak: Record<string, unknown>): LeakInfo {
  let description = 'Unknown';
  let retainedSize = 0;
  let type: string | undefined;

  for (const key of Object.keys(leak)) {
    const descResult = parseLeakKeyDescription(key, { description, type });
    description = descResult.description;
    type = descResult.type;

    retainedSize = parseLeakKeyRetainedSize(key, retainedSize);

    const tagResult = parseLeakTags(leak[key], { retainedSize, type });
    retainedSize = tagResult.retainedSize;
    type = tagResult.type;
  }

  return { name: description, retainedSize, type };
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validate snapshot directory exists and is accessible
 *
 * @param snapshotDir - Path to snapshot directory
 * @param componentName - Name of component being analyzed
 * @param startTime - Start time for duration calculation
 * @returns Error AnalysisResult if invalid, null if valid
 */
function validateSnapshotDirectory(
  snapshotDir: string,
  componentName: string,
  startTime: number,
): AnalysisResult | null {
  if (!(snapshotDir && fs.existsSync(snapshotDir))) {
    const errorMsg = `Snapshot directory not found: ${snapshotDir}`;
    console.error(`❌ [${componentName}] ${errorMsg}`);
    return {
      status: 'error',
      leaks: [],
      totalRetainedSize: 0,
      leakCount: 0,
      passed: false,
      error: 'Invalid snapshot directory',
      errorDetails: errorMsg,
      duration: Date.now() - startTime,
    };
  }
  return null;
}

// =============================================================================
// LOGGING HELPERS
// =============================================================================

/**
 * Log analysis results to console
 *
 * @param componentName - Name of component analyzed
 * @param leaks - Array of detected leaks
 * @param totalRetainedSize - Total retained size in bytes
 * @param threshold - Threshold configuration used
 * @param passed - Whether the analysis passed
 */
function logAnalysisResults(
  componentName: string,
  leaks: LeakInfo[],
  totalRetainedSize: number,
  threshold: ComponentThreshold,
  passed: boolean,
): void {
  console.log(`\n📊 [${componentName}] Memory Analysis Results:`);
  console.log(`   Leaks found: ${leaks.length}`);
  console.log(`   Retained size: ${formatBytes(totalRetainedSize)}`);
  console.log(
    `   Threshold: ${threshold.maxLeakedObjects} leaks / ${formatBytes(threshold.maxRetainedSize)}`,
  );
  console.log(`   Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  if (leaks.length > 0) {
    console.log('\n   Top leaks:');
    for (const [i, leak] of leaks.slice(0, 5).entries()) {
      console.log(
        `   ${i + 1}. ${leak.name || 'Unknown'} (${formatBytes(leak.retainedSize || 0)})`,
      );
    }
  }

  if (threshold.notes) {
    console.log(`\n   Notes: ${threshold.notes}`);
  }
}

// =============================================================================
// BASELINE HELPERS
// =============================================================================

/**
 * Handle baseline comparison and optional update
 *
 * @param result - Analysis result (without duration)
 * @param report - MemLab report for baseline update
 * @param options - Analysis options including baseline settings
 */
function handleBaselineComparison(
  result: { leaks: LeakInfo[]; totalRetainedSize: number; passed: boolean },
  report: MemlabReport,
  options: AnalysisOptions,
): void {
  if (!options.baselineFile) {
    return;
  }

  const baseline = loadBaseline(options.baselineFile);
  const comparison = compareWithBaseline(
    {
      status: 'success',
      leaks: result.leaks,
      totalRetainedSize: result.totalRetainedSize,
      leakCount: result.leaks.length,
      passed: result.passed,
    },
    options.componentName,
    baseline,
  );

  if (comparison) {
    console.log(formatBaselineComparison(comparison));
  } else {
    console.log(`\n   📊 No baseline found for ${options.componentName}`);
  }

  // Update baseline if requested
  if (options.updateBaseline) {
    const commitHash = getGitCommitHash();
    const updatedBaseline = updateBaseline(report, baseline, commitHash);
    saveBaseline(updatedBaseline, options.baselineFile);
  }
}

/** Timeout for MemLab analysis (2 minutes) */
const MEMLAB_ANALYSIS_TIMEOUT_MS = 120_000;

/**
 * Run MemLab leak detection and return parsed leaks
 *
 * @param reader - MemLab result reader
 * @param componentName - Component name for logging
 * @param startTime - Start time for duration calculation
 * @returns Object with leaks array, or AnalysisResult error on failure
 */
async function runLeakDetection(
  reader: ReturnType<
    typeof memlabApiDefault.BrowserInteractionResultReader.from
  >,
  componentName: string,
  startTime: number,
): Promise<{ leaks: LeakInfo[] } | AnalysisResult> {
  try {
    const useCustomFilter = process.env.MEMLAB_USE_CUSTOM_FILTER === 'true';

    // Wrap findLeaks with a timeout to prevent infinite hangs
    const rawLeaks = await withTimeout(
      findLeaks(reader, {
        consoleMode: ConsoleMode.SILENT,
        ...(useCustomFilter && { leakFilter: designToolkitFilter }),
      }),
      MEMLAB_ANALYSIS_TIMEOUT_MS,
      `MemLab analysis for ${componentName}`,
    );

    // Debug: Log raw leak structure for first leak
    if (rawLeaks.length > 0 && process.env.DEBUG_MEMLAB) {
      console.log(
        '\n🔬 Raw leak structure:',
        JSON.stringify(rawLeaks[0], null, 2),
      );
    }

    const leaks = rawLeaks.map((leak) => parseLeakInfo(leak));
    return { leaks };
  } catch (error) {
    // Handle timeout specifically
    if (error instanceof TimeoutError) {
      console.error(
        `⏱️ [${componentName}] Analysis timed out - treating as error`,
      );
      return {
        status: 'error',
        leaks: [],
        totalRetainedSize: 0,
        leakCount: 0,
        passed: false,
        error: 'Analysis timeout',
        errorDetails: error.message,
        duration: Date.now() - startTime,
      };
    }

    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ [${componentName}] Leak detection failed:`, error);
    return {
      status: 'error',
      leaks: [],
      totalRetainedSize: 0,
      leakCount: 0,
      passed: false,
      error: 'Leak detection failed',
      errorDetails: errorMsg,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Analyze heap snapshots for memory leaks using MemLab
 *
 * @param snapshotDir - Path to the directory containing snapshot data
 * @param options - Analysis configuration options
 * @returns Analysis results including detected leaks, pass/fail status, and operation status
 */
export async function analyzeSnapshots(
  snapshotDir: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  const startTime = Date.now();
  console.log(`\n🔍 [${options.componentName}] Analyzing heap snapshots...`);

  // Validate snapshot directory
  const validationError = validateSnapshotDirectory(
    snapshotDir,
    options.componentName,
    startTime,
  );
  if (validationError) {
    return validationError;
  }

  // Load threshold configuration (uses cache for performance)
  const thresholds = options.thresholdFile
    ? getCachedThresholds(options.thresholdFile)
    : { global: DEFAULT_THRESHOLD, components: {} };

  const componentThreshold: ComponentThreshold =
    thresholds.components?.[options.componentName] || thresholds.global;

  // Create result reader from snapshot directory
  const { BrowserInteractionResultReader } = memlabApiDefault;
  const reader = BrowserInteractionResultReader.from(snapshotDir);

  // Run leak detection
  const detectionResult = await runLeakDetection(
    reader,
    options.componentName,
    startTime,
  );
  if ('status' in detectionResult) {
    return detectionResult;
  }

  const { leaks } = detectionResult;

  // Calculate totals
  const totalRetainedSize = leaks.reduce(
    (sum, leak) => sum + (leak.retainedSize || 0),
    0,
  );

  // Determine pass/fail
  const passed =
    leaks.length <= componentThreshold.maxLeakedObjects &&
    totalRetainedSize <= componentThreshold.maxRetainedSize;

  // Generate report
  const report: MemlabReport = {
    component: options.componentName,
    timestamp: new Date().toISOString(),
    leakCount: leaks.length,
    totalRetainedSize,
    threshold: componentThreshold,
    passed,
    leaks,
  };

  // Ensure output directory exists and write report
  await fs.promises.mkdir(options.outputDir, { recursive: true });
  const reportPath = path.join(
    options.outputDir,
    `${options.componentName}.json`,
  );
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Log summary
  logAnalysisResults(
    options.componentName,
    leaks,
    totalRetainedSize,
    componentThreshold,
    passed,
  );

  // Baseline comparison if enabled
  handleBaselineComparison(
    { leaks, totalRetainedSize, passed },
    report,
    options,
  );

  return {
    status: 'success',
    leaks,
    totalRetainedSize,
    leakCount: leaks.length,
    passed,
    duration: Date.now() - startTime,
  };
}

/**
 * Load threshold configuration from file
 */
export function loadThresholds(configPath: string): ThresholdConfig {
  if (!fs.existsSync(configPath)) {
    return {
      global: DEFAULT_THRESHOLD,
      components: {},
    };
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    return {
      global: DEFAULT_THRESHOLD,
      components: {},
    };
  }
}
