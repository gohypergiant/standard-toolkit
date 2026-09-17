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

/** Mean Earth radius used by the geodesy library's spherical model. */
const EARTH_RADIUS_METERS = 6371e3;

/**
 * Computes the great-circle distance between two coordinates in meters.
 *
 * Uses the Haversine formula via the geodesy library. Handles antipodal points
 * and antimeridian crossings correctly.
 *
 * @param origin - The starting coordinate as `[longitude, latitude]` in decimal degrees.
 * @param destination - The ending coordinate as `[longitude, latitude]` in decimal degrees.
 * @returns The great-circle distance in meters, or `0` when the points are identical.
 * @throws {RangeError} When any coordinate component is not a finite number.
 *
 * @remarks
 * pure function
 *
 * Longitude and latitude are not range-checked. Map libraries such as deck.gl
 * hand this function longitudes beyond ±180 when the map wraps, and the
 * spherical math is periodic, so out-of-range values still produce the
 * correct distance.
 * Near-antipodal pairs, where the library's haversine returns NaN from
 * floating-point rounding, resolve to half the circumference instead.
 *
 * @example
 * ```typescript
 * distance([0, 0], [0, 0]);
 * // 0
 *
 * distance([-0.1278, 51.5074], [2.3522, 48.8566]);
 * // ~343556 — approximately 343.6 km from London to Paris
 * ```
 */
export function distance(
  origin: LonLatTuple,
  destination: LonLatTuple,
): number {
  const [originPoint, destinationPoint] = toSphericalPoints(
    origin,
    destination,
    'distance',
  );

  const meters = originPoint.distanceTo(destinationPoint);

  // The haversine takes sqrt(1 - a), and rounding can push `a` just past 1 for
  // near-antipodal pairs, which the library reports as NaN. The true value in
  // that band is half the circumference.
  return Number.isNaN(meters) ? Math.PI * EARTH_RADIUS_METERS : meters;
}
