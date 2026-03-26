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

import { isValid255Channel } from '../is-valid-255-channel';

/**
 * CSS-style RGBA color object (React Aria Components style)
 * RGB channels are 0-255, alpha is 0-1
 */
export type CssRgbaObject = {
  readonly r: number; // 0-255
  readonly g: number; // 0-255
  readonly b: number; // 0-255
  readonly a: number; // 0-1
};

/**
 * Check if a value is a valid CssRgbaObject.
 *
 * @param value - The value to check.
 * @returns true if the value is a CssRgbaObject, false otherwise.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { isCssRgbaObject } from '@accelint/predicates/is-css-rgba-object';
 *
 * console.log(isCssRgbaObject({ r: 255, g: 128, b: 64, a: 1 }));
 * // true
 *
 * console.log(isCssRgbaObject({ r: 255, g: 128, b: 64, a: 0.5 }));
 * // true
 *
 * console.log(isCssRgbaObject({ r: 255, g: 128, b: 64 }));
 * // false (missing alpha)
 *
 * console.log(isCssRgbaObject([255, 128, 64, 255]));
 * // false (array, not object)
 * ```
 */
export function isCssRgbaObject(value: unknown): value is CssRgbaObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  if (!('r' in obj && 'g' in obj && 'b' in obj && 'a' in obj)) {
    return false;
  }

  // Validate all channels in single return
  return (
    typeof obj.r === 'number' &&
    isValid255Channel(obj.r) &&
    typeof obj.g === 'number' &&
    isValid255Channel(obj.g) &&
    typeof obj.b === 'number' &&
    isValid255Channel(obj.b) &&
    typeof obj.a === 'number' &&
    Number.isFinite(obj.a) &&
    obj.a >= 0 &&
    obj.a <= 1
  );
}
