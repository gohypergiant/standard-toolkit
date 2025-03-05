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
 * Returns the first index as which a given element can be found in the array. Returns `-1` otherwise.
 * @param x The value to find in the array.
 * @param arr The array to search for the element in.
 *
 * @remark
 * pure function
 *
 * @example
 * indexOf(3)([[1, 2, 3, 4, 5]])
 * // 2
 */
export const indexOf =
  <T>(x: T) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        return i;
      }
    }

    return -1;
  };
