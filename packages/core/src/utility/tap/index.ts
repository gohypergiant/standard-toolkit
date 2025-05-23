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
 * Calls the given function with the passed value and returns the value unchanged.
 *
 * @template T - The type of the input given to the function.
 * @template R - The return type of the given function.
 * @param fn - The function to call, passing the given value.
 * @param val - The value to pass to the function and then return.
 *
 * @remarks
 * tap :: (a -> b) -> a -> a
 *
 * @example
 * tap(console.log)('foobar');
 * // foobar
 */
export const tap =
  <T, R>(fn: (v: T) => R) =>
  (val: T) => {
    fn(val);

    return val;
  };
