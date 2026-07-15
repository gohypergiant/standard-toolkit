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

import { LatLon } from 'geodesy/utm';
import { validateNumericCoordinate } from '../latlon/internal';

/**
 * Lowest latitude (degrees) the UTM/MGRS grid is defined for, inclusive.
 *
 * Matches the patched geodesy valid range; latitudes below this yield an
 * out-of-range result rather than a projected grid reference.
 */
export const GRID_LATITUDE_MIN = -80;

/**
 * Highest latitude (degrees) the UTM/MGRS grid is defined for, inclusive.
 *
 * Matches the patched geodesy valid range; latitudes above this yield an
 * out-of-range result rather than a projected grid reference.
 */
export const GRID_LATITUDE_MAX = 84;

/**
 * Discriminated result for a grid-parts conversion.
 *
 * `ok: true` carries the structured grid parts; `ok: false` carries a typed
 * `reason` so consumers branch on a field instead of matching error text.
 *
 * @template Value - The grid parts shape carried on success.
 */
export type GridPartsResult<Value> =
  | { ok: true; value: Value }
  | { ok: false; reason: 'out-of-range' };

/**
 * Structured UTM grid parts for a signed `[lat, lon]` coordinate.
 *
 * `easting` and `northing` are the rounded integer metres geodesy yields.
 */
export type UtmParts = {
  zone: number;
  hemisphere: 'N' | 'S';
  easting: number;
  northing: number;
};

/**
 * Reports whether a latitude falls within the inclusive UTM/MGRS grid band.
 *
 * @param lat - The latitude in degrees.
 * @returns `true` when `-80 ≤ lat ≤ 84`.
 *
 * @remarks pure function
 */
export const isWithinGridBand = (lat: number): boolean =>
  lat >= GRID_LATITUDE_MIN && lat <= GRID_LATITUDE_MAX;

/**
 * Reports whether a longitude sits on the eastern antimeridian singularity.
 *
 * At exactly `+180°` the UTM zone formula yields the nonexistent zone `61`,
 * for which geodesy throws. `-180°` and values beyond `±180°` project
 * normally, so only `+180°` is excluded here — the same point is reachable as
 * `-180°`, or via a caller's own longitude normalization.
 *
 * @param lon - The longitude in degrees.
 * @returns `true` when `lon` is exactly `180`.
 *
 * @remarks pure function
 */
export const isOnEasternAntimeridian = (lon: number): boolean => lon === 180;

/**
 * Converts a signed `[lat, lon]` coordinate into UTM grid parts.
 *
 * Reads the geodesy `Utm` fields directly and rounds `easting`/`northing` to
 * integer metres (matching the existing UTM string renderer). The UTM/MGRS
 * grid is defined for `-80 ≤ lat ≤ 84` inclusive; latitudes outside that band,
 * a longitude of exactly `+180°` (the antimeridian zone singularity), or
 * non-finite input, produce `{ ok: false, reason: 'out-of-range' }`.
 *
 * @param coordinate - Signed `[latitude, longitude]` tuple.
 * @returns A discriminated result with `{ zone, hemisphere, easting, northing }` on success.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toUtmParts([38.8977, -77.0365]);
 * // { ok: true, value: { zone: 18, hemisphere: 'N', easting: 323394, northing: 4307396 } }
 * ```
 *
 * @example
 * ```typescript
 * toUtmParts([85, 0]);
 * // { ok: false, reason: 'out-of-range' }
 * ```
 */
export const toUtmParts = ([lat, lon]: [
  number,
  number,
]): GridPartsResult<UtmParts> => {
  if (
    validateNumericCoordinate(lat, lon).length ||
    !isWithinGridBand(lat) ||
    isOnEasternAntimeridian(lon)
  ) {
    return { ok: false, reason: 'out-of-range' };
  }

  const utm = new LatLon(lat, lon).toUtm();

  return {
    ok: true,
    value: {
      zone: utm.zone,
      hemisphere: utm.hemisphere as 'N' | 'S',
      easting: Math.round(utm.easting),
      northing: Math.round(utm.northing),
    },
  };
};
