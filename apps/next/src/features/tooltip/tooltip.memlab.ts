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

import { createComponentTests } from '~/memlab/playwright/test-builder';

createComponentTests({
  componentName: 'Tooltip',
  testPagePath: '/tooltip/client',
  testSelector: '[data-testid="memlab-tooltip-test"]',
  scenarios: [
    {
      name: 'mount/unmount cycle should not leak memory',
      action: async (page) => {
        // Hover over tooltips to trigger display
        await page.hover('[data-testid="tooltip-top"]');
        await page.waitForTimeout(300);

        await page.hover('[data-testid="tooltip-bottom"]');
        await page.waitForTimeout(300);

        await page.hover('[data-testid="tooltip-trigger-long"]');
        await page.waitForTimeout(300);
      },
      cleanup: async (page) => {
        // Move mouse away and hide tooltips
        await page.mouse.move(0, 0);
        await page.click('[data-testid="toggle-tooltips"]');
        await page.waitForSelector('[data-testid="tooltip-container"]', {
          state: 'hidden',
        });
      },
    },
    {
      name: 'multiple tooltip displays should not leak memory',
      action: async (page) => {
        const tooltipTriggers = [
          '[data-testid="tooltip-top"]',
          '[data-testid="tooltip-bottom"]',
          '[data-testid="tooltip-left"]',
          '[data-testid="tooltip-right"]',
          '[data-testid="tooltip-trigger-long"]',
        ];

        for (let round = 0; round < 2; round++) {
          for (const trigger of tooltipTriggers) {
            await page.hover(trigger);
            await page.waitForTimeout(150);
            await page.mouse.move(0, 0);
            await page.waitForTimeout(100);
          }
        }
      },
      cleanup: async (page) => {
        await page.mouse.move(0, 0);
      },
      cleanupWaitMs: 1000,
    },
    {
      name: 'stress test: rapid mount/unmount cycles',
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
      expectedLeaks: 3, // Tooltip may have minor leaks due to floating-ui
      actionWaitMs: 1000,
      cleanupWaitMs: 1000,
    },
  ],
});
