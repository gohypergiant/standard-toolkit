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
 * Logical `(!a)`. Logical Not (Negation)
 * @param x The value to negate.
 *
 * @see https://en.wikipedia.org/wiki/Negation
 *
 * @remarks
 * pure function
 *
 * @example
 * not(2);
 * // false
 */
export const not = <T>(x: T) => !x;

/**
 * Logical `(!a(b))`. Logical (Function Result) Not (Negation)
 * @param a The function to negate the return of.
 * @param b The value to pass to the given function.
 *
 * @see https://en.wikipedia.org/wiki/Negation
 *
 * @remarks
 * pure function
 *
 * @example
 * notFn(x => x & 1)(4);
 * // true
 */
export const notFn =
  <T>(a: (x: T) => unknown) =>
  (b: T) =>
    !a(b);
