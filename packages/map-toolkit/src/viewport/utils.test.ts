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

import { describe, expect, it } from 'vitest';
import { getViewportSize } from './utils';

describe('getViewportSize', () => {
  it('calculates viewport size using zoom-based formula', () => {
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      zoom: 5,
      width: 800,
      height: 600,
      unit: 'nm',
    });
    // Should return a formatted string with calculated distances
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });

  it('can take a custom formatter', () => {
    const formatter = Intl.NumberFormat('de-DE');
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      zoom: 5,
      width: 800,
      height: 600,
      unit: 'km',
      formatter,
    });
    // German format uses periods as thousand separators
    expect(result).toMatch(/^\d{1,3}(\.\d{3})* x \d{1,3}(\.\d{3})* KM$/);
  });

  it('provides a fallback for NaN bounds', () => {
    const result = getViewportSize({
      bounds: [Number.NaN, Number.NaN, Number.NaN, Number.NaN],
      zoom: 5,
      width: 800,
      height: 600,
    });
    expect(result).toBe('-- x -- NM');
  });

  it('provides a fallback for NaN zoom', () => {
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      zoom: Number.NaN,
      width: 800,
      height: 600,
    });
    expect(result).toBe('-- x -- NM');
  });

  it('provides a fallback for zero width', () => {
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      zoom: 5,
      width: 0,
      height: 600,
    });
    expect(result).toBe('-- x -- NM');
  });

  it('provides a fallback for zero height', () => {
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      zoom: 5,
      width: 800,
      height: 0,
    });
    expect(result).toBe('-- x -- NM');
  });

  it('handles invalid latitude values outside -90 to 90 range', () => {
    const result = getViewportSize({
      bounds: [-82, -100, -71, 52],
      zoom: 5,
      width: 800,
      height: 600,
      unit: 'nm',
    });
    expect(result).toBe('-- x -- NM');
  });

  it('works with all supported units', () => {
    const bounds: [number, number, number, number] = [-82, 22, -71, 52];
    const zoom = 5;
    const width = 800;
    const height = 600;
    expect(
      getViewportSize({ bounds, zoom, width, height, unit: 'km' }),
    ).toContain('KM');
    expect(
      getViewportSize({ bounds, zoom, width, height, unit: 'm' }),
    ).toContain('M');
    expect(
      getViewportSize({ bounds, zoom, width, height, unit: 'nm' }),
    ).toContain('NM');
    expect(
      getViewportSize({ bounds, zoom, width, height, unit: 'mi' }),
    ).toContain('MI');
    expect(
      getViewportSize({ bounds, zoom, width, height, unit: 'ft' }),
    ).toContain('FT');
  });

  it('calculates larger dimensions at lower zoom levels', () => {
    const bounds: [number, number, number, number] = [-82, 22, -71, 52];
    const width = 800;
    const height = 600;

    const lowZoomResult = getViewportSize({
      bounds,
      zoom: 2,
      width,
      height,
      unit: 'nm',
    });

    const highZoomResult = getViewportSize({
      bounds,
      zoom: 8,
      width,
      height,
      unit: 'nm',
    });

    // Extract width values
    const lowZoomWidth = Number.parseInt(
      lowZoomResult.split(' x ')[0].replace(/,/g, ''),
      10,
    );
    const highZoomWidth = Number.parseInt(
      highZoomResult.split(' x ')[0].replace(/,/g, ''),
      10,
    );

    // Lower zoom should show larger area
    expect(lowZoomWidth).toBeGreaterThan(highZoomWidth);
  });

  it('calculates proportional dimensions based on pixel size', () => {
    const bounds: [number, number, number, number] = [-82, 22, -71, 52];
    const zoom = 5;

    const smallViewport = getViewportSize({
      bounds,
      zoom,
      width: 400,
      height: 300,
      unit: 'nm',
    });

    const largeViewport = getViewportSize({
      bounds,
      zoom,
      width: 800,
      height: 600,
      unit: 'nm',
    });

    // Extract width values
    const smallWidth = Number.parseInt(
      smallViewport.split(' x ')[0].replace(/,/g, ''),
      10,
    );
    const largeWidth = Number.parseInt(
      largeViewport.split(' x ')[0].replace(/,/g, ''),
      10,
    );

    // Larger pixel viewport should show larger area at same zoom
    expect(largeWidth).toBeGreaterThan(smallWidth);
    // Should be approximately 2x (800/400)
    expect(largeWidth / smallWidth).toBeCloseTo(2, 0);
  });

  it('adjusts for latitude in the calculation', () => {
    const zoom = 5;
    const width = 800;
    const height = 600;

    // Near equator
    const equatorResult = getViewportSize({
      bounds: [-82, -5, -71, 5],
      zoom,
      width,
      height,
      unit: 'nm',
    });

    // Near pole
    const poleResult = getViewportSize({
      bounds: [-82, 70, -71, 80],
      zoom,
      width,
      height,
      unit: 'nm',
    });

    // Extract width values
    const equatorWidth = Number.parseInt(
      equatorResult.split(' x ')[0].replace(/,/g, ''),
      10,
    );
    const poleWidth = Number.parseInt(
      poleResult.split(' x ')[0].replace(/,/g, ''),
      10,
    );

    // Same zoom/pixels at higher latitude should show smaller area due to Mercator projection
    expect(poleWidth).toBeLessThan(equatorWidth);
  });

  it('handles bounds at world extents', () => {
    const result = getViewportSize({
      bounds: [-180, -85, 180, 85],
      zoom: 1,
      width: 1024,
      height: 768,
      unit: 'nm',
    });
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });

  it('maintains stable output without flickering on pan', () => {
    // At same zoom and pixel dimensions, result should be identical
    // regardless of where the map is panned
    const zoom = 3;
    const width = 800;
    const height = 600;

    const result1 = getViewportSize({
      bounds: [-100, 20, -60, 50],
      zoom,
      width,
      height,
      unit: 'nm',
    });

    const result2 = getViewportSize({
      bounds: [40, 30, 80, 60],
      zoom,
      width,
      height,
      unit: 'nm',
    });

    // Width should be nearly the same (small differences due to latitude)
    const width1 = Number.parseInt(
      result1.split(' x ')[0].replace(/,/g, ''),
      10,
    );
    const width2 = Number.parseInt(
      result2.split(' x ')[0].replace(/,/g, ''),
      10,
    );

    // Should be within 30% of each other (accounting for latitude differences)
    expect(Math.abs(width1 - width2) / Math.max(width1, width2)).toBeLessThan(
      0.3,
    );
  });
});
