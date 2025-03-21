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

/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/type-challenges/type-challenges/issues/15988

export type Curried<T extends unknown[], R> = <P extends Partial<T>>(
  ...args: P
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
) => ((...args: T) => any) extends (...args: [...P, ...infer Args]) => any
  ? Args extends []
    ? R
    : Curried<Args, R>
  : never;

/**
 * Curries the given function. Allowing it to accept one or more arguments at a time.
 *
 * @param fn The function to convert to a curried version of.
 *
 * @remark
 * pure function
 *
 * @example
 * const curried = autoCurry((a, b, c) => (a + b) * c);
 * curried(2)(3)(4);
 * curried(2, 3)(4);
 * curried(2)(3, 4);
 * curried(2, 3, 4);
 */
// biome-ignore lint/suspicious/noExplicitAny: This is intended
export function autoCurry<T extends (...args: any[]) => any>(
  fn: T,
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  _args = [] as any[],
): Curried<Parameters<T>, ReturnType<T>> {
  return (...__args) =>
    ((rest) => (rest.length >= fn.length ? fn(...rest) : autoCurry(fn, rest)))([
      ..._args,
      ...__args,
    ]);
}
