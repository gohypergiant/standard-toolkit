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

import { DEFAULT_OPTIONS } from '@/internal/default-options.js';
import { EmptyInputError, ParseError } from '../internal/parse-error.js';
import { validatePrecisionUTM } from '../nga-grids-common/validators/precision.js';
import {
  exceptionsForZone,
  invalidZoneLetter,
  missingZoneLetter,
} from '../nga-grids-common/validators/zone-letter.js';
import {
  invalidZoneNumber,
  missingZoneNumber,
} from '../nga-grids-common/validators/zone-number.js';
import type { Options } from '../internal/options.js';
import type { TokensUTM } from './tokens-utm.js';

// @esbuild-inline - inline the content at build time
const patternUTMLoose = new RegExp(
  [
    '^', // start of string

    // zone number
    '([-+]?\\d{1,2})',

    // zone letter
    '\\s*(.?)',

    // easting/northing pair
    '(?:\\s+([^\\s]+?)\\s+([^\\s]+?))?',

    '$', // end of string
  ].join(''),
  'i',
); // @esbuild-inline-end

// @esbuild-inline - inline the content at build time
const patternUTMStrict = new RegExp(
  [
    '^', // start of string

    // Zone number: 01–60
    '(0?[1-9]|[1-5][0-9]|60)',

    // Zone letter: C–H, J–N, P–X (exclude I and O)
    '\\s*([C-HJ-NP-X])',

    // Optional easting/northing pair
    // Easting: 1–6 digits
    // Northing: 1–7 digits
    '(?:\\s+(\\d{1,6})\\s+(\\d{1,7}))?',

    '$', // end of string
  ].join(''),
  'i',
); // @esbuild-inline-end

const validators = [
  // static
  missingZoneNumber,
  invalidZoneNumber,
  missingZoneLetter,
  invalidZoneLetter,
  exceptionsForZone,
  validatePrecisionUTM,
];

/**
 * Parses a Universal Transverse Mercator (UTM) coordinate string.
 *
 * UTM format consists of:
 * - Zone number (1-60)
 * - Zone letter (C-X, excluding I and O)
 * - Easting value in meters (space-separated from northing)
 * - Northing value in meters
 *
 * @param raw - The UTM coordinate string to parse (e.g., "33U 456789 5678901")
 * @param options - Optional parsing configuration
 * @param options.skipValidation - If true, only validates format without full parsing (returns boolean)
 *
 * @returns
 * - When `skipValidation` is true: `true` if format is valid, `false` otherwise
 * - When `skipValidation` is false (default):
 *   - `Tokens` object if parsing succeeds
 *   - `ParseError` if validation fails or input is invalid
 *
 * @example
 * ```ts
 * // Full parsing with validation
 * const coord = parse("33U 456789 5678901");
 * // Returns: { zoneNumber: 33, zoneLetter: "U", hemisphere: "N",
 * //            easting: 456789, northing: 5678901, precision: { easting: 6, northing: 7 } }
 *
 * // Format-only validation
 * const isValid = parse("33U 456789 5678901", { skipValidation: true });
 * // Returns: true
 *
 * // Invalid input
 * const error = parse("invalid");
 * // Returns: ParseError instance
 * ```
 */
export function parseUTM(
  raw: string,
  options?: Options,
): boolean | TokensUTM | ParseError {
  const { skipValidation } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (!`${raw}`.trim()) {
    return skipValidation ? false : new EmptyInputError(raw);
  }

  if (skipValidation) {
    return patternUTMStrict.test(raw);
  }

  const clean = `${raw}`
    .toUpperCase()
    .replace(/[\n\t\s]+/g, ' ') // NOTE: whitespace is important
    .trim();

  if (!clean || typeof raw !== 'string') {
    return new EmptyInputError(raw);
  }

  const [zoneNumberText = '', zoneLetter = '', easting = '', northing = ''] = (
    clean.match(patternUTMLoose) ?? []
  ).slice(1);
  const zoneNumber = Number.parseInt(zoneNumberText, 10);

  const error = validators.reduce(
    (err, check) => err || check({ easting, northing, zoneLetter, zoneNumber }),
    '',
  );

  if (error) {
    return new ParseError(error, raw);
  }

  return {
    easting: Number.parseInt(easting, 10),
    hemisphere: zoneLetter >= 'N' && zoneLetter <= 'X' ? 'N' : 'S',
    northing: Number.parseInt(northing, 10),
    precision: {
      easting: easting.length,
      northing: northing.length,
    },
    zoneLetter,
    zoneNumber,
  };
}
