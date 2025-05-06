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

import type { Accumulator } from '@/types';

/**
 * Calls the accumulator with each element of the given array, starting with the last element. Returns the final result.
 *
 * @template T - The type of array elements.
 * @template R - The result type of the folder function.
 * @param fn - The accumulator function to apply to each element of the array.
 * @param initVal - The initial value of the reduction.
 * @param arr - The array to fold over.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { reduceRight } from '@accelint/core';
 *
 * reduceRight((base, s) => `${base}${s}`)('')(['a', 'b', 'c', 'd', 'e']);
 * // 'edcba'
 */
export const reduceRight =
  <T, R>(fn: Accumulator<T, R>) =>
  (initVal: R) =>
  (arr: T[]) => {
    const len = arr.length;
    let acc = initVal;

    for (let i = len - 1; i >= 0; i--) {
      acc = fn(acc, arr[i] as T);
    }

    return acc;
  };
