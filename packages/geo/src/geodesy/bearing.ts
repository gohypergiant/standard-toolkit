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

import LatLonSpherical from 'geodesy/latlon-spherical';

/**
 * Computes the initial great-circle bearing from pointA to pointB.
 *
 * Bearing is expressed as degrees clockwise from true north (0–360).
 * Antipodal points and antimeridian crossings are handled correctly by
 * the underlying geodesy library.
 *
 * @param pointA - The origin coordinate as `[longitude, latitude]` in decimal degrees.
 * @param pointB - The destination coordinate as `[longitude, latitude]` in decimal degrees.
 * @returns The initial bearing in degrees (0–360), or `0` when pointA and pointB are identical.
 *
 * @remarks
 * pure function
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
export function bearing(
  pointA: [number, number],
  pointB: [number, number],
): number {
  const [lonA, latA] = pointA;
  const [lonB, latB] = pointB;

  if (latA === latB && lonA === lonB) {
    return 0;
  }

  const a = new LatLonSpherical(latA, lonA);
  const b = new LatLonSpherical(latB, lonB);

  return a.initialBearingTo(b);
}
