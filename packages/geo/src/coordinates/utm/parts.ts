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
import { isValidNumericCoordinate } from '../latlon/internal';

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
 * Reports whether a signed `[lat, lon]` coordinate can be projected to a UTM
 * zone (and therefore to MGRS).
 *
 * A coordinate is projectable when it is finite and in range, its latitude is
 * within the inclusive `80°S`–`84°N` grid band, and it does not sit on the
 * `+180°` antimeridian singularity. This is the single validity gate shared by
 * {@link toUtmParts} and {@link toMgrsParts}.
 *
 * @param coordinate - Signed `[latitude, longitude]` tuple.
 * @returns `true` when the coordinate projects to a grid reference.
 *
 * @remarks pure function
 */
export const isGridProjectable = ([lat, lon]: [number, number]): boolean =>
  isValidNumericCoordinate(lat, lon) &&
  isWithinGridBand(lat) &&
  !isOnEasternAntimeridian(lon);

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
  if (!isGridProjectable([lat, lon])) {
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

/**
 * Renders UTM grid parts as their canonical coordinate string.
 *
 * Left-pads the zone to two digits and joins zone+hemisphere, easting, and
 * northing with single spaces, matching geodesy's `Utm.toString()` output.
 * `easting`/`northing` are already the rounded integer metres `toUtmParts`
 * yields, so no further rounding is applied here.
 *
 * @param parts - The UTM grid parts to render.
 * @returns The canonical UTM string, e.g. `"18N 323394 4307396"`.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * formatUtmParts({ zone: 18, hemisphere: 'N', easting: 323394, northing: 4307396 });
 * // '18N 323394 4307396'
 * ```
 */
export const formatUtmParts = ({
  zone,
  hemisphere,
  easting,
  northing,
}: UtmParts): string =>
  `${zone.toString().padStart(2, '0')}${hemisphere} ${easting} ${northing}`;
