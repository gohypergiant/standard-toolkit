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
// Type-only import pulls in the `Window.__mapTest` global augmentation that the
// bridge declares, so `page.evaluate` callbacks below are fully typed.
import type {} from './test-bridge';

// MapLibre renders the (interleaved) deck.gl scene into this canvas.
const MAP_CANVAS = 'canvas.maplibregl-canvas';

async function waitForMapReady(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => window.__mapTest?.ready === true);
}

function readViewport(page: import('@playwright/test').Page) {
  return page.evaluate(() => window.__mapTest?.viewport ?? null);
}

test.describe('BaseMap integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map');
  });

  test('deck.gl initializes over MapLibre with a live WebGL context', async ({
    page,
  }) => {
    const canvas = page.locator(MAP_CANVAS);
    await expect(canvas).toBeVisible();

    // A real, sized GL context proves deck.gl + MapLibre wired up the canvas.
    const gl = await canvas.evaluate((el: HTMLCanvasElement) => {
      const ctx = el.getContext('webgl2') ?? el.getContext('webgl');
      return { hasContext: ctx !== null, width: el.width, height: el.height };
    });
    expect(gl.hasContext).toBe(true);
    expect(gl.width).toBeGreaterThan(0);
    expect(gl.height).toBeGreaterThan(0);

    // BaseMap emits its first `map:viewport` once deck finishes loading.
    await waitForMapReady(page);

    const viewport = await readViewport(page);
    expect(viewport).not.toBeNull();
    expect(viewport?.zoom).toBeGreaterThan(0);
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });

  test('camera responds to pan and zoom interaction', async ({ page }) => {
    await waitForMapReady(page);

    const start = await readViewport(page);
    expect(start).not.toBeNull();

    const box = await page.locator(MAP_CANVAS).boundingBox();
    if (!box) {
      throw new Error('map canvas has no bounding box');
    }

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Drag to pan — the center coordinate should change.
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 200, centerY - 120, { steps: 12 });
    await page.mouse.up();

    const startKey = `${start?.latitude.toFixed(4)},${start?.longitude.toFixed(4)}`;
    await expect
      .poll(async () => {
        const view = await readViewport(page);
        return view
          ? `${view.latitude.toFixed(4)},${view.longitude.toFixed(4)}`
          : '';
      })
      .not.toBe(startKey);

    // Wheel up to zoom in — zoom should increase.
    const beforeZoom =
      (await page.evaluate(() => window.__mapTest?.viewport?.zoom)) ?? 0;

    await page.mouse.move(centerX, centerY);
    await page.mouse.wheel(0, -600);

    await expect
      .poll(() => page.evaluate(() => window.__mapTest?.viewport?.zoom ?? 0))
      .toBeGreaterThan(beforeZoom);
  });
});
