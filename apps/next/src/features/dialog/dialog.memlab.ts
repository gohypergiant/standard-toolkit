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
  componentName: 'Dialog',
  testPagePath: '/dialog/memlab',
  testSelector: '[data-testid="memlab-dialog-test"]',
  scenarios: [
    {
      name: 'multiple dialog sizes should not leak memory',
      action: async (page) => {
        // Open and close each dialog size
        const sizes = ['small', 'large'];
        for (const size of sizes) {
          await page.click(`[data-testid="dialog-${size}"]`);
          await page.waitForTimeout(300);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      },
      cleanupWaitMs: 1000,
    },
    {
      name: 'stress test: rapid open/close cycles',
      action: async (page) => {
        await page.click('[data-testid="stress-test"]');
        await page.waitForFunction(
          () => {
            const btn = document.querySelector('[data-testid="stress-test"]');
            return btn && !btn.textContent?.includes('Testing');
          },
          { timeout: 30000 },
        );
      },
      expectedLeaks: 3, // Dialog uses portals - allow some tolerance
      actionWaitMs: 1000,
      cleanupWaitMs: 1000,
    },
  ],
});

// Manual test for complex portal handling with retry logic
test.describe('Dialog Portal Tests', () => {
  test.use({ componentName: 'dialog' });

  test('mount/unmount cycle should not leak memory', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/dialog/memlab');
    await page.waitForSelector('[data-testid="memlab-dialog-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'initial-page-load');

    // TARGET: Open the dialog
    await page.click('[data-testid="toggle-dialog"]');
    await page.waitForTimeout(500);

    // Try to wait for the dialog - React Aria modals may use various selectors
    const dialogVisible = await page
      .locator('[role="dialog"], [data-overlay], [class*="modal"]')
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!dialogVisible) {
      // If dialog didn't appear, try clicking again
      await page.click('[data-testid="toggle-dialog"]');
      await page.waitForTimeout(500);
    }

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'dialog-opened');

    // FINAL: Close the dialog using Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await waitForCleanup(page);

    await forceGC(page);
    await waitForCleanup(page);

    await collector.takeSnapshot(page, 'final', 'dialog-closed');

    const result = await analyzeResult();
    expect(result.passed).toBe(true);
  });
});
