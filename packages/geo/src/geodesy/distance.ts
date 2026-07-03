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
 * Computes the great-circle distance between two coordinates in meters.
 *
 * Uses the Haversine formula via the geodesy library. Handles antipodal points
 * and antimeridian crossings correctly.
 *
 * @param pointA - The origin coordinate as `[longitude, latitude]` in decimal degrees.
 * @param pointB - The destination coordinate as `[longitude, latitude]` in decimal degrees.
 * @returns The great-circle distance in meters, or `0` when the points are identical.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```typescript
 * distance([0, 0], [0, 0]);
 * // 0
 *
 * distance([-0.1278, 51.5074], [2.3522, 48.8566]);
 * // ~341551 — approximately 341.6 km from London to Paris
 * ```
 */
export function distance(
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

  return a.distanceTo(b);
}
