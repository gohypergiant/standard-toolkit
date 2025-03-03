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
 * Logical `(a && b)`
 *
 * Logical Conjunction
 *
 * @see https://en.wikipedia.org/wiki/Logical_conjunction
 *
 * @remarks
 * pure function
 *
 * @playground
 * import { and } from '@accelint/core';
 *
 * console.log(and(true)(0));
 * // false
 *
 * console.log(and(true)(1));
 * // true
 */
export const and =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(a) && Boolean(b);

/**
 * Logical `(a(x) && b(x))`
 *
 * Logical (Function Result) Conjunction
 *
 * @see https://en.wikipedia.org/wiki/Logical_conjunction
 *
 * @remarks
 * pure function
 *
 * @playground
 * import { andFn } from '@accelint/core';
 *
 * console.log(andFn((x) => x > 0)((x) => x < 10)(5));
 * // true
 */
export const andFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(a(c)) && Boolean(b(c));
