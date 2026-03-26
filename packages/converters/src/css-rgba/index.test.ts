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
  cssRgbaObjectToRgba255Tuple,
  cssRgbaStringToRgba255Tuple,
  cssRgbaTupleToRgba255Tuple,
  rgba255TupleToCssRgbaObject,
  rgba255TupleToCssRgbaString,
  rgba255TupleToCssRgbaTuple,
} from '.';
import type { CssRgbaObject, Rgba255Tuple } from '@accelint/predicates';

describe('css-rgba', () => {
  describe('cssRgbaStringToRgba255Tuple', () => {
    describe('legacy comma-separated syntax', () => {
      it.each([
        // Integer RGB with decimal alpha
        ['rgba(255, 128, 64, 1)', [255, 128, 64, 255]],
        ['rgba(255, 128, 64, 0.5)', [255, 128, 64, 128]],
        ['rgba(255, 128, 64, 0)', [255, 128, 64, 0]],
        ['rgb(255, 128, 64)', [255, 128, 64, 255]],
        ['rgba(  255  ,  128  ,  64  ,  1  )', [255, 128, 64, 255]],
        ['rgba(0, 0, 0, 0)', [0, 0, 0, 0]],
        ['rgb(0, 0, 0)', [0, 0, 0, 255]],
        ['rgba(255, 255, 255, 1)', [255, 255, 255, 255]],
        // Percentage RGB with decimal alpha
        ['rgb(100%, 50%, 25%)', [255, 128, 64, 255]],
        ['rgba(100%, 50%, 25%, 0.5)', [255, 128, 64, 128]],
        ['rgba(100%, 50%, 25%, 1)', [255, 128, 64, 255]],
        ['rgba(100%, 50%, 25%, 0)', [255, 128, 64, 0]],
        ['rgb(0%, 0%, 0%)', [0, 0, 0, 255]],
        ['rgb(100%, 100%, 100%)', [255, 255, 255, 255]],
        // Percentage RGB with percentage alpha
        ['rgba(100%, 50%, 25%, 50%)', [255, 128, 64, 128]],
        ['rgba(100%, 50%, 25%, 100%)', [255, 128, 64, 255]],
        ['rgba(100%, 50%, 25%, 0%)', [255, 128, 64, 0]],
        // Integer RGB with percentage alpha
        ['rgba(255, 128, 64, 50%)', [255, 128, 64, 128]],
        ['rgba(255, 128, 64, 100%)', [255, 128, 64, 255]],
      ] as const)('should parse %s to %o', (css, expected) => {
        expect(cssRgbaStringToRgba255Tuple(css)).toEqual(expected);
      });
    });

    describe('modern space-separated syntax', () => {
      it.each([
        // Integer RGB without alpha
        ['rgb(255 128 64)', [255, 128, 64, 255]],
        ['rgb(0 0 0)', [0, 0, 0, 255]],
        ['rgb(255 255 255)', [255, 255, 255, 255]],
        // Integer RGB with decimal alpha (slash separator)
        ['rgb(255 128 64 / 0.5)', [255, 128, 64, 128]],
        ['rgb(255 128 64 / 1)', [255, 128, 64, 255]],
        ['rgb(255 128 64 / 0)', [255, 128, 64, 0]],
        ['rgb(  255  128  64  /  0.5  )', [255, 128, 64, 128]],
        // Integer RGB with percentage alpha (slash separator)
        ['rgb(255 128 64 / 50%)', [255, 128, 64, 128]],
        ['rgb(255 128 64 / 100%)', [255, 128, 64, 255]],
        ['rgb(255 128 64 / 0%)', [255, 128, 64, 0]],
        // Percentage RGB without alpha
        ['rgb(100% 50% 25%)', [255, 128, 64, 255]],
        ['rgb(0% 0% 0%)', [0, 0, 0, 255]],
        ['rgb(100% 100% 100%)', [255, 255, 255, 255]],
        // Percentage RGB with decimal alpha (slash separator)
        ['rgb(100% 50% 25% / 0.5)', [255, 128, 64, 128]],
        ['rgb(100% 50% 25% / 1)', [255, 128, 64, 255]],
        ['rgb(100% 50% 25% / 0)', [255, 128, 64, 0]],
        // Percentage RGB with percentage alpha (slash separator)
        ['rgb(100% 50% 25% / 50%)', [255, 128, 64, 128]],
        ['rgb(100% 50% 25% / 100%)', [255, 128, 64, 255]],
        ['rgb(100% 50% 25% / 0%)', [255, 128, 64, 0]],
      ] as const)('should parse %s to %o', (css, expected) => {
        expect(cssRgbaStringToRgba255Tuple(css)).toEqual(expected);
      });
    });

    describe('error cases', () => {
      it.each([
        'invalid',
        'rgb(256, 0, 0)', // Out of range
        'rgb(-1, 0, 0)', // Negative
        'rgba(1,2)', // Incomplete
        'rgba(1, 2, 3, 2)', // Alpha out of range
        'rgba(1, 2, 3, -0.5)', // Negative alpha
        'rgba(1, 2, 3, 101%)', // Alpha percentage out of range
        '', // Empty
        'rgba()', // Empty values
        'rgb()', // Empty values
        'rgb(255, 50%, 64)', // Mixed integer and percentage
        'rgb(100%, 128, 25%)', // Mixed integer and percentage
        'rgb(50%, 128, 64)', // Mixed integer and percentage
        'rgb(255 128, 64)', // Mixed separators
        'rgb(255, 128 64)', // Mixed separators
      ])('should throw for invalid input: %s', (css) => {
        expect(() => cssRgbaStringToRgba255Tuple(css)).toThrow();
      });

      it('should throw for percentage RGB values > 100%', () => {
        expect(() =>
          cssRgbaStringToRgba255Tuple('rgb(101%, 50%, 25%)'),
        ).toThrow(/RGB percentage must be between 0-100%/);
      });

      it('should throw for percentage alpha > 100%', () => {
        expect(() =>
          cssRgbaStringToRgba255Tuple('rgba(255, 128, 64, 150%)'),
        ).toThrow(/Alpha percentage must be between 0-100%/);
      });
    });
  });

  describe('rgba255TupleToCssRgbaString', () => {
    it.each([
      [[255, 128, 64, 255] as const, 'rgba(255, 128, 64, 1)'],
      [[255, 128, 64, 128] as const, 'rgba(255, 128, 64, 0.5019607843137255)'],
      [[255, 128, 64, 0] as const, 'rgba(255, 128, 64, 0)'],
      [[0, 0, 0, 0] as const, 'rgba(0, 0, 0, 0)'],
      [[0, 0, 0, 255] as const, 'rgba(0, 0, 0, 1)'],
    ] as const)('should convert %o to %s', (color, expected) => {
      expect(rgba255TupleToCssRgbaString(color)).toBe(expected);
    });
  });

  describe('cssRgbaObjectToRgba255Tuple', () => {
    it.each([
      [{ r: 255, g: 128, b: 64, a: 1 }, [255, 128, 64, 255]],
      [{ r: 255, g: 128, b: 64, a: 0.5 }, [255, 128, 64, 128]],
      [{ r: 0, g: 0, b: 0, a: 0 }, [0, 0, 0, 0]],
      [{ r: 255, g: 255, b: 255, a: 1 }, [255, 255, 255, 255]],
    ] as const)('should convert %o to %o', (obj, expected) => {
      expect(cssRgbaObjectToRgba255Tuple(obj)).toEqual(expected);
    });

    it.each([
      { r: 256, g: 0, b: 0, a: 1 },
      { r: -1, g: 0, b: 0, a: 1 },
      { r: 0, g: 256, b: 0, a: 1 },
      { r: 0, g: 0, b: 256, a: 1 },
      { r: 0, g: 0, b: 0, a: 2 },
      { r: 0, g: 0, b: 0, a: -0.5 },
    ])('should throw for out of range values: %o', (obj) => {
      expect(() => cssRgbaObjectToRgba255Tuple(obj as CssRgbaObject)).toThrow();
    });
  });

  describe('rgba255TupleToCssRgbaObject', () => {
    it.each([
      [[255, 128, 64, 255] as const, { r: 255, g: 128, b: 64, a: 1 }],
      [
        [255, 128, 64, 128] as const,
        { r: 255, g: 128, b: 64, a: 0.5019607843137255 },
      ],
      [[0, 0, 0, 0] as const, { r: 0, g: 0, b: 0, a: 0 }],
      [[255, 255, 255, 255] as const, { r: 255, g: 255, b: 255, a: 1 }],
    ] as const)('should convert %o to %o', (color, expected) => {
      expect(rgba255TupleToCssRgbaObject(color)).toEqual(expected);
    });
  });

  describe('cssRgbaTupleToRgba255Tuple', () => {
    it.each([
      [[255, 128, 64, 1] as const, [255, 128, 64, 255]],
      [[255, 128, 64, 0.5] as const, [255, 128, 64, 128]],
      [[255, 128, 64, 0] as const, [255, 128, 64, 0]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[255, 255, 255, 1] as const, [255, 255, 255, 255]],
    ] as const)('should parse %o to %o', (tuple, expected) => {
      expect(cssRgbaTupleToRgba255Tuple(tuple)).toEqual(expected);
    });

    it.each([
      [256, 0, 0, 1],
      [-1, 0, 0, 1],
      [0, 0, 0, 2],
      [0, 0, 0, -0.5],
    ] as const)('should throw for invalid tuple: %o', (...values) => {
      expect(() =>
        cssRgbaTupleToRgba255Tuple(
          values as readonly [number, number, number, number],
        ),
      ).toThrow();
    });

    it('should throw for tuple with wrong length', () => {
      expect(() =>
        cssRgbaTupleToRgba255Tuple([255, 128, 64] as unknown as readonly [
          number,
          number,
          number,
          number,
        ]),
      ).toThrow('CSS RGBA tuple must have exactly 4 values');
    });
  });

  describe('rgba255TupleToCssRgbaTuple', () => {
    it.each([
      [[255, 128, 64, 255] as const, [255, 128, 64, 1]],
      [[255, 128, 64, 128] as const, [255, 128, 64, 0.5019607843137255]],
      [[255, 128, 64, 0] as const, [255, 128, 64, 0]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[255, 255, 255, 255] as const, [255, 255, 255, 1]],
    ] as const)('should convert %o to %o', (color, expected) => {
      expect(rgba255TupleToCssRgbaTuple(color)).toEqual(expected);
    });
  });

  describe('round-trip conversions', () => {
    const testColor: Rgba255Tuple = [255, 128, 64, 255];

    it('should round-trip through CSS', () => {
      const css = rgba255TupleToCssRgbaString(testColor);
      const result = cssRgbaStringToRgba255Tuple(css);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through object conversion', () => {
      const obj = rgba255TupleToCssRgbaObject(testColor);
      const result = cssRgbaObjectToRgba255Tuple(obj);
      expect(result).toEqual(testColor);
    });

    it('should handle semi-transparent colors in CSS round-trip', () => {
      const semiTransparent: Rgba255Tuple = [255, 128, 64, 128];
      const css = rgba255TupleToCssRgbaString(semiTransparent);
      const result = cssRgbaStringToRgba255Tuple(css);
      expect(result).toEqual(semiTransparent);
    });
  });
});
