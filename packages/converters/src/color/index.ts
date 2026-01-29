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

/**
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 */
export type Color = readonly [number, number, number, number];

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

// CSS rgba regex - matches rgb(r, g, b) or rgba(r, g, b, a)
const CSS_RGBA_REGEX =
  /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/;

// Hex color regex - matches #RGB, #RRGGBB, #RRGGBBAA (with or without #)
const HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

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
 * Parse a hex color string to a Color tuple.
 *
 * @param hex - The hex string to parse (e.g., "#RGB", "#RRGGBB", "#RRGGBBAA"). Hash is optional.
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the hex string is invalid.
 *
 * @remarks
 * pure function
 *
 * @playground
 * ```ts
 * import { hexToColor } from '@accelint/converters/color';
 *
 * console.log(hexToColor('#FF8040'));
 * // [255, 128, 64, 255]
 *
 * console.log(hexToColor('#F84'));
 * // [255, 136, 68, 255]
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

  // Expand 3-char hex to 6-char
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split('')
      .map((char) => char + char)
      .join('');
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
 * @playground
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

  const rHex = r.toString(16).padStart(2, '0').toUpperCase();
  const gHex = g.toString(16).padStart(2, '0').toUpperCase();
  const bHex = b.toString(16).padStart(2, '0').toUpperCase();

  if (includeAlpha) {
    const aHex = a.toString(16).padStart(2, '0').toUpperCase();
    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Parse a CSS rgba/rgb string to a Color tuple.
 *
 * @param css - The CSS string to parse (e.g., "rgba(255, 128, 64, 0.5)" or "rgb(255, 128, 64)").
 * @returns A Color tuple [r, g, b, a] where all values are 0-255.
 * @throws {Error} If the CSS string is invalid or values are out of range.
 *
 * @remarks
 * pure function
 *
 * @playground
 * ```ts
 * import { cssRgbaStringToColor } from '@accelint/converters/color';
 *
 * console.log(cssRgbaStringToColor('rgba(255, 128, 64, 0.5)'));
 * // [255, 128, 64, 128]
 *
 * console.log(cssRgbaStringToColor('rgb(255, 128, 64)'));
 * // [255, 128, 64, 255]
 * ```
 */
export function cssRgbaStringToColor(css: string): Color {
  const match = css.trim().match(CSS_RGBA_REGEX);

  if (!match) {
    throw new Error(`Invalid CSS rgba string: ${css}`);
  }

  const rStr = match[1];
  const gStr = match[2];
  const bStr = match[3];

  if (rStr === undefined || gStr === undefined || bStr === undefined) {
    throw new Error(`Invalid CSS rgba string: ${css}`);
  }

  const r = Number.parseInt(rStr, 10);
  const g = Number.parseInt(gStr, 10);
  const b = Number.parseInt(bStr, 10);
  const alphaStr = match[4];
  const alpha = alphaStr ? Number.parseFloat(alphaStr) : 1.0;

  // Validate RGB channels
  const rgbValid = [r, g, b].every(isValidChannel);
  if (!rgbValid) {
    throw new Error(`RGB values must be between 0-255: rgb(${r}, ${g}, ${b})`);
  }

  // Validate alpha (0-1 in CSS)
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error(`Alpha value must be between 0-1: ${alpha}`);
  }

  // Convert alpha from 0-1 to 0-255
  const a = Math.round(alpha * 255);

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
 * @playground
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
  // Convert alpha from 0-255 to 0-1
  const alpha = a / 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
 * @playground
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
export function cssRgbaTupleToColor(
  tuple: readonly [number, number, number, number],
): Color {
  if (tuple.length !== 4) {
    throw new Error(
      `CSS RGBA tuple must have exactly 4 values, got ${tuple.length}`,
    );
  }

  const [r, g, b, alpha] = tuple;

  // Validate RGB channels (0-255)
  const rgbValid = [r, g, b].every(isValidChannel);
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
 * @playground
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
export function colorToCssRgbaTuple(
  color: Color,
): readonly [number, number, number, number] {
  const [r, g, b, a] = color;
  // Convert alpha from 0-255 to 0-1
  const alpha = a / 255;
  return [r, g, b, alpha];
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
 * @playground
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

  // Validate RGB channels (0-255)
  const rgbValid = [r, g, b].every(isValidChannel);
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
  const alpha255 = Math.round(a * 255);

  return [r, g, b, alpha255];
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
 * @playground
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
  const alpha = a / 255;
  return { r, g, b, a: alpha };
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
 * @playground
 * ```ts
 * import { colorToGlsl } from '@accelint/converters/color';
 *
 * console.log(colorToGlsl([255, 128, 64, 255]));
 * // [1, 0.5019607843137255, 0.25098039215686274, 1]
 * ```
 */
export function colorToGlsl(color: Color): Color {
  const [r, g, b, a] = color;
  return [r / 255, g / 255, b / 255, a / 255];
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
 * @playground
 * ```ts
 * import { glslToColor } from '@accelint/converters/color';
 *
 * console.log(glslToColor([1, 0.5, 0.25, 1]));
 * // [255, 128, 64, 255]
 * ```
 */
export function glslToColor(color: Color): Color {
  const [r, g, b, a] = color;
  return [
    Math.round(clamp(0, 255, r * 255)),
    Math.round(clamp(0, 255, g * 255)),
    Math.round(clamp(0, 255, b * 255)),
    Math.round(clamp(0, 255, a * 255)),
  ];
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
 * @playground
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

  return value.every(
    (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 255,
  );
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
 * @playground
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

  const hasAllKeys = 'r' in obj && 'g' in obj && 'b' in obj && 'a' in obj;
  if (!hasAllKeys) {
    return false;
  }

  // Validate RGB channels (0-255)
  const rgbValid = [obj.r, obj.g, obj.b].every(
    (v) => typeof v === 'number' && isValidChannel(v as number),
  );
  if (!rgbValid) {
    return false;
  }

  // Validate alpha (0-1)
  const a = obj.a as number;
  return typeof a === 'number' && Number.isFinite(a) && a >= 0 && a <= 1;
}
