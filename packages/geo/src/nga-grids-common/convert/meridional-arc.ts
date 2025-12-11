// __private-exports
/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Calculates the meridional arc length from the equator to a given latitude.
 *
 * The meridional arc is the distance along the central meridian of an ellipsoid
 * from the equator to a specified latitude. Uses a series expansion with terms
 * for the ellipsoid's eccentricity.
 *
 * @param latRad - Latitude in radians
 * @param a - Semi-major axis of ellipsoid (meters)
 * @param e2 - First eccentricity squared
 * @returns Meridional arc distance in meters
 *
 * @see USGS Professional Paper 1395 (1987) - Snyder, Map Projections, Equations 3-21
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2.2
 * @see {@link file://./../../../agents.md} for AI generation prompts
 */
export function meridionalArc(latRad: number, a: number, e2: number): number {
  return (
    a *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) *
        Math.sin(2 * latRad) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * latRad))
  );
}
