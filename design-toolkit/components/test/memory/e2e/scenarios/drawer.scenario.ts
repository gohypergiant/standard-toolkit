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

import type { Page } from 'puppeteer';

export const drawerScenario = {
  url: () =>
    'http://localhost:6006/iframe.html?id=components-drawer--open-close-trigger&viewMode=story',

  action: async (page: Page) => {
    await page.waitForFunction(
      () => {
        const preparing = document.querySelector(
          '.sb-preparing-story, .sb-preparing-docs',
        );
        console.log('preparing:', preparing);
        return (
          !preparing ||
          preparing.style.display === 'none' ||
          !preparing.offsetParent
        );
      },
      {
        timeout: 15_000,
      },
    );
    for (let i = 0; i < 5; i++) {
      const openButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent?.trim() === 'Open');
      });
      const openElement = openButton && openButton.asElement();
      if (openElement) {
        await openElement.click();
        await page.waitForSelector('header', { timeout: 2000 });
        const closeButton = await page.evaluateHandle(() => {
          const buttons = Array.from(
            document.querySelectorAll('header button'),
          );
          return buttons[buttons.length - 1];
        });
        const closeElement = closeButton && closeButton.asElement();
        if (closeElement) {
          await closeElement.click();
          await page.waitForSelector('header', { hidden: true, timeout: 2000 });
        }
      }
    }
  },

  back: async (page: Page) => {
    await page.waitForSelector('button');
  },
};
