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

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import { formatBytes } from './heap-snapshot';
import type { AnalysisResult, MemlabReport } from './types';

/**
 * Baseline entry for a component
 */
export interface BaselineEntry {
  /** Component name */
  component: string;
  /** Timestamp of baseline capture */
  timestamp: string;
  /** Git commit hash when baseline was captured */
  commitHash?: string;
  /** Number of leaks in baseline */
  leakCount: number;
  /** Total retained size in baseline */
  totalRetainedSize: number;
  /** Whether the baseline was passing */
  passed: boolean;
}

/**
 * Full baseline data structure
 */
export interface BaselineData {
  /** Version of baseline format */
  version: number;
  /** Last updated timestamp */
  lastUpdated: string;
  /** Component baselines */
  components: Record<string, BaselineEntry>;
  /** Historical trend data */
  history: Array<{
    timestamp: string;
    commitHash?: string;
    components: Record<
      string,
      { leakCount: number; totalRetainedSize: number }
    >;
  }>;
}

/**
 * Comparison result between current run and baseline
 */
export interface BaselineComparison {
  /** Component name */
  component: string;
  /** Current leak count */
  currentLeakCount: number;
  /** Baseline leak count */
  baselineLeakCount: number;
  /** Change in leak count */
  leakCountDelta: number;
  /** Current retained size */
  currentRetainedSize: number;
  /** Baseline retained size */
  baselineRetainedSize: number;
  /** Change in retained size */
  retainedSizeDelta: number;
  /** Whether this represents a regression */
  isRegression: boolean;
  /** Whether this represents an improvement */
  isImprovement: boolean;
}

const BASELINE_VERSION = 1;
const DEFAULT_BASELINE_PATH = '.memlab-baseline.json';

/**
 * Load baseline data from file
 */
export function loadBaseline(baselinePath?: string): BaselineData | null {
  const filePath = baselinePath || DEFAULT_BASELINE_PATH;

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    console.warn(`⚠️ Failed to load baseline from ${filePath}`);
    return null;
  }
}

/**
 * Save baseline data to file
 */
export function saveBaseline(data: BaselineData, baselinePath?: string): void {
  const filePath = baselinePath || DEFAULT_BASELINE_PATH;

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`📊 Baseline saved to ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to save baseline: ${error}`);
  }
}

/**
 * Update baseline with new results
 */
export function updateBaseline(
  report: MemlabReport,
  existingBaseline?: BaselineData | null,
  commitHash?: string,
): BaselineData {
  const now = new Date().toISOString();

  // Clone existing baseline to avoid mutating the input parameter
  const baseline: BaselineData = existingBaseline
    ? structuredClone(existingBaseline)
    : {
        version: BASELINE_VERSION,
        lastUpdated: now,
        components: {},
        history: [],
      };

  // Update component entry
  baseline.components[report.component] = {
    component: report.component,
    timestamp: now,
    commitHash,
    leakCount: report.leakCount,
    totalRetainedSize: report.totalRetainedSize,
    passed: report.passed,
  };

  baseline.lastUpdated = now;

  // Add to history (keep last 50 entries)
  const historyEntry = baseline.history.find(
    (h) =>
      h.commitHash === commitHash && h.timestamp.startsWith(now.slice(0, 10)),
  );

  if (historyEntry) {
    historyEntry.components[report.component] = {
      leakCount: report.leakCount,
      totalRetainedSize: report.totalRetainedSize,
    };
  } else {
    baseline.history.push({
      timestamp: now,
      commitHash,
      components: {
        [report.component]: {
          leakCount: report.leakCount,
          totalRetainedSize: report.totalRetainedSize,
        },
      },
    });

    // Keep only last 50 history entries
    if (baseline.history.length > 50) {
      baseline.history = baseline.history.slice(-50);
    }
  }

  return baseline;
}

/**
 * Compare current results against baseline
 */
export function compareWithBaseline(
  result: AnalysisResult,
  componentName: string,
  baseline: BaselineData | null,
): BaselineComparison | null {
  if (!baseline?.components[componentName]) {
    return null;
  }

  const baselineEntry = baseline.components[componentName];

  const leakCountDelta = result.leakCount - baselineEntry.leakCount;
  const retainedSizeDelta =
    result.totalRetainedSize - baselineEntry.totalRetainedSize;

  // Consider it a regression if leaks increased or retained size increased by >10%
  const isRegression =
    leakCountDelta > 0 ||
    retainedSizeDelta > baselineEntry.totalRetainedSize * 0.1;

  // Consider it an improvement if leaks decreased or retained size decreased by >10%
  const isImprovement =
    leakCountDelta < 0 ||
    retainedSizeDelta < -baselineEntry.totalRetainedSize * 0.1;

  return {
    component: componentName,
    currentLeakCount: result.leakCount,
    baselineLeakCount: baselineEntry.leakCount,
    leakCountDelta,
    currentRetainedSize: result.totalRetainedSize,
    baselineRetainedSize: baselineEntry.totalRetainedSize,
    retainedSizeDelta,
    isRegression,
    isImprovement,
  };
}

/**
 * Get trend icon based on delta value
 */
function getDeltaIcon(delta: number): string {
  if (delta > 0) {
    return '📈';
  }
  if (delta < 0) {
    return '📉';
  }
  return '➡️';
}

/**
 * Format baseline comparison for console output
 */
export function formatBaselineComparison(
  comparison: BaselineComparison,
): string {
  const lines: string[] = [];

  const leakIcon = getDeltaIcon(comparison.leakCountDelta);
  const sizeIcon = getDeltaIcon(comparison.retainedSizeDelta);

  lines.push(
    `\n📊 Baseline Comparison for ${comparison.component}:`,
    `   ${leakIcon} Leaks: ${comparison.currentLeakCount} (baseline: ${comparison.baselineLeakCount}, delta: ${comparison.leakCountDelta >= 0 ? '+' : ''}${comparison.leakCountDelta})`,
    `   ${sizeIcon} Retained: ${formatBytes(comparison.currentRetainedSize)} (baseline: ${formatBytes(comparison.baselineRetainedSize)}, delta: ${comparison.retainedSizeDelta >= 0 ? '+' : ''}${formatBytes(Math.abs(comparison.retainedSizeDelta))})`,
  );

  if (comparison.isRegression) {
    lines.push('   ⚠️ REGRESSION DETECTED');
  } else if (comparison.isImprovement) {
    lines.push('   ✅ IMPROVEMENT DETECTED');
  } else {
    lines.push('   ➡️ No significant change');
  }

  return lines.join('\n');
}

/**
 * Generate baseline report for multiple components
 */
export function generateBaselineReport(
  comparisons: BaselineComparison[],
): string {
  const lines: string[] = [];

  lines.push(
    `\n${'='.repeat(60)}`,
    '📊 BASELINE COMPARISON REPORT',
    '='.repeat(60),
  );

  const regressions = comparisons.filter((c) => c.isRegression);
  const improvements = comparisons.filter((c) => c.isImprovement);
  const unchanged = comparisons.filter(
    (c) => !(c.isRegression || c.isImprovement),
  );

  if (regressions.length > 0) {
    lines.push(`\n⚠️ Regressions: ${regressions.length}`);
    for (const r of regressions) {
      lines.push(
        `   - ${r.component}: +${r.leakCountDelta} leaks, +${formatBytes(Math.abs(r.retainedSizeDelta))}`,
      );
    }
  }

  if (improvements.length > 0) {
    lines.push(`\n✅ Improvements: ${improvements.length}`);
    for (const i of improvements) {
      lines.push(
        `   - ${i.component}: ${i.leakCountDelta} leaks, ${formatBytes(Math.abs(i.retainedSizeDelta))}`,
      );
    }
  }

  if (unchanged.length > 0) {
    lines.push(`\n➡️ Unchanged: ${unchanged.length}`);
    for (const u of unchanged) {
      lines.push(`   - ${u.component}`);
    }
  }

  lines.push(`\n${'='.repeat(60)}`);

  return lines.join('\n');
}

/**
 * Get current git commit hash
 */
export function getGitCommitHash(): string | undefined {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return undefined;
  }
}
