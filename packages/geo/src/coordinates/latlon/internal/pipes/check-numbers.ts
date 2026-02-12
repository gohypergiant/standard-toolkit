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

import { SYMBOLS } from '..';
import { pipesResult } from '../pipes';
import { simpler } from './simpler';
import type { Tokens } from '../lexer';

/**
 * Check for problems in the numeric values.
 *
 * Validates that there are at least 2 numbers, no more than 6 numbers total,
 * and that negative values only appear in the first position (degrees).
 *
 * @param tokens - Array of parsed coordinate tokens.
 * @returns Pipe result with tokens and error message (or false if valid).
 *
 * @example
 * ```typescript
 * checkNumberValues(['45', '30']);
 * // Returns tokens with error=false (valid number count)
 * ```
 *
 * @example
 * ```typescript
 * checkNumberValues(['45']);
 * // Returns error: 'Too few numbers.'
 * ```
 *
 * @example
 * ```typescript
 * checkNumberValues(['1', '2', '3', '4', '5', '6', '7']);
 * // Returns error: 'Too many numbers.'
 * ```
 */
export function checkNumberValues(tokens: Tokens) {
  const simple = simpler(tokens);

  if ((simple.match(/N/g) ?? []).length < 2) {
    return pipesResult(tokens, 'Too few numbers.');
  }

  const error =
    // 4 consecutive numbers in specific formation is not going to be valid
    /(?:N{4,}BN+)|(?:N+BN{4,})/.test(simple) ||
    // more than 6 numbers total
    (simple.match(/N/g) ?? []).length > 6;

  if (error) {
    return pipesResult(tokens, 'Too many numbers.');
  }

  const pattern = tokens
    .reduce((acc, t) => {
      if (/\d/.test(t)) {
        acc.push(Number.parseFloat(t) < 0 ? '-' : '+');
      } else {
        acc.push('_');
      }

      return acc;
    }, [] as string[])
    .join('');

  const matches = pattern.match(/[^_]-./);

  // special case '_--_' when the input is something like 'S -1 -1 W'
  // which is invalid for other reasons and will be caught elsewhere
  if (!!matches && pattern !== '_--_') {
    return pipesResult(tokens, 'Negative value for non-degrees value found.');
  }

  if (tokens.includes(SYMBOLS.DIVIDER)) {
    const divIdx = tokens.indexOf(SYMBOLS.DIVIDER);
    const halves = [tokens.slice(0, divIdx), tokens.slice(divIdx + 1)];

    for (const half of halves) {
      const nums = half.filter((t) => /\d/.test(t));

      if (
        nums.length > 1 &&
        nums.some((n, i) => i > 0 && Number.parseFloat(n) < 0)
      ) {
        return pipesResult(
          tokens,
          'Negative value for non-degrees value found.',
        );
      }
    }
  }

  return pipesResult(tokens, false);
}
