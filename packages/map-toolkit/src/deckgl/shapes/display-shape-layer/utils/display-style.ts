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
} from '../../shared/constants';
import type { Color } from '@deck.gl/core';
import type { StyledFeature } from '../../shared/types';

/**
 * Get fill color for a feature
 * Colors are passed through as-is unless applyBaseOpacity is true
 *
 * @param feature - The styled feature
 * @param applyBaseOpacity - When true, multiplies alpha by BASE_FILL_OPACITY (0.6)
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
 * Get stroke color for a feature
 * Strokes are always rendered at their literal alpha value
 *
 * @param feature - The styled feature
 * @returns RGBA color array
 */
export function getStrokeColor(feature: StyledFeature): Color {
  const styleProps = feature.properties?.styleProperties;
  const color = styleProps?.strokeColor ?? DEFAULT_COLORS.stroke;

  return normalizeColor(color);
}

/**
 * Normalize a Color to a 4-element RGBA array
 * Handles RGB arrays (adds alpha 255), RGBA arrays, and typed arrays
 */
function normalizeColor(color: Color): [number, number, number, number] {
  if (color instanceof Uint8Array || color instanceof Uint8ClampedArray) {
    return [color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 255];
  }

  // Handle RGB (3-element) or RGBA (4-element) arrays
  return [color[0], color[1], color[2], color[3] ?? 255];
}

/**
 * Get line width for a feature
 */
export function getLineWidth(feature: StyledFeature): number {
  const styleProps = feature.properties?.styleProperties;
  return styleProps?.strokeWidth ?? 4;
}

/**
 * Alias for getLineWidth (for compatibility)
 */
export const getStrokeWidth = getLineWidth;

/**
 * Get dash array for stroke pattern
 */
export function getDashArray(feature: StyledFeature): [number, number] | null {
  const styleProps = feature.properties?.styleProperties;
  const pattern = styleProps?.strokePattern ?? 'solid';

  return DASH_ARRAYS[pattern] || null;
}

/**
 * Get hover-enhanced line width
 */
export function getHoverLineWidth(
  feature: StyledFeature,
  isHovered: boolean,
): number {
  const baseWidth = getLineWidth(feature);
  return isHovered ? baseWidth + 2 : baseWidth;
}

/**
 * Get selection highlight color
 * Returns the default highlight color or allows custom opacity override
 */
export function getHighlightColor(
  opacity?: number,
): [number, number, number, number] {
  const rgba = normalizeColor(DEFAULT_COLORS.highlight);

  if (opacity !== undefined) {
    return [rgba[0], rgba[1], rgba[2], Math.round(opacity * 255)];
  }

  return rgba;
}

/**
 * Get highlight line width (base width + increase)
 */
export function getHighlightLineWidth(feature: StyledFeature): number {
  const baseWidth = getLineWidth(feature);
  return baseWidth + 10;
}
