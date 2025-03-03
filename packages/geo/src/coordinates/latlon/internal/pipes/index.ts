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

import { type Format, SYMBOL_PATTERNS } from '..';
import type { Tokens } from '../lexer';

import { checkAmbiguousGrouping } from './check-ambiguous';
import { checkNumberValues } from './check-numbers';
import { fixBearings } from './fix-bearings';
import { fixDivider } from './fix-dividers';

type Pipe = (t: Tokens, f?: Format) => [Tokens, boolean | string];

export type PipeResult = ReturnType<Pipe>;

/** Make a RegExp global. */
const makeGlobal = (k: keyof typeof SYMBOL_PATTERNS) =>
  new RegExp(SYMBOL_PATTERNS[k], 'g');

/**
 * Consistently create a PipesResult array to return. Use this instead of
 * casting to PipesResult everywhere.
 *
 * @param e true = has error, false = no error
 *
 * @remarks
 * pure function
 */
export const pipesResult = (t: Tokens, e: boolean | string): PipeResult => [
  // if there are errors do NOT return the tokens
  e ? [] : t,
  e,
];

/** Check if there are more than 2 of something. */
const tooMany = (p: RegExp) => (t: Tokens) =>
  pipesResult(t, (t.join('').match(p) ?? []).length > 2);

const pipes: [string, Pipe][] = [
  // Unrecoverable violations
  ['Too many bearings.', tooMany(makeGlobal('NSEW'))],
  ['Too many numeric signs.', tooMany(/[-+]/g)],
  ['Too many degrees indicators.', tooMany(makeGlobal('DEGREES'))],
  ['Too many minutes indicators.', tooMany(makeGlobal('MINUTES'))],
  ['Too many seconds indicators.', tooMany(makeGlobal('SECONDS'))],
  ['Number values checks.', checkNumberValues],
  ['Ambiguous grouping of numbers with no divider.', checkAmbiguousGrouping],

  // fix values and formatting to be consistent
  ['Unable to identify latitude from longitude.', fixDivider],
  ['Unable to identify bearings.', fixBearings],
];

/**
 * Run the tokens through a preset pipeline of violations checks exiting the
 * process as early as possible when violations are found because violations
 * will make further violations checks less accurate and could return inaccurate
 * violations that could be misleading or hide the most important violation
 */
export function pipesRunner(
  tokens: Tokens,
  format?: Format,
): [Tokens, string[]] {
  let copy = tokens.slice(0);
  let error: PipeResult[1] = false;
  const errors = [] as string[];

  for (const [message, op] of pipes) {
    [copy, error] = op(copy, format);

    if (error) {
      // accumulate the "errors" because if tokens are returned
      // the errors are only warnings and are recoverable
      errors.push(error === true ? message : error);

      if (!copy.length) {
        return [copy, [error === true ? message : error]];
      }
    }
  }

  return [copy, errors];
}
