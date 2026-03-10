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
import { isValid255Channel } from '@accelint/predicates';
import type { CssRgbaObject, Rgba255Tuple } from '@accelint/predicates';

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
 * Parse a CSS rgba/rgb string to a Rgba255Tuple.
 * Supports CSS Color Module Level 4 spec including legacy and modern syntax.
 *
 * @param css - The CSS string to parse. Supports:
 *   - Legacy comma-separated: "rgb(255, 128, 64)", "rgba(255, 128, 64, 0.5)"
 *   - Modern space-separated: "rgb(255 128 64)", "rgb(255 128 64 / 0.5)"
 *   - Percentage RGB: "rgb(100%, 50%, 25%)", "rgb(100% 50% 25%)"
 *   - Percentage alpha: "rgb(255, 128, 64, 50%)", "rgb(255 128 64 / 50%)"
 * @returns A Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the CSS string is invalid, values are out of range, or RGB values mix integers and percentages.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaStringToRgba255Tuple } from '@accelint/converters/color';
 *
 * console.log(cssRgbaStringToRgba255Tuple('rgba(255, 128, 64, 0.5)'));
 * // [255, 128, 64, 128]
 *
 * console.log(cssRgbaStringToRgba255Tuple('rgb(255 128 64 / 50%)'));
 * // [255, 128, 64, 128]
 *
 * console.log(cssRgbaStringToRgba255Tuple('rgb(100% 50% 25%)'));
 * // [255, 128, 64, 255]
 * ```
 */
export function cssRgbaStringToRgba255Tuple(css: string): Rgba255Tuple {
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
 * Convert a Rgba255Tuple to a CSS rgba string.
 *
 * @param color - The Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @returns A CSS rgba string (e.g., "rgba(255, 128, 64, 0.5)").
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { rgba255TupleToCssRgbaString } from '@accelint/converters/color';
 *
 * console.log(rgba255TupleToCssRgbaString([255, 128, 64, 255]));
 * // "rgba(255, 128, 64, 1)"
 *
 * console.log(rgba255TupleToCssRgbaString([255, 128, 64, 128]));
 * // "rgba(255, 128, 64, 0.5)"
 * ```
 */
export function rgba255TupleToCssRgbaString(color: Rgba255Tuple): string {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1, use concatenation to reduce allocations
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

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

/**
 * Parse a CSS rgba tuple to a Rgba255Tuple.
 *
 * @param tuple - The CSS rgba tuple [r, g, b, a] where RGB are 0-255 and alpha is 0-1.
 * @returns A Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the tuple is invalid or values are out of range.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaTupleToRgba255Tuple } from '@accelint/converters/color';
 *
 * console.log(cssRgbaTupleToRgba255Tuple([255, 128, 64, 1]));
 * // [255, 128, 64, 255]
 *
 * console.log(cssRgbaTupleToRgba255Tuple([255, 128, 64, 0.5]));
 * // [255, 128, 64, 128]
 * ```
 */
export function cssRgbaTupleToRgba255Tuple(tuple: CssRgbaTuple): Rgba255Tuple {
  if (tuple.length !== 4) {
    throw new Error(
      `CSS RGBA tuple must have exactly 4 values, got ${tuple.length}`,
    );
  }

  const [r, g, b, alpha] = tuple;

  // Validate RGB channels (avoid array allocation)
  const rgbValid =
    isValid255Channel(r) && isValid255Channel(g) && isValid255Channel(b);
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
 * Convert a Rgba255Tuple to a CSS rgba tuple.
 *
 * @param color - The Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @returns A CSS rgba tuple [r, g, b, a] where RGB are 0-255 and alpha is 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { rgba255TupleToCssRgbaTuple } from '@accelint/converters/color';
 *
 * console.log(rgba255TupleToCssRgbaTuple([255, 128, 64, 255]));
 * // [255, 128, 64, 1]
 *
 * console.log(rgba255TupleToCssRgbaTuple([255, 128, 64, 128]));
 * // [255, 128, 64, 0.5019607843137255]
 * ```
 */
export function rgba255TupleToCssRgbaTuple(color: Rgba255Tuple): CssRgbaTuple {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1
  return [r, g, b, a / 255];
}

/**
 * Convert a CssRgbaObject to a Rgba255Tuple.
 *
 * @param obj - The CssRgbaObject {r, g, b, a} where RGB are 0-255 and alpha is 0-1.
 * @returns A Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If any values are out of range.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { cssRgbaObjectToRgba255Tuple } from '@accelint/converters/color';
 *
 * console.log(cssRgbaObjectToRgba255Tuple({ r: 255, g: 128, b: 64, a: 1 }));
 * // [255, 128, 64, 255]
 *
 * console.log(cssRgbaObjectToRgba255Tuple({ r: 255, g: 128, b: 64, a: 0.5 }));
 * // [255, 128, 64, 128]
 * ```
 */
export function cssRgbaObjectToRgba255Tuple(obj: CssRgbaObject): Rgba255Tuple {
  const { r, g, b, a } = obj;

  // Validate RGB channels (avoid array allocation)
  const rgbValid =
    isValid255Channel(r) && isValid255Channel(g) && isValid255Channel(b);
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
 * Convert a Rgba255Tuple to a CssRgbaObject.
 *
 * @param color - The Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @returns A CssRgbaObject {r, g, b, a} where RGB are 0-255 and alpha is 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { rgba255TupleToCssRgbaObject } from '@accelint/converters/color';
 *
 * console.log(rgba255TupleToCssRgbaObject([255, 128, 64, 255]));
 * // { r: 255, g: 128, b: 64, a: 1 }
 *
 * console.log(rgba255TupleToCssRgbaObject([255, 128, 64, 128]));
 * // { r: 255, g: 128, b: 64, a: 0.5019607843137255 }
 * ```
 */
export function rgba255TupleToCssRgbaObject(
  color: Rgba255Tuple,
): CssRgbaObject {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1
  return { r, g, b, a: a / 255 };
}
