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
 * Pass a value through two different functions and the results to a function that takes two arguments.
 *
 * @template A - The type of the first input to the binary function. Corresponds to the return type of the first function.
 * @template B - The type of the second input to the binary function. Corresponds to the return type of the second function.
 * @template C - The return type of the binary function.
 * @template D - The type of the input value.
 * @param a - The final curried, binary function that receives the results from `b` and `c`.
 * @param b - The first function to pass the value to.
 * @param c - The second function to pass the value to.
 * @param d - The value to pass to `b` and `c`.
 *
 * @remarks
 * Phi combinator
 *
 * `λabcd.a(bd)(cd)`
 *
 * 'fork :: (a → b → c) → (d → a) → (d → b) → d → c'
 *
 * pure function
 *
 * @example
 * fork((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
 * // 19
 */
export const fork =
  <A, B, C>(a: (x: A) => (y: B) => C) =>
  <D>(b: (x: D) => A) =>
  (c: (x: D) => B) =>
  (d: D) =>
    a(b(d))(c(d));
