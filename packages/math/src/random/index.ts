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
 * Generate a random number within the given bounds.
 *
 * @param min - The minimum value in the range (inclusive).
 * @param max - The maximum value in the range (inclusive).
 *
 * @throws {RangeError} Throws if min > max.
 *
 * @example
 * const value = random(0, 10);
 * // value >= 0 && value <= 10;
 *
 * const value = random(10, 0);
 * // RangeError
 */
export function random(min: number, max: number) {
  if (min > max) {
    throw new RangeError('Min exceeded max');
  }

  return Math.random() * (max - min + Number.EPSILON) + min;
}

/**
 * Generate a random integer within the given bounds.
 *
 * @param min - The minimum value in the range (inclusive).
 * @param max - The maximum value in the range (inclusive).
 *
 * @throws {RangeError} Throws if min > max.
 *
 * @example
 * const value = randomInt(0, 10);
 * // value >= 0 && value <= 10;
 *
 * const value = randomInt(10, 0);
 * // RangeError
 */
export function randomInt(min: number, max: number) {
  if (min > max) {
    throw new RangeError('Min exceeded max');
  }

  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil);
}
