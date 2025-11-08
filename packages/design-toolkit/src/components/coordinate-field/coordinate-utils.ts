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

import { createCoordinate } from '@accelint/geo';
import { getLogger } from '@accelint/logger';
import {
  COORDINATE_SYSTEMS,
  type CoordinateSystem,
  type CoordinateValue,
  type ParsedCoordinateMatch,
} from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'debug',
  prefix: '[CoordinateField]',
  pretty: true,
});

/**
 * Coordinate Conversion Utilities
 *
 * This module provides utilities for converting between:
 * 1. Segment values (user input) → Coordinate strings (for @accelint/geo parsing)
 * 2. Coordinate strings (from @accelint/geo output) → Segment values (for display)
 * 3. Decimal Degrees (internal format) ↔ Display format segment values
 *
 * All conversions use the local @accelint/geo package for accurate coordinate parsing
 * and conversion between coordinate systems.
 *
 * ## Architecture: Bridge Layer Between UI and Geo Package
 *
 * This module serves as a bridge layer to handle the impedance mismatch between:
 * - **UI Requirements**: Individual segment fields (e.g., degrees, minutes, seconds, direction)
 * - **Geo Package API**: Complete coordinate strings (e.g., "40° 42' 46" N / 74° 0' 22" W")
 *
 * ### Why This Bridge Layer Exists
 *
 * The @accelint/geo package provides excellent coordinate parsing, validation, and conversion,
 * but its API is designed around complete coordinate strings:
 *
 * ```typescript
 * // What geo provides:
 * const coord = createCoordinate('latlon', '40 42.768 N / 74 0.36 W');
 * coord.toString({ format: 'dd' })   // Returns: "40.7128, -74.006" (formatted string)
 * coord.toString({ format: 'ddm' })  // Returns: "40° 42.768', -74° 0.36'" (formatted string)
 * coord.lat, coord.lon               // Returns: 40.7128, -74.006 (DD numbers)
 * ```
 *
 * The coordinate-field component needs segment-level data for individual input fields:
 * - DDM: ['40', '42.768', 'N', '74', '0.36', 'W'] ← Not provided by geo
 * - DMS: ['40', '42', '46.08', 'N', '74', '0', '21.6', 'W'] ← Not provided by geo
 *
 * ### Current Limitations and Duplication
 *
 * Because the geo package only exposes:
 * 1. **Formatters** that return complete strings (coord.toString({ format: ... }))
 * 2. **Raw values** in Decimal Degrees only (coord.lat, coord.lon)
 *
 * This module must:
 * 1. Build coordinate strings from segments → Pass to geo for parsing
 * 2. Parse geo's formatted output strings → Extract segments using regex
 *
 * This creates a circular conversion flow for DD → Display Segments:
 * ```
 * DD value → String → Geo parse → Geo format → String → Regex parse → Segments
 * ```
 *
 * **Note on Duplication**: The regex parsing in this module duplicates work that the
 * geo package parsers already do internally. However, since geo doesn't expose the
 * parsed segment components (only formatted strings and raw DD values), we must
 * re-parse its output to extract the individual segments for the UI.
 *
 * ### What Would Eliminate This Duplication
 *
 * If the geo package exported component-level converters like:
 * ```typescript
 * // Hypothetical API that would eliminate the bridge layer:
 * export function ddToDdmComponents(dd: number): {
 *   degrees: number;
 *   minutes: number;
 *   direction: 'N' | 'S' | 'E' | 'W';
 * }
 * ```
 *
 * Then this bridge layer could be significantly simplified. The math for these conversions
 * exists in the geo package's formatters (e.g., formatDegreesDecimalMinutes), but it's
 * wrapped in string formatting logic rather than exposed as standalone utilities.
 *
 * ### Conversion Efficiency
 *
 * - **Efficient Path** (Display Segments → DD): Segments → String → Geo parse → DD
 *   - Uses geo package for all parsing and validation ✓
 *
 * - **Inefficient Path** (DD → Display Segments): DD → String → Geo parse → Geo format → Regex parse → Segments
 *   - Circular conversion with redundant string parsing/formatting ✗
 *   - Necessary given current geo API limitations
 */

/** Epsilon for coordinate equality comparison (≈11cm precision at equator) */
export const COORDINATE_EPSILON = 0.000001;

/**
 * Error message constants for coordinate format conversion
 * @internal
 */
export const COORDINATE_ERROR_MESSAGES = {
  INVALID: 'Invalid coordinate',
  CONVERSION_FAILED: 'Conversion failed',
  NOT_AVAILABLE_AT_POLES: 'Not available at poles',
} as const;

/**
 * Result of coordinate format conversion
 */
export interface CoordinateFormatResult {
  /** The formatted coordinate string or error message */
  value: string;
  /** Whether the coordinate format is valid and can be used/copied */
  isValid: boolean;
}

/**
 * Format DD (Decimal Degrees) segments to coordinate string
 *
 * Bridge function that builds a coordinate string from UI segment values
 * for passing to the geo package parser. Part of the Segments → String → Geo Parse flow.
 *
 * @internal
 */
function formatDDSegments(segments: string[]): string | undefined {
  if (segments.length < 2) {
    return undefined;
  }
  const latNum = Number.parseFloat(segments[0] as string);
  const lonNum = Number.parseFloat(segments[1] as string);

  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return undefined;
  }

  const latDir = latNum >= 0 ? 'N' : 'S';
  const lonDir = lonNum >= 0 ? 'E' : 'W';

  return `${Math.abs(latNum)} ${latDir} / ${Math.abs(lonNum)} ${lonDir}`;
}

/**
 * Format DDM (Degrees Decimal Minutes) segments to coordinate string
 *
 * Bridge function that builds a coordinate string from UI segment values
 * for passing to the geo package parser. Part of the Segments → String → Geo Parse flow.
 *
 * @internal
 */
function formatDDMSegments(segments: string[]): string | undefined {
  if (segments.length < 6) {
    return undefined;
  }

  return `${segments[0]}° ${segments[1]}' ${segments[2]}, ${segments[3]}° ${segments[4]}' ${segments[5]}`;
}

/**
 * Format DMS (Degrees Minutes Seconds) segments to coordinate string
 *
 * Bridge function that builds a coordinate string from UI segment values
 * for passing to the geo package parser. Part of the Segments → String → Geo Parse flow.
 *
 * @internal
 */
function formatDMSSegments(segments: string[]): string | undefined {
  if (segments.length < 8) {
    return undefined;
  }

  return `${segments[0]}° ${segments[1]}' ${segments[2]}" ${segments[3]}, ${segments[4]}° ${segments[5]}' ${segments[6]}" ${segments[7]}`;
}

/**
 * Format MGRS (Military Grid Reference System) segments to coordinate string
 *
 * Bridge function that builds a coordinate string from UI segment values
 * for passing to the geo package parser. Part of the Segments → String → Geo Parse flow.
 *
 * @internal
 */
function formatMGRSSegments(segments: string[]): string | undefined {
  if (segments.length < 5) {
    return undefined;
  }

  return `${segments[0]}${segments[1]} ${segments[2]} ${segments[3]} ${segments[4]}`;
}

/**
 * Format UTM (Universal Transverse Mercator) segments to coordinate string
 *
 * Bridge function that builds a coordinate string from UI segment values
 * for passing to the geo package parser. Part of the Segments → String → Geo Parse flow.
 *
 * @internal
 */
function formatUTMSegments(segments: string[]): string | undefined {
  if (segments.length < 4) {
    return undefined;
  }

  return `${segments[0]}${segments[1]} ${segments[2]} ${segments[3]}`;
}

/**
 * Format segment values into a coordinate string suitable for @accelint/geo parsing
 *
 * Converts an array of segment values into a string format that the geo package
 * parsers can understand. Each format has different requirements:
 *
 * DD: [lat, lon] → "lat, lon"
 * DDM: [latDeg, latMin, latDir, lonDeg, lonMin, lonDir] → "latDeg° latMin' latDir, lonDeg° lonMin' lonDir"
 * DMS: [latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir] → "latDeg° latMin' latSec\" latDir, lonDeg° lonMin' lonSec\" lonDir"
 * MGRS: [zone, band, grid, easting, northing] → "zone+band grid easting northing"
 * UTM: [zone, hemisphere, easting, northing] → "zone+hemisphere easting northing"
 *
 * @param segments - Array of segment values from user input
 * @param format - The coordinate system format
 * @returns Formatted coordinate string, or null if segments are invalid
 */
export function formatSegmentsToCoordinateString(
  segments: string[],
  format: CoordinateSystem,
): string | undefined {
  if (segments.some((seg) => seg === '' || seg === undefined)) {
    return undefined;
  }

  try {
    switch (format) {
      case 'dd':
        return formatDDSegments(segments);
      case 'ddm':
        return formatDDMSegments(segments);
      case 'dms':
        return formatDMSSegments(segments);
      case 'mgrs':
        return formatMGRSSegments(segments);
      case 'utm':
        return formatUTMSegments(segments);
      default:
      // NOTE: intentionally empty; return undefined
    }
  } catch (_error) {
    // NOTE: intentionally empty; return undefined
  }
}

/**
 * Parse DD coordinate string to segments
 *
 * Extracts segment values from a formatted DD coordinate string.
 *
 * @internal
 */
function parseDDCoordinateString(coordString: string): string[] | undefined {
  const { lat, lon } = createCoordinate('wgs', coordString);

  if (lat && lon) {
    return [lat, lon].map(String);
  }
}

/**
 * Parse DDM coordinate string to segments
 *
 * Extracts segment values from a formatted DDM coordinate string.
 *
 * @internal
 */
function parseDDMCoordinateString(coordString: string): string[] | undefined {
  const { lat, lon } = createCoordinate('wgs', coordString).tokens({
    format: 'ddm',
  }) as Record<'lat' | 'lon', { degrees: number; minutes: number }>;

  if (lat && lon) {
    const [compassLat, compassLon] = [
      lat.degrees < 0 ? 'S' : 'N',
      lon.degrees < 0 ? 'W' : 'E',
    ];

    if (lat.degrees < 0) {
      lat.degrees = Math.abs(lat.degrees);
    }

    if (lon.degrees < 0) {
      lon.degrees = Math.abs(lon.degrees);
    }

    return [
      lat.degrees,
      lat.minutes,
      compassLat,
      lon.degrees,
      lon.minutes,
      compassLon,
    ].map(String);
  }
}

/**
 * Parse DMS coordinate string to segments
 *
 * Extracts segment values from a formatted DMS coordinate string. This duplicates
 * parsing logic from @accelint/geo's parseDegreesMinutesSeconds, but is necessary because
 * geo doesn't expose the parsed components - only formatted strings and raw DD numbers.
 *
 * Part of the Geo Format → String → Regex Parse → Segments flow (circular conversion).
 *
 * @internal
 */
function parseDMSCoordinateString(coordString: string): string[] | undefined {
  const { lat, lon } = createCoordinate('wgs', coordString).tokens({
    format: 'dms',
  }) as Record<
    'lat' | 'lon',
    { degrees: number; minutes: number; seconds: number }
  >;

  if (lat && lon) {
    const [compassLat, compassLon] = [
      lat.degrees < 0 ? 'S' : 'N',
      lon.degrees < 0 ? 'W' : 'E',
    ];

    if (lat.degrees < 0) {
      lat.degrees = Math.abs(lat.degrees);
    }

    if (lon.degrees < 0) {
      lon.degrees = Math.abs(lon.degrees);
    }

    return [
      lat.degrees,
      lat.minutes,
      lat.seconds,
      compassLat,
      lon.degrees,
      lon.minutes,
      lon.seconds,
      compassLon,
    ].map(String);
  }
}

/**
 * Parse MGRS coordinate string to segments
 *
 * Extracts segment values from a formatted MGRS coordinate string. This duplicates
 * parsing logic from @accelint/geo's parseMGRS, but is necessary because
 * geo doesn't expose the parsed components - only formatted strings and raw DD numbers.
 *
 * Part of the Geo Format → String → Regex Parse → Segments flow (circular conversion).
 *
 * @internal
 */
function parseMGRSCoordinateString(coordString: string): string[] | undefined {
  // MGRS formats:
  // New compact format from @accelint/geo v0.3.0: "18TXL8395907350"
  // Old spaced format: "18T WM 12345 67890" or "18T WL 80654 06346"

  // Try compact format first (no spaces)
  const compactMatch = coordString.match(
    /(\d+)([A-Z])([A-Z]{2})(\d{5})(\d{5})/i,
  );

  if (compactMatch) {
    return [
      compactMatch[1] as string,
      compactMatch[2] as string,
      compactMatch[3] as string,
      compactMatch[4] as string,
      compactMatch[5] as string,
    ];
  }

  // Try spaced format
  const spacedMatch = coordString.match(
    /(\d+)([A-Z])\s+([A-Z]{2})\s+(\d+)\s+(\d+)/i,
  );

  if (spacedMatch) {
    return [
      spacedMatch[1] as string,
      spacedMatch[2] as string,
      spacedMatch[3] as string,
      spacedMatch[4] as string,
      spacedMatch[5] as string,
    ];
  }
}

/**
 * Parse UTM coordinate string to segments
 *
 * Extracts segment values from a formatted UTM coordinate string. This duplicates
 * parsing logic from @accelint/geo's parseUTM, but is necessary because
 * geo doesn't expose the parsed components - only formatted strings and raw DD numbers.
 *
 * Part of the Geo Format → String → Regex Parse → Segments flow (circular conversion).
 *
 * @internal
 */
function parseUTMCoordinateString(coordString: string): string[] | undefined {
  // UTM formats from @accelint/geo v0.3.0:
  // "18T 583959 4507351" (zone, band/hemisphere, easting, northing)
  // Also handle: "18N 585628 4511644" or "18 N 585628 4511644"

  // The new format includes zone letter (band) instead of just hemisphere
  const match = coordString.match(/(\d+)\s*([A-Z])\s+(\d+)\s+(\d+)/i);

  if (match) {
    return [
      match[1] as string,
      match[2] as string,
      match[3] as string,
      match[4] as string,
    ];
  }
}

/**
 * Parse a coordinate string into segment values
 *
 * Converts a formatted coordinate string (from @accelint/geo output or user input)
 * back into individual segment values for display.
 *
 * This is the inverse of formatSegmentsToCoordinateString.
 *
 * **Note on Duplication**: This function and its helpers (parseDDCoordinateString,
 * parseDDMCoordinateString, etc.) duplicate parsing logic that already exists in
 * the @accelint/geo package parsers:
 *
 * - Geo parsers: parseDecimalDegrees, parseDegreesDecimalMinutes, etc.
 * - These functions: parseDDCoordinateString, parseDDMCoordinateString, etc.
 *
 * Both use regex patterns to extract coordinate components from strings. The duplication
 * exists because:
 *
 * 1. **Geo parsers** extract components, validate them, convert to DD, then format back to strings
 * 2. **This function** extracts components from those formatted strings for the UI
 *
 * We're essentially undoing the formatting that geo just did. This is the second half
 * of the circular conversion described in convertDDToDisplaySegments.
 *
 * **Why we can't use geo parsers directly**: The geo parsers return coord objects with
 * only `coord.lat/coord.lon` (DD numbers) and formatting methods. They don't expose the parsed
 * segment components we need for the UI (e.g., the degrees, minutes, and direction values).
 *
 * **Parsing Order**:
 * - **convertDisplaySegmentsToDD**: Segments → String → **Geo parse** → DD ✓ (efficient)
 * - **convertDDToDisplaySegments**: DD → String → Geo parse → Geo format → **This parse** → Segments ✗ (circular)
 *
 * @param coordString - Formatted coordinate string
 * @param format - The coordinate system format
 * @returns Array of segment values, or null if parsing fails
 */
export function parseCoordinateStringToSegments(
  coordString: string,
  format: CoordinateSystem,
): string[] | undefined {
  if (coordString) {
    try {
      switch (format) {
        case 'dd':
          return parseDDCoordinateString(coordString);
        case 'ddm':
          return parseDDMCoordinateString(coordString);
        case 'dms':
          return parseDMSCoordinateString(coordString);
        case 'mgrs':
          return parseMGRSCoordinateString(coordString);
        case 'utm':
          return parseUTMCoordinateString(coordString);
        default:
        // NOTE: intentionally empty; return undefined
      }
    } catch (_error) {
      // NOTE: intentionally empty; return undefined
    }
  }
}

/**
 * Convert DD (internal format) to display format segment values
 *
 * Takes a CoordinateValue in Decimal Degrees format and converts it to the
 * segment values needed for the specified display format.
 *
 * Uses @accelint/geo to ensure accurate conversion between coordinate systems.
 *
 * **Note on Circular Conversion**: This function demonstrates the circular conversion
 * pattern discussed in the module documentation. The flow is:
 *
 * 1. Start with DD value: `{ lat: 40.7128, lon: -74.0060 }`
 * 2. Convert to coordinate string: `"40.7128, -74.006"`
 * 3. Parse with geo package (creates coord object with internal parsed state)
 * 4. Format to target system using geo: `coord.toString({ format: 'ddm' })` → `"40° 42.768', -74° 0.36'"`
 * 5. Parse the formatted string AGAIN with regex to extract segments: `['40', '42.768', 'N', ...]`
 *
 * This is inefficient because:
 * - The geo package already has the component values (degrees, minutes, direction) internally
 * - We format them into a string, then immediately parse the string back apart
 * - The regex parsing duplicates work the geo parsers already did
 *
 * However, this approach is necessary because:
 * - The geo package only exposes `coord.lat/coord.lon` (DD numbers) and formatted strings
 * - It doesn't expose the intermediate component values we need for the UI segments
 * - We need individual segment values for separate input fields
 *
 * **Future Improvement**: If geo package exported component extractors like:
 * ```typescript
 * coord.components.ddm // { latDeg: 40, latMin: 42.768, latDir: 'N', ... }
 * ```
 * Then we could eliminate the format→parse cycle entirely.
 *
 * @param value - Coordinate value in DD format `{ lat: number, lon: number }`
 * @param format - Target display format
 * @returns Array of segment values for display, or null if conversion fails
 *
 * @example
 * const segments = convertDDToDisplaySegments({ lat: 40.7128, lon: -74.0060 }, 'ddm');
 * // Returns: ['40', '42.7680', 'N', '74', '0.3600', 'W']
 */
export function convertDDToDisplaySegments(
  value: CoordinateValue,
  format: CoordinateSystem,
): string[] | undefined {
  if (
    !value ||
    typeof value.lat !== 'number' ||
    typeof value.lon !== 'number'
  ) {
    return undefined;
  }

  try {
    // Round to 5 decimal places to prevent precision issues with geo package
    // Use signed numbers for reliable conversions to all formats
    const lat = Number(value.lat.toFixed(5));
    const lon = Number(value.lon.toFixed(5));
    const inputCoordString = `${lat}, ${lon}`;

    const coord = createCoordinate('latlon', inputCoordString);

    // Format the coordinate using geo package formatters
    // These return complete coordinate strings (e.g., "40° 42.768', -74° 0.36'")
    let coordString: string;
    switch (format) {
      case 'dd':
        coordString = coord.toString({ format: 'dd' });
        break;
      case 'ddm':
        coordString = coord.toString({ format: 'ddm' });
        break;
      case 'dms':
        coordString = coord.toString({ format: 'dms' });
        break;
      case 'mgrs':
        coordString = coord.toMGRS().toString();
        break;
      case 'utm':
        coordString = coord.toUTM().toString();
        break;
      default:
        return undefined;
    }

    // Parse the formatted string to extract individual segment values
    // This is the circular part: geo formatted it, now we parse it back apart
    // Necessary because geo doesn't expose the components directly
    const segments = parseCoordinateStringToSegments(coordString, format);
    return segments;
  } catch (error) {
    logger.withError(error).error('Failed to convert DD to display');
    return undefined;
  }
}

/**
 * Convert display format segment values to DD (internal format)
 *
 * Takes segment values from user input and converts them to a CoordinateValue
 * in Decimal Degrees format using @accelint/geo for validation and conversion.
 *
 * **Note on Efficiency**: This function demonstrates the EFFICIENT conversion direction.
 * The flow is:
 *
 * 1. Start with UI segments: `['40', '42.768', 'N', '74', '0.36', 'W']`
 * 2. Build coordinate string: `"40° 42.768' N, 74° 0.36' W"`
 * 3. Parse with geo package (validates and converts internally)
 * 4. Extract DD from coord.lat/lon: `{ lat: 40.7128, lon: -74.0060 }`
 *
 * This is efficient because:
 * - We let geo do what it's designed for: parsing and validating coordinate strings
 * - We extract the DD values directly from `coord.lat/coord.lon` (no string parsing needed)
 * - Single direction: Segments → String → Geo Parse → DD (no circular conversion)
 *
 * Contrast with `convertDDToDisplaySegments` which has the circular pattern:
 * DD → String → Geo Parse → Geo Format → String → Regex Parse → Segments
 *
 * @param segments - Array of segment values from user input
 * @param format - The coordinate system format of the segments
 * @returns CoordinateValue in DD format, or null if invalid
 *
 * @example
 * const coord = convertDisplaySegmentsToDD(['40', '42.7680', 'N', '74', '0.3600', 'W'], 'ddm');
 * // Returns: { lat: 40.7128, lon: -74.0060 }
 */
export function convertDisplaySegmentsToDD(
  segments: string[],
  format: CoordinateSystem,
): CoordinateValue | undefined {
  // Build coordinate string from segments for geo parsing
  const coordString = formatSegmentsToCoordinateString(segments, format);
  if (!coordString) {
    return undefined;
  }

  try {
    // Parse and validate with geo package
    // Map format to system: dd/ddm/dms -> 'latlon', mgrs -> 'mgrs', utm -> 'utm'
    if (format === 'dd' || format === 'ddm' || format === 'dms') {
      const coord = createCoordinate('latlon', coordString);
      // Extract DD values directly from coord.lat/lon (no string parsing needed)
      return {
        lat: coord.lat,
        lon: coord.lon,
      };
    }

    if (format === 'mgrs') {
      const mgrsCoord = createCoordinate('mgrs', coordString);
      // Convert MGRS to WGS to get lat/lon
      const wgsCoord = mgrsCoord.toWGS();
      return {
        lat: wgsCoord.lat,
        lon: wgsCoord.lon,
      };
    }

    if (format === 'utm') {
      const utmCoord = createCoordinate('utm', coordString);
      // Convert UTM to WGS to get lat/lon
      const wgsCoord = utmCoord.toWGS();
      return {
        lat: wgsCoord.lat,
        lon: wgsCoord.lon,
      };
    }

    return undefined;
  } catch (error) {
    logger.withError(error).error('Failed to convert display to DD');
    return undefined;
  }
}

/**
 * Validate coordinate segments and return errors
 *
 * Uses @accelint/geo to validate the segments and returns any validation errors.
 * Only validates when all required segments are filled.
 *
 * @param segments - Array of segment values from user input
 * @param format - The coordinate system format
 * @returns Array of error messages, empty if valid or incomplete
 *
 * @example
 * const errors = validateCoordinateSegments(['91', '0', 'N', '0', '0', 'E'], 'ddm');
 * // Returns: ['Invalid coordinate value']
 */
export function validateCoordinateSegments(
  segments: string[],
  format: CoordinateSystem,
): string[] {
  if (segments.some((seg) => seg === '' || seg === undefined)) {
    return [];
  }

  const coordString = formatSegmentsToCoordinateString(segments, format);
  if (!coordString) {
    return ['Invalid coordinate value'];
  }

  try {
    // Map format to system: dd/ddm/dms -> 'latlon', mgrs -> 'mgrs', utm -> 'utm'
    if (format === 'dd' || format === 'ddm' || format === 'dms') {
      createCoordinate('latlon', coordString);
    } else if (format === 'mgrs') {
      createCoordinate('mgrs', coordString);
    } else if (format === 'utm') {
      createCoordinate('utm', coordString);
    } else {
      return ['Invalid coordinate value'];
    }

    return [];
  } catch (_error) {
    return ['Invalid coordinate value'];
  }
}

/**
 * Check if all segments are filled
 *
 * Helper to determine if the user has completed entering all segment values.
 * Used to determine when to trigger validation.
 *
 * @param segments - Array of segment values
 * @returns True if all segments have values, false otherwise
 */
export function areAllSegmentsFilled(segments: string[]): boolean {
  return segments.every((seg) => seg !== '' && seg !== undefined);
}

/**
 * Check if any segments have values
 *
 * Helper to determine if the user has started entering coordinate values.
 *
 * @param segments - Array of segment values
 * @returns True if any segment has a value, false if all empty
 */
export function hasAnySegmentValue(segments: string[]): boolean {
  return segments.some((seg) => seg !== '' && seg !== undefined);
}

/**
 * Create an invalid result object for all coordinate systems
 * @internal
 */
function createInvalidResult(): Record<
  CoordinateSystem,
  CoordinateFormatResult
> {
  return {
    dd: { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false },
    ddm: { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false },
    dms: { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false },
    mgrs: { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false },
    utm: { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false },
  };
}

/**
 * Validate coordinate value
 * @internal
 */
function isValidCoordinateValue(value: CoordinateValue | null): boolean {
  return (
    value !== null &&
    typeof value.lat === 'number' &&
    typeof value.lon === 'number'
  );
}

/**
 * Check if error is due to geographic limitation (poles)
 * @internal
 */
function isGeographicLimitationError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorMessage.includes('outside UTM limits') ||
    errorMessage.includes('invalid UTM zone')
  );
}

/**
 * Convert coordinate to a specific format with error handling
 * @internal
 */
function convertToFormat(
  coord: {
    toString: (options?: { format?: 'dd' | 'ddm' | 'dms' }) => string;
    toMGRS: () => { toString: () => string };
    toUTM: () => { toString: () => string };
  },
  format: CoordinateSystem,
): CoordinateFormatResult {
  try {
    let formattedValue: string;
    switch (format) {
      case 'dd':
        formattedValue = coord.toString({ format: 'dd' });
        break;
      case 'ddm':
        formattedValue = coord.toString({ format: 'ddm' });
        break;
      case 'dms':
        formattedValue = coord.toString({ format: 'dms' });
        break;
      case 'mgrs':
        formattedValue = coord.toMGRS().toString();
        break;
      case 'utm':
        formattedValue = coord.toUTM().toString();
        break;
      default:
        return { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false };
    }
    return { value: formattedValue, isValid: true };
  } catch (error) {
    // Handle geographic limitations for MGRS/UTM
    if (
      (format === 'mgrs' || format === 'utm') &&
      isGeographicLimitationError(error)
    ) {
      return {
        value: COORDINATE_ERROR_MESSAGES.NOT_AVAILABLE_AT_POLES,
        isValid: false,
      };
    }

    // Log other errors in development
    logger.withError(error).error(`Failed to convert to ${format}`);
    return {
      value: COORDINATE_ERROR_MESSAGES.CONVERSION_FAILED,
      isValid: false,
    };
  }
}

/**
 * Get all coordinate formats for a given DD value
 *
 * Converts a Decimal Degrees coordinate to all 5 supported coordinate systems
 * for display in the format conversion popover.
 *
 * Each format is tried independently - if one fails (e.g., UTM/MGRS at poles),
 * the others can still succeed.
 *
 * @param value - Coordinate value in DD format `{ lat: number, lon: number }`
 * @returns Object containing formatted strings and validity status for all coordinate systems
 *
 * @example
 * const formats = getAllCoordinateFormats({ lat: 40.7128, lon: -74.0060 });
 * // Returns: {
 * //   dd: { value: "40.7128 N / 74.006 W", isValid: true },
 * //   ddm: { value: "40 42.768 N / 74 0.36 W", isValid: true },
 * //   dms: { value: "40 42 46.08 N / 74 0 21.6 W", isValid: true },
 * //   mgrs: { value: "18T WL 80654 06346", isValid: true },
 * //   utm: { value: "18N 585628 4511644", isValid: true }
 * // }
 *
 * @example
 * const formats = getAllCoordinateFormats({ lat: 90, lon: 0 });
 * // Returns: {
 * //   dd: { value: "90 N / 0 E", isValid: true },
 * //   ddm: { value: "90 0 N / 0 0 E", isValid: true },
 * //   dms: { value: "90 0 0 N / 0 0 0 E", isValid: true },
 * //   mgrs: { value: "Not available at poles", isValid: false },
 * //   utm: { value: "Not available at poles", isValid: false }
 * // }
 */
export function getAllCoordinateFormats(
  value: CoordinateValue | null,
): Record<CoordinateSystem, CoordinateFormatResult> {
  const invalidResult = createInvalidResult();

  if (!isValidCoordinateValue(value)) {
    return invalidResult;
  }

  const validValue = value as CoordinateValue;

  try {
    const coord = createCoordinate(
      'latlon',
      `${validValue.lat}, ${validValue.lon}`,
    );

    const result = {} as Record<CoordinateSystem, CoordinateFormatResult>;

    for (const format of COORDINATE_SYSTEMS) {
      result[format] = convertToFormat(coord, format);
    }

    return result;
  } catch (error) {
    logger.withError(error).error('Failed to get all coordinate formats');
    return invalidResult;
  }
}

/**
 * Check if pasted text looks like a complete coordinate string
 *
 * Uses heuristics to detect if the pasted text contains a full coordinate
 * rather than just a single segment value. This prevents intercepting
 * single-segment pastes.
 *
 * Indicators of a complete coordinate:
 * - Contains separators: comma, slash, or multiple consecutive spaces
 * - Contains coordinate symbols: °, ′, ″, ', "
 * - Multiple numbers separated by whitespace
 *
 * @param text - The pasted text to check
 * @returns True if it looks like a complete coordinate string
 *
 * @example
 * isCompleteCoordinate("40.7128, -74.0060") // true - contains comma
 * isCompleteCoordinate("40° 42' 46\" N / 74° 0' 22\" W") // true - contains symbols
 * isCompleteCoordinate("18T WM 12345 67890") // true - multiple parts
 * isCompleteCoordinate("42") // false - single number
 * isCompleteCoordinate("N") // false - single letter
 */
export function isCompleteCoordinate(text: string): boolean {
  if (!text || text.trim() === '') {
    return false;
  }

  const hasSeparators = /[,/]|°|′|″|['"]|\s{2,}/.test(text);
  const numbers = text.match(/\d+/g) || [];
  const hasMultipleNumbers = numbers.length >= 2;

  // Explicitly detect MGRS format: <zone><band> <grid> <easting> <northing>
  // Example: "18T WL 80654 06346"
  const isMGRS = /^\d{1,2}[A-Z]\s+[A-Z]{2}\s+\d+\s+\d+$/i.test(text.trim());

  // Explicitly detect UTM format: <zone><hemisphere> <easting> <northing>
  // Example: "18N 585628 4511644"
  const isUTM = /^\d{1,2}[NS]\s+\d+\s+\d+$/i.test(text.trim());

  return hasSeparators || hasMultipleNumbers || isMGRS || isUTM;
}

/**
 * Attempt to parse pasted text as all coordinate formats
 *
 * Tries to parse the pasted text using each of the 5 coordinate system parsers.
 * Returns all formats that successfully parse the text.
 *
 * This enables automatic detection of coordinate format and disambiguation
 * when multiple formats match the same input string.
 *
 * @param pastedText - The raw text from clipboard
 * @returns Array of successfully parsed coordinate matches (may be empty)
 *
 * @example
 * const matches = parseCoordinatePaste("40.7128, -74.0060");
 * // Returns: [{ format: 'dd', value: { lat: 40.7128, lon: -74.0060 }, displayString: "..." }]
 *
 * @example
 * const matches = parseCoordinatePaste("18T WM 12345 67890");
 * // Returns: [{ format: 'mgrs', value: { lat: ..., lon: ... }, displayString: "..." }]
 *
 * @example
 * const matches = parseCoordinatePaste("invalid text");
 * // Returns: []
 */
export function parseCoordinatePaste(
  pastedText: string,
): ParsedCoordinateMatch[] {
  if (!pastedText || pastedText.trim() === '') {
    return [];
  }

  const matches: ParsedCoordinateMatch[] = [];

  for (const format of COORDINATE_SYSTEMS) {
    try {
      // Map format to system: dd/ddm/dms -> 'latlon', mgrs -> 'mgrs', utm -> 'utm'
      let lat: number;
      let lon: number;
      let displayString: string;

      if (format === 'dd' || format === 'ddm' || format === 'dms') {
        const coord = createCoordinate('latlon', pastedText.trim());
        lat = coord.lat;
        lon = coord.lon;

        switch (format) {
          case 'dd':
            displayString = coord.toString({ format: 'dd' });
            break;
          case 'ddm':
            displayString = coord.toString({ format: 'ddm' });
            break;
          case 'dms':
            displayString = coord.toString({ format: 'dms' });
            break;
          default:
            displayString = '';
        }
      } else if (format === 'mgrs') {
        const mgrsCoord = createCoordinate('mgrs', pastedText.trim());
        const wgsCoord = mgrsCoord.toWGS();
        lat = wgsCoord.lat;
        lon = wgsCoord.lon;
        displayString = mgrsCoord.toString();
      } else if (format === 'utm') {
        const utmCoord = createCoordinate('utm', pastedText.trim());
        const wgsCoord = utmCoord.toWGS();
        lat = wgsCoord.lat;
        lon = wgsCoord.lon;
        displayString = utmCoord.toString();
      } else {
        continue;
      }

      matches.push({
        format,
        value: { lat, lon },
        displayString,
      });
    } catch (error) {
      // Log parsing errors in development for debugging
      logger.withError(error).warn(`Failed to parse as ${format}`);
      // Continue trying other parsers
    }
  }

  return matches;
}

/**
 * Check if two coordinates are equal within epsilon tolerance
 */
export function areCoordinatesEqual(
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number },
  epsilon = COORDINATE_EPSILON,
): boolean {
  return (
    Math.abs(coord1.lat - coord2.lat) < epsilon &&
    Math.abs(coord1.lon - coord2.lon) < epsilon
  );
}

/**
 * Deduplicate coordinate matches by location, keeping first match for each unique location
 */
export function deduplicateMatchesByLocation(
  matches: ParsedCoordinateMatch[],
): ParsedCoordinateMatch[] {
  const uniqueMatches: ParsedCoordinateMatch[] = [];

  for (const match of matches) {
    const isDuplicate = uniqueMatches.some((existing) =>
      areCoordinatesEqual(existing.value, match.value),
    );

    if (!isDuplicate) {
      uniqueMatches.push(match);
    }
  }

  return uniqueMatches;
}
