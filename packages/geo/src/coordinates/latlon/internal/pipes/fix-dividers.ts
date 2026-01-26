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

import { type Format, SYMBOLS } from '..';
import { getGenomeIndex } from './genome';
import { simpler } from './simpler';
import type { Tokens } from '../lexer';
import type { PipeResult } from '../pipes';

// N = number
// B = bearing
const SIMPLER_PATTERNS = {
  NN: 1,
  NNB: 1,
  BNNB: 2,
  BNN: 2,
};

/**
 * Inserts a divider token at the specified index in the tokens array.
 *
 * @param tokens - Array of coordinate tokens without a divider.
 * @param index - Position where the divider should be inserted.
 * @returns Pipe result with divider inserted and error=false.
 *
 * @example
 * insertDivider(['45', '30', 'N', '122', '15', 'W'], 3);
 * // [['45', '30', 'N', '/', '122', '15', 'W'], false]
 */
const insertDivider = (tokens: Tokens, index: number): PipeResult => [
  [...tokens.slice(0, index), SYMBOLS.DIVIDER, ...tokens.slice(index)],
  false,
];

/**
 * For tokens lists without a divider, `fixDivider` attempts to determine the
 * __safe__ location to add a divider based on the existing formatting of the
 * coordinate: numbers, number positions, and number indicators.
 *
 * @param original - Array of coordinate tokens without a divider.
 * @param _format - Optional coordinate format (LATLON or LONLAT), currently unused.
 * @returns Pipe result with divider inserted, or error=true if no safe location found.
 *
 * @example
 * fixDivider(['45°', '30'', 'N', '122°', '15'', 'W']);
 * // Returns tokens with divider inserted between latitude and longitude
 *
 * @example
 * fixDivider(['45', '30', 'N']);
 * // Returns error=true (cannot safely determine divider position)
 *
 * @remarks
 * pure function
 */
export function fixDivider(original: Tokens, _format?: Format): PipeResult {
  // if there is already a divider then there is nothing to do
  if (original.includes(SYMBOLS.DIVIDER)) {
    return [original, false];
  }

  // disconnect from argument memory space so we aren't working on shared memory
  const tokens = original.slice(0);

  const genomeIndex = getGenomeIndex(tokens);

  if (genomeIndex) {
    return insertDivider(tokens, genomeIndex);
  }

  const simple = simpler(tokens) as keyof typeof SIMPLER_PATTERNS;

  if (SIMPLER_PATTERNS[simple]) {
    return insertDivider(tokens, SIMPLER_PATTERNS[simple]);
  }

  // no position is found to be a safe location to insert a divider; any placement
  // would be a guess and therefor only has a 50% chance of being wrong or right
  return [[], true];
}
