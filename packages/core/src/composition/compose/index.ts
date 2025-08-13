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

/**
 * Defines the valid shapes for function arrays that can be composed.
 *
 * This union type represents two possible compositions:
 * 1. An array with zero or more unary functions followed by one n-ary function
 * 2. A single n-ary function
 *
 * The `readonly` modifier ensures immutability and enables better type inference
 * with rest/spread patterns. The `...UnaryFunction[]` spread allows for any number
 * of unary functions to precede the final n-ary function.
 */
type CompositionArray =
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [...UnaryFunction[], (...args: any[]) => any]
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => any];

/**
 * Extracts the parameter types of the rightmost (last) function in a composition array.
 *
 * This type uses conditional type inference with `infer` to:
 * 1. Pattern match against `readonly [...unknown[], infer Last]` to capture the last element
 * 2. Check if `Last` is a function and extract its parameters with `infer P`
 * 3. Return the parameter tuple type `P`, or `never` if extraction fails
 *
 * The `...unknown[]` spread matches any prefix elements without caring about their types,
 * focusing only on the last element. This follows right-to-left composition semantics
 * where the rightmost function receives the initial arguments.
 *
 * Example:
 * ComposeParams<[(x: string) => number, (a: boolean, b: string) => string]>
 * // Result: [a: boolean, b: string]
 */
type ComposeParams<Fns extends CompositionArray> = Fns extends readonly [
  ...unknown[],
  infer Last,
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    Last extends (...args: infer P) => any
    ? P
    : never
  : never;

/**
 * Extracts the return type of the leftmost (first) function in a composition array.
 *
 * This type mirrors ComposeParams but focuses on the first element:
 * 1. Pattern match against `readonly [infer First, ...unknown[]]` to capture the first element
 * 2. Check if `First` is a function and extract its return type with `infer R`
 * 3. Return the return type `R`, or `never` if extraction fails
 *
 * The `...unknown[]` spread ignores all elements after the first. This follows
 * composition semantics where the leftmost function's return type becomes the
 * overall composition's return type.
 *
 * Example:
 * ComposeReturn<[(x: string) => number, (a: boolean) => string]>
 * // Result: number
 */
type ComposeReturn<Fns extends CompositionArray> = Fns extends readonly [
  infer First,
  ...unknown[],
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    First extends (...args: any[]) => infer R
    ? R
    : never
  : never;

/**
 * Validates and transforms a function array to ensure valid composition structure.
 *
 * This recursive conditional type enforces that:
 * 1. Base case: A single function (of any arity) is always valid
 * 2. Recursive case: The first function must be unary, and the rest must form a valid composition
 *
 * The constraint system works as follows:
 * - `infer First extends UnaryFunction` ensures the first function is unary
 * - `infer Rest extends CompositionArray` ensures the remaining functions form a valid composition
 * - `readonly [First, ...Composable<Rest>]` recursively validates the tail
 *
 * This prevents invalid compositions like having non-unary functions in non-terminal positions,
 * which would break the composition chain since intermediate functions can only receive one argument.
 *
 * Example transformations:
 * Composable<[(x: number) => string]>
 * // Result: [(x: number) => string]
 *
 * Composable<[(x: string) => number, (a: boolean, b: string) => string]>
 * // Result: [(x: string) => number, (a: boolean, b: string) => string]
 *
 * Invalid example (would result in `never`):
 * Composable<[(a: string, b: number) => boolean, (x: boolean) => string]>
 * // Error: First function is not unary
 */
type Composable<Fn extends CompositionArray> = Fn extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  (...args: any[]) => any,
]
  ? Fn // Base case: single function (can be n-ary)
  : Fn extends readonly [
        infer First extends UnaryFunction,
        ...infer Rest extends CompositionArray,
      ]
    ? readonly [First, ...Composable<Rest>]
    : never;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a right-to-left call order.
 *
 * @template Fns - The list of unary functions.
 * @param fns - The functions to compose.
 * @param args - The arguments to give to the first function in the composition.
 *
 * @remarks
 * The implementation follows right-to-left composition semantics:
 * 1. The rightmost function is applied first to the input arguments
 * 2. Each subsequent function (moving left) receives the result of the previous function
 * 3. The leftmost function's result becomes the final output
 *
 * @example
 * const getActiveUsers = compose(
 *   displayPage,
 *   sortUserNames,
 *   filterActive,
 * );
 *
 * const activeUsers = getActiveUsersByPage(users);
 */
export const compose =
  <Fns extends CompositionArray>(...fns: Composable<Fns>) =>
  (...args: ComposeParams<Fns>): ComposeReturn<Fns> => {
    if (fns.length === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      return (fns[0] as any)(...(args as any[])) as ComposeReturn<Fns>;
    }

    const [lastFn, ...restFns] = [...fns].reverse();
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    const initial = (lastFn as any)(...(args as any[]));

    return restFns.reduce((acc, fn) => fn(acc), initial) as ComposeReturn<Fns>;
  };
