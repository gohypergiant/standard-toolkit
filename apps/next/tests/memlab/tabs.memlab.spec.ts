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

test.describe('Tabs Memory Leak Tests', () => {
  test('should not leak memory when switching between Tab 1 and Tab 2 20 times', async ({
    page,
  }) => {
    // Persist tests snapshots to isolated dir
    const snapshotDir = join(DEFAULT_CONFIG.snapshotDir, 'tabs1');
    // Navigate to the kitchen sink page
    await page.goto('/kitchen-sink');
    await page.waitForLoadState('networkidle');

    // Force garbage collection and take baseline snapshot (s1)
    await page.requestGC();

    const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);

    // Switch between Tab 1 and Tab 2 20 times
    for (let i = 1; i <= 20; i++) {
      // Click Tab 2
      await page.getByTestId('tab-2').click();
      await expect(page.getByTestId('content-2')).toBeVisible({
        timeout: 2000,
      });

      // Click Tab 1
      await page.getByTestId('tab-1').click();
      await expect(page.getByTestId('content-1')).toBeVisible({
        timeout: 2000,
      });
    }

    // Take target snapshot (s2)
    const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

    // Force GC and take final snapshot (s3)
    await page.requestGC();

    const finalSnapshot = await takeHeapSnapshot(page, 3, snapshotDir);

    // Analyze snapshots using memlab
    const result: MemLabResult = await analyzeHeapSnapshots(
      baselineSnapshot,
      targetSnapshot,
      finalSnapshot,
      {
        maxMemoryGrowthMB: 0,
        maxRetainedObjects: 1, // Allow 1 retained object (known stylesheet issue)
        snapshotDir,
      },
    );

    expect(result.leakTraces).toHaveLength(0);
  });
});
