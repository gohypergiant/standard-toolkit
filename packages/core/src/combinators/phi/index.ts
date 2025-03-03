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
 * Bird: `Phoenix`
 *
 * Signature: (Big) Phi :: (a → b → c) → (d → a) → (d → b) → d → c
 *
 * Lambda: λabcd.a(bd)(cd)
 *
 * @example
 * Phi((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
 * // 19
 */
export const Phi =
  <A, B, C>(a: (x: A) => (y: B) => C) =>
  <D>(b: (x: D) => A) =>
  (c: (x: D) => B) =>
  (d: D) =>
    a(b(d))(c(d));

/**
 * {@inheritDoc Phi}
 */
export const fork = Phi;
