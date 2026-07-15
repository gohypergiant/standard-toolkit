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

import {
  formatDecimalDegrees,
  formatDegreesDecimalMinutes,
  formatDegreesMinutesSeconds,
  toMgrsParts,
  toUtmParts,
} from '@accelint/geo';
import {
  DEFAULT_MGRS_UTM_COORDS,
  LONGITUDE_RANGE,
  MAX_LONGITUDE,
} from './constants';
import type { CoordinateFormatTypes } from './types';

/**
 * Normalizes longitude to the -180 to 180 range.
 * Handles wraparound including multi-revolution values.
 *
 * @param lon - Longitude value in degrees
 * @returns Normalized longitude between -180 and 180
 */
export function normalizeLongitude(lon: number): number {
  return (
    ((((lon + MAX_LONGITUDE) % LONGITUDE_RANGE) + LONGITUDE_RANGE) %
      LONGITUDE_RANGE) -
    MAX_LONGITUDE
  );
}

/**
 * Formats a `[longitude, latitude]` coordinate into the requested geographic
 * coordinate system. The longitude is normalized to -180..180 first.
 *
 * Uses `@accelint/geo` formatters, matching the precision of the toolkit's
 * coordinate inputs:
 * - `dd`  — Decimal Degrees, 6 decimal places
 * - `ddm` — Degrees Decimal Minutes, 4 decimal places for minutes
 * - `dms` — Degrees Minutes Seconds, 2 decimal places for seconds
 * - `mgrs` / `utm` — grid references
 *
 * This is the pure formatting primitive behind `useCursorCoordinates`; reach
 * for it directly when you need an MGRS/UTM/DD string outside the hook (e.g. a
 * one-off label) instead of re-deriving the grid-conversion logic.
 *
 * @param coord - Coordinate tuple `[longitude, latitude]`
 * @param format - Target coordinate format
 * @returns Formatted coordinate string
 *
 * @remarks
 * **UTM/MGRS limitations:** UTM and MGRS are only valid between 80°S and 84°N.
 * Coordinates outside that range return the placeholder `--, --`
 * ({@link DEFAULT_MGRS_UTM_COORDS}). DD, DDM, and DMS work at all latitudes.
 *
 * @example
 * ```ts
 * import { formatCoordinate } from '@accelint/map-toolkit/cursor-coordinates';
 *
 * formatCoordinate([-122.4194, 37.7749], 'mgrs'); // '10S EG 51810 90261'
 * formatCoordinate([-122.4194, 37.7749], 'dd');   // '37.774900 N / 122.419400 W'
 * ```
 */
export function formatCoordinate(
  coord: [number, number],
  format: CoordinateFormatTypes,
): string {
  // Normalize longitude and convert to [lat, lon] for geo formatters
  const normalizedLon = normalizeLongitude(coord[0]);
  const latLon: [number, number] = [coord[1], normalizedLon];

  switch (format) {
    case 'dd':
      return formatDecimalDegrees(latLon, {
        withOrdinal: true,
        separator: ' / ',
        prefix: '',
        suffix: '',
      });
    case 'ddm':
      return formatDegreesDecimalMinutes(latLon, {
        withOrdinal: true,
        separator: ' / ',
        prefix: '',
        suffix: '',
      });
    case 'dms':
      return formatDegreesMinutesSeconds(latLon, {
        withOrdinal: true,
        separator: ' / ',
        prefix: '',
        suffix: '',
      });
    case 'mgrs': {
      // The geo grid parts own the 80°S–84°N inclusive boundary and reject
      // non-finite input; an out-of-range result maps to the placeholder.
      const result = toMgrsParts(latLon);

      if (!result.ok) {
        return DEFAULT_MGRS_UTM_COORDS;
      }

      const { zone, band, e100k, n100k, easting, northing } = result.value;

      // Mirror the geo MGRS string renderer: 2-digit zone, floored
      // within-square metres left-padded to 5 digits.
      const zonePadded = zone.toString().padStart(2, '0');
      const eastingPadded = Math.floor(easting).toString().padStart(5, '0');
      const northingPadded = Math.floor(northing).toString().padStart(5, '0');

      return `${zonePadded}${band} ${e100k}${n100k} ${eastingPadded} ${northingPadded}`;
    }
    case 'utm': {
      // The geo grid parts own the 80°S–84°N inclusive boundary and reject
      // non-finite input; an out-of-range result maps to the placeholder.
      const result = toUtmParts(latLon);

      if (!result.ok) {
        return DEFAULT_MGRS_UTM_COORDS;
      }

      const { zone, hemisphere, easting, northing } = result.value;

      // Mirror the geo UTM string renderer: 2-digit zone + hemisphere, then
      // the rounded integer easting/northing metres.
      return `${zone.toString().padStart(2, '0')}${hemisphere} ${easting} ${northing}`;
    }
  }
}
