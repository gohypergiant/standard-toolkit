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
 * Calculates the prime vertical radius of curvature (N) at a given latitude.
 *
 * The prime vertical radius is the radius of curvature in the plane perpendicular
 * to the meridian. It's used in converting between geodetic and projected coordinates.
 *
 * Formula: N = a / √(1 - e² × sin²φ)
 *
 * @param sinLat - Sine of the latitude (pre-computed for efficiency)
 * @param a - Semi-major axis of ellipsoid (meters)
 * @param e2 - First eccentricity squared
 * @returns Prime vertical radius in meters
 *
 * @see USGS Professional Paper 1395 (1987) - Snyder, Map Projections, Equation 4-20
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2.2
 * @see {@link file://./../../../agents.md} for AI generation prompts
 */
export function primeVerticalRadius(
  sinLat: number,
  a: number,
  e2: number,
): number {
  return a / Math.sqrt(1 - e2 * sinLat * sinLat);
}
