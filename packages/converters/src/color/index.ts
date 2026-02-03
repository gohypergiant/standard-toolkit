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

import { clamp } from '@accelint/math';

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
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 */
export type Color = readonly [
  r: number, // 0-255
  g: number, // 0-255
  b: number, // 0-255
  a: number, // 0-255
];

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
 * CSS RGBA tuple format (used by React Aria Components and other CSS-based libraries)
 * RGB channels are 0-255, alpha is 0-1
 * [red, green, blue, alpha]
 */
export type CssRgbaTuple = readonly [
  r: number, // 0-255
  g: number, // 0-255
  b: number, // 0-255
  a: number, // 0-1
];

// CSS rgba regex patterns - support both legacy and modern syntax

// Legacy comma-separated: rgb(255, 128, 64) or rgba(255, 128, 64, 0.5)
// Supports integers and percentages for both RGB and alpha
const CSS_RGBA_LEGACY_REGEX =
  /^rgba?\(\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*(?:,\s*(\d+(?:\.\d+)?%?)\s*)?\)$/;

// Modern space-separated: rgb(255 128 64) or rgb(255 128 64 / 0.5)
// Supports integers and percentages for both RGB and alpha
const CSS_RGBA_MODERN_REGEX =
  /^rgba?\(\s*(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s*(?:\/\s*(\d+(?:\.\d+)?%?)\s*)?\)$/;

// Hex color regex - matches #RGB, #RGBA, #RRGGBB, #RRGGBBAA (with or without #)
const HEX_REGEX =
  /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * Check if a number is a valid color channel value (0-255).
 *
 * @param n - The number to check.
 * @returns true if the value is between 0-255, false otherwise.
 */
function isValidChannel(n: number): boolean {
  return Number.isFinite(n) && n >= 0 && n <= 255;
}

/**
 * Parse a CSS color value (handles both integers and percentages).
 *
 * @param value - The CSS value string (e.g., "255", "100%", "0.5", "50%").
 * @param isAlpha - Whether this is an alpha channel value.
 * @returns The parsed value in 0-255 range.
 * @throws {Error} If the value is out of valid range.
 */
function parseCssValue(value: string, isAlpha: boolean): number {
  const isPercentage = value.endsWith('%');
  const numericValue = Number.parseFloat(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  // Determine valid range based on type and format
  const maxValue = isPercentage ? 100 : isAlpha ? 1 : 255;
  const valueType = isAlpha ? 'Alpha' : 'RGB';
  const formatType = isPercentage ? 'percentage' : 'value';
  const unit = isPercentage ? '%' : '';

  // Validate range
  if (numericValue < 0 || numericValue > maxValue) {
    throw new Error(
      `${valueType} ${formatType} must be between 0-${maxValue}${unit}: ${numericValue}${unit}`,
    );
  }

  // Convert to 0-255 range
  if (isPercentage) {
    return Math.round((numericValue / 100) * 255);
  }
  if (isAlpha) {
    return Math.round(numericValue * 255);
  }
  return Math.round(numericValue);
}

/**
 * Parse a hex color string to a Color tuple.
 *
 * @param hex - The hex string to parse (e.g., "#RGB", "#RGBA", "#RRGGBB", "#RRGGBBAA"). Hash is optional.
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
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
 * import { hexToColor } from '@accelint/converters/color';
 *
 * console.log(hexToColor('#FF8040'));
 * // [255, 128, 64, 255]
 *
 * console.log(hexToColor('#F84'));
 * // [255, 136, 68, 255] (expands to #FF8844)
 *
 * console.log(hexToColor('#F840'));
 * // [255, 136, 68, 0] (expands to #FF884400)
 *
 * console.log(hexToColor('#FF804080'));
 * // [255, 128, 64, 128]
 * ```
 */
export function hexToColor(hex: string): Color {
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
 * Convert a Color tuple to a hex string.
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-255.
 * @param includeAlpha - Whether to include alpha channel in output (default: false).
 * @returns A hex string (e.g., "#FF8040" or "#FF804080").
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { colorToHex } from '@accelint/converters/color';
 *
 * console.log(colorToHex([255, 128, 64, 255]));
 * // "#FF8040"
 *
 * console.log(colorToHex([255, 128, 64, 128], true));
 * // "#FF804080"
 * ```
 */
export function colorToHex(color: Color, includeAlpha = false): string {
  const [r, g, b, a] = color;
  return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}${includeAlpha ? numberToHex(a) : ''}`;
}

/**
 * Parse a CSS rgba/rgb string to a Color tuple.
 * Supports CSS Color Module Level 4 spec including legacy and modern syntax.
 *
 * @param css - The CSS string to parse. Supports:
 *   - Legacy comma-separated: "rgb(255, 128, 64)", "rgba(255, 128, 64, 0.5)"
 *   - Modern space-separated: "rgb(255 128 64)", "rgb(255 128 64 / 0.5)"
 *   - Percentage RGB: "rgb(100%, 50%, 25%)", "rgb(100% 50% 25%)"
 *   - Percentage alpha: "rgb(255, 128, 64, 50%)", "rgb(255 128 64 / 50%)"
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the CSS string is invalid, values are out of range, or RGB values mix integers and percentages.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaStringToColor } from '@accelint/converters/color';
 *
 * console.log(cssRgbaStringToColor('rgba(255, 128, 64, 0.5)'));
 * // [255, 128, 64, 128]
 *
 * console.log(cssRgbaStringToColor('rgb(255 128 64 / 50%)'));
 * // [255, 128, 64, 128]
 *
 * console.log(cssRgbaStringToColor('rgb(100% 50% 25%)'));
 * // [255, 128, 64, 255]
 * ```
 */
export function cssRgbaStringToColor(css: string): Color {
  const trimmed = css.trim();

  // Try legacy comma-separated syntax first
  const match =
    trimmed.match(CSS_RGBA_LEGACY_REGEX) ||
    trimmed.match(CSS_RGBA_MODERN_REGEX);

  if (!match) {
    throw new Error(`Invalid CSS rgba string: ${css}`);
  }

  const rStr = match[1];
  const gStr = match[2];
  const bStr = match[3];
  const alphaStr = match[4];

  if (rStr === undefined || gStr === undefined || bStr === undefined) {
    throw new Error(`Invalid CSS rgba string: ${css}`);
  }

  // Validate that RGB values use consistent format (all integers or all percentages)
  // Inlined for performance (eliminates function call overhead)
  const rIsPercent = rStr.endsWith('%');
  const gIsPercent = gStr.endsWith('%');
  const bIsPercent = bStr.endsWith('%');

  if (rIsPercent !== gIsPercent || gIsPercent !== bIsPercent) {
    throw new Error(
      `RGB values must all be integers or all be percentages, no mixing: rgb(${rStr}, ${gStr}, ${bStr})`,
    );
  }

  // Parse RGB values (handles both integers and percentages)
  const r = parseCssValue(rStr, false);
  const g = parseCssValue(gStr, false);
  const b = parseCssValue(bStr, false);

  // Parse alpha value (defaults to 1.0/255 if not provided)
  // Handles both decimal (0-1) and percentage (0-100%)
  const a = alphaStr ? parseCssValue(alphaStr, true) : 255;

  return [r, g, b, a];
}

/**
 * Convert a Color tuple to a CSS rgba string.
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-255.
 * @returns A CSS rgba string (e.g., "rgba(255, 128, 64, 0.5)").
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { colorToCssRgbaString } from '@accelint/converters/color';
 *
 * console.log(colorToCssRgbaString([255, 128, 64, 255]));
 * // "rgba(255, 128, 64, 1)"
 *
 * console.log(colorToCssRgbaString([255, 128, 64, 128]));
 * // "rgba(255, 128, 64, 0.5)"
 * ```
 */
export function colorToCssRgbaString(color: Color): string {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1, use concatenation to reduce allocations
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

/**
 * Parse a CSS rgba tuple to a Color tuple.
 *
 * @param tuple - The CSS rgba tuple [r, g, b, a] where RGB are 0-255 and alpha is 0-1.
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the tuple is invalid or values are out of range.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaTupleToColor } from '@accelint/converters/color';
 *
 * console.log(cssRgbaTupleToColor([255, 128, 64, 1]));
 * // [255, 128, 64, 255]
 *
 * console.log(cssRgbaTupleToColor([255, 128, 64, 0.5]));
 * // [255, 128, 64, 128]
 * ```
 */
export function cssRgbaTupleToColor(tuple: CssRgbaTuple): Color {
  if (tuple.length !== 4) {
    throw new Error(
      `CSS RGBA tuple must have exactly 4 values, got ${tuple.length}`,
    );
  }

  const [r, g, b, alpha] = tuple;

  // Validate RGB channels (avoid array allocation)
  const rgbValid = isValidChannel(r) && isValidChannel(g) && isValidChannel(b);
  if (!rgbValid) {
    throw new Error(`RGB values must be between 0-255: [${r}, ${g}, ${b}]`);
  }

  // Validate alpha (0-1)
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error(`Alpha value must be between 0-1: ${alpha}`);
  }

  // Convert alpha from 0-1 to 0-255
  const a = Math.round(alpha * 255);

  return [r, g, b, a];
}

/**
 * Convert a Color tuple to a CSS rgba tuple.
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-255.
 * @returns A CSS rgba tuple [r, g, b, a] where RGB are 0-255 and alpha is 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { colorToCssRgbaTuple } from '@accelint/converters/color';
 *
 * console.log(colorToCssRgbaTuple([255, 128, 64, 255]));
 * // [255, 128, 64, 1]
 *
 * console.log(colorToCssRgbaTuple([255, 128, 64, 128]));
 * // [255, 128, 64, 0.5019607843137255]
 * ```
 */
export function colorToCssRgbaTuple(color: Color): CssRgbaTuple {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1
  return [r, g, b, a / 255];
}

/**
 * Convert a CssRgbaObject to a Color tuple.
 *
 * @param obj - The CssRgbaObject {r, g, b, a} where RGB are 0-255 and alpha is 0-1.
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If any values are out of range.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaObjectToColor } from '@accelint/converters/color';
 *
 * console.log(cssRgbaObjectToColor({ r: 255, g: 128, b: 64, a: 1 }));
 * // [255, 128, 64, 255]
 *
 * console.log(cssRgbaObjectToColor({ r: 255, g: 128, b: 64, a: 0.5 }));
 * // [255, 128, 64, 128]
 * ```
 */
export function cssRgbaObjectToColor(obj: CssRgbaObject): Color {
  const { r, g, b, a } = obj;

  // Validate RGB channels (avoid array allocation)
  const rgbValid = isValidChannel(r) && isValidChannel(g) && isValidChannel(b);
  if (!rgbValid) {
    throw new Error(
      `RGB values must be between 0-255: {r: ${r}, g: ${g}, b: ${b}}`,
    );
  }

  // Validate alpha (0-1)
  if (!Number.isFinite(a) || a < 0 || a > 1) {
    throw new Error(`Alpha value must be between 0-1: ${a}`);
  }

  // Convert alpha from 0-1 to 0-255
  return [r, g, b, Math.round(a * 255)];
}

/**
 * Convert a Color tuple to a CssRgbaObject.
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-255.
 * @returns A CssRgbaObject {r, g, b, a} where RGB are 0-255 and alpha is 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { colorToCssRgbaObject } from '@accelint/converters/color';
 *
 * console.log(colorToCssRgbaObject([255, 128, 64, 255]));
 * // { r: 255, g: 128, b: 64, a: 1 }
 *
 * console.log(colorToCssRgbaObject([255, 128, 64, 128]));
 * // { r: 255, g: 128, b: 64, a: 0.5019607843137255 }
 * ```
 */
export function colorToCssRgbaObject(color: Color): CssRgbaObject {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1
  return { r, g, b, a: a / 255 };
}

/**
 * Convert a Color from deck.gl format (0-255) to GLSL format (0-1).
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-255.
 * @returns A Color tuple [r, g, b, a] where all values are 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { colorToGlsl } from '@accelint/converters/color';
 *
 * console.log(colorToGlsl([255, 128, 64, 255]));
 * // [1, 0.5019607843137255, 0.25098039215686274, 1]
 * ```
 */
export function colorToGlsl(color: Color): Color {
  // Manual array construction for performance (avoids .map() overhead)
  return [
    color[0] / 255,
    color[1] / 255,
    color[2] / 255,
    color[3] / 255,
  ] as Color;
}

/**
 * Convert a Color from GLSL format (0-1) to deck.gl format (0-255).
 *
 * @param color - The Color tuple [r, g, b, a] where all values are 0-1.
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { glslToColor } from '@accelint/converters/color';
 *
 * console.log(glslToColor([1, 0.5, 0.25, 1]));
 * // [255, 128, 64, 255]
 * ```
 */
export function glslToColor(color: Color): Color {
  // Manual array construction for performance (avoids .map() overhead)
  return [
    Math.round(clamp(0, 255, color[0] * 255)),
    Math.round(clamp(0, 255, color[1] * 255)),
    Math.round(clamp(0, 255, color[2] * 255)),
    Math.round(clamp(0, 255, color[3] * 255)),
  ] as Color;
}

/**
 * Check if a value is a valid Color tuple.
 *
 * @param value - The value to check.
 * @returns true if the value is a Color tuple, false otherwise.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { isColor } from '@accelint/converters/color';
 *
 * console.log(isColor([255, 128, 64, 255]));
 * // true
 *
 * console.log(isColor([255, 128, 64]));
 * // false (missing alpha)
 *
 * console.log(isColor('rgba(255, 128, 64, 1)'));
 * // false (string, not tuple)
 * ```
 */
export function isColor(value: unknown): value is Color {
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
 * import { isCssRgbaObject } from '@accelint/converters/color';
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
    isValidChannel(obj.r) &&
    typeof obj.g === 'number' &&
    isValidChannel(obj.g) &&
    typeof obj.b === 'number' &&
    isValidChannel(obj.b) &&
    typeof obj.a === 'number' &&
    Number.isFinite(obj.a) &&
    obj.a >= 0 &&
    obj.a <= 1
  );
}
