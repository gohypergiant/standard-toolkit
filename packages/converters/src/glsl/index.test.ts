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
import { glslToRgba255Tuple, rgba255TupleToGlsl } from '.';
import type { Rgba255Tuple } from '@accelint/predicates';

describe('color', () => {
  describe('rgba255TupleToGlsl', () => {
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
      const result = rgba255TupleToGlsl(color);
      expect(result).toEqual(expected);
    });
  });

  describe('glslToRgba255Tuple', () => {
    it.each([
      [[1, 0.5, 0.25, 1] as const, [255, 128, 64, 255]],
      [[0, 0, 0, 0] as const, [0, 0, 0, 0]],
      [[1, 1, 1, 1] as const, [255, 255, 255, 255]],
      [[0.5, 0.5, 0.5, 0.5] as const, [128, 128, 128, 128]],
    ] as const)('should denormalize %o to %o', (color, expected) => {
      expect(glslToRgba255Tuple(color)).toEqual(expected);
    });

    it('should clamp values above 1', () => {
      const result = glslToRgba255Tuple([1.5, 1.2, 1.0, 1.0]);
      expect(result).toEqual([255, 255, 255, 255]);
    });

    it('should clamp values below 0', () => {
      const result = glslToRgba255Tuple([-0.5, -0.2, 0, 0]);
      expect(result).toEqual([0, 0, 0, 0]);
    });
  });

  describe('round-trip conversions', () => {
    const testColor: Rgba255Tuple = [255, 128, 64, 255];
    it('should round-trip through normalize/denormalize', () => {
      const normalized = rgba255TupleToGlsl(testColor);
      const result = glslToRgba255Tuple(normalized);
      expect(result).toEqual(testColor);
    });
  });
});
