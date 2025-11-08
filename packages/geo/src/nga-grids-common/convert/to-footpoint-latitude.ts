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
 * Calculates the footpoint latitude from a meridional arc distance.
 *
 * The footpoint latitude is the latitude on the central meridian that has the same
 * northing as the point being converted. Used in the inverse Transverse Mercator
 * projection. Calculated using a series expansion based on the rectifying latitude.
 *
 * @param M - Meridional arc distance in meters
 * @param a - Semi-major axis of ellipsoid (meters)
 * @param e2 - First eccentricity squared
 * @returns Footpoint latitude in radians
 *
 * @see USGS Professional Paper 1395 (1987) - Snyder, Map Projections, Equations 3-24 to 3-26
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2.2
 * @see {@link file://./../../../agents.md} for AI generation prompts
 */
export function toFootpointLatitude(M: number, a: number, e2: number): number {
  const mu = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 ** 3) / 256));
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  // NOTE: these variables minify and compress better than moving the powers inline
  const J1 = (3 * e1) / 2 - (27 * e1 ** 3) / 32;
  const J2 = (21 * e1 * e1) / 16 - (55 * e1 ** 4) / 32;
  const J3 = (151 * e1 ** 3) / 96;
  const J4 = (1097 * e1 ** 4) / 512;

  return (
    mu +
    J1 * Math.sin(2 * mu) +
    J2 * Math.sin(4 * mu) +
    J3 * Math.sin(6 * mu) +
    J4 * Math.sin(8 * mu)
  );
}
