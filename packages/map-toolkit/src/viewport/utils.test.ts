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
  it('converts the bounds to a string', () => {
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      unit: 'nm',
    });
    expect(result).toBe('612 x 1,801 NM');
  });

  it('can take a custom formatter', () => {
    const formatter = Intl.NumberFormat('de-DE');
    const result = getViewportSize({
      bounds: [-82, 22, -71, 52],
      unit: 'km',
      formatter,
    });
    expect(result).toBe('1.134 x 3.336 KM');
  });

  it('provides a fallback for undefined bounds', () => {
    const result = getViewportSize({
      bounds: undefined,
    });
    expect(result).toBe('-- x -- NM');
  });

  it('normalizes longitude values outside -180 to 180 range', () => {
    const result = getViewportSize({
      bounds: [-200, 22, -71, 52], // -200 normalizes to 160
      unit: 'nm',
    });
    // Should calculate distance, not return fallback
    expect(result).not.toBe('-- x -- NM');
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });

  it('handles multi-revolution longitude values (721°)', () => {
    const result = getViewportSize({
      bounds: [721, 22, 730, 52], // 721° -> 1°, 730° -> 10°
      unit: 'nm',
    });
    expect(result).not.toBe('-- x -- NM');
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });

  it('normalizes negative longitude values beyond -360', () => {
    const result = getViewportSize({
      bounds: [-541, 22, -530, 52], // -541° -> 179°, -530° -> -170°
      unit: 'nm',
    });
    expect(result).not.toBe('-- x -- NM');
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });

  it('handles International Date Line crossing', () => {
    const result = getViewportSize({
      bounds: [170, 50, -170, 60], // Crosses dateline
      unit: 'nm',
    });
    // Should calculate the short distance across the dateline (~20 degrees)
    // not the long way around (~340 degrees)
    expect(result).not.toBe('-- x -- NM');
    const width = Number.parseInt(result.split(' x ')[0].replace(/,/g, ''));
    // Width should be roughly 20 degrees at 50°N (~700-800 NM)
    // Not 340 degrees (~18,000+ NM)
    expect(width).toBeLessThan(2000);
    expect(width).toBeGreaterThan(500);
  });

  it('handles invalid latitude values outside -90 to 90 range', () => {
    const result = getViewportSize({
      bounds: [-82, -100, -71, 52],
      unit: 'nm',
    });
    expect(result).toBe('-- x -- NM');
  });

  it('handles invalid bounds where minLat > maxLat', () => {
    const result = getViewportSize({
      bounds: [-82, 52, -71, 22],
      unit: 'nm',
    });
    expect(result).toBe('-- x -- NM');
  });

  it('works with all supported units', () => {
    const bounds: [number, number, number, number] = [-82, 22, -71, 52];
    expect(getViewportSize({ bounds, unit: 'km' })).toContain('KM');
    expect(getViewportSize({ bounds, unit: 'm' })).toContain('M');
    expect(getViewportSize({ bounds, unit: 'nm' })).toContain('NM');
    expect(getViewportSize({ bounds, unit: 'mi' })).toContain('MI');
    expect(getViewportSize({ bounds, unit: 'ft' })).toContain('FT');
  });

  it('handles edge case of bounds at world extents', () => {
    const result = getViewportSize({
      bounds: [-180, -90, 180, 90],
      unit: 'nm',
    });
    expect(result).toMatch(/^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/);
  });
});
