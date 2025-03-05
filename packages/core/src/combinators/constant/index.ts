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
 * Corresponds to the encoding of `true` in the lambda calculus.
 * Takes two arguments and always returns the first.
 * @param a The value to return.
 * @param b The value to ignore.
 *
 * @remark
 * K combinator
 *
 * @remark
 * `constant :: a → b → a`
 *
 * @remark
 * `λab.a`
 *
 * @remark
 * pure function
 *
 * @example
 * constant(1)(2);
 * // 1
 */
export const constant =
  <A>(a: A) =>
  <B>(_: B): A =>
    a;
