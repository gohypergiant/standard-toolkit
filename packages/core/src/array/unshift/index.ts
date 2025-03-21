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
 * Returns a new array with the given value added to the start.
 *
 * @param arr The array to add an item to.
 * @param x The value to add to the start of the array.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { unshift } from '@accelint/core';
 *
 * push([1, 2, 3, 4])(0);
 * // [0, 1, 2, 3, 4]
 */
export const unshift =
  <T>(arr: T[]) =>
  (x: T) => {
    const len = arr.length;
    const res = new Array<T>(len + 1);

    res[0] = x;

    for (let i = 0; i < len; i++) {
      res[i + 1] = arr[i] as T;
    }

    return res;
  };
