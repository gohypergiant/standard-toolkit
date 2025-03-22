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
 * Nullish Coalescing `(a ?? b)`.
 *
 * @param a The possible null value.
 * @param b The value to fallback to.
 *
 * @remark
 * pure function
 *
 * @example
 * nullishOr(null)(4);
 * // 4
 */
export const nullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    a ?? b;

/**
 * Nullish Coalescing `(a(x) ?? b(x))`.
 *
 * @param a The function to get the, possibly null, return of.
 * @param b The function to get the fallback return of.
 * @param c The value to pass to both `a` and `b`.
 *
 * @remark
 * pure function
 *
 * @example
 * nullishOrFn(x => x.foo)(x => x.bar)({ bar: 4 });
 * // 4
 */
export const nullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    a(c) ?? b(c);

/**
 * Swapped Nullish Coalescing `(b ?? a)`.
 *
 * @param a The value to fallback to.
 * @param b The possible null value.
 *
 * @remark
 * pure function
 *
 * @example
 * swappedNullishOr(4)(null);
 * // 4
 */
export const swappedNullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    b ?? a;

/**
 * Swapped Nullish Coalescing `(b(x) ?? a(x))`.
 *
 * @param a The function to get the fallback return of.
 * @param b The function to get the, possibly null, return of.
 * @param c The value to pass to both `a` and `b`.
 *
 * @remark
 * pure function
 *
 * @example
 * swappedNullishOrFn(x => x.bar)(x => x.foo)({ bar: 4 });
 * // 4
 */
export const swappedNullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    b(c) ?? a(c);
