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

import { toSphericalPoints } from './to-spherical-points';
import type { LonLatTuple } from '../coordinates/latlon/internal/normalize';

const DEFAULT_SEGMENTS = 64;

/**
 * Shifts `longitude` by whole turns so it sits within 180° of `reference`,
 * keeping consecutive vertices on the same world copy.
 */
function unwrapLongitude(reference: number, longitude: number): number {
  return longitude + 360 * Math.round((reference - longitude) / 360);
}

/**
 * Samples the great-circle path between two `[longitude, latitude]` points.
 *
 * Returns `segments + 1` vertices from `origin` to `destination`, evenly
 * spaced along the geodesic. Longitudes are unwrapped relative to the previous
 * vertex, so a path that crosses the antimeridian stays monotonic (for example
 * 179 → 181 rather than 179 → -179) and can be drawn as one polyline.
 *
 * @param origin - Starting point as `[longitude, latitude]`
 * @param destination - Ending point as `[longitude, latitude]`
 * @param segments - Number of segments to divide the path into
 * @returns The path vertices as `[longitude, latitude]` tuples
 * @throws {RangeError} When any coordinate component is not a finite number
 * @throws {RangeError} When `segments` is not a positive integer
 *
 * @remarks pure function
 *
 * Identical points return the two endpoints as given. Longitude and latitude
 * are not range-checked, matching {@link bearing} and {@link distance}.
 * Antipodal pairs have no unique great circle, so their vertices are not
 * meaningful; see {@link midpoint}.
 *
 * @example
 * ```typescript
 * import { greatCirclePoints } from '@accelint/geo/geodesy';
 *
 * greatCirclePoints([179, 0], [-179, 0], 4);
 * // [[179, 0], [179.5, 0], [180, 0], [180.5, 0], [181, 0]]
 *
 * greatCirclePoints([-74, 40.7], [139.7, 35.7]).length;
 * // 65
 * ```
 */
export function greatCirclePoints(
  origin: LonLatTuple,
  destination: LonLatTuple,
  segments: number = DEFAULT_SEGMENTS,
): [number, number][] {
  if (!(Number.isInteger(segments) && segments > 0)) {
    throw new RangeError(
      'greatCirclePoints requires a positive integer segment count.',
    );
  }

  const [originPoint, destinationPoint] = toSphericalPoints(
    origin,
    destination,
    'greatCirclePoints',
  );
  const [originLongitude, originLatitude] = origin;
  const [destinationLongitude, destinationLatitude] = destination;

  if (originPoint.equals(destinationPoint)) {
    return [
      [originLongitude, originLatitude],
      [destinationLongitude, destinationLatitude],
    ];
  }

  const points: [number, number][] = [[originLongitude, originLatitude]];

  for (let index = 1; index < segments; index++) {
    const point = originPoint.intermediatePointTo(
      destinationPoint,
      index / segments,
    );
    const previousLongitude = points[index - 1]?.[0] ?? originLongitude;

    points.push([unwrapLongitude(previousLongitude, point.lon), point.lat]);
  }

  const lastLongitude = points[points.length - 1]?.[0] ?? originLongitude;

  points.push([
    unwrapLongitude(lastLongitude, destinationLongitude),
    destinationLatitude,
  ]);

  return points;
}
