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
 * Returns a tuple containing the first element (head) of the given array and
 * the remaining elements of the array (tail).
 *
 * @template T - The type of array elements.
 * @param arr - The element to get the `head`/`tail` of.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { shift } from '@accelint/core';
 *
 * shift([1, 2, 3, 4]);
 * // [1, [2, 3, 4, 5]]
 */
export const shift = <T>(arr: T[]): [T, T[]] => {
  const len = arr.length;
  const tail = new Array<T>(len - 1);

  const head = arr[0] as T;

  for (let i = 1; i < len; i++) {
    tail[i - 1] = arr[i] as T;
  }

  return [head, tail];
};
