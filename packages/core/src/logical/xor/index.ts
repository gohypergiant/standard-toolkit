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
 * Logical Exclusive Disjunction `(a ^ b)`.
 *
 * @param a - The first value in the bitwise XOR.
 * @param b - The second value in the bitwise XOR.
 *
 * @see https://en.wikipedia.org/wiki/Exclusive_or
 *
 * @remarks
 * pure function
 *
 * @example
 * xor(true)(0);
 * // true
 */
export const xor = (a: unknown) => (b: unknown) =>
  Boolean((a ? 1 : 0) ^ (b ? 1 : 0));

/**
 * Logical Exclusive (Function Result) Disjunction `(a(x) ^ b(x))`.
 *
 * @template T - The type of the input value of the functions.
 * @param a - The first function to bitwise XOR the return of.
 * @param b - The second function to bitwise XOR the return of.
 * @param c - The value to pass to both `a` and `b`.
 *
 * @see https://en.wikipedia.org/wiki/Exclusive_or
 *
 * @remarks
 * pure function
 *
 * @example
 * xorFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // false
 */
export const xorFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T) =>
    Boolean((a(c) ? 1 : 0) ^ (b(c) ? 1 : 0));
