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
import { distance } from './distance';

const longitudeArbitrary = fc.double({ min: -180, max: 180, noNaN: true });
const latitudeArbitrary = fc.double({ min: -90, max: 90, noNaN: true });

// Microdegree resolution (~0.11 m) keeps distinct points far enough apart that
// the haversine term cannot underflow to 0 the way sub-1e-160 degree deltas do.
const MICRODEGREES_PER_DEGREE = 1_000_000;
const microdegreeLongitudeArbitrary = fc
  .integer({
    min: -180 * MICRODEGREES_PER_DEGREE,
    max: 180 * MICRODEGREES_PER_DEGREE,
  })
  .map((microdegrees) => microdegrees / MICRODEGREES_PER_DEGREE);
const microdegreeLatitudeArbitrary = fc
  .integer({
    min: -90 * MICRODEGREES_PER_DEGREE,
    max: 90 * MICRODEGREES_PER_DEGREE,
  })
  .map((microdegrees) => microdegrees / MICRODEGREES_PER_DEGREE);

describe('distance', () => {
  describe('known distances', () => {
    it('returns approximately 111195 meters for 1 degree of latitude at equator', () => {
      // 1 degree of latitude ≈ 111,195 m
      const result = distance([0, 0], [0, 1]);

      expect(result).toBeCloseTo(111195, -2);
    });

    it('computes distance from London to Paris (~343556 m)', () => {
      // London: [-0.1278, 51.5074], Paris: [2.3522, 48.8566]
      const result = distance([-0.1278, 51.5074], [2.3522, 48.8566]);

      expect(result).toBeCloseTo(343556, -2);
    });

    it('returns a positive distance for non-identical coordinates', () => {
      const result = distance([10, 20], [11, 21]);

      expect(result).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for identical coordinates', () => {
      expect(distance([10, 20], [10, 20])).toBe(0);
    });

    it('returns 0 for origin coordinates', () => {
      expect(distance([0, 0], [0, 0])).toBe(0);
    });

    it('handles antipodal points', () => {
      // Distance between north and south pole ≈ half Earth circumference ≈ 20,015,087 m
      const result = distance([0, 90], [0, -90]);

      expect(result).toBeCloseTo(20015087, -2);
    });

    it('returns half the circumference instead of NaN for near-antipodal points', () => {
      // geodesy's haversine computes sqrt(1 - a) and rounding pushes `a` past 1
      // for this pair, so the library itself returns NaN.
      const result = distance(
        [165.56831887102487, 20.542180502772695],
        [-14.43168138306451, -20.542180512793223],
      );

      expect(result).toBeCloseTo(20015087, -2);
    });

    it('handles antimeridian crossing', () => {
      // Points straddling the antimeridian at same latitude
      // Should be about 222,390 m (2 degrees of longitude at equator)
      const result = distance([179, 0], [-179, 0]);

      expect(result).toBeCloseTo(222390, -2);
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
      expect(() => distance(origin, destination)).toThrow(RangeError);
      expect(() => distance(origin, destination)).toThrow(
        'distance requires finite [longitude, latitude] coordinates.',
      );
    });
  });

  describe('properties', () => {
    it('is non-negative and symmetric for any in-range coordinate pair', () => {
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
            const forward = distance(
              [originLongitude, originLatitude],
              [destinationLongitude, destinationLatitude],
            );
            const reverse = distance(
              [destinationLongitude, destinationLatitude],
              [originLongitude, originLatitude],
            );

            expect(forward).toBeGreaterThanOrEqual(0);
            expect(forward).toBe(reverse);
          },
        ),
      );
    });

    it('is finite for any pair, including near-antipodal ones', () => {
      fc.assert(
        fc.property(
          longitudeArbitrary,
          latitudeArbitrary,
          fc.double({ min: -1e-6, max: 1e-6, noNaN: true }),
          fc.double({ min: -1e-6, max: 1e-6, noNaN: true }),
          (longitude, latitude, longitudeJitter, latitudeJitter) => {
            const antipodeLongitude =
              longitude > 0 ? longitude - 180 : longitude + 180;
            const result = distance(
              [longitude, latitude],
              [antipodeLongitude + longitudeJitter, -latitude + latitudeJitter],
            );

            return Number.isFinite(result);
          },
        ),
      );
    });

    it('is 0 exactly when both points are identical', () => {
      fc.assert(
        fc.property(
          microdegreeLongitudeArbitrary,
          microdegreeLatitudeArbitrary,
          microdegreeLongitudeArbitrary,
          microdegreeLatitudeArbitrary,
          (
            originLongitude,
            originLatitude,
            destinationLongitude,
            destinationLatitude,
          ) => {
            const isIdentical =
              originLongitude === destinationLongitude &&
              originLatitude === destinationLatitude;
            const result = distance(
              [originLongitude, originLatitude],
              [destinationLongitude, destinationLatitude],
            );

            expect(result === 0).toBe(isIdentical);
          },
        ),
      );
    });

    it('is invariant when 360 degrees is added to a longitude', () => {
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
            const reference = distance(
              [originLongitude, originLatitude],
              [destinationLongitude, destinationLatitude],
            );
            const wrappedOrigin = distance(
              [originLongitude + 360, originLatitude],
              [destinationLongitude, destinationLatitude],
            );
            const wrappedDestination = distance(
              [originLongitude, originLatitude],
              [destinationLongitude + 360, destinationLatitude],
            );

            expect(wrappedOrigin).toBeCloseTo(reference, 3);
            expect(wrappedDestination).toBeCloseTo(reference, 3);
          },
        ),
      );
    });
  });
});
