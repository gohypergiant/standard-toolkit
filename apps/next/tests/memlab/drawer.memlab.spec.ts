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

import { expect, test } from '@playwright/test';
import {
  analyzeHeapSnapshots,
  forceGarbageCollection,
  logMemLabResult,
  type MemLabResult,
  takeHeapSnapshot,
} from './utils/memlab-helpers';

test.describe('Drawer Memory Leak Tests', () => {
  test('should not leak memory when opening and closing drawer 5 times', async ({
    page,
  }) => {
    const snapshotDir = './tests/memlab/snapshots';

    // Navigate to the kitchen sink page
    await page.goto('/kitchen-sink');
    await page.waitForLoadState('networkidle');

    // Force garbage collection and take baseline snapshot (s1)
    await forceGarbageCollection(page);

    const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);

    // Perform 5 iterations of opening and closing the drawer
    for (let i = 1; i <= 20; i++) {
      await page.getByTestId('drawer-menu-a').click();
      await expect(page.getByText('View A')).toBeVisible({ timeout: 2000 });

      const closeButton = page.getByRole('button', { name: 'Close' });
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      await expect(page.getByText('View A')).not.toBeVisible();
    }

    // Take target snapshot (s2) - drawer open
    await page.getByTestId('drawer-menu-a').click();
    await expect(page.getByText('View A')).toBeVisible({ timeout: 2000 });

    const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

    // Close drawer
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();

    // Force GC and take final snapshot (s3)
    await forceGarbageCollection(page);

    const finalSnapshot = await takeHeapSnapshot(page, 3, snapshotDir);

    // Analyze snapshots using memlab
    const result: MemLabResult = await analyzeHeapSnapshots(
      snapshotDir,
      baselineSnapshot,
      targetSnapshot,
      finalSnapshot,
      {
        maxMemoryGrowthMB: 0.5,
        maxRetainedObjects: 0,
        snapshotDir,
      },
    );

    logMemLabResult(result);

    expect(result).toBeDefined();
  });

  test('should not leak memory when switching between drawer views', async ({
    page,
  }) => {
    const snapshotDir = './tests/memlab/snapshots-views';

    await page.goto('/kitchen-sink');
    await page.waitForLoadState('networkidle');

    // Force GC and take baseline snapshot (s1)
    await forceGarbageCollection(page);

    const baselineSnapshot = await takeHeapSnapshot(page, 1, snapshotDir);

    // Cycle through views
    for (let i = 1; i <= 3; i++) {
      await page.getByTestId('drawer-menu-a').click();
      await expect(page.getByText('View A')).toBeVisible();

      await page.getByTestId('drawer-menu-b').click();
      await expect(page.getByText('View B')).toBeVisible();

      await page.getByTestId('drawer-menu-c').click();
      await expect(page.getByText('View C')).toBeVisible();

      const closeButton = page.getByRole('button', { name: 'Close' });
      await closeButton.click();
    }

    // Take target snapshot (s2) - drawer with views
    await page.getByTestId('drawer-menu-a').click();
    await expect(page.getByText('View A')).toBeVisible();
    await page.getByTestId('drawer-menu-b').click();
    await expect(page.getByText('View B')).toBeVisible();

    const targetSnapshot = await takeHeapSnapshot(page, 2, snapshotDir);

    // Close drawer
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();

    // Force GC and take final snapshot (s3)
    await forceGarbageCollection(page);

    const finalSnapshot = await takeHeapSnapshot(page, 3, snapshotDir);

    // Analyze snapshots
    const result = await analyzeHeapSnapshots(
      snapshotDir,
      baselineSnapshot,
      targetSnapshot,
      finalSnapshot,
      {
        maxMemoryGrowthMB: 0.5,
        maxRetainedObjects: 0,
        snapshotDir,
      },
    );

    logMemLabResult(result);

    expect(result).toBeDefined();
  });
});
