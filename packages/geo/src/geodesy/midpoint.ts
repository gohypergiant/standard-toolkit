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

/**
 * Computes the great-circle midpoint between two coordinates.
 *
 * The midpoint lies on the shortest great-circle path, so a pair that
 * straddles the antimeridian yields a midpoint near ±180 rather than near 0.
 * Longitude is normalized to `[-180, 180]` by the underlying geodesy library.
 *
 * @param origin - The starting coordinate as `[longitude, latitude]` in decimal degrees.
 * @param destination - The ending coordinate as `[longitude, latitude]` in decimal degrees.
 * @returns The midpoint as `[longitude, latitude]` in decimal degrees, or the point itself when origin and destination are identical.
 * @throws {RangeError} When any coordinate component is not a finite number.
 *
 * @remarks
 * pure function
 *
 * Longitude and latitude are not range-checked. Map libraries such as deck.gl
 * hand this function longitudes beyond ±180 when the map wraps, and the
 * spherical math is periodic, so out-of-range values still produce the
 * correct midpoint.
 *
 * For antipodal pairs the midpoint is not unique (every great circle through
 * them is a candidate). The formula degrades to `atan2(≈0, 0)` and the library
 * returns a point on the equator 90° of longitude from `origin`, offset in the
 * sign of the longitude difference `destination - origin`:
 * `midpoint([0, 0], [180, 0])` is `[90, 0]` and
 * `midpoint([10, 45], [-170, -45])` is `[-80, 0]`. Pole to pole along one
 * meridian returns `[origin longitude, 0]`.
 *
 * @example
 * ```typescript
 * midpoint([0, 0], [0, 10]);
 * // [0, 5]
 *
 * midpoint([179, 0], [-179, 0]);
 * // [180, 0] — crosses the antimeridian rather than the prime meridian
 *
 * midpoint([-0.1278, 51.5074], [2.3522, 48.8566]);
 * // [~1.15, ~50.19] — between London and Paris
 * ```
 */
export function midpoint(
  origin: LonLatTuple,
  destination: LonLatTuple,
): [number, number] {
  const [originPoint, destinationPoint] = toSphericalPoints(
    origin,
    destination,
    'midpoint',
  );

  // Coincident points can drift by an ulp through the trigonometry, so return
  // the (longitude-normalized) origin directly when the library deems them equal.
  if (originPoint.equals(destinationPoint)) {
    return [originPoint.lon, originPoint.lat];
  }

  const result = originPoint.midpointTo(destinationPoint);

  return [result.lon, result.lat];
}
