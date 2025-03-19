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
 * Returns a new array with the order of the elements reversed.
 *
 * @param arr The array to reverse the order of.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { reverse } from '@accelint/core';
 *
 * reverse([1, 2, 3, 4, 5]);
 * // [5, 4, 3, 2, 1]
 */
export const reverse = <T>(arr: T[]) => {
  const len = arr.length;
  const res = new Array<T>(len);

  for (let i = len - 1; i >= 0; i--) {
    res[len - i - 1] = arr[i] as T;
  }

  return res;
};
