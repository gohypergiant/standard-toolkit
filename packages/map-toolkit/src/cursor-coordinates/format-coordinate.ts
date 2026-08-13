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
  coordinateSystems,
  createCoordinate,
  formatDecimalDegrees,
  formatDegreesDecimalMinutes,
  formatDegreesMinutesSeconds,
} from '@accelint/geo';
import { createLoggerDomain } from '@/shared/logger';
import {
  DEFAULT_MGRS_UTM_COORDS,
  LONGITUDE_RANGE,
  MAX_LONGITUDE,
} from './constants';
import type { CoordinateFormatTypes } from './types';

const logger = createLoggerDomain('[formatCoordinate]');

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
    case 'mgrs':
    case 'utm': {
      // UTM and MGRS are only valid between 80°S and 84°N
      // Use createCoordinate for grid-based formats
      // Input format: "lon E / lat N" for LONLAT (matching geo package DD tests)
      // Limit to 10 decimal places (geo parser max) and avoid floating point precision issues
      const lat = latLon[0];
      const lon = latLon[1];

      // Check if coordinate is within valid UTM/MGRS range
      if (lat < -80 || lat > 84) {
        return DEFAULT_MGRS_UTM_COORDS;
      }

      const latOrdinal = lat >= 0 ? 'N' : 'S';
      const lonOrdinal = lon >= 0 ? 'E' : 'W';
      // Use LONLAT format: longitude first, then latitude
      // toFixed(10) ensures we stay within the parser's regex limits
      const formattedInput = `${Math.abs(lon).toFixed(10)} ${lonOrdinal} / ${Math.abs(lat).toFixed(10)} ${latOrdinal}`;

      const geoCoord = createCoordinate(
        coordinateSystems.dd,
        'LONLAT',
      )(formattedInput);

      // Validate the coordinate was created successfully
      if (!geoCoord.valid) {
        logger.error(
          `Failed to create coordinate for ${format}: ${geoCoord.errors.join(', ')}`,
        );
        return DEFAULT_MGRS_UTM_COORDS;
      }

      return geoCoord[format]();
    }
  }
}
