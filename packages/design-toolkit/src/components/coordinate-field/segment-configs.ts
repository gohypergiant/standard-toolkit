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
 * Coordinate Field Segment Configurations
 *
 * This file defines the segment layouts for each supported coordinate system format.
 * Each configuration specifies the editable segments and literal separators that make up
 * the coordinate input for that format.
 *
 * Supported formats:
 * - DD (Decimal Degrees) - 2 editable segments
 * - DDM (Degrees Decimal Minutes) - 6 editable segments
 * - DMS (Degrees Minutes Seconds) - 8 editable segments
 * - MGRS (Military Grid Reference System) - 5 editable segments
 * - UTM (Universal Transverse Mercator) - 4 editable segments
 *
 * References:
 * - DD parser: /packages/geo/src/coordinates/latlon/decimal-degrees/parser.ts
 * - DDM parser: /packages/geo/src/coordinates/latlon/degrees-decimal-minutes/parser.ts
 * - DMS parser: /packages/geo/src/coordinates/latlon/degrees-minutes-seconds/parser.ts
 * - MGRS parser: /packages/geo/src/coordinates/mgrs/parser.ts
 * - UTM parser: /packages/geo/src/coordinates/utm/parser.ts
 */

import type { CoordinateSystem, SegmentConfig } from './types';

/** Padding for numeric segments (0.25ch ≈ quarter character width for visual spacing) */
const NUMERIC_PAD = 0.25;

/** Larger padding for final segment to account for container edge (0.5ch ≈ half character) */
const LAST_PAD = 0.5;

/**
 * DD (Decimal Degrees) Segment Configuration
 *
 * Format: [lat_deg], [lon_deg]
 * Example: 89.765432, -123.456789
 *
 * Segments:
 * - Latitude degrees: -90 to 90, allows negative sign, decimals, 0-9
 * - Longitude degrees: -180 to 180, allows negative sign, decimals, 0-9
 *
 * Total segments: 2 editable
 */
export const ddSegmentConfigs: SegmentConfig[] = [
  {
    type: 'numeric',
    placeholder: '00.000000',
    allowedChars: '[0-9\\-\\.]',
    maxLength: 10, // Max: -90.123456
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: ', ',
  },
  {
    type: 'numeric',
    placeholder: '-000.000000',
    allowedChars: '[0-9\\-\\.]',
    maxLength: 11, // Max: -180.123456
    pad: LAST_PAD,
  },
];

/**
 * DDM (Degrees Decimal Minutes) Segment Configuration
 *
 * Format: [lat_deg]° [lat_min]' [lat_dir], [lon_deg]° [lon_min]' [lon_dir]
 * Example: 89° 45.9259' N, 123° 27.4073' W
 *
 * Segments:
 * - Latitude degrees: 0-90, whole number only (no decimals)
 * - Latitude minutes: 0-59.9999, decimals allowed
 * - Latitude direction: N or S
 * - Longitude degrees: 0-180, whole number only (no decimals)
 * - Longitude minutes: 0-59.9999, decimals allowed
 * - Longitude direction: E or W
 *
 * Total segments: 6 editable
 */
export const ddmSegmentConfigs: SegmentConfig[] = [
  // Latitude degrees
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 90
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '° ',
  },
  // Latitude minutes (decimal minutes)
  {
    type: 'numeric',
    placeholder: '00.0000',
    allowedChars: '[0-9\\.]',
    maxLength: 7, // Max: 59.9999
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: "' ",
  },
  // Latitude direction
  {
    type: 'directional',
    placeholder: 'N',
    allowedChars: '[NS]',
    maxLength: 1,
    pad: 0,
  },
  {
    type: 'literal',
    value: ', ',
  },
  // Longitude degrees
  {
    type: 'numeric',
    placeholder: '000',
    allowedChars: '[0-9]',
    maxLength: 3, // Max: 180
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '° ',
  },
  // Longitude minutes (decimal minutes)
  {
    type: 'numeric',
    placeholder: '00.0000',
    allowedChars: '[0-9\\.]',
    maxLength: 7, // Max: 59.9999
    pad: LAST_PAD,
  },
  {
    type: 'literal',
    value: "' ",
  },
  // Longitude direction
  {
    type: 'directional',
    placeholder: 'W',
    allowedChars: '[EW]',
    maxLength: 1,
    pad: 0,
  },
];

/**
 * DMS (Degrees Minutes Seconds) Segment Configuration
 *
 * Format: [lat_deg]° [lat_min]' [lat_sec]" [lat_dir], [lon_deg]° [lon_min]' [lon_sec]" [lon_dir]
 * Example: 89° 45' 55.56" N, 123° 27' 24.44" W
 *
 * Segments:
 * - Latitude degrees: 0-90, whole number only (no decimals)
 * - Latitude minutes: 0-59, whole number only (no decimals)
 * - Latitude seconds: 0-59.999, decimals allowed
 * - Latitude direction: N or S
 * - Longitude degrees: 0-180, whole number only (no decimals)
 * - Longitude minutes: 0-59, whole number only (no decimals)
 * - Longitude seconds: 0-59.999, decimals allowed
 * - Longitude direction: E or W
 *
 * Total segments: 8 editable
 */
export const dmsSegmentConfigs: SegmentConfig[] = [
  // Latitude degrees
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 90
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '° ',
  },
  // Latitude minutes (whole number)
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 59
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: "' ",
  },
  // Latitude seconds (decimal seconds)
  {
    type: 'numeric',
    placeholder: '00.00',
    allowedChars: '[0-9\\.]',
    maxLength: 5, // Max: 59.99
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '" ',
  },
  // Latitude direction
  {
    type: 'directional',
    placeholder: 'N',
    allowedChars: '[NS]',
    maxLength: 1,
    pad: 0,
  },
  {
    type: 'literal',
    value: ', ',
  },
  // Longitude degrees
  {
    type: 'numeric',
    placeholder: '000',
    allowedChars: '[0-9]',
    maxLength: 3, // Max: 180
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '° ',
  },
  // Longitude minutes (whole number)
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 59
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: "' ",
  },
  // Longitude seconds (decimal seconds)
  {
    type: 'numeric',
    placeholder: '00.00',
    allowedChars: '[0-9\\.]',
    maxLength: 5, // Max: 59.99
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: '" ',
  },
  // Longitude direction
  {
    type: 'directional',
    placeholder: 'W',
    allowedChars: '[EW]',
    maxLength: 1,
    pad: 0,
  },
];

/**
 * MGRS (Military Grid Reference System) Segment Configuration
 *
 * Format: [zone][band] [grid_100km] [easting] [northing]
 * Example: 18T WM 12345 67890
 *
 * Segments:
 * - Zone: 1-60, 2 digits
 * - Band: C-X (excluding I and O), 1 letter
 * - Grid 100km: 2 letters (A-Z excluding I and O)
 * - Easting: 5 digits (can be 1-5 based on precision)
 * - Northing: 5 digits (can be 1-5 based on precision)
 *
 * Total segments: 5 editable
 *
 * Reference: /packages/geo/src/coordinates/mgrs/parser.ts
 * Pattern: /^((?:..?)?)(\w?)\s*((?:\w{2})?)\s*(?:(\d+(?:\.\d*)?)?)\s*(?:(\d+(?:\.\d*)?)?)$/i
 */
export const mgrsSegmentConfigs: SegmentConfig[] = [
  // Zone (1-60)
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 60
    pad: NUMERIC_PAD,
  },
  // Band (C-X, excluding I and O)
  {
    type: 'alphanumeric',
    placeholder: 'T',
    allowedChars: '[C-HJ-NP-X]', // Excludes I and O
    maxLength: 1,
    pad: 0,
  },
  {
    type: 'literal',
    value: ' ',
  },
  // Grid 100km identifier (2 letters, A-Z excluding I and O)
  {
    type: 'alphanumeric',
    placeholder: 'WM',
    allowedChars: '[A-HJ-NP-Z]', // Excludes I and O
    maxLength: 2,
    pad: 0,
  },
  {
    type: 'literal',
    value: ' ',
  },
  // Easting (5 digits, can be 1-5 based on precision)
  {
    type: 'numeric',
    placeholder: '00000',
    allowedChars: '[0-9]',
    maxLength: 5,
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: ' ',
  },
  // Northing (5 digits, can be 1-5 based on precision)
  {
    type: 'numeric',
    placeholder: '00000',
    allowedChars: '[0-9]',
    maxLength: 5,
    pad: LAST_PAD,
  },
];

/**
 * UTM (Universal Transverse Mercator) Segment Configuration
 *
 * Format: [zone][hemisphere] [easting] [northing]
 * Example: 18N 585628 4511644
 *
 * Segments:
 * - Zone: 1-60, 2 digits
 * - Hemisphere: N or S, 1 letter
 * - Easting: 6-7 digits
 * - Northing: 7 digits
 *
 * Total segments: 4 editable
 *
 * Reference: /packages/geo/src/coordinates/utm/parser.ts
 * Pattern: /^((?:..)?)\s*(\w?)\s*(?:(\d+(?:\.\d*)?)?)\s*(?:(\d+(?:\.\d*)?)?)$/i
 */
export const utmSegmentConfigs: SegmentConfig[] = [
  // Zone (1-60)
  {
    type: 'numeric',
    placeholder: '00',
    allowedChars: '[0-9]',
    maxLength: 2, // Max: 60
    pad: NUMERIC_PAD,
  },
  // Hemisphere (N or S)
  {
    type: 'directional',
    placeholder: 'N',
    allowedChars: '[NS]',
    maxLength: 1,
    pad: 0,
  },
  {
    type: 'literal',
    value: ' ',
  },
  // Easting (6-7 digits)
  {
    type: 'numeric',
    placeholder: '000000',
    allowedChars: '[0-9]',
    maxLength: 7,
    pad: NUMERIC_PAD,
  },
  {
    type: 'literal',
    value: ' ',
  },
  // Northing (7 digits)
  {
    type: 'numeric',
    placeholder: '0000000',
    allowedChars: '[0-9]',
    maxLength: 7,
    pad: LAST_PAD,
  },
];

/**
 * Get segment configurations for a specific coordinate system
 *
 * @param format - The coordinate system format
 * @returns Array of segment configurations for the specified format
 */
export function getSegmentConfigs(format: CoordinateSystem): SegmentConfig[] {
  switch (format) {
    case 'dd':
      return ddSegmentConfigs;
    case 'ddm':
      return ddmSegmentConfigs;
    case 'dms':
      return dmsSegmentConfigs;
    case 'mgrs':
      return mgrsSegmentConfigs;
    case 'utm':
      return utmSegmentConfigs;
    default:
      // Default to DD format if unknown format provided
      return ddSegmentConfigs;
  }
}

/**
 * Get format description with example
 *
 * Provides a user-friendly description of the coordinate format with an example value.
 * These descriptions can be used as helper text to guide users on the expected format.
 *
 * @param format - The coordinate system format
 * @returns Description string with format example
 */
export function getFormatDescription(format: CoordinateSystem): string {
  switch (format) {
    case 'dd':
      return 'Example: 40.7128, -74.0060 (New York City)';
    case 'ddm':
      return "Example: 40° 42.768' N, 74° 0.360' W (New York City)";
    case 'dms':
      return 'Example: 40° 42\' 46.08" N, 74° 0\' 21.60" W (New York City)';
    case 'mgrs':
      return 'Example: 18T WL 80654 06346 (New York City)';
    case 'utm':
      return 'Example: 18N 585628 4511644 (New York City)';
    default:
      return '';
  }
}

/**
 * Get editable segment count for a format
 *
 * Returns the number of editable segments (excluding literal separators) for each format.
 * This is useful for initializing segment values and validation.
 *
 * @param format - The coordinate system format
 * @returns Number of editable segments
 */
export function getEditableSegmentCount(format: CoordinateSystem): number {
  const configs = getSegmentConfigs(format);
  return configs.filter((config) => config.type !== 'literal').length;
}

/**
 * Validate segment count for each format
 *
 * Expected editable segment counts:
 * - DD: 2 segments (lat, lon)
 * - DDM: 6 segments (lat_deg, lat_min, lat_dir, lon_deg, lon_min, lon_dir)
 * - DMS: 8 segments (lat_deg, lat_min, lat_sec, lat_dir, lon_deg, lon_min, lon_sec, lon_dir)
 * - MGRS: 5 segments (zone, band, grid, easting, northing)
 * - UTM: 4 segments (zone, hemisphere, easting, northing)
 */
export const EXPECTED_SEGMENT_COUNTS: Record<CoordinateSystem, number> = {
  dd: 2,
  ddm: 6,
  dms: 8,
  mgrs: 5,
  utm: 4,
};

/**
 * Get semantic accessibility label for a segment based on format and editable index
 *
 * Provides descriptive labels for screen readers (e.g., "Latitude degrees", "Longitude minutes")
 * to improve accessibility beyond generic "Coordinate segment 1" announcements.
 *
 * @param format - The coordinate system format
 * @param editableIndex - The index of the editable segment (0-based, excluding literals)
 * @returns Semantic label string for the segment
 */
export function getSegmentLabel(
  format: CoordinateSystem,
  editableIndex: number,
): string {
  switch (format) {
    case 'dd':
      // DD: [lat, lon]
      return editableIndex === 0 ? 'Latitude' : 'Longitude';

    case 'ddm':
      // DDM: [lat_deg, lat_min, lat_dir, lon_deg, lon_min, lon_dir]
      switch (editableIndex) {
        case 0:
          return 'Latitude degrees';
        case 1:
          return 'Latitude minutes';
        case 2:
          return 'Latitude direction';
        case 3:
          return 'Longitude degrees';
        case 4:
          return 'Longitude minutes';
        case 5:
          return 'Longitude direction';
        default:
          return `Coordinate segment ${editableIndex + 1}`;
      }

    case 'dms':
      // DMS: [lat_deg, lat_min, lat_sec, lat_dir, lon_deg, lon_min, lon_sec, lon_dir]
      switch (editableIndex) {
        case 0:
          return 'Latitude degrees';
        case 1:
          return 'Latitude minutes';
        case 2:
          return 'Latitude seconds';
        case 3:
          return 'Latitude direction';
        case 4:
          return 'Longitude degrees';
        case 5:
          return 'Longitude minutes';
        case 6:
          return 'Longitude seconds';
        case 7:
          return 'Longitude direction';
        default:
          return `Coordinate segment ${editableIndex + 1}`;
      }

    case 'mgrs':
      // MGRS: [zone, band, grid, easting, northing]
      switch (editableIndex) {
        case 0:
          return 'MGRS zone';
        case 1:
          return 'MGRS band';
        case 2:
          return 'MGRS grid square';
        case 3:
          return 'MGRS easting';
        case 4:
          return 'MGRS northing';
        default:
          return `Coordinate segment ${editableIndex + 1}`;
      }

    case 'utm':
      // UTM: [zone, hemisphere, easting, northing]
      switch (editableIndex) {
        case 0:
          return 'UTM zone';
        case 1:
          return 'UTM hemisphere';
        case 2:
          return 'UTM easting';
        case 3:
          return 'UTM northing';
        default:
          return `Coordinate segment ${editableIndex + 1}`;
      }

    default:
      return `Coordinate segment ${editableIndex + 1}`;
  }
}
