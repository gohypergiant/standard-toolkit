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

import type { MapFn } from '@/types';

/**
 * Maps over the given array, calling the mapping function for each element.
 * Returns a new array of the results.
 *
 * @template T - The type of array elements.
 * @template R - The return type of the mapping function.
 * @param map - The mapping function to apply to each element of the array.
 * @param arr - The array to map over.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { map } from '@accelint/core';
 *
 * map(x => x * 2)([1, 2, 3, 4, 5]);
 * // [2, 4, 6, 8, 10]
 */
export const map =
  <T, R>(map: MapFn<T, R>) =>
  (arr: T[]) => {
    const len = arr.length;
    const res = new Array<R>(len);

    for (let i = 0; i < len; i++) {
      res[i] = map(arr[i] as T, i);
    }

    return res;
  };
