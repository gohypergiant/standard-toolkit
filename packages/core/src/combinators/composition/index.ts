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
 * Pass a value to a function and then the result to another function.
 * @param f The second function in the composition.
 * @param g The first function in the composition.
 * @param x The value to pass to `g`.
 *
 * @remark
 * B combinator
 *
 * @remark
 * `composition :: (a → b) → (c → a) → c → b`
 *
 * @remark
 * `λabc.a(bc)`
 *
 * @remark
 * pure function
 *
 * @example
 * composition((x) => x + 8)((x) => x * 3)(4);
 * // 20
 */
export const composition =
  <A, B>(f: (z: A) => B) =>
  <C>(g: (y: C) => A) =>
  (x: C) =>
    f(g(x));
