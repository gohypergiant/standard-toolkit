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

'use client';

import {
  DEFAULT_COLORS,
  HIGHLIGHT_WIDTH_INCREASE,
  HOVER_WIDTH_INCREASE,
} from '../../shared/constants';
import { getLineWidth, normalizeColor } from '../../shared/utils/style-utils';
import type { StyledFeature } from '../../shared/types';

/**
 * Get hover-enhanced border/outline width.
 *
 * Calculates the line width for a feature, increasing it when hovered to provide
 * visual feedback. The hover effect adds a fixed pixel increase to the base width.
 *
 * @param feature - The styled feature to calculate width for
 * @param isHovered - Whether the feature is currently being hovered
 * @returns The calculated line width in pixels
 *
 * @example
 * ```typescript
 * import { getHoverLineWidth } from '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/utils/display-style';
 * import type { StyledFeature } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * const feature: StyledFeature = {
 *   properties: { styleProperties: { lineWidth: 2 } }
 * };
 *
 * const width = getHoverLineWidth(feature, true);
 * // Returns: 2 + HOVER_WIDTH_INCREASE (typically 4 pixels total)
 * ```
 */
export function getHoverLineWidth(
  feature: StyledFeature,
  isHovered: boolean,
): number {
  const baseWidth = getLineWidth(feature);
  return isHovered ? baseWidth + HOVER_WIDTH_INCREASE : baseWidth;
}

/**
 * Get selection highlight color.
 *
 * Returns the default highlight color with optional custom opacity override.
 * The highlight color is used to indicate selected features on the map.
 *
 * @param opacity - Optional opacity value (0-1 range), overrides default opacity
 * @returns RGBA color array [red, green, blue, alpha] with values 0-255
 *
 * @example
 * ```typescript
 * import { getHighlightColor } from '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/utils/display-style';
 *
 * // Use default highlight color with default opacity
 * const defaultColor = getHighlightColor();
 * // Returns: [r, g, b, a] from DEFAULT_COLORS.highlight
 *
 * // Use custom opacity (50% transparent)
 * const semiTransparent = getHighlightColor(0.5);
 * // Returns: [r, g, b, 127]
 * ```
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
 * Get highlight border/outline width.
 *
 * Calculates the line width for a selected/highlighted feature by adding a fixed
 * pixel increase to the base width. This makes selected features more prominent.
 *
 * @param feature - The styled feature to calculate width for
 * @returns The calculated line width in pixels (base width + HIGHLIGHT_WIDTH_INCREASE)
 *
 * @example
 * ```typescript
 * import { getHighlightLineWidth } from '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/utils/display-style';
 * import type { StyledFeature } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * const feature: StyledFeature = {
 *   properties: { styleProperties: { lineWidth: 2 } }
 * };
 *
 * const width = getHighlightLineWidth(feature);
 * // Returns: 2 + HIGHLIGHT_WIDTH_INCREASE (typically 5 pixels total)
 * ```
 */
export function getHighlightLineWidth(feature: StyledFeature): number {
  const baseWidth = getLineWidth(feature);
  return baseWidth + HIGHLIGHT_WIDTH_INCREASE;
}

/**
 * Brighten an RGBA color by multiplying RGB channels by a factor.
 * Alpha is preserved unchanged.
 *
 * @param color - RGBA color tuple [r, g, b, a] (0-255)
 * @param factor - Multiplier for RGB channels (e.g. 1.5 = 50% brighter)
 * @returns Brightened RGBA color, clamped to 0-255
 */
export function brightenColor(
  color: [number, number, number, number],
  factor: number,
): [number, number, number, number] {
  return [
    Math.min(255, Math.round(color[0] * factor)),
    Math.min(255, Math.round(color[1] * factor)),
    Math.min(255, Math.round(color[2] * factor)),
    color[3],
  ];
}
