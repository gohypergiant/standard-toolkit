/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import * as Patterning from '@/patterning';
import {
  BEARINGS,
  type Format,
  LIMITS,
  PARTIAL_PATTERNS,
  SYMBOL_PATTERNS,
  SYMBOLS,
} from '../internal';
import { inRange } from '../internal/in-range';
import { createParser } from '../internal/parse-format';
import type { ParseResults } from '../internal/parse';

type DegreesMinutesSeconds = {
  bear: string;
  deg: string;
  min: string;
  sec: string;
};

const checks = {
  deg: (deg: string, limit: number) => {
    if (Number.parseFloat(deg) > limit) {
      return `Degrees value (${deg}) exceeds max value (${limit}).`;
    }

    if (/\./.test(deg)) {
      return `Degrees value (${deg}) must not include decimal value.`;
    }
  },
  min: (min: string) => inRange('Minutes', min, 59),
  sec: (sec: string) => inRange('Seconds', sec, 59.999999999),
};

const formats = {
  LATLON: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLat min secDec NS ${SYMBOLS.DIVIDER} degLon min secDec EW`,
  ),
  LONLAT: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLon min secDec EW ${SYMBOLS.DIVIDER} degLat min secDec NS`,
  ),
};

/**
 * Creates an error identification function for degrees minutes seconds coordinates.
 *
 * Validates that degree values are integers, minutes are in range 0-59,
 * seconds are in range 0-59.999..., and all components are properly formatted.
 *
 * @param format - The coordinate format (LATLON or LONLAT).
 * @returns Function that validates coordinate components and returns parse results.
 *
 * @example
 * ```typescript
 * const validator = identifyErrors('LATLON');
 * const result = validator({ deg: '91', min: '0', sec: '0', bear: 'N' }, 0);
 * // [[], ['Degrees value (91) exceeds max value (90).']]
 * ```
 */
function identifyErrors(format: Format) {
  return (arg: DegreesMinutesSeconds | undefined, i: number) => {
    if (!arg) {
      return [[], ['Invalid coordinate value.']] as ParseResults;
    }

    let { bear, deg, min, sec } = arg;

    deg ??= '0';
    // NOTE: need `||=` not `??=` because empty-string is not nullish
    min ||= '0';
    sec ||= '0';

    let isNegative: 0 | 1 = SYMBOL_PATTERNS.NEGATIVE_SIGN.test(deg) ? 1 : 0;
    const bearingOptions = BEARINGS[format][i] as [string, string];

    if (!bear || isNegative) {
      bear = bearingOptions[isNegative];
      deg = Math.abs(Number.parseFloat(deg)).toString();
      isNegative = 0;
    }

    const errors = [
      ...[checks.deg(deg, LIMITS[format][i] ?? 0)],
      ...[checks.min(min)],
      ...[checks.sec(sec)],
    ].filter(Boolean);

    return (
      errors.length ? [[], errors] : [[deg, min, sec, bear], []]
    ) as ParseResults;
  };
}

/**
 * Identifies and organizes coordinate components from parsed tokens.
 *
 * Separates bearing indicators (N/S/E/W), degree values, minute values, and second values from tokens.
 * Uses symbol patterns to identify component types and positional logic as fallback.
 *
 * @param half - Array of tokens representing one coordinate component.
 * @returns Object with `bear`, `deg`, `min`, and `sec` properties, or undefined if invalid.
 *
 * @example
 * ```typescript
 * identifyPieces(['45', '30', '15.23', 'N']);
 * // { bear: 'N', deg: '45', min: '30', sec: '15.23' }
 * ```
 *
 * @example
 * ```typescript
 * identifyPieces(['122°', '25'', '9.84″', 'W']);
 * // { bear: 'W', deg: '122', min: '25', sec: '9.84' }
 * ```
 */
function identifyPieces(half: string[]) {
  if (half.length < 1 || half.length > 4) {
    return;
  }

  const asString = half.join(' ');
  const places = { bear: '', deg: '', min: '', sec: '' };
  const keys = ['deg', 'min', 'sec'] as (keyof typeof places)[];
  const test = (r: RegExp, b: boolean, v: string) =>
    r.test(v) || (r.test(asString) && b);

  return half.reduce((acc, token, i, { length }) => {
    if (test(SYMBOL_PATTERNS.NSEW, i === length - 1, token)) {
      acc.bear ||= token;
    } else if (test(SYMBOL_PATTERNS.DEGREES, i === 0, token)) {
      acc.deg ||= token;
    } else if (test(SYMBOL_PATTERNS.MINUTES, i === 1, token)) {
      acc.min ||= token;
    } else if (test(SYMBOL_PATTERNS.SECONDS, i === 2, token)) {
      acc.sec ||= token;
    } else {
      const key = keys.find((k) => !acc[k]);

      acc[key as keyof typeof acc] = token;
    }

    return acc;
  }, places);
}

/**
 * Parses a Degrees Minutes Seconds coordinate string.
 *
 * Accepts coordinates in degrees minutes seconds format with bearing indicators.
 * Validates that degrees are integers, minutes are in range 0-59,
 * seconds are in range 0-59.999..., and all components are properly formatted.
 *
 * @param input - Raw coordinate string to parse.
 * @param format - Expected format (LATLON or LONLAT).
 * @returns Parsed coordinate values or errors.
 *
 * @example
 * ```typescript
 * parseDegreesMinutesSeconds('37° 46' 29.64″ N / 122° 25' 9.84″ W', 'LATLON');
 * // [[37.7749, -122.4194], []]
 * ```
 *
 * @example
 * ```typescript
 * parseDegreesMinutesSeconds('45 30 15.23 N, 122 25 9.84 W');
 * // [[45.504231, -122.419400], []]
 * ```
 */
export const parseDegreesMinutesSeconds = createParser<DegreesMinutesSeconds>({
  formats,
  identifyErrors,
  identifyPieces,
});
