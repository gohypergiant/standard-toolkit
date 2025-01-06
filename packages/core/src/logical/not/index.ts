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
 * Logical `(!a)`
 *
 * Logical Not (Negation)
 *
 * @see https://en.wikipedia.org/wiki/Negation
 *
 * @example
 * not(2);
 * // false
 */
export const not = <T>(x: T) => !x;

/**
 * Logical `(!a(b))`
 *
 * Logical (Function Result) Not (Negation)
 *
 * @see https://en.wikipedia.org/wiki/Negation
 *
 * @example
 * notFn(x => x & 1)(4);
 * // true
 */
export const notFn =
  <T>(a: (x: T) => unknown) =>
  (b: T) =>
    !a(b);
