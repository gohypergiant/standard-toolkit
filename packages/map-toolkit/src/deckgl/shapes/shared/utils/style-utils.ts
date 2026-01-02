/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use client';

import {
  BASE_FILL_OPACITY,
  DASH_ARRAYS,
  DEFAULT_COLORS,
  DEFAULT_LINE_WIDTH,
} from '../constants';
import type { Color } from '@deck.gl/core';
import type { StyledFeature } from '../types';

/**
 * Normalize a Color to a 4-element RGBA array.
 * Handles RGB arrays (adds alpha 255), RGBA arrays, and typed arrays.
 *
 * @param color - The color to normalize
 * @returns 4-element RGBA array [r, g, b, a]
 */
export function normalizeColor(color: Color): [number, number, number, number] {
  if (color instanceof Uint8Array || color instanceof Uint8ClampedArray) {
    return [color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 255];
  }

  // Handle RGB (3-element) or RGBA (4-element) arrays
  // Validate array has at least 3 elements for RGB
  if (!Array.isArray(color) || color.length < 3) {
    return [0, 0, 0, 255]; // Fallback to opaque black
  }
  return [color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 255];
}

/**
 * Get fill color for a feature.
 * Colors are passed through as-is unless applyBaseOpacity is true.
 *
 * @param feature - The styled feature
 * @param applyBaseOpacity - When true, multiplies alpha by BASE_FILL_OPACITY (0.2)
 * @returns RGBA color array
 */
export function getFillColor(
  feature: StyledFeature,
  applyBaseOpacity = false,
): Color {
  const styleProps = feature.properties?.styleProperties;
  const color = styleProps?.fillColor ?? DEFAULT_COLORS.fill;

  // Normalize to 4-element array
  const rgba = normalizeColor(color);

  if (applyBaseOpacity) {
    // Apply base opacity multiplier to alpha channel
    return [rgba[0], rgba[1], rgba[2], Math.round(rgba[3] * BASE_FILL_OPACITY)];
  }

  return rgba;
}

/**
 * Get border/outline color for a feature.
 * Outlines are always rendered at their literal alpha value.
 *
 * Named to match deck.gl's `getLineColor` accessor convention.
 * Reads from `lineColor` in the feature's style properties.
 *
 * @param feature - The styled feature
 * @returns RGBA color array
 */
export function getLineColor(feature: StyledFeature): Color {
  const styleProps = feature.properties?.styleProperties;
  const color = styleProps?.lineColor ?? DEFAULT_COLORS.line;

  return normalizeColor(color);
}

/**
 * Get border/outline width for a feature.
 *
 * Named to match deck.gl's `getLineWidth` accessor convention.
 * Reads from `lineWidth` in the feature's style properties.
 *
 * @param feature - The styled feature
 * @returns Border/outline width in pixels
 */
export function getLineWidth(feature: StyledFeature): number {
  const styleProps = feature.properties?.styleProperties;
  return styleProps?.lineWidth ?? DEFAULT_LINE_WIDTH;
}

/**
 * Get dash array for border/outline pattern.
 *
 * @param feature - The styled feature
 * @returns Dash array [dash, gap] or null for solid outlines
 */
export function getDashArray(feature: StyledFeature): [number, number] | null {
  const styleProps = feature.properties?.styleProperties;
  const pattern = styleProps?.linePattern ?? 'solid';

  return DASH_ARRAYS[pattern] || null;
}
