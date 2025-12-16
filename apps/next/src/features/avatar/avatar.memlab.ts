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
  componentName: 'Avatar',
  testPagePath: '/avatar/memlab',
  testSelector: '[data-testid="memlab-avatar-test"]',
  scenarios: [
    {
      name: 'mount/unmount cycle should not leak memory',
      action: async (page) => {
        // Simply wait while avatars are visible (images loading)
        await page.waitForTimeout(500);
      },
      cleanup: async (page) => {
        await page.click('[data-testid="toggle-avatars"]');
        await page.waitForSelector('[data-testid="avatar-container"]', {
          state: 'hidden',
        });
      },
    },
    {
      name: 'toggle visibility should not leak memory',
      action: async (page) => {
        for (let i = 0; i < 3; i++) {
          await page.click('[data-testid="toggle-avatars"]');
          await page.waitForTimeout(200);
          await page.click('[data-testid="toggle-avatars"]');
          await page.waitForTimeout(200);
        }
      },
      cleanup: async (page) => {
        await page.click('[data-testid="toggle-avatars"]');
        await page.waitForSelector('[data-testid="avatar-container"]', {
          state: 'hidden',
        });
      },
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
      // Radix Avatar's useImageLoadingStatus hook doesn't properly cancel pending
      // image loads on unmount. During rapid mount/unmount cycles, detached <img>
      // elements persist until browser completes or times out the load/error events.
      expectedLeaks: 6,
      actionWaitMs: 1000,
      cleanupWaitMs: 2000,
    },
  ],
});
