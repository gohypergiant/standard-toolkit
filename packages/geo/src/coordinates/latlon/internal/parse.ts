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

import type { Errors, Format } from '.';
import { type Tokens, lexer } from './lexer';
import { pipesRunner } from './pipes';
import { violation } from './violation';

export type ParseResults = [Tokens, Errors];

/**
 * Parse a raw input string into a validated and normalized coordinate
 * primitive ready for further refinement/validation by a more specific parser.
 *
 * @param input
 * raw input, from a user or external system, of unknown validity
 *
 * @param format
 * the expected format - LATLON or LONLAT - the coordinate should conform to
 *
 * @returns
 * tuple with two values: tokens, and errors
 *
 * @pure
 *
 * @example
 * const input = '1 2 3 / 4 5 6'
 * parse(input); // [['1', '2', '3', '/', '4', '5', '6'], []]
 *
 * @description
 * __Assumptions/Specification__
 * 1. Decimals are indicated by a "." and not ","
 * 2. A degrees indicator is "°"
 * 3. A minutes indicator is "'"
 * 4. A seconds indicator is '"'
 * 5. Each indicator is expected to follow the number it is annotating
 * 6. Numeric parts - degrees, minutes, and seconds - are positional and can
 *    not be arranged in alternative orders and be considered valid
 * 7. Output will have explicit bearings characters (NSEW) and not rely on
 *    positive and negative values; when bearings are available. Negative
 *    values will only be replaced with absolute values if bearings are available.
 *
 */
export function parse(input: string, format?: Format): ParseResults {
  if (!input?.length) {
    return [[], [violation('No input.')]];
  }

  const [tokens, errors] = pipesRunner(lexer(input), format);

  return [tokens, errors?.length ? errors.map(violation) : []];
}
