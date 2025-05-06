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
 * Returns the first element of the given array that satisfies the predicate.
 * Returns `null` otherwise.
 *
 * @template T - The type of array elements.
 * @param predicate - A predicate function to apply to each element of the array.
 * @param arr - The array to find against based on the predicate.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { find } from '@accelint/core';
 *
 * find(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 2
 */
export const find =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        return arr[i];
      }
    }

    return null;
  };
