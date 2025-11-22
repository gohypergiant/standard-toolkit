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
import { validatePrecisionMGRS } from '../nga-grids-common/validators/precision.js';
import {
  invalidSquareColumn,
  missingSquareColumn,
  validateColForZone,
} from '../nga-grids-common/validators/square-column.js';
import {
  invalidSquareRow,
  missingSquareRow,
  validateRowForZone,
} from '../nga-grids-common/validators/square-row.js';
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
import type { TokensMGRS } from './tokens-mgrs.js';

// @esbuild-inline - inline the content at build time
const patternMGRS = new RegExp(
  [
    '^', // Start of string

    // Zone number: 01–60
    '(0?[1-9]|[1-5][0-9]|60)',

    // Zone letter: C–H, J–N, P–X (exclude I and O)
    '\\s*([C-HJ-NP-X])',

    // 100k grid square - col: A–Z excluding I/O - row: A–V excluding I/O
    '\\s*([A-HJ-NP-Z])([A-HJ-NP-V])',

    // Easting/Northing: 1–5 digits each, lengths must match
    '\\s*(?:\\d{1}\\s*\\d{1}|\\d{2}\\s*\\d{2}|\\d{3}\\s*\\d{3}|\\d{4}\\s*\\d{4}|\\d{5}\\s*\\d{5})?',

    '$', // End of string
  ].join(''),
  'i', // case-insensitive
); // @esbuild-inline-end

const validators = [
  // static
  missingZoneNumber,
  invalidZoneNumber,
  missingZoneLetter,
  invalidZoneLetter,
  exceptionsForZone,
  missingSquareColumn,
  invalidSquareColumn,
  missingSquareRow,
  invalidSquareRow,
  validatePrecisionMGRS,

  // contextual
  validateColForZone,
  validateRowForZone,
];

/**
 * Parses a Military Grid Reference System (MGRS) coordinate string.
 *
 * MGRS format consists of:
 * - Zone number (1-60)
 * - Zone letter (C-X, excluding I and O)
 * - 100km grid square identifier (two letters)
 * - Numerical location within the grid square (0-10 digits, even count)
 *
 * @param raw - The MGRS coordinate string to parse (e.g., "33UXP1234567890")
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
 * const coord = parse("33UXP1234567890");
 * // Returns: { zoneNumber: 33, zoneLetter: "U", gridCol: "X", gridRow: "P",
 * //            easting: 12345, northing: 67890, precision: 5 }
 *
 * // Format-only validation
 * const isValid = parse("33UXP1234567890", { skipValidation: true });
 * // Returns: true
 *
 * // Invalid input
 * const error = parse("invalid");
 * // Returns: ParseError instance
 * ```
 */
export function parseMGRS(
  raw: string,
  options?: Options,
): boolean | TokensMGRS | ParseError {
  const { skipValidation } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (!`${raw}`.trim()) {
    return skipValidation ? false : new EmptyInputError(raw);
  }

  if (skipValidation) {
    return patternMGRS.test(raw);
  }

  const clean = `${raw}`
    .toUpperCase()
    .replace(/[\n\t\s]+/g, '') // NOTE: whitespace is NOT important
    .trim();

  if (!clean || typeof raw !== 'string') {
    return new EmptyInputError(raw);
  }

  const zoneNumberText = clean.match(/^[-+]?\d{1,2}/)?.[0] ?? '';
  const zoneNumber = Number.parseInt(zoneNumberText, 10);
  const zoneLetter = clean.slice(
    zoneNumberText.length,
    zoneNumberText.length + 1,
  );
  const restAfterZone = clean.slice(zoneNumberText.length + zoneLetter.length);
  const gridCol = restAfterZone.slice(0, 1);
  const gridRow = restAfterZone.slice(1, 2);
  const precision = restAfterZone.slice(2);
  const easting = precision?.slice(0, precision.length / 2);
  const northing = precision?.slice(precision.length / 2);

  const error = validators.reduce(
    (err, check) =>
      err ||
      check({ easting, gridCol, gridRow, northing, zoneNumber, zoneLetter }),
    '',
  );

  if (error) {
    return new ParseError(error, raw);
  }

  return {
    easting: Number.parseInt(easting, 10) || 0,
    gridCol,
    gridRow,
    northing: Number.parseInt(northing, 10) || 0,
    precision: precision.length / 2,
    zoneLetter,
    zoneNumber,
  };
}
