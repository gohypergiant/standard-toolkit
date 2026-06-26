/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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

const MAP_CANVAS = 'canvas.maplibregl-canvas';

test.describe('SymbolLayer integration', () => {
  test('renders on the map and the center symbol is pickable', async ({
    page,
  }) => {
    await page.goto('/map/symbol-layer');

    // Map + deck are ready once the first viewport is emitted.
    await page.waitForFunction(() => window.__mapTest?.ready === true);

    const box = await page.locator(MAP_CANVAS).boundingBox();
    if (!box) {
      throw new Error('map canvas has no bounding box');
    }

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // The 'center' symbol sits at the view center → canvas center. Poll the
    // click because the symbol's icon atlas can finish loading a beat after the
    // map reports ready; retry until the pick lands on the known feature.
    await expect
      .poll(
        async () => {
          await page.mouse.click(centerX, centerY);
          return page.evaluate(
            () => window.__mapTest?.lastPick?.objectId ?? null,
          );
        },
        { timeout: 15_000 },
      )
      .toBe('center');

    // Sanity: the pick resolved to the symbol layer, not some other layer.
    const pick = await page.evaluate(() => window.__mapTest?.lastPick);
    expect(pick?.layerId).toContain('symbols');
    expect(pick?.index).toBeGreaterThanOrEqual(0);
  });
});
