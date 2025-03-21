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

/**
 * Logical `(a === b)`. Logical Equality (XNOR)
 * @param a The first value to compare.
 * @param b The second value to compare.
 *
 * @see https://en.wikipedia.org/wiki/Logical_equality
 * @see https://en.wikipedia.org/wiki/Logical_biconditional
 *
 * @remarks
 * pure function
 *
 * @example
 * equality(4)(8);
 * // false
 */
export const equality = (a: unknown) => (b: unknown) => a === b;

/**
 * Logical `(a(x) === b(x))`. Logical (Function Result) Equality (XNOR)
 * @param a The first function to compare the return of.
 * @param b The second function to compare the return of.
 * @param c The value to pass to both `a` and `b`.
 *
 * @see https://en.wikipedia.org/wiki/Logical_equality
 * @see https://en.wikipedia.org/wiki/Logical_biconditional
 *
 * @remarks
 * pure function
 *
 * @example
 * equalityFn(x => x % 2)(x => x % 3)(6);
 * // true
 */
export const equalityFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T) =>
    a(c) === b(c);
