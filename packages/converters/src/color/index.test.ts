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
  type Color,
  type CssRgbaObject,
  colorToCssRgbaObject,
  colorToCssRgbaString,
  colorToCssRgbaTuple,
  colorToGlsl,
  colorToHex,
  cssRgbaObjectToColor,
  cssRgbaStringToColor,
  cssRgbaTupleToColor,
  glslToColor,
  hexToColor,
  isColor,
  isCssRgbaObject,
} from './';

describe('color', () => {
  describe('hexToColor', () => {
    it.each([
      // 6-char hex (RRGGBB)
      ['#FF8040', [255, 128, 64, 255]],
      ['FF8040', [255, 128, 64, 255]], // Without hash
      ['#000000', [0, 0, 0, 255]],
      ['#FFFFFF', [255, 255, 255, 255]],
      // 3-char hex (RGB) - expands to RRGGBB
      ['#F84', [255, 136, 68, 255]], // F84 -> FF8844
      ['#000', [0, 0, 0, 255]],
      ['#FFF', [255, 255, 255, 255]],
      // 8-char hex (RRGGBBAA)
      ['#FF804080', [255, 128, 64, 128]],
      ['#FF8040FF', [255, 128, 64, 255]],
      ['#00000000', [0, 0, 0, 0]],
    ] as const)('should parse %s to %o', (hex, expected) => {
      expect(hexToColor(hex)).toEqual(expected);
    });

    it.each([
      'invalid',
      '#GG0000', // Invalid hex character
      '#FF', // Too short
      '#FF00', // Invalid length (4 chars)
      '#FF00000', // Invalid length (7 chars)
      '#FF0000000', // Invalid length (9 chars)
      '',
    ])('should throw for invalid hex: %s', (hex) => {
      expect(() => hexToColor(hex)).toThrow();
    });
  });

  describe('colorToHex', () => {
    it.each([
      [[255, 128, 64, 255] as const, false, '#FF8040'],
      [[255, 128, 64, 255] as const, true, '#FF8040FF'],
      [[255, 128, 64, 128] as const, false, '#FF8040'],
      [[255, 128, 64, 128] as const, true, '#FF804080'],
      [[0, 0, 0, 0] as const, false, '#000000'],
      [[0, 0, 0, 0] as const, true, '#00000000'],
      [[255, 255, 255, 255] as const, false, '#FFFFFF'],
      [[255, 255, 255, 255] as const, true, '#FFFFFFFF'],
    ] as const)('should convert %o to %s (includeAlpha=%s)', (color, includeAlpha, expected) => {
      expect(colorToHex(color, includeAlpha)).toBe(expected);
    });

    it('should default to 6-char hex without alpha', () => {
      expect(colorToHex([255, 128, 64, 128])).toBe('#FF8040');
    });
  });

  describe('cssRgbaStringToColor', () => {
    it.each([
      ['rgba(255, 128, 64, 1)', [255, 128, 64, 255]],
      ['rgba(255, 128, 64, 0.5)', [255, 128, 64, 128]],
      ['rgba(255, 128, 64, 0)', [255, 128, 64, 0]],
      ['rgb(255, 128, 64)', [255, 128, 64, 255]],
      ['rgba(  255  ,  128  ,  64  ,  1  )', [255, 128, 64, 255]],
      ['rgba(0, 0, 0, 0)', [0, 0, 0, 0]],
      ['rgb(0, 0, 0)', [0, 0, 0, 255]],
      ['rgba(255, 255, 255, 1)', [255, 255, 255, 255]],
    ] as const)('should parse %s to %o', (css, expected) => {
      expect(cssRgbaStringToColor(css)).toEqual(expected);
    });

    it.each([
      'invalid',
      'rgb(256, 0, 0)',
      'rgb(-1, 0, 0)',
      'rgba(1,2)',
      'rgba(1, 2, 3, 2)',
      'rgba(1, 2, 3, -0.5)',
      '',
      'rgba()',
      'rgb()',
    ])('should throw for invalid input: %s', (css) => {
      expect(() => cssRgbaStringToColor(css)).toThrow();
    });
  });

  describe('colorToCssRgbaString', () => {
    it.each([
      [[255, 128, 64, 255] as const, 'rgba(255, 128, 64, 1)'],
      [[255, 128, 64, 128] as const, 'rgba(255, 128, 64, 0.5019607843137255)'],
      [[255, 128, 64, 0] as const, 'rgba(255, 128, 64, 0)'],
      [[0, 0, 0, 0] as const, 'rgba(0, 0, 0, 0)'],
      [[0, 0, 0, 255] as const, 'rgba(0, 0, 0, 1)'],
    ] as const)('should convert %o to %s', (color, expected) => {
      expect(colorToCssRgbaString(color)).toBe(expected);
    });
  });

  describe('cssRgbaObjectToColor', () => {
    it.each([
      [{ r: 255, g: 128, b: 64, a: 1 }, [255, 128, 64, 255]],
      [{ r: 255, g: 128, b: 64, a: 0.5 }, [255, 128, 64, 128]],
      [{ r: 0, g: 0, b: 0, a: 0 }, [0, 0, 0, 0]],
      [{ r: 255, g: 255, b: 255, a: 1 }, [255, 255, 255, 255]],
    ] as const)('should convert %o to %o', (obj, expected) => {
      expect(cssRgbaObjectToColor(obj)).toEqual(expected);
    });

    it.each([
      { r: 256, g: 0, b: 0, a: 1 },
      { r: -1, g: 0, b: 0, a: 1 },
      { r: 0, g: 256, b: 0, a: 1 },
      { r: 0, g: 0, b: 256, a: 1 },
      { r: 0, g: 0, b: 0, a: 2 },
      { r: 0, g: 0, b: 0, a: -0.5 },
    ])('should throw for out of range values: %o', (obj) => {
      expect(() => cssRgbaObjectToColor(obj as CssRgbaObject)).toThrow();
    });
  });

  describe('colorToCssRgbaObject', () => {
    it.each([
      [[255, 128, 64, 255] as const, { r: 255, g: 128, b: 64, a: 1 }],
      [
        [255, 128, 64, 128] as const,
        { r: 255, g: 128, b: 64, a: 0.5019607843137255 },
      ],
      [[0, 0, 0, 0] as const, { r: 0, g: 0, b: 0, a: 0 }],
      [[255, 255, 255, 255] as const, { r: 255, g: 255, b: 255, a: 1 }],
    ] as const)('should convert %o to %o', (color, expected) => {
      expect(colorToCssRgbaObject(color)).toEqual(expected);
    });
  });

  describe('cssRgbaTupleToColor', () => {
    it.each([
      [[255, 128, 64, 1] as const, [255, 128, 64, 255]],
      [[255, 128, 64, 0.5] as const, [255, 128, 64, 128]],
      [[255, 128, 64, 0] as const, [255, 128, 64, 0]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[255, 255, 255, 1] as const, [255, 255, 255, 255]],
    ] as const)('should parse %o to %o', (tuple, expected) => {
      expect(cssRgbaTupleToColor(tuple)).toEqual(expected);
    });

    it.each([
      [256, 0, 0, 1],
      [-1, 0, 0, 1],
      [0, 0, 0, 2],
      [0, 0, 0, -0.5],
    ] as const)('should throw for invalid tuple: %o', (...values) => {
      expect(() =>
        cssRgbaTupleToColor(
          values as readonly [number, number, number, number],
        ),
      ).toThrow();
    });
  });

  describe('colorToCssRgbaTuple', () => {
    it.each([
      [[255, 128, 64, 255] as const, [255, 128, 64, 1]],
      [[255, 128, 64, 128] as const, [255, 128, 64, 0.5019607843137255]],
      [[255, 128, 64, 0] as const, [255, 128, 64, 0]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[255, 255, 255, 255] as const, [255, 255, 255, 1]],
    ] as const)('should convert %o to %o', (color, expected) => {
      expect(colorToCssRgbaTuple(color)).toEqual(expected);
    });
  });

  describe('colorToGlsl', () => {
    it.each([
      [
        [255, 128, 64, 255] as const,
        [1, 0.5019607843137255, 0.25098039215686274, 1],
      ],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[255, 255, 255, 255] as const, [1, 1, 1, 1]],
      [
        [127, 127, 127, 127] as const,
        [
          0.4980392156862745, 0.4980392156862745, 0.4980392156862745,
          0.4980392156862745,
        ],
      ],
    ] as const)('should normalize %o to %o', (color, expected) => {
      const result = colorToGlsl(color);
      expect(result).toEqual(expected);
    });
  });

  describe('glslToColor', () => {
    it.each([
      [[1, 0.5, 0.25, 1] as const, [255, 128, 64, 255]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[1, 1, 1, 1] as const, [255, 255, 255, 255]],
      [[0.5, 0.5, 0.5, 0.5] as const, [128, 128, 128, 128]],
    ] as const)('should denormalize %o to %o', (color, expected) => {
      expect(glslToColor(color)).toEqual(expected);
    });

    it('should clamp values above 1', () => {
      const result = glslToColor([1.5, 1.2, 1.0, 1.0]);
      expect(result).toEqual([255, 255, 255, 255]);
    });

    it('should clamp values below 0', () => {
      const result = glslToColor([-0.5, -0.2, 0, 0]);
      expect(result).toEqual([0, 0, 0, 0]);
    });
  });

  describe('isColor', () => {
    it.each([
      [[255, 128, 64, 255], true],
      [[0, 0, 0, 0], true],
      [[255, 255, 255, 255], true],
    ] as const)('should return %s for %o', (value, expected) => {
      expect(isColor(value)).toBe(expected);
    });

    it.each([
      [255, 128, 64],
      [255, 128, 64, 255, 0],
      [256, 0, 0, 0],
      [-1, 0, 0, 0],
      'rgba(255, 128, 64, 1)',
      { r: 255, g: 128, b: 64, a: 255 },
      null,
      undefined,
      [Number.NaN, 0, 0, 0],
      [Number.POSITIVE_INFINITY, 0, 0, 0],
    ])('should return false for invalid value: %o', (value) => {
      expect(isColor(value)).toBe(false);
    });
  });

  describe('isCssRgbaObject', () => {
    it.each([
      [{ r: 255, g: 128, b: 64, a: 1 }, true],
      [{ r: 255, g: 128, b: 64, a: 0.5 }, true],
      [{ r: 0, g: 0, b: 0, a: 0 }, true],
      [{ r: 255, g: 255, b: 255, a: 1 }, true],
    ] as const)('should return %s for %o', (value, expected) => {
      expect(isCssRgbaObject(value)).toBe(expected);
    });

    it.each([
      { r: 255, g: 128, b: 64 },
      { r: 256, g: 0, b: 0, a: 1 },
      { r: -1, g: 0, b: 0, a: 1 },
      { r: 0, g: 0, b: 0, a: 2 },
      { r: 0, g: 0, b: 0, a: -0.5 },
      [255, 128, 64, 255],
      'rgba(255, 128, 64, 1)',
      null,
      undefined,
      {},
      { r: Number.NaN, g: 0, b: 0, a: 1 },
      { r: 0, g: 0, b: 0, a: Number.NaN },
    ])('should return false for invalid value: %o', (value) => {
      expect(isCssRgbaObject(value)).toBe(false);
    });
  });

  describe('round-trip conversions', () => {
    const testColor: Color = [255, 128, 64, 255];

    it('should round-trip through CSS', () => {
      const css = colorToCssRgbaString(testColor);
      const result = cssRgbaStringToColor(css);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through hex (6-char)', () => {
      const hex = colorToHex(testColor);
      const result = hexToColor(hex);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through hex (8-char with alpha)', () => {
      const hex = colorToHex(testColor, true);
      const result = hexToColor(hex);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through normalize/denormalize', () => {
      const normalized = colorToGlsl(testColor);
      const result = glslToColor(normalized);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through object conversion', () => {
      const obj = colorToCssRgbaObject(testColor);
      const result = cssRgbaObjectToColor(obj);
      expect(result).toEqual(testColor);
    });

    it('should handle semi-transparent colors in CSS round-trip', () => {
      const semiTransparent: Color = [255, 128, 64, 128];
      const css = colorToCssRgbaString(semiTransparent);
      const result = cssRgbaStringToColor(css);
      expect(result).toEqual(semiTransparent);
    });

    it('should handle semi-transparent colors in hex round-trip', () => {
      const semiTransparent: Color = [255, 128, 64, 128];
      const hex = colorToHex(semiTransparent, true);
      const result = hexToColor(hex);
      expect(result).toEqual(semiTransparent);
    });
  });
});
