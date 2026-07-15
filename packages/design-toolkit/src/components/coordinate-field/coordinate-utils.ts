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

import { createLoggerDomain } from '@/utils/logger';

const logger = createLoggerDomain('[CoordinateField]');

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
 * const coord = createCoordinate(coordinateSystems.ddm, 'LATLON')('40 42.768 N / 74 0.36 W');
 * coord.dd()   // Returns: "40.7128 N / 74.006 W"  (formatted string)
 * coord.ddm()  // Returns: "40 42.768 N / 74 0.36 W" (formatted string)
 * coord.raw    // Returns: { LAT: 40.7128, LON: -74.006 } (only DD numbers)
 * ```
 *
 * The coordinate-field component needs segment-level data for individual input fields:
 * - DDM: ['40', '42.768', 'N', '74', '0.36', 'W'] ← Not provided by geo
 * - DMS: ['40', '42', '46.08', 'N', '74', '0', '21.6', 'W'] ← Not provided by geo
 *
 * ### Current Limitations and Duplication
 *
 * Because the geo package only exposes:
 * 1. **Formatters** that return complete strings (coord.ddm(), coord.dms(), etc.)
 * 2. **Raw values** in Decimal Degrees only (coord.raw)
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

import {
  coordinateSystems,
  createCoordinate,
  toDdmParts,
  toDmsParts,
  toMgrsParts,
  toUtmParts,
} from '@accelint/geo';
import {
  COORDINATE_SYSTEMS,
  type CoordinateSystem,
  type CoordinateValue,
  type ParsedCoordinateMatch,
} from './types';

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
function formatDDSegments(segments: string[]): string | null {
  if (segments.length < 2) {
    return null;
  }
  const latNum = Number.parseFloat(segments[0] as string);
  const lonNum = Number.parseFloat(segments[1] as string);

  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return null;
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
function formatDDMSegments(segments: string[]): string | null {
  if (segments.length < 6) {
    return null;
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
function formatDMSSegments(segments: string[]): string | null {
  if (segments.length < 8) {
    return null;
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
function formatMGRSSegments(segments: string[]): string | null {
  if (segments.length < 5) {
    return null;
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
function formatUTMSegments(segments: string[]): string | null {
  if (segments.length < 4) {
    return null;
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
): string | null {
  if (segments.some((seg) => seg === '' || seg === undefined)) {
    return null;
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
        return null;
    }
  } catch (_error) {
    return null;
  }
}

/**
 * Format a decimal string to specified precision for display
 *
 * This is used to ensure consistent decimal precision when displaying
 * coordinate segments, regardless of the precision returned by the geo package.
 *
 * @param value - The decimal string to format
 * @param decimals - Number of decimal places to display
 * @returns Formatted string with specified precision
 * @internal
 */
function formatDecimalPrecision(value: string, decimals: number): string {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) {
    return value;
  }
  // Round to specified decimals, then remove trailing zeros
  return Number.parseFloat(num.toFixed(decimals)).toString();
}

/**
 * Per-format regex parsers that extract segment values from a coordinate string.
 *
 * Each entry tolerates optional degree/minute/second symbols and both `,` and `/`
 * separators so user-typed and geo-formatted strings both parse. Keyed by
 * coordinate system so {@link parseCoordinateStringToSegments} stays a flat lookup.
 *
 * @internal
 */
const coordinateStringParsers: Record<
  CoordinateSystem,
  (coordString: string) => string[] | null
> = {
  dd(coordString) {
    // DD formats: "40.7128 N / -74.006 W", "89.765432° N / 123.456789° W",
    // or "89.765432, -123.456789" (optional degree symbols/direction letters).
    const match = coordString.match(
      /([-]?\d+\.?\d*)°?\s*([NS])?\s*[,/\s]+\s*([-]?\d+\.?\d*)°?\s*([EW])?/i,
    );

    if (!match) {
      return null;
    }

    let lat = match[1];
    let lon = match[3];

    if (!(lat && lon)) {
      return null;
    }

    if (match[2]?.toUpperCase() === 'S' && !lat.startsWith('-')) {
      lat = `-${lat}`;
    }

    if (match[4]?.toUpperCase() === 'W' && !lon.startsWith('-')) {
      lon = `-${lon}`;
    }

    return [lat, lon];
  },
  ddm(coordString) {
    // DDM formats: "40 42.768 N / 74 0.36 W" or
    // "89° 45.9259' N / 123° 27.4073' W" (optional degree/minute symbols).
    const match = coordString.match(
      /(\d+)°?\s+([\d.]+)'?\s+([NS])\s*[,/]\s*(\d+)°?\s+([\d.]+)'?\s+([EW])/i,
    );

    if (!match) {
      return null;
    }

    // Round minutes to 4 decimal places for display (CJCSI 3900.01E compliance)
    return [
      match[1] as string,
      formatDecimalPrecision(match[2] as string, 4),
      match[3] as string,
      match[4] as string,
      formatDecimalPrecision(match[5] as string, 4),
      match[6] as string,
    ];
  },
  dms(coordString) {
    // DMS formats: "40 42 46.08 N / 74 0 21.60 W" or
    // "89° 45' 55.56" N / 123° 27' 24.44" W" (optional degree/minute/second symbols).
    const match = coordString.match(
      /(\d+)°?\s+(\d+)'?\s+([\d.]+)"?\s+([NS])\s*[,/]\s*(\d+)°?\s+(\d+)'?\s+([\d.]+)"?\s+([EW])/i,
    );

    if (!match) {
      return null;
    }

    // Round seconds to 2 decimal places for display
    return [
      match[1] as string,
      match[2] as string,
      formatDecimalPrecision(match[3] as string, 2),
      match[4] as string,
      match[5] as string,
      match[6] as string,
      formatDecimalPrecision(match[7] as string, 2),
      match[8] as string,
    ];
  },
  mgrs(coordString) {
    // MGRS: "18T WM 12345 67890"
    const match = coordString.match(
      /(\d+)([A-Z])\s+([A-Z]{2})\s+(\d+)\s+(\d+)/i,
    );

    if (!match) {
      return null;
    }

    return [
      match[1] as string,
      match[2] as string,
      match[3] as string,
      match[4] as string,
      match[5] as string,
    ];
  },
  utm(coordString) {
    // UTM: "18N 585628 4511644" or "18 N 585628 4511644" (optional space)
    const match = coordString.match(/(\d+)\s*([NS])\s+(\d+)\s+(\d+)/i);

    if (!match) {
      return null;
    }

    return [
      match[1] as string,
      match[2] as string,
      match[3] as string,
      match[4] as string,
    ];
  },
};

/**
 * Report whether a latitude/longitude pair is within the valid geographic range.
 *
 * Matches @accelint/geo's decimal-degrees validity bounds (`|lat| ≤ 90`,
 * `|lon| ≤ 180`). Used to reject out-of-range input before deriving segments,
 * preserving the previous behavior where geo's parser flagged such values.
 *
 * @internal
 */
function isCoordinateInRange(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
}

/**
 * Parse a coordinate string into segment values
 *
 * Converts a formatted coordinate string (from @accelint/geo output or user input)
 * back into individual segment values for display.
 *
 * This is the inverse of formatSegmentsToCoordinateString and is used to extract
 * segments from arbitrary coordinate strings (e.g. pasted text).
 *
 * @param coordString - Formatted coordinate string
 * @param format - The coordinate system format
 * @returns Array of segment values, or null if parsing fails
 */
export function parseCoordinateStringToSegments(
  coordString: string,
  format: CoordinateSystem,
): string[] | null {
  if (!coordString) {
    return null;
  }

  try {
    return coordinateStringParsers[format](coordString);
  } catch (_error) {
    return null;
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
 * 2. Convert to coordinate string: `"40.7128 / -74.006"`
 * 3. Parse with geo package (creates coord object with internal parsed state)
 * 4. Format to target system using geo: `coord.ddm()` → `"40 42.768 N / 74 0.36 W"`
 * 5. Parse the formatted string AGAIN with regex to extract segments: `['40', '42.768', 'N', ...]`
 *
 * This is inefficient because:
 * - The geo package already has the component values (degrees, minutes, direction) internally
 * - We format them into a string, then immediately parse the string back apart
 * - The regex parsing duplicates work the geo parsers already did
 *
 * However, this approach is necessary because:
 * - The geo package only exposes `coord.raw` (DD numbers) and formatted strings
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
): string[] | null {
  if (
    !value ||
    typeof value.lat !== 'number' ||
    typeof value.lon !== 'number' ||
    !isCoordinateInRange(value.lat, value.lon)
  ) {
    return null;
  }

  try {
    const { lat, lon } = value;

    // Build each format's segments directly from @accelint/geo structured parts.
    // DD keeps the raw signed magnitude (full precision); DDM/DMS use the parts
    // functions' default display precision (minutes 4, seconds 2); MGRS/UTM read
    // the grid parts and branch on the discriminated out-of-range result.
    switch (format) {
      case 'dd':
        // DD segments carry the raw signed magnitudes at full precision (no
        // rounding), matching geo's decimal-degrees renderer over the raw value.
        return [String(lat), String(lon)];
      case 'ddm': {
        const latParts = toDdmParts(lat, 'lat');
        const lonParts = toDdmParts(lon, 'lon');

        return [
          String(latParts.degrees),
          String(latParts.minutes),
          latParts.hemisphere,
          String(lonParts.degrees),
          String(lonParts.minutes),
          lonParts.hemisphere,
        ];
      }
      case 'dms': {
        const latParts = toDmsParts(lat, 'lat');
        const lonParts = toDmsParts(lon, 'lon');

        return [
          String(latParts.degrees),
          String(latParts.minutes),
          String(latParts.seconds),
          latParts.hemisphere,
          String(lonParts.degrees),
          String(lonParts.minutes),
          String(lonParts.seconds),
          lonParts.hemisphere,
        ];
      }
      case 'mgrs': {
        const result = toMgrsParts([lat, lon]);

        if (!result.ok) {
          return null;
        }

        const { zone, band, e100k, n100k, easting, northing } = result.value;

        // Mirror the geo MGRS renderer: floor within-square metres and left-pad
        // zone to 2 digits, easting/northing to 5.
        return [
          zone.toString().padStart(2, '0'),
          band,
          `${e100k}${n100k}`,
          Math.floor(easting).toString().padStart(5, '0'),
          Math.floor(northing).toString().padStart(5, '0'),
        ];
      }
      case 'utm': {
        const result = toUtmParts([lat, lon]);

        if (!result.ok) {
          return null;
        }

        const { zone, hemisphere, easting, northing } = result.value;

        // Mirror the geo UTM renderer: left-pad zone to 2 digits; easting and
        // northing are already the rounded integer metres.
        return [
          zone.toString().padStart(2, '0'),
          hemisphere,
          String(easting),
          String(northing),
        ];
      }
      default:
        return null;
    }
  } catch (error) {
    logger
      .withMetadata({
        value: String(value),
        format: String(format),
      })
      .withError(error)
      .error('Failed to convert DD to display');
    return null;
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
 * 4. Extract DD from coord.raw: `{ lat: 40.7128, lon: -74.0060 }`
 *
 * This is efficient because:
 * - We let geo do what it's designed for: parsing and validating coordinate strings
 * - We extract the DD values directly from `coord.raw` (no string parsing needed)
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
): CoordinateValue | null {
  // Build coordinate string from segments for geo parsing
  const coordString = formatSegmentsToCoordinateString(segments, format);
  if (!coordString) {
    return null;
  }

  try {
    // Parse and validate with geo package
    const create = createCoordinate(coordinateSystems[format], 'LATLON');
    const coord = create(coordString);

    if (!coord.valid) {
      // Return null for invalid coordinates (errors will be handled separately)
      return null;
    }

    // Extract DD values directly from coord.raw and round to 6 decimals
    // This ensures consistency with convertDDToDisplaySegments and getAllCoordinateFormats
    const { LAT, LON } = coord.raw;

    return {
      lat: LAT,
      lon: LON,
    };
  } catch (error) {
    logger
      .withMetadata({
        segments: JSON.stringify(segments),
        format: String(format),
      })
      .withError(error)
      .error('Failed to convert display to DD');
    return null;
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
    const create = createCoordinate(coordinateSystems[format], 'LATLON');
    const coord = create(coordString);

    if (!coord.valid) {
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
 * Build the MGRS display result for a coordinate.
 *
 * Composes the string from {@link toMgrsParts}, mirroring geo's MGRS renderer
 * (floor within-square metres; pad zone to 2 and easting/northing to 5). An
 * out-of-range result — or a geodesy zone error at the antimeridian — maps to
 * the poles sentinel instead of a thrown error or matched error text.
 *
 * @internal
 */
function convertToMgrsResult(lat: number, lon: number): CoordinateFormatResult {
  let result: ReturnType<typeof toMgrsParts>;

  try {
    result = toMgrsParts([lat, lon]);
  } catch {
    return {
      value: COORDINATE_ERROR_MESSAGES.NOT_AVAILABLE_AT_POLES,
      isValid: false,
    };
  }

  if (!result.ok) {
    return {
      value: COORDINATE_ERROR_MESSAGES.NOT_AVAILABLE_AT_POLES,
      isValid: false,
    };
  }

  const { zone, band, e100k, n100k, easting, northing } = result.value;
  const eastingPadded = Math.floor(easting).toString().padStart(5, '0');
  const northingPadded = Math.floor(northing).toString().padStart(5, '0');

  return {
    value: `${zone.toString().padStart(2, '0')}${band} ${e100k}${n100k} ${eastingPadded} ${northingPadded}`,
    isValid: true,
  };
}

/**
 * Build the UTM display result for a coordinate.
 *
 * Composes the string from {@link toUtmParts}, mirroring geo's UTM renderer
 * (pad zone to 2; easting/northing are already rounded integer metres). An
 * out-of-range result — or a geodesy zone error at the antimeridian — maps to
 * the poles sentinel instead of a thrown error or matched error text.
 *
 * @internal
 */
function convertToUtmResult(lat: number, lon: number): CoordinateFormatResult {
  let result: ReturnType<typeof toUtmParts>;

  try {
    result = toUtmParts([lat, lon]);
  } catch {
    return {
      value: COORDINATE_ERROR_MESSAGES.NOT_AVAILABLE_AT_POLES,
      isValid: false,
    };
  }

  if (!result.ok) {
    return {
      value: COORDINATE_ERROR_MESSAGES.NOT_AVAILABLE_AT_POLES,
      isValid: false,
    };
  }

  const { zone, hemisphere, easting, northing } = result.value;

  return {
    value: `${zone.toString().padStart(2, '0')}${hemisphere} ${easting} ${northing}`,
    isValid: true,
  };
}

/**
 * Convert coordinate to a specific format with error handling
 *
 * DD reads the geo string renderer directly; DDM/DMS and MGRS/UTM compose the
 * display string from @accelint/geo structured parts. MGRS/UTM signal
 * out-of-range latitudes through the discriminated result rather than by
 * matching geodesy error text, mapping to the poles sentinel.
 *
 * @internal
 */
function convertToFormat(
  coord: {
    dd: () => string;
  },
  format: CoordinateSystem,
  value: CoordinateValue,
): CoordinateFormatResult {
  const { lat, lon } = value;

  try {
    switch (format) {
      case 'dd':
        return { value: coord.dd(), isValid: true };
      case 'ddm': {
        const latParts = toDdmParts(lat, 'lat');
        const lonParts = toDdmParts(lon, 'lon');

        return {
          value: `${latParts.degrees} ${latParts.minutes} ${latParts.hemisphere} / ${lonParts.degrees} ${lonParts.minutes} ${lonParts.hemisphere}`,
          isValid: true,
        };
      }
      case 'dms': {
        const latParts = toDmsParts(lat, 'lat');
        const lonParts = toDmsParts(lon, 'lon');

        return {
          value: `${latParts.degrees} ${latParts.minutes} ${latParts.seconds} ${latParts.hemisphere} / ${lonParts.degrees} ${lonParts.minutes} ${lonParts.seconds} ${lonParts.hemisphere}`,
          isValid: true,
        };
      }
      case 'mgrs':
        return convertToMgrsResult(lat, lon);
      case 'utm':
        return convertToUtmResult(lat, lon);
      default:
        return { value: COORDINATE_ERROR_MESSAGES.INVALID, isValid: false };
    }
  } catch (error) {
    // Log other errors in development
    logger
      .withMetadata({
        value: JSON.stringify(value),
      })
      .withError(error)
      .error(`Failed to convert to ${format}`);
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
    const create = createCoordinate(coordinateSystems.dd, 'LATLON');
    const coord = create(
      `${validValue.lat.toFixed(10)} / ${validValue.lon.toFixed(10)}`,
    );

    if (!coord.valid) {
      return invalidResult;
    }

    const result = {} as Record<CoordinateSystem, CoordinateFormatResult>;

    for (const format of COORDINATE_SYSTEMS) {
      result[format] = convertToFormat(coord, format, validValue);
    }

    return result;
  } catch (error) {
    logger
      .withMetadata({
        value: JSON.stringify(validValue),
      })
      .withError(error)
      .error('Failed to get all coordinate formats');
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
      const create = createCoordinate(coordinateSystems[format], 'LATLON');
      const coord = create(pastedText.trim());

      if (coord.valid) {
        const { LAT, LON } = coord.raw;

        let displayString: string;
        switch (format) {
          case 'dd':
            displayString = coord.dd();
            break;
          case 'ddm':
            displayString = coord.ddm();
            break;
          case 'dms':
            displayString = coord.dms();
            break;
          case 'mgrs':
            displayString = coord.mgrs();
            break;
          case 'utm':
            displayString = coord.utm();
            break;
          default:
            displayString = '';
        }

        matches.push({
          format,
          value: { lat: LAT, lon: LON },
          displayString,
        });
      }
    } catch (error) {
      // Log parsing errors in development for debugging
      logger
        .withMetadata({
          pastedText: pastedText.trim(),
          format: String(format),
        })
        .withError(error)
        .error(`Failed to parse as ${format}`);
      // Continue trying other parsers
    }
  }

  return matches;
}

/**
 * Check if two coordinates are equal within epsilon tolerance
 *
 * @param coord1 - First coordinate to compare.
 * @param coord2 - Second coordinate to compare.
 * @param epsilon - Tolerance for comparison (defaults to COORDINATE_EPSILON).
 * @returns True if coordinates are equal within tolerance.
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
 *
 * @param matches - Array of parsed coordinate matches to deduplicate.
 * @returns Array of unique matches based on coordinate location.
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
