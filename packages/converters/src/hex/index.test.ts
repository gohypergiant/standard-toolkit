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
import { hexToRgba255Tuple, rgba255TupleToHex } from '.';
import type { Rgba255Tuple } from '@accelint/predicates';

describe('hex', () => {
  describe('hexToRgba255Tuple', () => {
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
      // 4-char hex (RGBA) - expands to RRGGBBAA
      ['#F09A', [255, 0, 153, 170]], // F09A -> FF0099AA
      ['#F840', [255, 136, 68, 0]], // F840 -> FF884400
      ['#000F', [0, 0, 0, 255]], // 000F -> 000000FF
      ['#0000', [0, 0, 0, 0]], // 0000 -> 00000000
      ['#FFFF', [255, 255, 255, 255]], // FFFF -> FFFFFFFF
      ['F84A', [255, 136, 68, 170]], // Without hash
      // 8-char hex (RRGGBBAA)
      ['#FF804080', [255, 128, 64, 128]],
      ['#FF8040FF', [255, 128, 64, 255]],
      ['#00000000', [0, 0, 0, 0]],
    ] as const)('should parse %s to %o', (hex, expected) => {
      expect(hexToRgba255Tuple(hex)).toEqual(expected);
    });

    it.each([
      'invalid',
      '#GG0000', // Invalid hex character
      '#FF', // Too short (2 chars)
      '#FFFFF', // Invalid length (5 chars)
      '#FF00000', // Invalid length (7 chars)
      '#FF0000000', // Invalid length (9 chars)
      '',
    ])('should throw for invalid hex: %s', (hex) => {
      expect(() => hexToRgba255Tuple(hex)).toThrow();
    });
  });

  describe('rgba255TupleToHex', () => {
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
      expect(rgba255TupleToHex(color, includeAlpha)).toBe(expected);
    });

    it('should default to 6-char hex without alpha', () => {
      expect(rgba255TupleToHex([255, 128, 64, 128])).toBe('#FF8040');
    });
  });

  describe('round-trip conversions', () => {
    const testColor: Rgba255Tuple = [255, 128, 64, 255];

    it('should round-trip through hex (6-char)', () => {
      const hex = rgba255TupleToHex(testColor);
      const result = hexToRgba255Tuple(hex);
      expect(result).toEqual(testColor);
    });

    it('should round-trip through hex (8-char with alpha)', () => {
      const hex = rgba255TupleToHex(testColor, true);
      const result = hexToRgba255Tuple(hex);
      expect(result).toEqual(testColor);
    });
    it('should handle semi-transparent colors in hex round-trip', () => {
      const semiTransparent: Rgba255Tuple = [255, 128, 64, 128];
      const hex = rgba255TupleToHex(semiTransparent, true);
      const result = hexToRgba255Tuple(hex);
      expect(result).toEqual(semiTransparent);
    });
  });
});
