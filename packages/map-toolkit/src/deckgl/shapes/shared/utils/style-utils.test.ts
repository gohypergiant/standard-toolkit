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

import { describe, expect, it } from 'vitest';
import {
  BASE_FILL_OPACITY,
  DEFAULT_COLORS,
  DEFAULT_LINE_WIDTH,
} from '../constants';
import {
  getDashArray,
  getFillColor,
  getLineColor,
  getLineWidth,
  normalizeColor,
} from './style-utils';
import type { StyledFeature } from '../types';

function createFeature(
  styleOverrides: Record<string, unknown> = {},
): StyledFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [] },
    properties: {
      styleProperties: {
        fillColor: [255, 255, 255, 255],
        lineColor: [136, 138, 143, 255],
        lineWidth: 2,
        linePattern: 'solid',
        ...styleOverrides,
      },
    },
  } as StyledFeature;
}

describe('normalizeColor', () => {
  it('should add alpha 255 to RGB arrays', () => {
    const result = normalizeColor([255, 128, 0]);

    expect(result).toEqual([255, 128, 0, 255]);
  });

  it('should pass through RGBA arrays unchanged', () => {
    const result = normalizeColor([255, 128, 0, 200]);

    expect(result).toEqual([255, 128, 0, 200]);
  });

  it('should handle Uint8Array input', () => {
    const result = normalizeColor(new Uint8Array([100, 200, 50, 128]));

    expect(result).toEqual([100, 200, 50, 128]);
  });

  it('should handle Uint8ClampedArray input', () => {
    const result = normalizeColor(new Uint8ClampedArray([10, 20, 30]));

    expect(result).toEqual([10, 20, 30, 255]);
  });

  it('should fallback to opaque black for invalid arrays', () => {
    const result = normalizeColor([] as unknown as [number, number, number]);

    expect(result).toEqual([0, 0, 0, 255]);
  });
});

describe('getFillColor', () => {
  it('should return the fill color from style properties', () => {
    const feature = createFeature({ fillColor: [100, 150, 200, 255] });

    const result = getFillColor(feature);

    expect(result).toEqual([100, 150, 200, 255]);
  });

  it('should return default fill color when no style properties exist', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    } as unknown as StyledFeature;

    const result = getFillColor(feature);

    expect(result).toEqual(normalizeColor(DEFAULT_COLORS.fill));
  });

  it('should apply base opacity when applyBaseOpacity is true', () => {
    const feature = createFeature({ fillColor: [255, 255, 255, 255] });

    const result = getFillColor(feature, true);

    expect(result).toEqual([
      255,
      255,
      255,
      Math.round(255 * BASE_FILL_OPACITY),
    ]);
  });

  it('should not apply base opacity when applyBaseOpacity is false', () => {
    const feature = createFeature({ fillColor: [255, 255, 255, 100] });

    const result = getFillColor(feature);

    expect(result).toEqual([255, 255, 255, 100]);
  });
});

describe('getLineColor', () => {
  it('should return the line color from style properties', () => {
    const feature = createFeature({ lineColor: [0, 100, 200, 255] });

    const result = getLineColor(feature);

    expect(result).toEqual([0, 100, 200, 255]);
  });

  it('should return default line color when no style properties exist', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    } as unknown as StyledFeature;

    const result = getLineColor(feature);

    expect(result).toEqual(normalizeColor(DEFAULT_COLORS.line));
  });
});

describe('getLineWidth', () => {
  it('should return the line width from style properties', () => {
    const feature = createFeature({ lineWidth: 5 });

    const result = getLineWidth(feature);

    expect(result).toBe(5);
  });

  it('should return default line width when no style properties exist', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    } as unknown as StyledFeature;

    const result = getLineWidth(feature);

    expect(result).toBe(DEFAULT_LINE_WIDTH);
  });
});

describe('getDashArray', () => {
  it.each([
    ['solid', null],
    ['dashed', [8, 4]],
    ['dotted', [2, 4]],
  ] as const)('should return %s pattern as %s', (pattern, expected) => {
    const feature = createFeature({ linePattern: pattern });

    const result = getDashArray(feature);

    expect(result).toEqual(expected);
  });

  it('should default to solid (null) when no pattern is specified', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    } as unknown as StyledFeature;

    const result = getDashArray(feature);

    expect(result).toBeNull();
  });
});
