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
 * Takes an unary function and applies it to the given argument.
 * @param f The function to apply to the value.
 * @param x The value to pass to the function.
 *
 * @remark
 * A combinator
 *
 * @remark
 * `apply :: (a → b) → a → b`
 *
 * @remark
 * `λab.ab`
 *
 * @remark
 * pure function
 *
 * @example
 * apply((a) => a + 6)(3);
 * // 9
 */
export const apply =
  // Types renamed to avoid confusion with the combinator
    <T, R>(f: (x: T) => R) =>
    (x: T) =>
      f(x);
