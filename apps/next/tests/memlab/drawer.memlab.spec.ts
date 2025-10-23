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

test.describe('Drawer Memory Leak Tests', () => {
  test('should not leak memory when opening and closing drawer 20 times', async ({
    page,
  }) => {
    //Persist tests snapshots to isolated dir
    const snapshotDir = join(DEFAULT_CONFIG.snapshotDir, 'drawer1');
    // Navigate to the kitchen sink page
    await page.goto('/kitchen-sink');
    await page.waitForLoadState('networkidle');

    // Force garbage collection and take baseline snapshot (s1)
    await page.requestGC();

    const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);
    // Perform multiple iterations of opening and closing the drawer
    for (let i = 1; i <= 20; i++) {
      await page.getByTestId('drawer-menu-a').click();
      await expect(page.getByText('View A')).toBeVisible({ timeout: 2000 });

      const closeButton = page.getByRole('button', { name: 'Close' });
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      await expect(page.getByText('View A')).not.toBeVisible();
    }

    // Take target snapshot (s2) - drawer open
    const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

    // Force GC and take final snapshot (s3)
    // Properly cleaned-up elements should be gone; leaked ones will remain as detached
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

  test('should not leak memory when switching between drawer views', async ({
    page,
  }) => {
    //Persist tests snapshots to isolated dir
    const snapshotDir = join(DEFAULT_CONFIG.snapshotDir, 'drawer2');
    await page.goto('/kitchen-sink');
    await page.waitForLoadState('networkidle');

    // Force GC and take baseline snapshot (s1)
    await page.requestGC();

    const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);

    // Cycle through views multiple times - this creates leaked elements
    for (let i = 1; i <= 5; i++) {
      // Hover to trigger tooltip, then click (simulating user behavior)
      await page.getByTestId('drawer-menu-a').click();
      await expect(page.getByText('View A')).toBeVisible({ timeout: 2000 });

      // Hover to trigger tooltip, then click
      await page.getByTestId('drawer-menu-b').click();
      await expect(page.getByText('View B')).toBeVisible({ timeout: 2000 });

      // Hover to trigger tooltip, then click
      await page.getByTestId('drawer-menu-c').click();
      await expect(page.getByText('View C')).toBeVisible({ timeout: 2000 });

      const closeButton = page.getByRole('button', { name: 'Close' });
      await closeButton.click();
      await expect(page.getByText('View C')).not.toBeVisible();
    }

    // Take target snapshot (s2)
    const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

    // Force GC and take final snapshot (s3)
    await page.requestGC();

    const finalSnapshot = await takeHeapSnapshot(page, 3, snapshotDir);

    // Analyze snapshots
    const result = await analyzeHeapSnapshots(
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
