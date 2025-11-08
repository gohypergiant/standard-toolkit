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
import { assembleCoordinate } from './internal/assemble-coordinate.js';
import { createTokensMask } from './internal/create-tokens-mask.js';
import { findSeparatorIndex } from './internal/find-separator-index.js';
import { allWGSPatterns, patternWGSCompact } from './internal/patterns.js';
import { sanitize } from './internal/sanitize.js';
import { SEPARATOR } from './internal/separator.js';
import type { OptionsWGS } from './options-wgs.js';
import type { TokensWGS } from './tokens-wgs.js';

/**
 * Parses a WGS84 latitude/longitude coordinate string in various formats.
 *
 * Supports multiple format variations:
 * - Decimal degrees: "40.7128, -74.0060"
 * - Degrees minutes: "40° 42.768', -74° 0.36'"
 * - Degrees minutes seconds: "40° 42' 46.08\", -74° 0' 21.6\""
 * - With cardinal directions: "40.7128 N, 74.0060 W"
 * - Concatenated (no separators): "0451530E 123015N" (DDMMSSH format)
 * - Space or comma separated
 *
 * @param raw - The WGS84 coordinate string to parse
 * @param options - Optional parsing configuration
 * @param options.skipValidation - If true, only validates format without full parsing (returns boolean)
 * @param options.order - Expected coordinate order: "latlon" (default) or "lonlat"
 *
 * @returns
 * - When `skipValidation` is true: `true` if format is valid, `false` otherwise
 * - When `skipValidation` is false (default):
 *   - `Tokens` object with `lat` and `lon` properties if parsing succeeds
 *   - `ParseError` if validation fails or input is invalid
 *
 * @example
 * ```ts
 * // Decimal degrees
 * const coord = parse("40.7128, -74.0060");
 * // Returns: { lat: 40.7128, lon: -74.0060 }
 *
 * // Degrees minutes seconds with cardinal directions
 * const coord2 = parse("40° 42' 46.08\" N, 74° 0' 21.6\" W");
 * // Returns: { lat: 40.7128, lon: -74.0060 }
 *
 * // Concatenated format (DDMMSS with hemisphere)
 * const coord3 = parse("0451530E 123015N");
 * // Returns: { lat: 12.504167, lon: 45.258333 }
 *
 * // Longitude first
 * const coord4 = parse("-74.0060, 40.7128", { order: "lonlat" });
 * // Returns: { lat: 40.7128, lon: -74.0060 }
 *
 * // Format-only validation
 * const isValid = parse("40.7128, -74.0060", { skipValidation: true });
 * // Returns: true
 * ```
 */
export function parseWGS(
  raw: string,
  options?: OptionsWGS,
): boolean | TokensWGS | ParseError {
  const { order, skipValidation } = {
    ...DEFAULT_OPTIONS,
    ...options,
  } as OptionsWGS;

  if (!raw || raw.constructor !== String || !raw.trim()) {
    return skipValidation ? false : new EmptyInputError(raw);
  }

  const compactParse = raw
    .trim()
    .match(patternWGSCompact)
    ?.slice(1)
    .filter(Boolean);
  const tokens = compactParse || sanitize(raw).split(' ');

  // missing separator, try to infer position
  if (!tokens.includes(SEPARATOR)) {
    const index = findSeparatorIndex(tokens);

    if (index) {
      tokens.splice(index, 0, SEPARATOR);
    }
  }

  const mask = createTokensMask(tokens);
  const simple = mask.replace(SEPARATOR, '');
  const formatOnly = allWGSPatterns.some((regex) => regex.test(simple));

  if (skipValidation) {
    return formatOnly;
  }

  if (!formatOnly) {
    return new ParseError('Input is not in a valid WGS format', raw);
  }

  const [assembleError, coordinate] = assembleCoordinate(tokens, order);

  if (assembleError) {
    return assembleError;
  }

  return coordinate;
}
