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

import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  analyzeHeapSnapshots,
  DEFAULT_CONFIG,
  type MemLabResult,
  takeHeapSnapshot,
} from './utils/memlab-helpers';

test.describe
  .only('Tooltip Memory Leak Tests', () => {
    test('should not leak memory when toggling tooltip 20 times', async ({
      page,
    }) => {
      const snapshotDir = join(DEFAULT_CONFIG.snapshotDir, 'tooltip');

      // Navigate to the kitchen sink page
      await page.goto('/kitchen-sink');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Force garbage collection and take baseline snapshot (s1)
      await page.requestGC();

      const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);

      // Perform 20 iterations of toggling the tooltip open and closed
      for (let i = 1; i <= 20; i++) {
        // Click to open the tooltip
        await page.getByTestId('tooltip-trigger').click();

        await expect(
          page.getByText('This is a tooltip for memory testing'),
        ).toBeVisible({ timeout: 2000 });

        // Click to close the tooltip
        await page.getByTestId('tooltip-trigger').click();

        await expect(
          page.getByText('This is a tooltip for memory testing'),
        ).not.toBeVisible();
      }

      // Take target snapshot (s2)
      const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

      // Force GC and take final snapshot (s3)
      //await page.requestGC();

      const finalSnapshot = await takeHeapSnapshot(page, 3, snapshotDir);

      // Analyze snapshots using memlab with stricter thresholds
      const result: MemLabResult = await analyzeHeapSnapshots(
        baselineSnapshot,
        targetSnapshot,
        finalSnapshot,
        {
          maxMemoryGrowthMB: 0,
          maxRetainedObjects: 0,
          snapshotDir,
        },
      );

      expect(result.leakTraces).toHaveLength(0);
    });
  });
