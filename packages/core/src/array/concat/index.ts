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
 * Concatenate the two given arrays together.
 *
 * @template T - The type of array elements.
 * @param concatable - The second array to add to the end of the first.
 * @param newValue - The first array to append to.
 *
 * @remarks
 * pure function
 *
 * @example
 * import { concat } from '@accelint/core';
 *
 * concat([1, 2, 3])([4, 5, 6]);
 * // [1, 2, 3, 4, 5, 6]
 */
export const concat =
  <T>(concatable: T[]) =>
  (newValue: T[]) =>
    concatable.concat(newValue);
