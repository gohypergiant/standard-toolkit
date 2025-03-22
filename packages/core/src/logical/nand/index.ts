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

import { and, andFn } from '../and';
import { not } from '../not';

/**
 * Logical Non-conjunction `!(a && b)`.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 *
 * @see https://en.wikipedia.org/wiki/Sheffer_stroke
 *
 * @remarks
 * pure function
 *
 * @example
 * nand(true)(0);
 * // true
 */
export const nand =
  <A>(a: A) =>
  <B>(b: B) =>
    not(and(a)(b));

/**
 * Logical (Function Result) Non-conjunction `!(a(x) && b(x))`.
 *
 * @param a The first function to compare the return of.
 * @param b The second function to compare the return of.
 * @param c The value to pass to both `a` and `b`.
 *
 * @see https://en.wikipedia.org/wiki/Sheffer_stroke
 *
 * @remarks
 * pure function
 *
 * @example
 * nandFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // false
 */
export const nandFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    not(andFn(a)(b)(c));
