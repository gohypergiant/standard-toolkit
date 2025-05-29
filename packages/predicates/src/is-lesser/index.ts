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
 * Determines if the first value is lesser than the second value.
 *
 * @param a - The first value to check against.
 * @param b - The second value to check against.
 * @template T - The type of the values.
 *
 * @remarks
 * pure function
 *
 * @example
 * isLesser(42)(23); // false
 * isLesser(5)(23); // true
 */
export const isLesser =
  <T>(a: T) =>
  (b: T) =>
    a < b;
