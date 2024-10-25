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

import { SYMBOL_PATTERNS, SYMBOLS, type Format } from '..';
import type { Tokens } from '../lexer';
import { pipesResult } from '../pipes';

import { simpler } from './simpler';

/**
 * Look for groupings of numbers that are ambiguous; no indicators, or no
 * dividers and not possibility of deducing where a divider should be inserted.
 */
export function checkAmbiguousGrouping(tokens: Tokens, _format?: Format) {
  if (tokens.includes(SYMBOLS.DIVIDER)) {
    return pipesResult(tokens, false);
  }

  const simple = simpler(tokens);

  // 3-5 numbers after or before a single bearing indicator BNNN, NNNB
  const ambiguous = /^(?:(?:BN{3,5})|(?:N{3,5}B))$/.test(simple);
  // 3-5 numbers between 2 bearings indicators BNNNB
  const bookends = /^BN{3,5}B$/.test(simple);
  // "helpful" indicators:
  //   1. degrees number in the right-of-divider position e.g. # #°
  //   2. seconds number in the left-of-divider position e.g. # #" #
  //   3. trailing bearings in the left-of-divider position e.g. # N #
  //   4. leading bearings in the right-of-divider position e.g. N # E #
  const helpful = tokens
    // helpful tokens are only helpful in the middle of the token list
    // not the beginning or end of the list
    .slice(1, -1)
    .reduce((acc, t) => {
      const helps =
        t.includes(SYMBOLS.DEGREES) ||
        t.includes(SYMBOLS.SECONDS) ||
        SYMBOL_PATTERNS.NSEW.test(t);

      return `${acc}${helps ? 'H' : '_'}`;
    }, '')
    .includes('H');
  // 3-5 numbers with no bearings indicators, and no helpful indicators
  const hopeless = /^N{3,5}$/.test(simple) && !helpful;

  return pipesResult(tokens, ambiguous || bookends || hopeless);
}
