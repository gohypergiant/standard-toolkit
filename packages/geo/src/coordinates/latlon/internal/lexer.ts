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
import { SYMBOL_PATTERNS, SYMBOLS } from '.';

export type Tokens = ReturnType<typeof lexer>;

/**
 * Separating latitude from longitude portions of a coordinate. At this level
 * of pattern matching this list can not include the "space" character since
 * that is valid between components of either side of a divider; higher level
 * parsers will be able to make up for this shortcoming and be more intelligent
 * about deducing where a divider could be added or would not be valid.
 */
const DIVIDERS = /[,/]/g;
const FLOATS = /^(-?)([\d.]+)([^.\d]?)$/;
/** Positional indicators for: degrees, minutes, and seconds */
const POSITIONAL = new RegExp(
  Patterning.merge(/\s*/, Patterning.capture(SYMBOL_PATTERNS.DMS), /\s*/),
  'g',
);
const POSITIVE = /\+/g;
const SIGNS = /([-+])\s*/g;
/**
 * Any recognizably significant tokens anywhere (non-positional-y) within a
 * string; because at this level (lexing) actual position is not important.
 *
 * - [Regex Vis](https://regex-vis.com/?r=%2F%5B%2C%2F%5D%7C%5BNSEW%5D%7C%28%3F%3A%5B-%2B%5D%3F%28%3F%3A%28%3F%3A%5Cd%2B%28%3F%3A%5C.%5Cd*%29%3F%29%7C%28%3F%3A%5C.%5Cd%2B%29%29%28%3F%3A%5B%C2%B0%27%22%5D%29%3F%29%2Fgi)
 * - [Nodexr](https://www.nodexr.net/?parse=%2F%5B,%2F%5D%7C%5BNSEW%5D%7C(%3F%3A%5B-%2B%5D%3F(%3F%3A(%3F%3A%5Cd%2B(%3F%3A%5C.%5Cd*)%3F)%7C(%3F%3A%5C.%5Cd%2B))%5B%C2%B0%27%22%5D%3F)%2Fgi)
 */
// NOTE: the links (above) for "Regex Vis" and "Nodexr" would need to be updated if/when the pattern is changed.
const TOKENS = new RegExp(
  Patterning.merge(
    DIVIDERS,
    /|/,
    SYMBOL_PATTERNS.NSEW,
    /|/,
    Patterning.group(
      /[-+]?/,
      Patterning.group(
        // left of decimal REQUIRED, right of decimal optional
        /(?:\d+(?:\.\d*)?)|/,
        // left of decimal omitted, right of decimal REQUIRED
        /(?:\.\d+)/,
      ),
      Patterning.optional(SYMBOL_PATTERNS.DMS),
    ),
  ),
  'gi',
);

// remove trailing zeros '?.0' and ensure leading zero '0.?' in numbers
function fixLeadingAndTrailing(t: string) {
  const [sign, num, pos] = (FLOATS.exec(t) ?? []).slice(1);

  if (num) {
    return `${sign}${Number.parseFloat(num)}${pos}`;
  }

  return t;
}

/**
 * Take an input string - possibly from user input - and clean it up enough to
 * be something to work with at a higher level of processing (with more
 * information) than is available at this level. Generating a list of "tokens"
 * that are potentially valid parts of a coordinate. The values being looked
 * for are: numbers (with positional indicators) and axes (NSEW).
 *
 * NOTE: No validation is done at this level to keep it simple as agnostic.
 *
 * @remarks
 * pure function
 *
 * @example
 * lexer('N 55,E 44') === ['N' '55', '/', 'E', '44']
 * lexer(` + 89  ° 59   59.999 " N, 179° 59 59.999"  `) === ['89', '59', '59.999', 'N', '/', '179', '59', '59.999', 'E']
 */
export function lexer(input: string) {
  const tokens =
    input
      .trim()
      .toUpperCase()
      .replace(POSITIVE, '') // positive signs are redundant
      .replace(POSITIONAL, '$1 ') // group positional indicators with numbers
      .replace(SIGNS, '$1') // group signs with numbers
      .replace(DIVIDERS, SYMBOLS.DIVIDER) // standardize the divider
      .match(TOKENS)
      ?.map(fixLeadingAndTrailing)
      ?.slice() ?? [];

  return tokens;
}
