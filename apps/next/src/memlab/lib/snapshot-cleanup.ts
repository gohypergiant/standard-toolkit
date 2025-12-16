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
import { formatBytes } from './heap-snapshot';

/**
 * Options for cleaning up old snapshots
 */
export interface CleanupOptions {
  /** Directory containing snapshot subdirectories */
  snapshotDir: string;
  /** Number of days to retain snapshots */
  retentionDays: number;
  /** If true, only report what would be deleted without actually deleting */
  dryRun?: boolean;
  /** If true, log verbose output */
  verbose?: boolean;
}

/**
 * Result of cleanup operation
 */
export interface CleanupResult {
  /** List of deleted directory names */
  deleted: string[];
  /** List of retained directory names */
  retained: string[];
  /** Error messages for failed deletions */
  errors: string[];
  /** Total bytes freed (actual or estimated for dry run) */
  freedBytes: number;
  /** Total bytes still retained */
  retainedBytes: number;
  /** Whether this was a dry run */
  dryRun: boolean;
}

/**
 * Get the total size of a directory recursively
 *
 * @param dirPath - Path to the directory
 * @returns Total size in bytes
 */
async function getDirSize(dirPath: string): Promise<number> {
  let size = 0;

  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += await getDirSize(fullPath);
      } else {
        try {
          const stats = await fs.promises.stat(fullPath);
          size += stats.size;
        } catch {
          // Skip files we can't stat
        }
      }
    }
  } catch {
    // Return 0 if we can't read the directory
  }

  return size;
}

/**
 * Get the creation time of a snapshot directory
 * First tries to parse timestamp from directory name, falls back to mtime
 */
async function getSnapshotCreationTime(
  dirPath: string,
  dirName: string,
): Promise<number | null> {
  const timestamp = Number.parseInt(dirName, 10);

  if (!Number.isNaN(timestamp) && timestamp > 0) {
    return timestamp;
  }

  try {
    const stats = await fs.promises.stat(dirPath);
    return stats.mtimeMs;
  } catch {
    return null;
  }
}

/**
 * Delete a snapshot directory and return the freed bytes
 */
async function deleteSnapshotDir(
  dirPath: string,
  dryRun: boolean,
): Promise<number> {
  const size = await getDirSize(dirPath);

  if (!dryRun) {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  }

  return size;
}

/**
 * Log verbose cleanup header information
 */
function logCleanupHeader(
  retentionDays: number,
  cutoffDate: number,
  snapshotDir: string,
  dryRun: boolean,
): void {
  console.log(`\n🧹 Cleaning up snapshots older than ${retentionDays} days`);
  console.log(`   Cutoff date: ${new Date(cutoffDate).toISOString()}`);
  console.log(`   Snapshot dir: ${snapshotDir}`);
  if (dryRun) {
    console.log('   Mode: DRY RUN (no files will be deleted)');
  }
}

/**
 * Log verbose cleanup summary
 */
function logCleanupSummary(result: CleanupResult): void {
  console.log('\n   Summary:');
  console.log(
    `   - Deleted: ${result.deleted.length} directories (${formatBytes(result.freedBytes)})`,
  );
  console.log(
    `   - Retained: ${result.retained.length} directories (${formatBytes(result.retainedBytes)})`,
  );
  if (result.errors.length > 0) {
    console.log(`   - Errors: ${result.errors.length}`);
  }
}

/**
 * Process a single snapshot directory for cleanup
 */
async function processSnapshotEntry(
  entry: fs.Dirent,
  snapshotDir: string,
  cutoffDate: number,
  dryRun: boolean,
  verbose: boolean,
  result: CleanupResult,
): Promise<void> {
  const dirPath = path.join(snapshotDir, entry.name);
  const createdTime = await getSnapshotCreationTime(dirPath, entry.name);

  if (createdTime === null) {
    result.errors.push(`Could not stat ${entry.name}`);
    return;
  }

  const shouldDelete = createdTime < cutoffDate;

  if (shouldDelete) {
    await handleDeletion(entry.name, dirPath, dryRun, verbose, result);
  } else {
    await handleRetention(entry.name, dirPath, result);
  }
}

/**
 * Handle deletion of an old snapshot directory
 */
async function handleDeletion(
  dirName: string,
  dirPath: string,
  dryRun: boolean,
  verbose: boolean,
  result: CleanupResult,
): Promise<void> {
  try {
    const size = await deleteSnapshotDir(dirPath, dryRun);
    result.deleted.push(dirName);
    result.freedBytes += size;

    if (verbose) {
      const action = dryRun ? '[DRY RUN] Would delete' : 'Deleted';
      console.log(`   ${action}: ${dirName} (${formatBytes(size)})`);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to delete ${dirName}: ${errorMsg}`);
  }
}

/**
 * Handle retention of a snapshot directory
 */
async function handleRetention(
  dirName: string,
  dirPath: string,
  result: CleanupResult,
): Promise<void> {
  result.retained.push(dirName);
  try {
    const size = await getDirSize(dirPath);
    result.retainedBytes += size;
  } catch {
    // Size calculation failed, but directory is still retained
  }
}

/**
 * Clean up old snapshot directories
 *
 * Removes snapshot directories older than the retention period.
 * Snapshot directories are expected to be named with timestamps (e.g., "1701234567890")
 * or to have mtime older than the retention period.
 *
 * @param options - Cleanup configuration
 * @returns Cleanup result with statistics
 *
 * @example
 * ```typescript
 * const result = await cleanupOldSnapshots({
 *   snapshotDir: '/tmp/memlab-snapshots',
 *   retentionDays: 7,
 *   dryRun: false,
 * });
 * console.log(`Freed ${formatBytes(result.freedBytes)}`);
 * ```
 */
export async function cleanupOldSnapshots(
  options: CleanupOptions,
): Promise<CleanupResult> {
  const {
    snapshotDir,
    retentionDays,
    dryRun = false,
    verbose = false,
  } = options;

  const result: CleanupResult = {
    deleted: [],
    retained: [],
    errors: [],
    freedBytes: 0,
    retainedBytes: 0,
    dryRun,
  };

  if (!fs.existsSync(snapshotDir)) {
    if (verbose) {
      console.log(`📁 Snapshot directory does not exist: ${snapshotDir}`);
    }
    return result;
  }

  const cutoffDate = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  if (verbose) {
    logCleanupHeader(retentionDays, cutoffDate, snapshotDir, dryRun);
  }

  try {
    const entries = await fs.promises.readdir(snapshotDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await processSnapshotEntry(
          entry,
          snapshotDir,
          cutoffDate,
          dryRun,
          verbose,
          result,
        );
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to read snapshot directory: ${errorMsg}`);
  }

  if (verbose) {
    logCleanupSummary(result);
  }

  return result;
}

/**
 * Format cleanup result for console output
 *
 * @param result - Cleanup result to format
 * @returns Formatted string
 */
export function formatCleanupResult(result: CleanupResult): string {
  const lines: string[] = [];

  lines.push(
    `\n🧹 Snapshot Cleanup ${result.dryRun ? '(DRY RUN)' : 'Complete'}`,
  );
  lines.push(
    `   Deleted: ${result.deleted.length} directories (${formatBytes(result.freedBytes)})`,
  );
  lines.push(
    `   Retained: ${result.retained.length} directories (${formatBytes(result.retainedBytes)})`,
  );

  if (result.errors.length > 0) {
    lines.push('\n   ⚠️ Errors:');
    for (const error of result.errors) {
      lines.push(`      - ${error}`);
    }
  }

  return lines.join('\n');
}

/**
 * Clean up snapshots for a specific component
 *
 * @param snapshotDir - Base snapshot directory
 * @param componentName - Name of the component
 * @param retentionDays - Number of days to retain
 * @param dryRun - If true, only report what would be deleted
 * @returns Cleanup result
 */
export function cleanupComponentSnapshots(
  snapshotDir: string,
  componentName: string,
  retentionDays: number,
  dryRun = false,
): Promise<CleanupResult> {
  const componentDir = path.join(snapshotDir, componentName);
  return cleanupOldSnapshots({
    snapshotDir: componentDir,
    retentionDays,
    dryRun,
  });
}

/**
 * Clean up all component snapshots
 *
 * @param snapshotDir - Base snapshot directory containing component subdirectories
 * @param retentionDays - Number of days to retain
 * @param dryRun - If true, only report what would be deleted
 * @param verbose - If true, log verbose output
 * @returns Combined cleanup result
 */
export async function cleanupAllSnapshots(
  snapshotDir: string,
  retentionDays: number,
  dryRun = false,
  verbose = false,
): Promise<CleanupResult> {
  const combinedResult: CleanupResult = {
    deleted: [],
    retained: [],
    errors: [],
    freedBytes: 0,
    retainedBytes: 0,
    dryRun,
  };

  if (!fs.existsSync(snapshotDir)) {
    return combinedResult;
  }

  try {
    const entries = await fs.promises.readdir(snapshotDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const componentDir = path.join(snapshotDir, entry.name);
      const result = await cleanupOldSnapshots({
        snapshotDir: componentDir,
        retentionDays,
        dryRun,
        verbose,
      });

      combinedResult.deleted.push(
        ...result.deleted.map((d) => `${entry.name}/${d}`),
      );
      combinedResult.retained.push(
        ...result.retained.map((r) => `${entry.name}/${r}`),
      );
      combinedResult.errors.push(...result.errors);
      combinedResult.freedBytes += result.freedBytes;
      combinedResult.retainedBytes += result.retainedBytes;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    combinedResult.errors.push(
      `Failed to read snapshot directory: ${errorMsg}`,
    );
  }

  return combinedResult;
}
