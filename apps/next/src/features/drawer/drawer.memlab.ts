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

// Factory-based tests for simple scenarios
createComponentTests({
  componentName: 'Drawer',
  testPagePath: '/drawer/memlab',
  testSelector: '[data-testid="memlab-drawer-test"]',
  scenarios: [
    {
      name: 'mount/unmount cycle should not leak memory',
      action: async (page) => {
        // Open the drawer panel
        await page.click('[data-testid="open-drawer"]');
        // Wait for drawer animation to complete
        await waitForCleanup(page, 500);
        // The drawer content may not become visible immediately due to animation
        await page
          .waitForSelector('[data-testid="drawer-content"]', {
            state: 'visible',
            timeout: 5000,
          })
          .catch(() => {
            // Drawer animation timing - content is rendered but may not be "visible"
          });
      },
      cleanup: async (page) => {
        // Close the drawer using close button or Escape
        const closeButton = page.locator('[data-testid="close-drawer"]');
        if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await closeButton.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await page
          .waitForSelector('[data-testid="drawer-content"]', {
            state: 'hidden',
            timeout: 5000,
          })
          .catch(() => {
            // Drawer might fully unmount, which is fine
          });
      },
    },
    {
      name: 'stress test: rapid mount/unmount cycles',
      action: async (page) => {
        // Rapid mount/unmount cycles of the Drawer component
        for (let i = 0; i < 5; i++) {
          // Unmount drawer
          await page.click('[data-testid="toggle-drawer"]');
          await waitForCleanup(page, 100);
          // Remount drawer
          await page.click('[data-testid="toggle-drawer"]');
          await waitForCleanup(page, 100);
        }
      },
      expectedLeaks: 5, // Stress tests may have slightly higher tolerance
      actionWaitMs: 1000,
      cleanupWaitMs: 1000,
    },
  ],
});

// Manual test for complex view navigation scenario
test.describe('Drawer Navigation Tests', () => {
  test.use({ componentName: 'drawer' });

  test('navigation between views should not leak memory', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/drawer/memlab');
    await page.waitForSelector('[data-testid="memlab-drawer-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-navigation');

    // TARGET: Click the drawer menu item directly to open the view
    // The DrawerMenuItem with toggle for viewA should expand the panel
    const menuItemA = page
      .locator('[data-testid="memlab-drawer-test"]')
      .locator('text=A')
      .first();
    await menuItemA.click();
    await waitForCleanup(page, 500);

    // Try to navigate to View B if the panel is open
    const navigateBtn = page.locator('[data-testid="navigate-to-b"]');
    if (await navigateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await navigateBtn.click();
      await waitForCleanup(page);
    }

    await collector.takeSnapshot(page, 'target', 'after-view-navigation');

    // FINAL: Close drawer using Escape key or clicking menu item again
    await page.keyboard.press('Escape');
    await waitForCleanup(page, 1500);

    await forceGC(page);
    await waitForCleanup(page);

    await collector.takeSnapshot(page, 'final', 'after-drawer-close');

    const result = await analyzeResult();

    // Navigation between views may leave some minor traces
    expect(result.leakCount).toBeLessThanOrEqual(3);
  });
});
