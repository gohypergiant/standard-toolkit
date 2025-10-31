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

import { DASH_ARRAYS, DEFAULT_COLORS } from '../../shared/constants';
import type { Color } from '@deck.gl/core';
import type { StyledFeature } from '../../shared/types';

/**
 * Convert hex color string to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b = Number.parseInt(cleanHex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * Create a color accessor function with opacity support
 *
 * @param colorKey Style property key for color (e.g., 'fillColor')
 * @param opacityKey Style property key for opacity (e.g., 'fillOpacity')
 * @param baseOpacity Base opacity multiplier (0-1)
 * @param fallbackColor Fallback RGB color if property not found
 * @returns Color accessor function
 */
function createColorAccessor(
  colorKey: 'fillColor' | 'strokeColor',
  opacityKey: 'fillOpacity' | 'strokeOpacity',
  baseOpacity: number,
  fallbackColor: [number, number, number],
): (feature: StyledFeature) => Color {
  return (feature: StyledFeature): Color => {
    const styleProps = feature.properties?.styleProperties;

    if (!styleProps) {
      return [...fallbackColor, Math.round(baseOpacity * 255)];
    }

    // Get color
    const hexColor = styleProps[colorKey];
    const rgb = hexColor ? hexToRgb(hexColor) : fallbackColor;

    // Get opacity (0-100 percentage)
    const userOpacity = styleProps[opacityKey] ?? 100;

    // Calculate final opacity: (user% / 100) * baseOpacity * 255
    const finalOpacity = Math.round((userOpacity / 100) * baseOpacity * 255);

    return [...rgb, finalOpacity] as Color;
  };
}

/**
 * Get fill color for a feature
 */
export const getFillColor = createColorAccessor(
  'fillColor',
  'fillOpacity',
  0.59, // Base fill opacity from ngc2
  DEFAULT_COLORS.fill,
);

/**
 * Get stroke color for a feature
 */
export const getStrokeColor = createColorAccessor(
  'strokeColor',
  'strokeOpacity',
  1.0, // Full stroke opacity
  DEFAULT_COLORS.stroke,
);

/**
 * Get line width for a feature
 */
export function getLineWidth(feature: StyledFeature): number {
  const styleProps = feature.properties?.styleProperties;
  return styleProps?.strokeWidth ?? 2;
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
 */
export function getHighlightColor(
  opacity = 0.39,
): [number, number, number, number] {
  return [...DEFAULT_COLORS.highlight, Math.round(opacity * 255)] as [
    number,
    number,
    number,
    number,
  ];
}

/**
 * Get highlight line width (base width + increase)
 */
export function getHighlightLineWidth(feature: StyledFeature): number {
  const baseWidth = getLineWidth(feature);
  return baseWidth + 10;
}
