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
  SYMBOLS,
  SYMBOL_PATTERNS,
} from '../internal';
import { inRange } from '../internal/in-range';
import type { ParseResults } from '../internal/parse';
import { createParser } from '../internal/parse-format';

type DegreesDecimalMinutes = {
  bear: string;
  deg: string;
  min: string;
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
  min: (min: string) => inRange('Minutes', min, 59.999999999),
  sec: (val: string) => {
    if (val.includes(SYMBOLS.SECONDS)) {
      return `Seconds indicator (${SYMBOLS.SECONDS}) not valid in Degree Decimal Minutes.`;
    }
  },
};

const formats = {
  LATLON: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLat minDec NS ${SYMBOLS.DIVIDER} degLon minDec EW`,
  ),
  LONLAT: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLon minDec EW ${SYMBOLS.DIVIDER} degLat minDec NS`,
  ),
};

function identifyErrors(format: Format) {
  return (arg: DegreesDecimalMinutes | undefined, i: number) => {
    if (!arg) {
      return [[], ['Invalid coordinate value.']] as ParseResults;
    }

    let { bear, deg, min } = arg;

    deg ??= '0';
    min ??= '0';

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
      ...[checks.sec([bear, deg, min].join(''))],
    ].filter(Boolean);

    return (
      errors.length ? [[], errors] : [[deg, min, bear], []]
    ) as ParseResults;
  };
}

function identifyPieces(half: string[]) {
  if (half.length < 1 || half.length > 3) {
    return;
  }

  const asString = half.join(' ');
  const places = { bear: '', deg: '', min: '' };
  const keys = ['deg', 'min'] as (keyof typeof places)[];
  const test = (r: RegExp, b: boolean, v: string) =>
    r.test(v) || (r.test(asString) && b);

  return half.reduce((acc, token, i, { length }) => {
    if (test(SYMBOL_PATTERNS.NSEW, i === length - 1, token)) {
      acc.bear ||= token;
    } else if (test(SYMBOL_PATTERNS.DEGREES, i === 0, token)) {
      acc.deg ||= token;
    } else if (test(SYMBOL_PATTERNS.MINUTES, i === 1, token)) {
      acc.min ||= token;
    } else {
      const key = keys.find((k) => !acc[k]);

      acc[key as keyof typeof acc] = token;
    }

    return acc;
  }, places);
}

/** Parse a Degrees Decimal Minutes coordinate. */
export const parseDegreesDecimalMinutes = createParser<DegreesDecimalMinutes>({
  formats,
  identifyErrors,
  identifyPieces,
});
