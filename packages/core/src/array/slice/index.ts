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
 * Returns a new array containing elements between `start` and `end` (exclusive)
 * from the original array.
 * @param start The index to start at (inclusive).
 * @param end The index to end on (exclusive).
 * @param arr The array to get a slice from.
 *
 * @remark
 * pure function
 *
 * @example
 * slice(0)(4)([1, 2, 3, 4, 5, 6]);
 * // [1, 2, 3, 4]
 */
export const slice =
  (start: number) =>
  (end: number) =>
  <T>(arr: T[]) => {
    const minY = Math.min(end, arr.length);
    const res = new Array<T>(minY - start);

    for (let i = start; i < minY; i++) {
      res[i - start] = arr[i] as T;
    }

    return res;
  };
