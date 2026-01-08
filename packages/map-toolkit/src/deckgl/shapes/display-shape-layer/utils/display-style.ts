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
  DEFAULT_COLORS,
  HIGHLIGHT_WIDTH_INCREASE,
  HOVER_WIDTH_INCREASE,
} from '../../shared/constants';
import { getLineWidth, normalizeColor } from '../../shared/utils/style-utils';
import type { StyledFeature } from '../../shared/types';

/**
 * Get hover-enhanced border/outline width
 */
export function getHoverLineWidth(
  feature: StyledFeature,
  isHovered: boolean,
): number {
  const baseWidth = getLineWidth(feature);
  return isHovered ? baseWidth + HOVER_WIDTH_INCREASE : baseWidth;
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
 * Get highlight border/outline width (base width + increase)
 */
export function getHighlightLineWidth(feature: StyledFeature): number {
  const baseWidth = getLineWidth(feature);
  return baseWidth + HIGHLIGHT_WIDTH_INCREASE;
}
