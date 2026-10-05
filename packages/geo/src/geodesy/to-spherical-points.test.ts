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
import { toSphericalPoints } from './to-spherical-points';

describe('toSphericalPoints', () => {
  describe('conversion', () => {
    it('returns origin then destination as latitude/longitude points', () => {
      const [originPoint, destinationPoint] = toSphericalPoints(
        [10, 20],
        [30, 40],
        'caller',
      );

      expect([originPoint.lat, originPoint.lon]).toEqual([20, 10]);
      expect([destinationPoint.lat, destinationPoint.lon]).toEqual([40, 30]);
    });
  });

  describe('input validation', () => {
    it.each([
      ['NaN origin longitude', [Number.NaN, 0], [1, 1]],
      ['NaN origin latitude', [0, Number.NaN], [1, 1]],
      ['NaN destination longitude', [0, 0], [Number.NaN, 1]],
      ['NaN destination latitude', [0, 0], [1, Number.NaN]],
      ['Infinity origin longitude', [Number.POSITIVE_INFINITY, 0], [1, 1]],
      ['Infinity origin latitude', [0, Number.POSITIVE_INFINITY], [1, 1]],
      ['Infinity destination longitude', [0, 0], [Number.POSITIVE_INFINITY, 1]],
      ['Infinity destination latitude', [0, 0], [1, Number.POSITIVE_INFINITY]],
      ['-Infinity origin longitude', [Number.NEGATIVE_INFINITY, 0], [1, 1]],
      ['-Infinity origin latitude', [0, Number.NEGATIVE_INFINITY], [1, 1]],
      [
        '-Infinity destination longitude',
        [0, 0],
        [Number.NEGATIVE_INFINITY, 1],
      ],
      ['-Infinity destination latitude', [0, 0], [1, Number.NEGATIVE_INFINITY]],
    ] as const)('throws RangeError naming the caller for %s', (_description, origin, destination) => {
      expect(() =>
        toSphericalPoints(origin, destination, 'someFunction'),
      ).toThrow(RangeError);
      expect(() =>
        toSphericalPoints(origin, destination, 'someFunction'),
      ).toThrow(
        'someFunction requires finite [longitude, latitude] coordinates.',
      );
    });
  });
});
