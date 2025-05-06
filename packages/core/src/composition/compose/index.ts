/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UnaryFunction } from '@/types';

// https://stackoverflow.com/questions/49310886/typing-compose-function-in-typescript-flow-compose#answer-73082627

// If its a list of functions, last being Unary
type ComposeParams<Fns> = Fns extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  ...any[],
  infer Last extends UnaryFunction,
]
  ? // Get Params of the last, which returns [...argTypes], so get the first one [0]
    // so that we have the true type of the arg
    Parameters<Last>[0]
  : never;

// Get the return type of the first function in the list (final func to be called)
type ComposeReturn<Fns extends readonly UnaryFunction[]> = ReturnType<Fns[0]>;

type Composable<Fn> =
  // If it's a single func, just return it
  Fn extends readonly [UnaryFunction]
    ? Fn
    : // if its a list of Unary funcs (ignoring the first)
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      Fn extends readonly [any, ...infer Rest extends readonly UnaryFunction[]]
      ? // Start building the list of func type by using the return type of the first in Rest
        // as the arg of the next in line and recursively spread the rest (doing the same thing)
        // The first is ignored but handled by the top level ComposeReturn
        // biome-ignore lint/suspicious/noExplicitAny: This is intended
        readonly [(arg: ComposeReturn<Rest>) => any, ...Composable<Rest>]
      : never;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a right-to-left call order.
 *
 * @template Fns - The list of unary functions.
 * @param fns - The functions to compose.
 * @param arg - The argument to give to the first function in the composition.
 *
 * @remarks
 * pure function
 *
 * @example
 * const getActiveUsers = page => compose(
 *   displayPage,
 *   sortUserNames,
 *   filterActive,
 * );
 *
 * const activeUsers = getActiveUsersByPage(users);
 */
export const compose =
  <Fns extends readonly UnaryFunction[]>(...fns: Composable<Fns>) =>
  (arg: ComposeParams<Fns>): ComposeReturn<Fns> => {
    return fns.reduceRight((acc, cur) => cur(acc), arg) as ComposeReturn<Fns>;
  };
