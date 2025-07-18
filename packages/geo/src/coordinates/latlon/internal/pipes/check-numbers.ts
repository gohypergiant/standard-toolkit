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

import { pipesResult } from '../pipes';
import { simpler } from './simpler';
import type { Tokens } from '../lexer';

/**
 * Check for problems in the numeric values.
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

  return pipesResult(tokens, false);
}
