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

/**
 * Metadata for a single heap snapshot
 */
export interface SnapshotMetadata {
  /** Human-readable name for this snapshot step */
  name: string;
  /** Whether a heap snapshot was captured */
  snapshot: boolean;
  /** Type of snapshot in the baseline/target/final sequence */
  type: 'baseline' | 'target' | 'final';
  /** Index used to locate corresponding snapshot file */
  idx: number;
  /** Heap size in bytes at time of snapshot */
  // biome-ignore lint/style/useNamingConvention: matches MemLab's expected snap-seq.json format
  JSHeapUsedSize: number;
}

/**
 * Browser and run metadata for MemLab analysis
 */
export interface RunMetadata {
  app: string;
  type: string;
  interaction: string;
  browserInfo: {
    _browserVersion: string;
    _puppeteerConfig: {
      headless: boolean;
      defaultViewport: {
        width: number;
        height: number;
      };
    };
  };
}

/**
 * Status of an analysis operation
 */
export type AnalysisStatus = 'success' | 'error' | 'skipped';

/**
 * Result from MemLab analysis
 */
export interface AnalysisResult {
  /** Status of the analysis operation */
  status: AnalysisStatus;
  /** Array of detected memory leaks */
  leaks: LeakInfo[];
  /** Total retained size of all leaks in bytes */
  totalRetainedSize: number;
  /** Number of leaks detected */
  leakCount: number;
  /** Whether the test passed threshold requirements */
  passed: boolean;
  /** Error message if status is 'error' */
  error?: string;
  /** Detailed error information */
  errorDetails?: string;
  /** Duration of analysis in milliseconds */
  duration?: number;
}

/**
 * Result from baseline comparison
 */
export interface BaselineComparisonResult {
  /** Status of the comparison operation */
  status: AnalysisStatus;
  /** Whether a baseline exists for comparison */
  hasBaseline: boolean;
  /** Change in leak count from baseline */
  leakDelta: number;
  /** Change in retained size from baseline */
  retainedDelta: number;
  /** Whether this represents a regression (more leaks than baseline) */
  isRegression: boolean;
  /** Whether this represents an improvement (fewer leaks than baseline) */
  isImprovement: boolean;
  /** Error message if status is 'error' */
  error?: string;
}

/**
 * Information about a detected memory leak
 */
export interface LeakInfo {
  /** Name/type of the leaked object */
  name?: string;
  /** Retained size in bytes */
  retainedSize?: number;
  /** Type of heap object */
  type?: string;
}

/**
 * Options for running memory analysis
 */
export interface AnalysisOptions {
  /** Path to threshold configuration file */
  thresholdFile?: string;
  /** Name of the component being tested */
  componentName: string;
  /** Directory to write reports to */
  outputDir: string;
  /** Path to baseline file for regression tracking */
  baselineFile?: string;
  /** Whether to update baseline with current results */
  updateBaseline?: boolean;
}

/**
 * Threshold configuration for a component
 */
export interface ComponentThreshold {
  /** Maximum number of leaked objects allowed */
  maxLeakedObjects: number;
  /** Maximum retained size in bytes allowed */
  maxRetainedSize: number;
  /** Optional notes about expected behavior */
  notes?: string;
  /** Known issues that are accepted */
  knownIssues?: string[];
}

/**
 * Full threshold configuration
 */
export interface ThresholdConfig {
  /** Global threshold defaults */
  global: ComponentThreshold;
  /** Component-specific thresholds */
  components: Record<string, ComponentThreshold>;
  /** Baseline tracking configuration */
  baseline?: {
    enabled: boolean;
    file: string;
    trackTrends: boolean;
  };
}

/**
 * Report generated after analysis
 */
export interface MemlabReport {
  /** Component name */
  component: string;
  /** ISO timestamp */
  timestamp: string;
  /** Number of leaks detected */
  leakCount: number;
  /** Total retained size in bytes */
  totalRetainedSize: number;
  /** Threshold configuration used */
  threshold: ComponentThreshold;
  /** Whether the test passed */
  passed: boolean;
  /** Summary of detected leaks */
  leaks: LeakInfo[];
}
