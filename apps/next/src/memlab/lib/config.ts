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
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_DIR = path.join(__dirname, '../config');

/**
 * MemLab configuration options
 */
export interface MemLabConfig {
  /** Path to threshold configuration JSON file */
  thresholdFile: string;
  /** Path to baseline JSON file for regression tracking */
  baselineFile: string;
  /** Directory for storing heap snapshots */
  snapshotDir: string;
  /** Directory for storing analysis reports */
  reportsDir: string;
  /** Whether to clean up old snapshots automatically */
  cleanupSnapshots: boolean;
  /** Number of days to retain snapshots (for cleanup) */
  snapshotRetentionDays: number;
  /** Whether to update baseline with current results */
  updateBaseline: boolean;
  /** Enable debug logging */
  debug: boolean;
}

/**
 * Get MemLab configuration with environment variable overrides
 *
 * Environment variables:
 * - MEMLAB_THRESHOLD_FILE: Path to threshold config
 * - MEMLAB_BASELINE_FILE: Path to baseline file
 * - MEMLAB_SNAPSHOT_DIR: Directory for snapshots
 * - MEMLAB_REPORTS_DIR: Directory for reports
 * - MEMLAB_CLEANUP_SNAPSHOTS: Set to 'false' to disable cleanup
 * - MEMLAB_RETENTION_DAYS: Number of days to retain snapshots
 * - UPDATE_BASELINE: Set to 'true' to update baseline
 * - DEBUG_MEMLAB: Set to '1' for debug logging
 *
 * @returns Configuration object with defaults and env overrides
 */
export function getConfig(): MemLabConfig {
  return {
    thresholdFile:
      process.env.MEMLAB_THRESHOLD_FILE ||
      path.join(DEFAULT_CONFIG_DIR, 'thresholds.json'),
    baselineFile:
      process.env.MEMLAB_BASELINE_FILE ||
      path.join(DEFAULT_CONFIG_DIR, '.memlab-baseline.json'),
    snapshotDir: process.env.MEMLAB_SNAPSHOT_DIR || '/tmp/memlab-snapshots',
    reportsDir:
      process.env.MEMLAB_REPORTS_DIR || path.join(__dirname, '../reports'),
    cleanupSnapshots: process.env.MEMLAB_CLEANUP_SNAPSHOTS !== 'false',
    snapshotRetentionDays: Number.parseInt(
      process.env.MEMLAB_RETENTION_DAYS || '7',
      10,
    ),
    updateBaseline: process.env.UPDATE_BASELINE === 'true',
    debug: process.env.DEBUG_MEMLAB === '1',
  };
}

/**
 * Validation result for configuration
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate MemLab configuration
 *
 * Checks:
 * - Threshold file exists and is readable
 * - Snapshot directory is writable
 * - Reports directory is writable
 * - Retention days is a positive number
 *
 * @param config - Configuration to validate
 * @returns Validation result with errors and warnings
 */
export function validateConfig(config: MemLabConfig): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check threshold file
  if (fs.existsSync(config.thresholdFile)) {
    try {
      const content = fs.readFileSync(config.thresholdFile, 'utf-8');
      JSON.parse(content);
    } catch (_e) {
      errors.push(`Threshold file is not valid JSON: ${config.thresholdFile}`);
    }
  } else {
    errors.push(`Threshold file not found: ${config.thresholdFile}`);
  }

  // Check baseline file directory exists (file may not exist yet)
  const baselineDir = path.dirname(config.baselineFile);
  if (!fs.existsSync(baselineDir)) {
    warnings.push(
      `Baseline directory does not exist: ${baselineDir}. Will be created on first run.`,
    );
  }

  // Check snapshot directory
  if (fs.existsSync(config.snapshotDir)) {
    try {
      fs.accessSync(config.snapshotDir, fs.constants.W_OK);
    } catch {
      errors.push(`Snapshot directory is not writable: ${config.snapshotDir}`);
    }
  }

  // Check reports directory
  if (fs.existsSync(config.reportsDir)) {
    try {
      fs.accessSync(config.reportsDir, fs.constants.W_OK);
    } catch {
      errors.push(`Reports directory is not writable: ${config.reportsDir}`);
    }
  }

  // Validate retention days
  if (
    config.snapshotRetentionDays <= 0 ||
    !Number.isFinite(config.snapshotRetentionDays)
  ) {
    errors.push(
      `Invalid snapshot retention days: ${config.snapshotRetentionDays}. Must be a positive number.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log configuration (for debugging)
 */
export function logConfig(config: MemLabConfig): void {
  console.log('\n📋 MemLab Configuration:');
  console.log(`   Threshold file: ${config.thresholdFile}`);
  console.log(`   Baseline file: ${config.baselineFile}`);
  console.log(`   Snapshot dir: ${config.snapshotDir}`);
  console.log(`   Reports dir: ${config.reportsDir}`);
  console.log(`   Cleanup snapshots: ${config.cleanupSnapshots}`);
  console.log(`   Retention days: ${config.snapshotRetentionDays}`);
  console.log(`   Update baseline: ${config.updateBaseline}`);
  console.log(`   Debug mode: ${config.debug}`);
}

// Cached config instance
let cachedConfig: MemLabConfig | null = null;

/**
 * Get cached configuration (avoids re-reading env vars)
 */
export function getCachedConfig(): MemLabConfig {
  cachedConfig ??= getConfig();
  return cachedConfig;
}

/**
 * Clear cached configuration (useful for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
