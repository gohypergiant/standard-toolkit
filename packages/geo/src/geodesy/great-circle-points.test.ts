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
import {
  HALF_CIRCUMFERENCE_METERS,
  lonLatArbitrary,
} from './__fixtures__/arbitraries';
import { distance } from './distance';
import { greatCirclePoints } from './great-circle-points';
import { midpoint } from './midpoint';

describe('greatCirclePoints', () => {
  it('starts at the origin, ends at the destination, and has segments + 1 vertices', () => {
    const points = greatCirclePoints([-74, 40.7], [139.7, 35.7], 8);

    expect(points).toHaveLength(9);
    expect(points[0]).toEqual([-74, 40.7]);
    // The geodesic runs west over the Pacific, so the final longitude is
    // unwrapped a full turn: 139.7 - 360.
    expect(points[8]).toEqual([139.7 - 360, 35.7]);
  });

  it('passes through the geodesic midpoint at the middle vertex', () => {
    const origin: [number, number] = [-74, 40.7];
    const destination: [number, number] = [139.7, 35.7];

    const points = greatCirclePoints(origin, destination, 8);
    const [longitude, latitude] = midpoint(origin, destination);

    expect(points[4]?.[0]).toBeCloseTo(longitude, 6);
    expect(points[4]?.[1]).toBeCloseTo(latitude, 6);
  });

  it('unwraps longitudes so a segment crossing the antimeridian is monotonic', () => {
    const points = greatCirclePoints([179, 0], [-179, 0], 4);

    expect(points.map(([longitude]) => longitude)).toEqual([
      179, 179.5, 180, 180.5, 181,
    ]);
  });

  it('returns both endpoints for identical points', () => {
    expect(greatCirclePoints([10, 20], [10, 20], 4)).toEqual([
      [10, 20],
      [10, 20],
    ]);
  });

  it('defaults to 64 segments', () => {
    expect(greatCirclePoints([0, 0], [10, 10])).toHaveLength(65);
  });

  it.each([
    ['zero', 0],
    ['negative', -2],
    ['fractional', 2.5],
  ])('throws a RangeError for a %s segment count', (_label, segments) => {
    expect(() => greatCirclePoints([0, 0], [1, 1], segments)).toThrow(
      RangeError,
    );
  });

  it('throws a RangeError for non-finite coordinates', () => {
    expect(() => greatCirclePoints([Number.NaN, 0], [1, 1])).toThrow(
      'greatCirclePoints requires finite [longitude, latitude] coordinates.',
    );
  });

  it('spaces vertices evenly along the geodesic', () => {
    fc.assert(
      fc.property(lonLatArbitrary, lonLatArbitrary, (origin, destination) => {
        const span = distance(origin, destination);

        // Antipodal pairs have no unique geodesic; stay 1 km clear of them.
        fc.pre(span > 1000 && span < HALF_CIRCUMFERENCE_METERS - 1000);

        const points = greatCirclePoints(origin, destination, 8);
        const segmentLengths = points
          .slice(1)
          .map((point, index) => distance(points[index] ?? point, point));
        const expected = distance(origin, destination) / 8;

        for (const segmentLength of segmentLengths) {
          expect(segmentLength).toBeCloseTo(expected, -1);
        }
      }),
    );
  });
});
