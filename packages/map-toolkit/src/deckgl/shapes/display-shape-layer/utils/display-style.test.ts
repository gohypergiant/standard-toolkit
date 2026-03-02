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
import { BASE_FILL_OPACITY } from '../../shared/constants';
import {
  getDashArray,
  getFillColor,
  getLineColor,
  getLineWidth,
} from '../../shared/utils/style-utils';
import { OVERLAY_FILL_OPACITY } from '../constants';
import {
  applyOverlayOpacity,
  brightenColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getOverlayFillColor,
} from './display-style';
import type { StyledFeature } from '../../shared/types';

/** Create a minimal StyledFeature with given style overrides. */
function createStyledFeature(
  styles: Partial<StyledFeature['properties']['styleProperties']> = {},
): StyledFeature {
  return {
    type: 'Feature',
    properties: {
      styleProperties: {
        fillColor: [0, 0, 0, 255],
        lineColor: [0, 0, 0, 255],
        lineWidth: 2,
        linePattern: 'solid',
        ...styles,
      },
    },
    geometry: { type: 'Point', coordinates: [0, 0] },
  };
}

describe('Display Style Utilities', () => {
  describe('getFillColor', () => {
    it('uses default color when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      expect(result).toEqual([255, 255, 255, 255]);
    });

    it('passes through RGBA color as-is when applyBaseOpacity is false', () => {
      const feature = createStyledFeature({ fillColor: [255, 0, 0, 200] });

      const result = getFillColor(feature);

      expect(result).toEqual([255, 0, 0, 200]);
    });

    it('applies BASE_FILL_OPACITY when applyBaseOpacity is true', () => {
      const feature = createStyledFeature({ fillColor: [255, 0, 0, 255] });

      const result = getFillColor(feature, true);

      const expectedOpacity = Math.round(255 * BASE_FILL_OPACITY);
      expect(result).toEqual([255, 0, 0, expectedOpacity]);
    });

    it('applies BASE_FILL_OPACITY to custom alpha value', () => {
      const feature = createStyledFeature({ fillColor: [0, 255, 0, 200] });

      const result = getFillColor(feature, true);

      const expectedOpacity = Math.round(200 * BASE_FILL_OPACITY);
      expect(result).toEqual([0, 255, 0, expectedOpacity]);
    });

    it('handles RGB array (3 elements) by adding default alpha', () => {
      const feature = createStyledFeature({
        fillColor: [0, 0, 255] as [number, number, number],
      });

      const result = getFillColor(feature);

      expect(result).toEqual([0, 0, 255, 255]);
    });

    it('handles zero alpha correctly', () => {
      const feature = createStyledFeature({ fillColor: [255, 255, 255, 0] });

      const result = getFillColor(feature);

      expect(result).toEqual([255, 255, 255, 0]);
    });
  });

  describe('getLineColor', () => {
    it('uses default color when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getLineColor(feature);

      expect(result).toEqual([136, 138, 143, 255]);
    });

    it('passes through RGBA color exactly as provided', () => {
      const feature = createStyledFeature({ lineColor: [255, 0, 0, 200] });

      const result = getLineColor(feature);

      expect(result).toEqual([255, 0, 0, 200]);
    });

    it('handles RGB array (3 elements) by adding default alpha', () => {
      const feature = createStyledFeature({
        lineColor: [0, 255, 0] as [number, number, number],
      });

      const result = getLineColor(feature);

      expect(result).toEqual([0, 255, 0, 255]);
    });
  });

  describe('getLineWidth', () => {
    it('returns default width when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getLineWidth(feature);

      expect(result).toBe(2);
    });

    it.each([
      { width: 1 },
      { width: 2 },
      { width: 4 },
      { width: 8 },
    ])('returns $width from style properties', ({ width }) => {
      const feature = createStyledFeature({ lineWidth: width });

      const result = getLineWidth(feature);

      expect(result).toBe(width);
    });
  });

  describe('getDashArray', () => {
    it.each([
      { pattern: 'solid' as const, expected: null },
      { pattern: 'dashed' as const, expected: [8, 4] },
      { pattern: 'dotted' as const, expected: [2, 4] },
    ])('returns $expected for $pattern pattern', ({ pattern, expected }) => {
      const feature = createStyledFeature({ linePattern: pattern });

      const result = getDashArray(feature);

      expect(result).toEqual(expected);
    });

    it('uses default solid pattern when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getDashArray(feature);

      expect(result).toBeNull();
    });

    it('returns null for unknown pattern', () => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
      const feature = createStyledFeature({ linePattern: 'unknown' as any });

      const result = getDashArray(feature);

      expect(result).toBeNull();
    });
  });

  describe('getHoverLineWidth', () => {
    it.each([
      { width: 1 },
      { width: 2 },
      { width: 4 },
      { width: 8 },
    ])('returns $width + 2 when hovered with base width $width', ({
      width,
    }) => {
      const feature = createStyledFeature({ lineWidth: width });

      expect(getHoverLineWidth(feature, true)).toBe(width + 2);
      expect(getHoverLineWidth(feature, false)).toBe(width);
    });
  });

  describe('getHighlightLineWidth', () => {
    it.each([
      { width: 1, expected: 6 },
      { width: 2, expected: 7 },
      { width: 4, expected: 9 },
      { width: 8, expected: 13 },
    ])('returns $expected for base width $width', ({ width, expected }) => {
      const feature = createStyledFeature({ lineWidth: width });

      expect(getHighlightLineWidth(feature)).toBe(expected);
    });

    it('uses default width when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHighlightLineWidth(feature);

      // DEFAULT_LINE_WIDTH (2) + HIGHLIGHT_WIDTH_INCREASE (5) = 7
      expect(result).toBe(7);
    });
  });

  describe('applyOverlayOpacity', () => {
    it('scales alpha by OVERLAY_FILL_OPACITY', () => {
      const result = applyOverlayOpacity([255, 100, 50, 200]);

      expect(result).toEqual([
        255,
        100,
        50,
        Math.round(200 * OVERLAY_FILL_OPACITY),
      ]);
    });

    it('scales zero alpha to zero', () => {
      const result = applyOverlayOpacity([255, 255, 255, 0]);

      expect(result[3]).toBe(0);
    });
  });

  describe('getOverlayFillColor', () => {
    it('scales alpha by OVERLAY_FILL_OPACITY', () => {
      const feature = createStyledFeature({ fillColor: [255, 100, 50, 200] });

      const result = getOverlayFillColor(feature);

      expect(result).toEqual([
        255,
        100,
        50,
        Math.round(200 * OVERLAY_FILL_OPACITY),
      ]);
    });

    it('scales zero alpha to zero', () => {
      const feature = createStyledFeature({ fillColor: [255, 255, 255, 0] });

      const result = getOverlayFillColor(feature);

      expect(result[3]).toBe(0);
    });
  });

  describe('brightenColor', () => {
    it('multiplies RGB channels by factor', () => {
      const color: [number, number, number, number] = [100, 150, 200, 255];

      const result = brightenColor(color, 1.5);

      expect(result).toEqual([150, 225, 255, 255]);
    });

    it('clamps RGB values to 255', () => {
      const color: [number, number, number, number] = [200, 200, 200, 255];

      const result = brightenColor(color, 2.0);

      expect(result).toEqual([255, 255, 255, 255]);
    });

    it('preserves alpha unchanged', () => {
      const color: [number, number, number, number] = [100, 100, 100, 128];

      const result = brightenColor(color, 1.5);

      expect(result[3]).toBe(128);
    });

    it('darkens with factor less than 1', () => {
      const color: [number, number, number, number] = [200, 200, 200, 255];

      const result = brightenColor(color, 0.5);

      expect(result).toEqual([100, 100, 100, 255]);
    });

    it('returns zeros for factor of 0', () => {
      const color: [number, number, number, number] = [100, 150, 200, 255];

      const result = brightenColor(color, 0);

      expect(result).toEqual([0, 0, 0, 255]);
    });
  });
});
