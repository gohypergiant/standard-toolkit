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
 * Corresponds to the encoding of `false` in the lambda calculus.
 * Takes two arguments and always returns the second.
 * Inverse of `constant` (`K`).
 * @param a The value to ignore.
 * @param b The value to return.
 *
 * @remark
 * KI combinator
 *
 * @remark
 * `inverseConstant :: a → b → b`
 *
 * @remark
 * `λab.b`
 *
 * @remark
 * pure function
 *
 * @example
 * inverseConstant(1)(2);
 * // 2
 */
export const inverseConstant =
  <A>(_: A) =>
  <B>(b: B): B =>
    b;
