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
import type { Rgba255Tuple } from '@accelint/predicates';

// Hex digit lookup table for efficient conversion
const HEX_CHARS = '0123456789ABCDEF';

/**
 * Convert a number (0-255) to a 2-character hex string.
 *
 * @param n - The number to convert (0-255).
 * @returns A 2-character hex string (e.g., "00", "FF", "A3").
 *
 * @remarks
 * Uses bitwise operations and lookup table to avoid string allocations
 * from toString(16).padStart(2, '0').toUpperCase().
 */
const numberToHex = (n: number): string =>
  HEX_CHARS.charAt(n >> 4) + HEX_CHARS.charAt(n & 0x0f);

/**
 * Parse a hex color string to a Rgba255Tuple.
 *
 * @param hex - The hex string to parse (e.g., "#RGB", "#RGBA", "#RRGGBB", "#RRGGBBAA"). Hash is optional.
 * @returns A Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the hex string is invalid.
 *
 * @remarks
 * pure function
 *
 * Supports all hex color formats:
 * - 3-char (#RGB): Each digit doubles - #F09 → #FF0099
 * - 4-char (#RGBA): Each digit doubles including alpha - #F09A → #FF0099AA
 * - 6-char (#RRGGBB): Standard format
 * - 8-char (#RRGGBBAA): Standard format with alpha
 *
 * @example
 * ```ts
 * import { hexToRgba255Tuple } from '@accelint/converters/color';
 *
 * console.log(hexToRgba255Tuple('#FF8040'));
 * // [255, 128, 64, 255]
 *
 * console.log(hexToRgba255Tuple('#F84'));
 * // [255, 136, 68, 255] (expands to #FF8844)
 *
 * console.log(hexToRgba255Tuple('#F840'));
 * // [255, 136, 68, 0] (expands to #FF884400)
 *
 * console.log(hexToRgba255Tuple('#FF804080'));
 * // [255, 128, 64, 128]
 * ```
 */
export function hexToRgba255Tuple(hex: string): Rgba255Tuple {
  const match = hex.trim().match(HEX_REGEX);

  if (!match) {
    throw new Error(`Invalid hex color string: ${hex}`);
  }

  let hexValue = match[1];

  if (hexValue === undefined) {
    throw new Error(`Invalid hex color string: ${hex}`);
  }

  // Expand 3-char hex to 6-char (#RGB → #RRGGBB)
  if (hexValue.length === 3) {
    hexValue =
      hexValue.charAt(0) +
      hexValue.charAt(0) +
      hexValue.charAt(1) +
      hexValue.charAt(1) +
      hexValue.charAt(2) +
      hexValue.charAt(2);
  }

  // Expand 4-char hex to 8-char (#RGBA → #RRGGBBAA)
  if (hexValue.length === 4) {
    hexValue =
      hexValue.charAt(0) +
      hexValue.charAt(0) +
      hexValue.charAt(1) +
      hexValue.charAt(1) +
      hexValue.charAt(2) +
      hexValue.charAt(2) +
      hexValue.charAt(3) +
      hexValue.charAt(3);
  }

  // Parse RGB values
  const r = Number.parseInt(hexValue.slice(0, 2), 16);
  const g = Number.parseInt(hexValue.slice(2, 4), 16);
  const b = Number.parseInt(hexValue.slice(4, 6), 16);

  // Parse alpha if present (8-char hex), otherwise default to 255
  const a =
    hexValue.length === 8 ? Number.parseInt(hexValue.slice(6, 8), 16) : 255;

  return [r, g, b, a];
}

/**
 * Convert a Rgba255Tuple to a hex string.
 *
 * @param color - The Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @param includeAlpha - Whether to include alpha channel in output (default: false).
 * @returns A hex string (e.g., "#FF8040" or "#FF804080").
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { rgba255TupleToHex } from '@accelint/converters/color';
 *
 * console.log(rgba255TupleToHex([255, 128, 64, 255]));
 * // "#FF8040"
 *
 * console.log(rgba255TupleToHex([255, 128, 64, 128], true));
 * // "#FF804080"
 * ```
 */
export function rgba255TupleToHex(
  color: Rgba255Tuple,
  includeAlpha = false,
): string {
  const [r, g, b, a] = color;
  return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}${includeAlpha ? numberToHex(a) : ''}`;
}
