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

// __private-exports

/**
 * Axis discriminator for a single coordinate value.
 *
 * `'lat'` selects the N/S hemisphere pair; `'lon'` selects E/W.
 */
export type Axis = 'lat' | 'lon';

/**
 * Hemisphere letter for a coordinate value, following geo's `>= 0`
 * convention (0 maps to `N` on the lat axis and `E` on the lon axis).
 */
export type Hemisphere = 'N' | 'S' | 'E' | 'W';

/**
 * Gets the typed hemisphere letter for a signed coordinate value on an axis.
 *
 * Follows the same `>= 0` convention as {@link getOrdinal}: a value of exactly
 * `0` maps to `N` on the latitude axis and `E` on the longitude axis.
 *
 * @param value - The signed coordinate value.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @returns Hemisphere letter: `'N'`, `'S'`, `'E'`, or `'W'`.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * getHemisphere(-77.0369, 'lon');
 * // 'W'
 * ```
 */
export const getHemisphere = (value: number, axis: Axis): Hemisphere => {
  if (axis === 'lat') {
    return value >= 0 ? 'N' : 'S';
  }

  return value >= 0 ? 'E' : 'W';
};

/**
 * Gets the ordinal direction (N/S/E/W) for a coordinate value.
 *
 * Retained as the established public API. Adapts {@link getHemisphere} — which
 * owns the `>= 0` convention — to a boolean axis and the wider `string` return
 * its existing callers expect.
 *
 * @param value - The coordinate value (positive or negative).
 * @param isLatitude - Whether this is a latitude coordinate (true) or longitude (false).
 * @returns Ordinal direction character: 'N', 'S', 'E', or 'W'.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * getOrdinal(37.7749, true);
 * // 'N'
 * ```
 *
 * @example
 * ```typescript
 * getOrdinal(-122.4194, false);
 * // 'W'
 * ```
 */
export const getOrdinal = (value: number, isLatitude: boolean): string =>
  getHemisphere(value, isLatitude ? 'lat' : 'lon');
