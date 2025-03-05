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

import type { Comparator } from '@/types';

/**
 * Tests whether all elements in the array pass the given comparator.
 * @param comparator The comparator function to apply to each element of the array.
 * @param arr The array to check each element of.
 *
 * @remark
 * pure function
 *
 * @example
 * every(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // false
 */
export const every =
  <T>(comparator: Comparator<T>) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (!comparator(arr[i] as T)) {
        return false;
      }
    }

    return true;
  };
