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
 * Logical Disjunction `(a || b)`.
 *
 * @template A - The type of the first input value.
 * @template B - The type of the second input value.
 * @param a - The possible falsey value.
 * @param b - The value to fallback to.
 *
 * @see https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @remarks
 * pure function
 *
 * @example
 * or(true)(0);
 * // true
 */
export const or =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(a) || Boolean(b);

/**
 * Logical (Function Result) Disjunction `(a(x) || b(x))`.
 *
 * @template T - The type of the input value of the functions.
 * @template A - The return type of the first function.
 * @template B - The return type of the second function.
 * @param a - The function to get the, possibly falsey, return of.
 * @param b - The function to get the fallback return of.
 * @param c - The value to pass to both `a` and `b`.
 *
 * @see https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @remarks
 * pure function
 *
 * @example
 * orFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // true
 */
export const orFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(a(c)) || Boolean(b(c));

/**
 * Swapped Logical Disjunction: `(b || a)`.
 *
 * @template A - The type of the first input value.
 * @template B - The type of the second input value.
 * @param a - The value to fallback to.
 * @param b - The possible falsey value.
 *
 * @see https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @remarks
 * pure function
 *
 * @example
 * swappedOr(0)(true);
 * // true
 */
export const swappedOr =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(b) || Boolean(a);

/**
 * Swapped Logical (Function Result) Disjunction: `(b(x) || a(x))`.
 *
 * @template T - The type of the input value of the functions.
 * @template A - The return type of the first function.
 * @template B - The return type of the second function.
 * @param a - The function to get the fallback return of.
 * @param b - The function to get the, possibly falsey, return of.
 * @param c - The value to pass to both `a` and `b`.
 *
 * @see https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @remarks
 * pure function
 *
 * @example
 * swappedOrFn(s => s.trimEnd())(s => s.trim())('foo bar ');
 * // true
 */
export const swappedOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(b(c)) || Boolean(a(c));
