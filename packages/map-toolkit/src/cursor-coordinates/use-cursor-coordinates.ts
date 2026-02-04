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
'use client';

import type { UniqueId } from '@accelint/core';
import {
  coordinateSystems,
  createCoordinate,
  formatDecimalDegrees,
  formatDegreesDecimalMinutes,
  formatDegreesMinutesSeconds,
} from '@accelint/geo';
import { getLogger } from '@accelint/logger';
import 'client-only';
import { useContext, useMemo } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import {
  DEFAULT_LATLON_COORDS,
  DEFAULT_MGRS_UTM_COORDS,
  LONGITUDE_RANGE,
  MAX_LONGITUDE,
} from './constants';
import { cursorCoordinateStore } from './store';
import type {
  CoordinateFormatTypes,
  RawCoordinate,
  UseCursorCoordinatesOptions,
  UseCursorCoordinatesReturn,
} from './types';

const logger = getLogger({
  enabled:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[CursorCoordinates]',
  pretty: true,
});

/**
 * Normalizes longitude to -180 to 180 range.
 * Handles wraparound including multi-revolution values.
 *
 * @param lon - Longitude value in degrees
 * @returns Normalized longitude between -180 and 180
 */
function normalizeLongitude(lon: number): number {
  return (
    ((((lon + MAX_LONGITUDE) % LONGITUDE_RANGE) + LONGITUDE_RANGE) %
      LONGITUDE_RANGE) -
    MAX_LONGITUDE
  );
}

/**
 * Builds a RawCoordinate object from a coordinate tuple.
 *
 * @param coord - Coordinate tuple [longitude, latitude] or null
 * @returns RawCoordinate object or null
 */
function buildRawCoordinate(coord: [number, number] | null): RawCoordinate {
  if (!coord) {
    return null;
  }

  const normalizedLon = normalizeLongitude(coord[0]);

  return {
    longitude: normalizedLon,
    latitude: coord[1],
  };
}

/**
 * Formats a coordinate using the specified format.
 * Uses @accelint/geo formatters which match CoordinateField precision:
 * - DD: 6 decimal places
 * - DDM: 4 decimal places for minutes
 * - DMS: 2 decimal places for seconds
 *
 * @param coord - Coordinate tuple [longitude, latitude]
 * @param format - Coordinate format type
 * @returns Formatted coordinate string
 *  *
 * @remarks
 * **UTM/MGRS Limitations:** UTM and MGRS coordinate systems are only valid between 80°S and 84°N.
 * Coordinates outside this range (e.g., polar regions) will return the default placeholder `--, --`.
 * Other formats (DD, DDM, DMS) work correctly at all latitudes.
 */
function formatCoordinate(
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

/**
 * React hook that tracks and formats the cursor hover position coordinates on a map.
 *
 * Subscribes to map hover events via the event bus and converts coordinates to various
 * geographic formats (Decimal Degrees, DMS, MGRS, UTM, etc.). The hook automatically
 * filters events to only process those from the specified map instance.
 *
 * Uses the shared store factory for efficient state management and automatic cleanup.
 *
 * @param id - Optional map instance ID. If not provided, attempts to use the ID from MapProvider context.
 * @param options - Optional configuration options
 * @returns Object containing the formatted coordinate string, raw coordinate, format setter, and current format
 * @throws {Error} When no id is provided and hook is used outside MapProvider context
 *
 * @remarks
 * **UTM/MGRS Limitations:** UTM and MGRS coordinate systems are only valid between 80°S and 84°N.
 * Coordinates outside this range (e.g., polar regions) will display the default placeholder `--, --`.
 * Other formats (DD, DDM, DMS) work correctly at all latitudes.
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { uuid } from '@accelint/core';
 * import { useCursorCoordinates } from '@accelint/map-toolkit/cursor-coordinates';
 *
 * const MAP_ID = uuid();
 *
 * function CoordinateDisplay() {
 *   const { formattedCoord, setFormat } = useCursorCoordinates(MAP_ID);
 *
 *   return (
 *     <div>
 *       <select onChange={(e) => setFormat(e.target.value as CoordinateFormatTypes)}>
 *         <option value="dd">Decimal Degrees</option>
 *         <option value="ddm">Degrees Decimal Minutes</option>
 *         <option value="dms">Degrees Minutes Seconds</option>
 *         <option value="mgrs">MGRS</option>
 *         <option value="utm">UTM</option>
 *       </select>
 *       <div>{formattedCoord}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom formatter:
 * ```tsx
 * function CustomCoordinateDisplay() {
 *   const { formattedCoord, rawCoord } = useCursorCoordinates(MAP_ID, {
 *     formatter: (coord) =>
 *       `Lat: ${coord.latitude.toFixed(6)}° Lng: ${coord.longitude.toFixed(6)}°`,
 *   });
 *
 *   return <div>{formattedCoord}</div>;
 * }
 * ```
 *
 * @example
 * Accessing raw coordinates:
 * ```tsx
 * function RawCoordinateDisplay() {
 *   const { rawCoord, currentFormat } = useCursorCoordinates(MAP_ID);
 *
 *   if (!rawCoord) {
 *     return <div>Move cursor over map</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <div>Longitude: {rawCoord.longitude}</div>
 *       <div>Latitude: {rawCoord.latitude}</div>
 *       <div>Format: {currentFormat}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCursorCoordinates(
  id?: UniqueId,
  options?: UseCursorCoordinatesOptions,
): UseCursorCoordinatesReturn {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useCursorCoordinates requires either an id parameter or to be used within a MapProvider',
    );
  }

  const customFormatter = options?.formatter;

  // Use the store hook to get state and actions
  const { state, setFormat } = cursorCoordinateStore.use(actualId);

  // Build raw coordinate object
  const rawCoord = useMemo(
    () => buildRawCoordinate(state.coordinate),
    [state.coordinate],
  );

  // Compute formatted coordinate string
  const formattedCoord = useMemo(() => {
    // Return default coords based on current format.
    const getDefaultCoords = () =>
      state.format === 'mgrs' || state.format === 'utm'
        ? DEFAULT_MGRS_UTM_COORDS
        : DEFAULT_LATLON_COORDS;

    if (!(rawCoord && state.coordinate)) {
      return getDefaultCoords();
    }

    // Use custom formatter if provided
    if (customFormatter) {
      try {
        return customFormatter(rawCoord);
      } catch (error) {
        logger.error(
          `Custom formatter failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        return getDefaultCoords();
      }
    }

    // Use built-in formatter
    return formatCoordinate(state.coordinate, state.format);
  }, [rawCoord, customFormatter, state.format, state.coordinate]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      formattedCoord,
      setFormat,
      rawCoord,
      currentFormat: state.format,
    }),
    [formattedCoord, setFormat, rawCoord, state.format],
  );
}
