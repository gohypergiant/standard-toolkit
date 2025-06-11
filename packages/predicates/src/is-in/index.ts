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
 * Determines if the value is in the provided array.
 *
 * @param a - The array to check for the value in.
 * @param b - The value to check for.
 * @template T - The type of the value/array.
 *
 * @remarks
 * pure function
 *
 * @example
 * isIn([58, 93, 29, 23])(23); // true
 * isIn([58, 93, 29, 123])(23); // false
 */
export const isIn =
  <T>(a: T[]) =>
  (b: T) =>
    a.includes(b);
