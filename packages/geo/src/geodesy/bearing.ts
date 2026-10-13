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
 * Computes the initial great-circle bearing from origin to destination.
 *
 * Bearing is expressed as degrees clockwise from true north (0–360).
 * Antipodal points and antimeridian crossings are handled correctly by
 * the underlying geodesy library.
 *
 * @param origin - The starting coordinate as `[longitude, latitude]` in decimal degrees.
 * @param destination - The ending coordinate as `[longitude, latitude]` in decimal degrees.
 * @returns The initial bearing in degrees (0–360), or `0` when origin and destination coincide (within `Number.EPSILON` degrees).
 * @throws {RangeError} When any coordinate component is not a finite number.
 *
 * @remarks
 * pure function
 *
 * Longitude and latitude are not range-checked. Map libraries such as deck.gl
 * hand this function longitudes beyond ±180 when the map wraps, and the
 * spherical math is periodic, so out-of-range values still produce the
 * correct bearing.
 *
 * @example
 * ```typescript
 * bearing([0, 0], [0, 1]);
 * // 0 — due north
 *
 * bearing([0, 0], [1, 0]);
 * // 90 — due east
 *
 * bearing([0, 0], [-1, 0]);
 * // 270 — due west
 * ```
 */
export function bearing(origin: LonLatTuple, destination: LonLatTuple): number {
  const [originPoint, destinationPoint] = toSphericalPoints(
    origin,
    destination,
    'bearing',
  );

  // The library returns NaN for coincident points (within Number.EPSILON), so
  // short-circuit with its own equality check to keep the result a usable angle.
  if (originPoint.equals(destinationPoint)) {
    return 0;
  }

  return originPoint.initialBearingTo(destinationPoint);
}
