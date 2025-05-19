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

// If its a list of functions, last being Unary
type PipeParams<Fns> = Fns extends readonly [
  infer First extends UnaryFunction,
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  ...any[],
]
  ? // Get Params of the first, which returns [...argTypes], so get the first one [0]
    // so that we have the true type of the arg
    Parameters<First>[0]
  : never;

// Get the return type of the last function in the list (last to be called)
// have to spread and infer last so that it gets the right type for the last one
// [-1] no bueno
type PipeReturn<Fns> = ReturnType<
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  Fns extends readonly [...any[], infer Last extends UnaryFunction]
    ? Last
    : never
>;

type Pipeable<Fn> =
  // If it's a single func, just return it
  Fn extends readonly [UnaryFunction]
    ? Fn
    : // if its a list of Unary funcs (ignoring the last)
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      Fn extends readonly [...infer Head extends readonly UnaryFunction[], any]
      ? // Start building the list of func type by using the return type of the last in Head
        // as the arg of the previous in line and recursively spread the rest (doing the same thing)
        // The last is ignored but handled by the top level FlowReturn
        // biome-ignore lint/suspicious/noExplicitAny: This is intended
        readonly [...Pipeable<Head>, (arg: PipeReturn<Head>) => any]
      : never;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a left-to-right call order.
 *
 * @template Fns - The list of unary functions.
 * @param fns - The functions to pipe.
 * @param arg - The argument to give to the first function in the pipe.
 *
 * @remarks
 * pure function
 *
 * @example
 * const getActiveUsers = page => pipe(
 *   filterActive,
 *   sortUserNames,
 *   displayPage,
 * );
 *
 * const activeUsers = getActiveUsersByPage(users);
 */
export const pipe =
  <Fns extends readonly UnaryFunction[]>(...fns: Pipeable<Fns>) =>
  (arg: PipeParams<Fns>): PipeReturn<Fns> => {
    return fns.reduce((acc, cur) => cur(acc), arg) as PipeReturn<Fns>;
  };
