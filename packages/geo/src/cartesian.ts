// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Computes the Cartesian product of multiple arrays.
 *
 * @template T
 * the type of elements in the input arrays.
 * @param {...T[][]} all
 * a variadic number of arrays to compute the Cartesian product of.
 * @returns {T[][]}
 * An array containing all possible combinations of elements from the input
 * arrays, where each combination is represented as an array.
 *
 * @remarks
 * pure function
 *
 * @example
 * const result = cartesian([1, 2], ['a', 'b']);
 * // result: [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 */
export function cartesian<T>(...all: T[][]): T[][] {
  return all.reduce<T[][]>(
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((sub, res) => sub.concat(res), []),
    [[]],
  );
}
