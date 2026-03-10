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

import {
  CSS_RGBA_LEGACY_REGEX,
  CSS_RGBA_MODERN_REGEX,
} from '@accelint/constants';
/**
 * Check if a value is a valid CSS rgba/rgb string.
 *
 * @param value - The value to check.
 * @returns true if the value is a valid CSS rgba string, false otherwise.
 *
 * @remarks
 * pure function
 *
 * Supports both legacy and modern CSS Color Module Level 4 syntax:
 * - Legacy: "rgb(255, 128, 64)", "rgba(255, 128, 64, 0.5)"
 * - Modern: "rgb(255 128 64)", "rgb(255 128 64 / 0.5)"
 *
 * @example
 * ```ts
 * import { isCssRgbaString } from '@accelint/predicates/is-css-rgba-string';
 *
 * console.log(isCssRgbaString('rgba(255, 128, 64, 0.5)'));
 * // true
 *
 * console.log(isCssRgbaString('rgb(255 128 64 / 50%)'));
 * // true
 *
 * console.log(isCssRgbaString('#FF8040'));
 * // false
 * ```
 */
export function isCssRgbaString(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();
  return (
    CSS_RGBA_LEGACY_REGEX.test(trimmed) || CSS_RGBA_MODERN_REGEX.test(trimmed)
  );
}
