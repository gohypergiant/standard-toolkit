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

import { clamp } from '@accelint/math';

/**
 * Web Mercator projection helpers used by edit-shape-layer math modules.
 *
 * Both `latToMercatorY` calls in a given computation use the same scale,
 * so projection math is internally consistent: longitude-degrees on x and
 * the function's "Mercator-y in degrees" output on y form a coordinate
 * system suitable for shape-preserving rectangle/ellipse scale math.
 */

/**
 * Maximum absolute latitude usable in the Mercator projection. The
 * formula `ln(tan(π/4 + lat/2))` diverges as `lat` approaches ±90°, so
 * we clamp slightly inside the poles.
 */
const MAX_MERCATOR_LATITUDE = 89.999999;

/**
 * Convert latitude (degrees) to Web Mercator Y (in degrees of "Mercator-y").
 *
 * Output is dimensionally compatible with longitude in degrees once divided
 * by the appropriate scale. Latitudes are clamped to
 * `±MAX_MERCATOR_LATITUDE` to avoid the polar singularities of the
 * Mercator projection.
 *
 * @param lat - Latitude in degrees.
 * @returns Mercator-y in the same "degree-like" units used by longitude.
 */
export function latToMercatorY(lat: number): number {
  const clamped = clamp(-MAX_MERCATOR_LATITUDE, MAX_MERCATOR_LATITUDE, lat);
  const rad = (clamped * Math.PI) / 180;

  return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
}

/**
 * Inverse of `latToMercatorY`: convert Mercator-y back to latitude in
 * degrees.
 *
 * @param mercY - Mercator-y in the same "degree-like" units that
 *   `latToMercatorY` produces.
 * @returns Latitude in degrees.
 */
export function mercatorYToLat(mercY: number): number {
  const rad = (mercY * Math.PI) / 180;

  return ((2 * Math.atan(Math.exp(rad)) - Math.PI / 2) * 180) / Math.PI;
}
