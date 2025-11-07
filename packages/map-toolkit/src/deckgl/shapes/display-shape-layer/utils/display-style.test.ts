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
import { DEFAULT_COLORS } from '../../shared/constants';
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
import type { StyledFeature } from '../../shared/types';

describe('Display Style Utilities', () => {
  describe('getFillColor', () => {
    it('uses default color when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Default fill: DEFAULT_COLORS.fill with 0.59 base opacity
      const expectedOpacity = Math.round(0.59 * 255);
      expect(result).toEqual([...DEFAULT_COLORS.fill, expectedOpacity]);
    });

    it('converts hex color to RGBA with base opacity', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: '#ff0000',
            fillOpacity: 100,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Red at 100% user opacity with 0.59 base opacity
      const expectedOpacity = Math.round((100 / 100) * 0.59 * 255);
      expect(result).toEqual([255, 0, 0, expectedOpacity]);
    });

    it('applies user opacity correctly', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: '#00ff00',
            fillOpacity: 50,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Green at 50% user opacity with 0.59 base opacity
      const expectedOpacity = Math.round((50 / 100) * 0.59 * 255);
      expect(result).toEqual([0, 255, 0, expectedOpacity]);
    });

    it('uses default opacity when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: '#0000ff',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getFillColor(feature);

      // Blue with default 100% user opacity and 0.59 base opacity
      const expectedOpacity = Math.round((100 / 100) * 0.59 * 255);
      expect(result).toEqual([0, 0, 255, expectedOpacity]);
    });

    it('handles zero opacity', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            fillColor: '#ffffff',
            fillOpacity: 0,
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
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Default stroke: DEFAULT_COLORS.stroke with full opacity
      expect(result).toEqual([...DEFAULT_COLORS.stroke, 255]);
    });

    it('converts hex color to RGBA with full base opacity', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            strokeColor: '#ff0000',
            strokeOpacity: 100,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Red at 100% user opacity with 1.0 base opacity
      expect(result).toEqual([255, 0, 0, 255]);
    });

    it('applies user opacity correctly', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            strokeColor: '#00ff00',
            strokeOpacity: 50,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Green at 50% user opacity with 1.0 base opacity
      const expectedOpacity = Math.round((50 / 100) * 1.0 * 255);
      expect(result).toEqual([0, 255, 0, expectedOpacity]);
    });

    it('uses default opacity when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            strokeColor: '#0000ff',
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getStrokeColor(feature);

      // Blue with default 100% user opacity and 1.0 base opacity
      expect(result).toEqual([0, 0, 255, 255]);
    });
  });

  describe('getLineWidth', () => {
    it('returns default width when no style properties provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getLineWidth(feature);

      expect(result).toBe(4);
    });

    it('returns strokeWidth from style properties', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            strokeWidth: 8,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getLineWidth(feature);

      expect(result).toBe(8);
    });

    it('handles different stroke widths', () => {
      const widths = [1, 2, 4, 8];

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              strokeWidth: width,
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
            strokeWidth: 8,
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
        properties: {},
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
            strokeWidth: 4,
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
            strokeWidth: 4,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHoverLineWidth(feature, true);

      expect(result).toBe(6);
    });

    it('works with different base widths', () => {
      const widths = [1, 2, 4, 8];

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              strokeWidth: width,
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
    it('returns default highlight color with default opacity', () => {
      const result = getHighlightColor();

      const expectedOpacity = Math.round(0.39 * 255);
      expect(result).toEqual([...DEFAULT_COLORS.highlight, expectedOpacity] as [
        number,
        number,
        number,
        number,
      ]);
    });

    it('applies custom opacity', () => {
      const result = getHighlightColor(0.5);

      const expectedOpacity = Math.round(0.5 * 255);
      expect(result).toEqual([...DEFAULT_COLORS.highlight, expectedOpacity] as [
        number,
        number,
        number,
        number,
      ]);
    });

    it('handles full opacity', () => {
      const result = getHighlightColor(1.0);

      expect(result).toEqual([...DEFAULT_COLORS.highlight, 255] as [
        number,
        number,
        number,
        number,
      ]);
    });

    it('handles zero opacity', () => {
      const result = getHighlightColor(0);

      expect(result).toEqual([...DEFAULT_COLORS.highlight, 0] as [
        number,
        number,
        number,
        number,
      ]);
    });
  });

  describe('getHighlightLineWidth', () => {
    it('increases base width by 10', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {
          styleProperties: {
            strokeWidth: 4,
          },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHighlightLineWidth(feature);

      expect(result).toBe(14);
    });

    it('works with different base widths', () => {
      const widths = [1, 2, 4, 8];

      for (const width of widths) {
        const feature: StyledFeature = {
          type: 'Feature',
          properties: {
            styleProperties: {
              strokeWidth: width,
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        };

        expect(getHighlightLineWidth(feature)).toBe(width + 10);
      }
    });

    it('uses default width when not provided', () => {
      const feature: StyledFeature = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      };

      const result = getHighlightLineWidth(feature);

      // Default width (4) + 10
      expect(result).toBe(14);
    });
  });
});
