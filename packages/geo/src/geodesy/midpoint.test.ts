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
import { midpoint } from './midpoint';

const longitudeArbitrary = fc.double({ min: -180, max: 180, noNaN: true });
const latitudeArbitrary = fc.double({ min: -90, max: 90, noNaN: true });

describe('midpoint', () => {
  describe('known midpoints', () => {
    it('returns the halfway point along a meridian', () => {
      const [longitude, latitude] = midpoint([0, 0], [0, 10]);

      expect(longitude).toBeCloseTo(0, 10);
      expect(latitude).toBeCloseTo(5, 10);
    });

    it('returns the halfway point along the equator', () => {
      const [longitude, latitude] = midpoint([0, 0], [10, 0]);

      expect(longitude).toBeCloseTo(5, 10);
      expect(latitude).toBeCloseTo(0, 10);
    });

    it('computes the midpoint between London and Paris', () => {
      // London: [-0.1278, 51.5074], Paris: [2.3522, 48.8566]
      const [longitude, latitude] = midpoint(
        [-0.1278, 51.5074],
        [2.3522, 48.8566],
      );

      expect(longitude).toBeCloseTo(1.15, 1);
      expect(latitude).toBeCloseTo(50.19, 1);
    });
  });

  describe('edge cases', () => {
    it('returns the point itself for identical coordinates', () => {
      expect(midpoint([10, 20], [10, 20])).toEqual([10, 20]);
    });

    it('returns the point itself for sub-microdegree identical coordinates', () => {
      expect(midpoint([1e-7, 1e-7], [1e-7, 1e-7])).toEqual([1e-7, 1e-7]);
    });

    it.each([
      ['eastward', [179, 0], [-179, 0]],
      ['westward', [-179, 0], [179, 0]],
    ] as const)('crosses the antimeridian rather than the prime meridian when travelling %s', (_direction, origin, destination) => {
      const [longitude, latitude] = midpoint(origin, destination);

      expect(Math.abs(longitude)).toBeCloseTo(180, 10);
      expect(latitude).toBeCloseTo(0, 10);
    });

    it('normalizes a wrapped-map longitude beyond 180 into [-180, 180]', () => {
      const [longitude, latitude] = midpoint([190, 0], [200, 0]);

      expect(longitude).toBeCloseTo(-165, 10);
      expect(latitude).toBeCloseTo(0, 10);
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
      expect(() => midpoint(origin, destination)).toThrow(RangeError);
      expect(() => midpoint(origin, destination)).toThrow(
        'midpoint requires finite [longitude, latitude] coordinates.',
      );
    });
  });

  describe('properties', () => {
    it('is equidistant from both endpoints for any in-range coordinate pair', () => {
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
            const origin: [number, number] = [originLongitude, originLatitude];
            const destination: [number, number] = [
              destinationLongitude,
              destinationLatitude,
            ];

            const result = midpoint(origin, destination);

            // Sub-millimeter tolerance; endpoint distances are equal up to
            // floating-point error in the spherical trigonometry.
            expect(distance(origin, result)).toBeCloseTo(
              distance(result, destination),
              3,
            );
          },
        ),
      );
    });

    it('returns a longitude within [-180, 180] and a latitude within [-90, 90]', () => {
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
            const [longitude, latitude] = midpoint(
              [originLongitude, originLatitude],
              [destinationLongitude, destinationLatitude],
            );

            expect(longitude).toBeGreaterThanOrEqual(-180);
            expect(longitude).toBeLessThanOrEqual(180);
            expect(latitude).toBeGreaterThanOrEqual(-90);
            expect(latitude).toBeLessThanOrEqual(90);
          },
        ),
      );
    });
  });
});
