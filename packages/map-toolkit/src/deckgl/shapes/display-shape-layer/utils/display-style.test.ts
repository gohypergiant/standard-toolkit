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
import { BASE_FILL_OPACITY } from '../../shared/constants';
import {
  getDashArray,
  getFillColor,
  getHighlightColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getLineWidth,
  getStrokeColor,
  getStrokeWidth,
} from './display-style';
import type { Color } from '@deck.gl/core';
import type { StyledFeature } from '../../shared/types';

describe('Display Style Utilities', () => {
  describe('getFillColor', () => {
    it('uses default color when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Default fill: DEFAULT_COLORS.fill passed through (white)
      expect(result).toEqual([255, 255, 255, 255]);
    });

    it('passes through RGBA color as-is when applyBaseOpacity is false', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [255, 0, 0, 200] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Color passed through exactly as provided
      expect(result).toEqual([255, 0, 0, 200]);
    });

    it('applies BASE_FILL_OPACITY when applyBaseOpacity is true', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [255, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature, true);

      // Red with alpha multiplied by BASE_FILL_OPACITY (0.2)
      const expectedOpacity = Math.round(255 * BASE_FILL_OPACITY);
      expect(result).toEqual([255, 0, 0, expectedOpacity]);
    });

    it('applies BASE_FILL_OPACITY to custom alpha value', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 255, 0, 200] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature, true);

      // Green with alpha 200 multiplied by BASE_FILL_OPACITY
      const expectedOpacity = Math.round(200 * BASE_FILL_OPACITY);
      expect(result).toEqual([0, 255, 0, expectedOpacity]);
    });

    it('handles RGB array (3 elements) by adding default alpha', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Blue with default alpha 255
      expect(result).toEqual([0, 0, 255, 255]);
    });

    it('handles zero alpha correctly', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [255, 255, 255, 0] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      expect(result).toEqual([255, 255, 255, 0]);
    });
  });

  describe('getStrokeColor', () => {
    it('uses default color when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Default stroke: DEFAULT_COLORS.stroke passed through (gray)
      expect(result).toEqual([136, 138, 143, 255]);
    });

    it('passes through RGBA color exactly as provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [255, 0, 0, 200] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Color passed through exactly as provided
      expect(result).toEqual([255, 0, 0, 200]);
    });

    it('handles RGB array (3 elements) by adding default alpha', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 255, 0] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Green with default alpha 255
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

      // DEFAULT_STROKE_WIDTH is 2
      expect(result).toBe(2);
    });

    it('returns strokeWidth from style properties', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 8,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getLineWidth(feature);

      expect(result).toBe(8);
    });

    it('handles different stroke widths', () => {
      const widths = [1, 2, 4, 8] as const;

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [0, 0, 0, 255] as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: width,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        };

        expect(getLineWidth(feature)).toBe(width);
      }
    });
  });

  describe('getStrokeWidth', () => {
    it('is an alias for getLineWidth', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 8,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      expect(getStrokeWidth(feature)).toBe(getLineWidth(feature));
    });
  });

  describe('getDashArray', () => {
    it('returns null for solid pattern', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getDashArray(feature);

      expect(result).toBeNull();
    });

    it('returns dash array for dashed pattern', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'dashed',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getDashArray(feature);

      expect(result).toEqual([8, 4]);
    });

    it('returns dash array for dotted pattern', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            strokePattern: 'dotted',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getDashArray(feature);

      expect(result).toEqual([2, 4]);
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
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 2,
            // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
            strokePattern: 'unknown' as any,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getDashArray(feature);

      expect(result).toBeNull();
    });
  });

  describe('getHoverLineWidth', () => {
    it('returns base width when not hovered', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 4,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHoverLineWidth(feature, false);

      expect(result).toBe(4);
    });

    it('increases width by 2 when hovered', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 4,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHoverLineWidth(feature, true);

      expect(result).toBe(6);
    });

    it('works with different base widths', () => {
      const widths = [1, 2, 4, 8] as const;

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [0, 0, 0, 255] as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: width,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        };

        expect(getHoverLineWidth(feature, true)).toBe(width + 2);
        expect(getHoverLineWidth(feature, false)).toBe(width);
      }
    });
  });

  describe('getHighlightColor', () => {
    it('returns default highlight color from DEFAULT_COLORS when no opacity provided', () => {
      const result = getHighlightColor();

      // DEFAULT_COLORS.highlight is [40, 245, 190, 100]
      expect(result).toEqual([40, 245, 190, 100]);
    });

    it('applies custom opacity override', () => {
      const result = getHighlightColor(0.5);

      const expectedOpacity = Math.round(0.5 * 255);
      expect(result).toEqual([40, 245, 190, expectedOpacity]);
    });

    it('handles full opacity', () => {
      const result = getHighlightColor(1.0);

      expect(result).toEqual([40, 245, 190, 255]);
    });

    it('handles zero opacity', () => {
      const result = getHighlightColor(0);

      expect(result).toEqual([40, 245, 190, 0]);
    });
  });

  describe('getHighlightLineWidth', () => {
    it('increases base width by HIGHLIGHT_WIDTH_INCREASE (5)', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: [0, 0, 0, 255] as Color,
            strokeColor: [0, 0, 0, 255] as Color,
            strokeWidth: 4,
            strokePattern: 'solid',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHighlightLineWidth(feature);

      // strokeWidth (4) + HIGHLIGHT_WIDTH_INCREASE (5) = 9
      expect(result).toBe(9);
    });

    it('works with different base widths', () => {
      const widths = [1, 2, 4, 8] as const;

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [0, 0, 0, 255] as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: width,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        };

        // HIGHLIGHT_WIDTH_INCREASE is 5
        expect(getHighlightLineWidth(feature)).toBe(width + 5);
      }
    });

    it('uses default width when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {} as StyledFeature['properties'],
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHighlightLineWidth(feature);

      // DEFAULT_STROKE_WIDTH (2) + HIGHLIGHT_WIDTH_INCREASE (5) = 7
      expect(result).toBe(7);
    });
  });
});
