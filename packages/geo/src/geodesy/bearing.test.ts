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

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bearing } from './bearing';

const longitudeArbitrary = fc.double({ min: -180, max: 180, noNaN: true });
const latitudeArbitrary = fc.double({ min: -90, max: 90, noNaN: true });

describe('bearing', () => {
  describe('cardinal directions', () => {
    it('returns 0 for due north', () => {
      expect(bearing([0, 0], [0, 1])).toBe(0);
    });

    it('returns 90 for due east', () => {
      expect(bearing([0, 0], [1, 0])).toBeCloseTo(90, 5);
    });

    it('returns 180 for due south', () => {
      expect(bearing([0, 1], [0, 0])).toBeCloseTo(180, 5);
    });

    it('returns 270 for due west', () => {
      expect(bearing([1, 0], [0, 0])).toBeCloseTo(270, 5);
    });
  });

  describe('known coordinate pairs', () => {
    it('returns northeast bearing from origin to northeast point', () => {
      const result = bearing([0, 0], [1, 1]);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(90);
    });

    it('returns southwest bearing from origin to southwest point', () => {
      const result = bearing([0, 0], [-1, -1]);

      expect(result).toBeGreaterThan(180);
      expect(result).toBeLessThan(270);
    });

    it('computes correct bearing from London to Paris (~148°)', () => {
      // London: [-0.1278, 51.5074], Paris: [2.3522, 48.8566]
      const result = bearing([-0.1278, 51.5074], [2.3522, 48.8566]);

      expect(result).toBeCloseTo(148.1, 0);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for identical coordinates (zero distance)', () => {
      expect(bearing([10, 20], [10, 20])).toBe(0);
    });

    it('handles antimeridian crossing correctly', () => {
      // From 179°E to 179°W crosses the antimeridian going east
      const result = bearing([179, 0], [-179, 0]);

      expect(result).toBeCloseTo(90, 0);
    });

    it('returns a finite bearing within [0, 360) for antipodal points', () => {
      // Antipodal points: bearing is technically undefined, but the result must still be a usable angle
      const result = bearing([0, 90], [0, -90]);

      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(360);
    });
  });

  describe('input validation', () => {
    it.each([
      ['NaN origin longitude', [Number.NaN, 0], [1, 1]],
      ['NaN origin latitude', [0, Number.NaN], [1, 1]],
      ['NaN destination longitude', [0, 0], [Number.NaN, 1]],
      ['NaN destination latitude', [0, 0], [1, Number.NaN]],
      ['Infinity origin longitude', [Number.POSITIVE_INFINITY, 0], [1, 1]],
      ['-Infinity destination latitude', [0, 0], [1, Number.NEGATIVE_INFINITY]],
    ] as const)('throws RangeError for %s', (_description, origin, destination) => {
      expect(() => bearing(origin, destination)).toThrow(RangeError);
      expect(() => bearing(origin, destination)).toThrow(
        'bearing requires finite [longitude, latitude] coordinates.',
      );
    });
  });

  describe('properties', () => {
    it('is finite and within [0, 360) for any in-range coordinate pair', () => {
      fc.assert(
        fc.property(
          longitudeArbitrary,
          latitudeArbitrary,
          longitudeArbitrary,
          latitudeArbitrary,
          (
            originLongitude,
            originLatitude,
            destinationLongitude,
            destinationLatitude,
          ) => {
            const result = bearing(
              [originLongitude, originLatitude],
              [destinationLongitude, destinationLatitude],
            );

            expect(Number.isFinite(result)).toBe(true);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(360);
          },
        ),
      );
    });
  });
});
