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

import { SYMBOL_PATTERNS, SYMBOLS } from '..';
import type { Tokens } from '../lexer';

const GENOME_PATTERN =
  /^(B?)([DN]?[MN]?[SN]?)(B?)(?:B?)([DN]?[MN]?[SN]?)(?:B?)$/;

/**
 * Get the position (index) of where to insert a divider into the token list;
 * basically, the count of numeric components (left-of-divider position) plus
 * 1 if there is a bearing identifier (left-of-divider).
 */
function dividerIndexer(_full: string, ...args: string[]) {
  const [bearing1 = '', number1, bearing2 = '', number2] = args;

  // if no numeric values exist there no way to infer a location to insert a divider
  if (!(number1?.length && number2?.length)) {
    return '0';
  }

  return `${number1.length + (bearing1.length || bearing2.length)}`;
}

/**
 * The genome sequence is a simplification of the tokens list:
 *
 *   - B = bearings (NSEW)
 *   - D = degrees (number with degree character following)
 *   - M = minutes (number with minutes character following)
 *   - S = seconds (number with seconds character following)
 *   - N = number (no identifying character following)
 *   - X = for unmatched token types
 */
function genomeSequencer(acc: string, t: string) {
  if (t.includes(SYMBOLS.DEGREES)) {
    return `${acc}D`;
  }

  if (t.includes(SYMBOLS.MINUTES)) {
    return `${acc}M`;
  }

  if (t.includes(SYMBOLS.SECONDS)) {
    return `${acc}S`;
  }

  if (SYMBOL_PATTERNS.NSEW.test(t)) {
    return `${acc}B`;
  }

  if (/\d/.test(t)) {
    return `${acc}N`;
  }

  return `${acc}X`;
}

/**
 * Use the "genome" sequence of the token list to find the index for inserting
 * a missing divider token.
 */
export function getGenomeIndex(tokens: Tokens) {
  const seq = tokens.reduce(genomeSequencer, '');

  return GENOME_PATTERN.test(seq)
    ? Number.parseInt(seq.replace(GENOME_PATTERN, dividerIndexer), 10)
    : 0;
}
