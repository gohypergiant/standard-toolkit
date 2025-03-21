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

import { createIterable } from '../create-iterable';

/**
 * Create an Iterator that goes from `start` to `end`.
 *
 * @param start The start of the number range (inclusive)
 * @param end The end of the number range (inclusive)
 *
 * @example
 * for (const n of range(1, 10)) {
 *   console.log(n);
 * }
 * // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
 *
 * const rangeArr = [...range(1, 10)];
 * // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 */
export function range(start: number, end: number) {
  let counter = start;

  return createIterable(() => {
    if (counter <= end) {
      return { value: counter++, done: false };
    }

    return { done: true, value: end };
  });
}
