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
import { createParser } from '../internal/parse-format';
import type { ParseResults } from '../internal/parse';

type DecimalDegrees = {
  bear: string;
  deg: string;
};

const checks = {
  deg: (deg: string, limit: number) => {
    if (Number.parseFloat(deg) > limit) {
      return `Degrees value (${deg}) exceeds max value (${limit}).`;
    }
  },
  min: (val: string) => {
    if (val.includes(SYMBOLS.MINUTES)) {
      return `Seconds indicator (${SYMBOLS.MINUTES}) not valid in Decimal Degrees.`;
    }
  },
  sec: (val: string) => {
    if (val.includes(SYMBOLS.SECONDS)) {
      return `Seconds indicator (${SYMBOLS.SECONDS}) not valid in Decimal Degrees.`;
    }
  },
};

const formats = {
  LATLON: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLatDec NS ${SYMBOLS.DIVIDER} degLonDec EW`,
  ),
  LONLAT: Patterning.fromTemplate(
    PARTIAL_PATTERNS,
    `degLonDec EW ${SYMBOLS.DIVIDER} degLatDec NS`,
  ),
};

function identifyErrors(format: Format) {
  return (arg: DecimalDegrees | undefined, i: number) => {
    if (!arg) {
      return [[], ['Invalid coordinate value.']] as ParseResults;
    }

    let { bear, deg } = arg;

    deg ??= '0';

    let isNegative: 0 | 1 = SYMBOL_PATTERNS.NEGATIVE_SIGN.test(deg) ? 1 : 0;
    const bearingOptions = BEARINGS[format][i] as [string, string];

    if (!bear || isNegative) {
      bear = bearingOptions[isNegative];
      deg = Math.abs(Number.parseFloat(deg)).toString();
      isNegative = 0;
    }

    const errors = [
      ...[checks.deg(deg, LIMITS[format][i] ?? 0)],
      ...[checks.min([bear, deg].join(''))],
      ...[checks.sec([bear, deg].join(''))],
    ].filter(Boolean);

    return (errors.length ? [[], errors] : [[deg, bear], []]) as ParseResults;
  };
}

function identifyPieces(half: string[]) {
  if (half.length > 2 || half.length < 1) {
    return;
  }

  const places = { bear: '', deg: '' };

  return half.reduce((acc, token) => {
    if (SYMBOL_PATTERNS.NSEW.test(token) && !acc.bear) {
      acc.bear ||= token;
    } else {
      acc.deg ||= token;
    }

    return acc;
  }, places);
}

/** Parse a Decimal Degrees coordinate. */
export const parseDecimalDegrees = createParser<DecimalDegrees>({
  formats,
  identifyErrors,
  identifyPieces,
});
