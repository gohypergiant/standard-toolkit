/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 */
export type Rgba255Tuple = readonly [
  r: number, // 0-255
  g: number, // 0-255
  b: number, // 0-255
  a: number, // 0-255
];

/**
 * Check if a value is a valid Rgba 255 tuple.
 *
 * @param value - The value to check.
 * @returns true if the value is a Rgba 255 tuple, false otherwise.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { isRgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
 *
 * console.log(isRgba255Tuple([255, 128, 64, 255]));
 * // true
 *
 * console.log(isRgba255Tuple([255, 128, 64]));
 * // false (missing alpha)
 *
 * console.log(isRgba255Tuple('rgba(255, 128, 64, 1)'));
 * // false (string, not tuple)
 * ```
 */
export function isRgba255Tuple(value: unknown): value is Rgba255Tuple {
  if (!Array.isArray(value) || value.length !== 4) {
    return false;
  }

  // Manual validation (avoid iterator overhead)
  for (let i = 0; i < 4; i++) {
    const v = value[i];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 255) {
      return false;
    }
  }
  return true;
}
