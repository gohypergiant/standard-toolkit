// __private-exports
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

export type Axes = 'LAT' | 'LON';
export type Compass = 'N' | 'S' | 'E' | 'W';
export type Errors = string[];
export type Format = (typeof FORMATS)[number];

/**
 * Bearings are the consistent/explicit identifiers of directionality of a
 * coordinate component; this library has opted for these over implicit
 * indication by number sign not because there is an inherent superiority
 * but because something had to be chosen.
 *
 * NOTE: these arrays are position-important; negative values are [1] and
 * positive values are [0] so that they can be consistently indexed using
 * an `isNegative` boolean to reference the negative bearing of each axis
 */
export const BEARINGS = {
  LAT: ['N', 'S'],
  LON: ['E', 'W'],
  LATLON: [
    ['N', 'S'],
    ['E', 'W'],
  ],
  LONLAT: [
    ['E', 'W'],
    ['N', 'S'],
  ],
} as const;

export const FORMATS = ['LATLON', 'LONLAT'] as const;
export const FORMATS_DEFAULT = FORMATS[0];

export const LIMITS = { LATLON: [90, 180], LONLAT: [180, 90] } as const;

export const SYMBOLS = {
  DEGREES: '°',
  MINUTES: "'",
  SECONDS: '"',
  DIVIDER: '/',
};

export const SYMBOL_PATTERNS = {
  LAT: new RegExp(`[${BEARINGS.LAT.join('')}]`),
  LON: new RegExp(`[${BEARINGS.LON.join('')}]`),
  NSEW: new RegExp(`[${[...BEARINGS.LAT, ...BEARINGS.LON].join('')}]`),
  NEGATIVE_BEARINGS: /[SW]/i,
  NEGATIVE_SIGN: /-/,

  DEGREES: new RegExp(SYMBOLS.DEGREES),
  MINUTES: new RegExp(SYMBOLS.MINUTES),
  SECONDS: new RegExp(SYMBOLS.SECONDS),

  DIVIDER: new RegExp(SYMBOLS.DIVIDER),

  DMS: new RegExp(
    `[${[SYMBOLS.DEGREES, SYMBOLS.MINUTES, SYMBOLS.SECONDS].join('')}]`,
  ),

  // divider: {
  //   first: /(?<NAMED_SEPARATOR>:?)/,
  //   follow: new RegExp(`\\s?\\k<${'NAMED_SEPARATOR'}>\\s?`),
  // },
} as const;

const decimalSecAndMin = (symbol: RegExp) =>
  Patterning.optional(
    // Negative lookbehind
    // to ensure that the match is not preceded by a digit,
    // avoiding partial matches within larger numbers.
    /(?<!\d)/,

    // 0-59 including 9 decimal places and leading zeros or no number before
    // acceptable values: 0, 0.123456789, .987654321, 001, 59.999999999
    /([-+]?0*(?:[0-5]?\d|\.\d{1,9})(?:\.\d{1,9})?)/,

    Patterning.optional(symbol),

    // Negative lookahead
    // to ensure that the match is not followed by a digit,
    // avoiding partial matches within larger numbers.
    /(?!\d)/,
  );

export const PARTIAL_PATTERNS = {
  ' ': /\s*/,
  '/': Patterning.capture(SYMBOL_PATTERNS.DIVIDER),
  NS: Patterning.optional(Patterning.capture(SYMBOL_PATTERNS.LAT)),
  EW: Patterning.optional(Patterning.capture(SYMBOL_PATTERNS.LON)),

  degLatDec: Patterning.merge(
    Patterning.capture(
      /0*(?:90(?:\.0{1,9})?)/, // 90[.0]
      /|/,
      /(?:0?[0-8]?\d(?:\.\d{1,9})?)/, // [0]0[.0]-89[.9]
    ),
    Patterning.optional(SYMBOL_PATTERNS.DEGREES),
  ),
  degLonDec: Patterning.merge(
    Patterning.capture(
      /(?:180(?:\.0{1,9})?)/, // 180[.0]
      /|/,
      /(?:0*(?:\d{1,2}|1[0-7]\d)(?:\.\d{1,9})?)/, // [00]0[.0]-179[.9]
    ),
    Patterning.optional(SYMBOL_PATTERNS.DEGREES),
  ),
  degLat: Patterning.merge(
    Patterning.capture(
      /(?:0?90)/, // 90
      /|/,
      /(?:0?[0-8]?\d)/, // [0]0-89
    ),
    Patterning.optional(SYMBOL_PATTERNS.DEGREES),
  ),
  degLon: Patterning.merge(
    Patterning.capture(
      /(?:180)/, // 180
      /|/,
      /(?:0*(?:\d{1,2}|1[0-7]\d))/, // [00]0-179
    ),
    Patterning.optional(SYMBOL_PATTERNS.DEGREES),
  ),
  min: Patterning.merge(
    Patterning.optional(
      Patterning.capture(
        /(?:0?[0-5]?\d)?/, // [0]0-59
      ),
      Patterning.optional(SYMBOL_PATTERNS.MINUTES),
    ),
  ),
  minDec: decimalSecAndMin(SYMBOL_PATTERNS.MINUTES),
  secDec: decimalSecAndMin(SYMBOL_PATTERNS.SECONDS),
} as const;
