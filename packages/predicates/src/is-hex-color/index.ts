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
import { HEX_REGEX } from '@accelint/constants';

/**
 * Check if a value is a valid hex color string.
 *
 * @param value - The value to check.
 * @returns true if the value is a valid hex color string, false otherwise.
 *
 * @remarks
 * pure function
 *
 * Supports: #RGB, #RGBA, #RRGGBB, #RRGGBBAA (hash optional)
 *
 * @example
 * ```ts
 * import { isHexColor } from '@accelint/predicates/is-hex-color';
 *
 * console.log(isHexColor('#FF8040'));
 * // true
 *
 * console.log(isHexColor('#F84'));
 * // true
 *
 * console.log(isHexColor('rgb(255, 128, 64)'));
 * // false
 * ```
 */
export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_REGEX.test(value.trim());
}
