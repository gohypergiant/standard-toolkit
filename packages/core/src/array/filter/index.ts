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

import type { Predicate } from '@/types';

/**
 * Returns a copy of the given array of elements that satisfy the predicate.
 *
 * @param predicate A predicate function to apply to each element of the array.
 * @param arr The array to filter on based on the predicate.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { filter } from '@accelint/core';
 *
 * filter(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // [2, 4]
 */
export const filter =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]) => {
    const len = arr.length;
    const res: T[] = [];

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        res.push(arr[i] as T);
      }
    }

    return res;
  };
