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

import {
  expect,
  forceGC,
  test,
  waitForCleanup,
} from '~/memlab/playwright/fixtures';
import { createComponentTests } from '~/memlab/playwright/test-builder';

// Factory-based tests for simpler scenarios
createComponentTests({
  componentName: 'Notice',
  testPagePath: '/notice/memlab',
  testSelector: '[data-testid="memlab-notice-test"]',
  scenarios: [
    {
      name: 'add/remove notices should not leak memory',
      action: async (page) => {
        await page.click('[data-testid="add-notice"]');
        await page.waitForTimeout(200);
        await page.click('[data-testid="add-critical-notice"]');
        await page.waitForTimeout(200);
        await page.click('[data-testid="add-warning-notice"]');
        await page.waitForTimeout(200);
      },
      cleanup: async (page) => {
        await page.click('[data-testid="clear-notices"]');
      },
      cleanupWaitMs: 1000,
    },
    {
      name: 'notice list mount/unmount should not leak bus subscriptions',
      action: async (page) => {
        await page.click('[data-testid="mount-unmount-test"]');
        await page.waitForFunction(
          () => {
            const btn = document.querySelector(
              '[data-testid="mount-unmount-test"]',
            );
            return btn && !btn.textContent?.includes('Mount/Unmount (');
          },
          { timeout: 30000 },
        );
      },
      cleanupWaitMs: 1000,
    },
  ],
});

// Manual tests for timing-sensitive scenarios
test.describe('Notice Timing Tests', () => {
  test.use({ componentName: 'notice' });

  test('stress test: rapid notice queue/dequeue', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/notice/memlab');
    await page.waitForSelector('[data-testid="memlab-notice-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-stress-test');

    // TARGET: Run stress test
    await page.click('[data-testid="stress-test"]');
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('[data-testid="stress-test"]');
        return btn && !btn.textContent?.includes('Testing');
      },
      { timeout: 60000 },
    );

    await collector.takeSnapshot(page, 'target', 'after-stress-test');

    // FINAL: Allow cleanup
    await waitForCleanup(page, 2000);
    await forceGC(page);
    await waitForCleanup(page);

    await collector.takeSnapshot(page, 'final', 'after-gc-cleanup');

    const result = await analyzeResult();

    // NoticeList uses bus + toast queue - allow some tolerance
    expect(result.leakCount).toBeLessThanOrEqual(5);
  });

  test('auto-dismiss notices should not leak memory', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/notice/memlab');
    await page.waitForSelector('[data-testid="memlab-notice-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-auto-dismiss');

    // TARGET: Add notices and let them auto-dismiss
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="add-notice"]');
      await page.waitForTimeout(100);
    }

    // Wait for auto-dismiss (timeout is 5000ms)
    await page.waitForTimeout(6000);

    await collector.takeSnapshot(page, 'target', 'after-auto-dismiss');

    // FINAL: Ensure cleanup
    await forceGC(page);
    await waitForCleanup(page, 1000);

    await collector.takeSnapshot(page, 'final', 'after-cleanup');

    const result = await analyzeResult();
    expect(result.passed).toBe(true);
  });
});
