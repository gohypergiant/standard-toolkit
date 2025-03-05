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
 * Takes an argument and an unary function and then applies the function to the argument.
 * Inverse of `apply` (`A`)
 * @param a The value to pass to the function.
 * @param b The function to apply to the value.
 *
 * @remark
 * Th combinator
 *
 * @remark
 * `applyTo :: a → (a → b) → b`
 *
 * @remark
 * `λab.ba`
 *
 * @remarks
 * pure function
 *
 * @example
 * applyTo(6)(x => x * 2);
 * // 12
 */
export const applyTo =
  <A>(a: A) =>
  <B>(b: (x: A) => B) =>
    b(a);
