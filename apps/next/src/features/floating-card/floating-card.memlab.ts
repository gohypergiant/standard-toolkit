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
  componentName: 'FloatingCard',
  testPagePath: '/floating-card/memlab',
  testSelector: '[data-testid="memlab-floating-card-test"]',
  scenarios: [
    {
      name: 'controlled card open/close should not leak memory',
      action: async (page) => {
        // Ensure provider is mounted
        const containerVisible = await page
          .locator('[data-testid="floating-card-container"]')
          .isVisible({ timeout: 2000 })
          .catch(() => false);

        if (!containerVisible) {
          await page.click('[data-testid="toggle-provider"]');
          await page.waitForSelector('[data-testid="floating-card-container"]');
        }

        // Toggle Card A open and closed several times
        for (let i = 0; i < 3; i++) {
          await page.click('[data-testid="toggle-card"]');
          await page.waitForTimeout(300);
          await page.click('[data-testid="toggle-card"]');
          await page.waitForTimeout(300);
        }
      },
      cleanup: async (page) => {
        // Unmount the provider to force full cleanup
        const containerVisible = await page
          .locator('[data-testid="floating-card-container"]')
          .isVisible({ timeout: 1000 })
          .catch(() => false);

        if (containerVisible) {
          await page.click('[data-testid="toggle-provider"]');
          await page.waitForSelector(
            '[data-testid="floating-card-container"]',
            {
              state: 'hidden',
            },
          );
        }
      },
      cleanupWaitMs: 1000,
    },
    {
      name: 'provider mount/unmount should not leak memory',
      action: async (page) => {
        for (let i = 0; i < 3; i++) {
          await page.click('[data-testid="toggle-provider"]');
          await page
            .locator('[data-testid="floating-card-container"]')
            .isVisible({ timeout: 2000 });
          await page.click('[data-testid="toggle-provider"]');
          await page
            .locator('[data-testid="floating-card-container"]')
            .isHidden({ timeout: 2000 });
        }
      },
      cleanupWaitMs: 1000,
    },
    {
      name: 'stress test: rapid provider mount/unmount cycles',
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
      // dockview-react allocates internal layout engine state — allow some tolerance
      expectedLeaks: 3,
      actionWaitMs: 1000,
      cleanupWaitMs: 1500,
    },
  ],
});

// Manual test for the full portal lifecycle
test.describe('FloatingCard Portal Tests', () => {
  test.use({ componentName: 'floating-card' });

  test('provider mount/unmount portal lifecycle should not leak memory', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/floating-card/memlab');
    await page.waitForSelector('[data-testid="memlab-floating-card-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE: provider unmounted (initial state)
    await collector.takeSnapshot(page, 'baseline', 'initial-page-load');

    // TARGET: mount the provider — registers dockview API, allocates portal DOM refs
    await page.click('[data-testid="toggle-provider"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isVisible({ timeout: 2000 });

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'provider-mounted');

    // FINAL: unmount the provider — should release all dockview panels and DOM refs
    await page.click('[data-testid="toggle-provider"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isHidden({ timeout: 2000 });

    await forceGC(page);
    await waitForCleanup(page);

    await collector.takeSnapshot(page, 'final', 'provider-unmounted');

    const result = await analyzeResult();
    expect(result.passed).toBe(true);
  });

  test('card isOpen toggle should release portal refs', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/floating-card/memlab');
    await page.waitForSelector('[data-testid="memlab-floating-card-test"]');

    // Ensure provider is mounted
    await page.click('[data-testid="toggle-provider"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isVisible({ timeout: 2000 });

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE: provider up, Card A closed
    await collector.takeSnapshot(
      page,
      'baseline',
      'provider-mounted-card-closed',
    );

    // TARGET: open Card A — registers portal target DOM ref via dockview
    await page.click('[data-testid="toggle-provider"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isVisible({ timeout: 2000 });
    await page.click('[data-testid="toggle-card"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isVisible({ timeout: 2000 });

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'card-a-opened');

    // FINAL: close Card A — should deregister the portal ref
    await page.click('[data-testid="toggle-card"]');
    await page
      .locator('[data-testid="floating-card-container"]')
      .isHidden({ timeout: 2000 });

    await forceGC(page);
    await waitForCleanup(page);

    await collector.takeSnapshot(page, 'final', 'card-a-closed');

    const result = await analyzeResult();
    expect(result.passed).toBe(true);
  });
});
