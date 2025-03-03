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

import { not } from '../not';
import { or, orFn } from '../or';

/**
 * Logical `!(a || b)`
 *
 * Logical Non-disjunction
 *
 * @see https://en.wikipedia.org/wiki/Logical_NOR
 *
 * @remarks
 * pure function
 *
 * @example
 * nor(true)(0);
 * // false
 */
export const nor =
  <A>(a: A) =>
  <B>(b: B) =>
    not(or(a)(b));

/**
 * Logical `!(a(x) || b(x))`
 *
 * Logical (Function Result) Non-disjunction
 *
 * @see https://en.wikipedia.org/wiki/Logical_NOR
 *
 * @remarks
 * pure function
 *
 * @example
 * norFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // false
 */
export const norFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    not(orFn(a)(b)(c));
