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
 *
 * Signature: `A :: (a → b) → a → b`
 *
 * Lambda: `λab.ab`
 *
 * @example
 * A((a) => a + 6)(3);
 * // 9
 */
export const A =
  // Types renamed to avoid confusion with the combinator
    <T, R>(f: (x: T) => R) =>
    (x: T) =>
      f(x);

/**
 * {@inheritDoc A}
 */
export const apply = A;
