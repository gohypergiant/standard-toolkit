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
  HIGHLIGHT_WIDTH_INCREASE,
  HOVER_WIDTH_INCREASE,
} from '../../shared/constants';
import { getFillColor, getLineWidth } from '../../shared/utils/style-utils';
import { OVERLAY_FILL_OPACITY } from '../constants';
import type { Rgba255Tuple } from '@accelint/predicates';
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
 * Scale the alpha channel of a raw RGBA color by OVERLAY_FILL_OPACITY.
 * Used by interaction overlay layers (hover, select, curtains) to sit at
 * a consistent opacity between the base layer (0.2) and fully solid (1.0).
 *
 * @param color - RGBA color tuple [r, g, b, a] (0-255)
 * @returns Color with alpha multiplied by OVERLAY_FILL_OPACITY
 * @example
 * ```typescript
 * applyOverlayOpacity([255, 128, 0, 200]);
 * // → [255, 128, 0, 50]  (200 × 0.25)
 * ```
 */
export function applyOverlayOpacity(
  color: Rgba255Tuple,
): [number, number, number, number] {
  return [
    color[0],
    color[1],
    color[2],
    Math.round(color[3] * OVERLAY_FILL_OPACITY),
  ];
}

/**
 * Get fill color for interaction overlay layers (hover, select).
 *
 * Returns the shape's fill color with alpha scaled by OVERLAY_FILL_OPACITY —
 * more opaque than the base-opacity main layer but not fully solid, so the
 * material brightness effect reads clearly without looking like a solid block.
 *
 * @param feature - The styled feature
 * @returns RGBA color with alpha multiplied by OVERLAY_FILL_OPACITY
 * @example
 * ```typescript
 * // Feature with fillColor [98, 166, 255, 255]
 * getOverlayFillColor(feature); // → [98, 166, 255, 64]
 * ```
 */
export function getOverlayFillColor(
  feature: StyledFeature,
): [number, number, number, number] {
  return applyOverlayOpacity(getFillColor(feature));
}

/**
 * Brighten an RGBA color by multiplying RGB channels by a factor.
 * Alpha is preserved unchanged.
 *
 * @param color - RGBA color tuple [r, g, b, a] (0-255)
 * @param factor - Multiplier for RGB channels (e.g. 1.5 = 50% brighter)
 * @returns Brightened RGBA color, clamped to 0-255
 *
 * @example
 * ```typescript
 * const brighter = brightenColor([100, 150, 200, 255], 1.5);
 * // Returns: [150, 225, 255, 255] — RGB multiplied by 1.5, alpha unchanged
 * ```
 */
export function brightenColor(
  color: Rgba255Tuple,
  factor: number,
): [number, number, number, number] {
  return [
    Math.min(255, Math.round(color[0] * factor)),
    Math.min(255, Math.round(color[1] * factor)),
    Math.min(255, Math.round(color[2] * factor)),
    color[3],
  ];
}
