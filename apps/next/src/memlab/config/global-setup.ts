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
import { getCachedConfig } from '../lib/config';

/**
 * Playwright global setup for MemLab tests
 *
 * Cleans up old snapshot directories to prevent disk space exhaustion.
 * Snapshots older than `snapshotRetentionDays` are removed.
 */
export default async function globalSetup() {
  const config = getCachedConfig();

  console.log('\n🧹 MemLab Global Setup');

  if (!config.cleanupSnapshots) {
    console.log('   Snapshot cleanup disabled');
    return;
  }

  const snapshotDir = config.snapshotDir;

  if (!fs.existsSync(snapshotDir)) {
    console.log(`   Snapshot directory does not exist: ${snapshotDir}`);
    return;
  }

  const now = Date.now();
  const retentionMs = config.snapshotRetentionDays * 24 * 60 * 60 * 1000;
  let cleanedCount = 0;
  let totalSize = 0;

  const entries = fs.readdirSync(snapshotDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirPath = path.join(snapshotDir, entry.name);

    try {
      const stats = fs.statSync(dirPath);
      const ageMs = now - stats.mtimeMs;

      if (ageMs > retentionMs) {
        // Calculate directory size before removal
        const size = getDirectorySize(dirPath);
        totalSize += size;

        fs.rmSync(dirPath, { recursive: true, force: true });
        cleanedCount++;
      }
    } catch (error) {
      console.warn(`   Warning: Failed to process ${entry.name}:`, error);
    }
  }

  if (cleanedCount > 0) {
    console.log(
      `   Cleaned ${cleanedCount} old snapshot(s), freed ${formatBytes(totalSize)}`,
    );
  } else {
    console.log('   No old snapshots to clean');
  }
}

/**
 * Calculate total size of a directory recursively
 */
function getDirectorySize(dirPath: string): number {
  let size = 0;

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        size += getDirectorySize(fullPath);
      } else {
        try {
          const stats = fs.statSync(fullPath);
          size += stats.size;
        } catch {
          // Ignore files we can't stat
        }
      }
    }
  } catch {
    // Ignore directories we can't read
  }

  return size;
}

/**
 * Format bytes into human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  if (bytes < 1073741824) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}
