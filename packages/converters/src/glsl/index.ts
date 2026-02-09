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
import type { Rgba255Tuple } from '@accelint/predicates';

/**
 * GLSL RGBA color tuple where all channels are normalized 0-1.
 * [red, green, blue, alpha]
 */
export type GlslRgbaTuple = readonly [
  r: number, // 0-1
  g: number, // 0-1
  b: number, // 0-1
  a: number, // 0-1
];

/**
 * Convert a Rgba255Tuple from deck.gl format (0-255) to GLSL format (0-1).
 *
 * @param color - The Rgba255Tuple [r, g, b, a] where all values are 0-255.
 * @returns A GlslRgbaTuple [r, g, b, a] where all values are 0-1.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { rgba255TupleToGlsl } from '@accelint/converters/color';
 *
 * console.log(rgba255TupleToGlsl([255, 128, 64, 255]));
 * // [1, 0.5019607843137255, 0.25098039215686274, 1]
 * ```
 */
export function rgba255TupleToGlsl(color: Rgba255Tuple): GlslRgbaTuple {
  // Manual array construction for performance (avoids .map() overhead)
  return [
    color[0] / 255,
    color[1] / 255,
    color[2] / 255,
    color[3] / 255,
  ] as GlslRgbaTuple;
}

/**
 * Convert a GlslRgbaTuple from GLSL format (0-1) to deck.gl format (0-255).
 *
 * @param color - The GlslRgbaTuple [r, g, b, a] where all values are 0-1.
 * @returns A Rgba255Tuple [r, g, b, a] where all values are 0-255.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```ts
 * import { glslToRgba255Tuple } from '@accelint/converters/color';
 *
 * console.log(glslToRgba255Tuple([1, 0.5, 0.25, 1]));
 * // [255, 128, 64, 255]
 * ```
 */
export function glslToRgba255Tuple(color: GlslRgbaTuple): Rgba255Tuple {
  // Manual array construction for performance (avoids .map() overhead)
  return [
    Math.round(clamp(0, 255, color[0] * 255)),
    Math.round(clamp(0, 255, color[1] * 255)),
    Math.round(clamp(0, 255, color[2] * 255)),
    Math.round(clamp(0, 255, color[3] * 255)),
  ] as Rgba255Tuple;
}
