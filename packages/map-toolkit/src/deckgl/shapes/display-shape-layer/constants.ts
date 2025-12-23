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

/**
 * Map interaction constants
 * Values derived from ngc2 for consistency
 */
export const MAP_INTERACTION = {
  LINE_WIDTH_MIN_PIXELS: 1, // Minimum line width in pixels
  ICON_SIZE: 38, // Size of shape icons
  ICON_HOVER_SIZE_INCREASE: 5, // Additional pixels added on hover
} as const;

/**
 * Selection highlight configuration
 */
export const SELECTION_HIGHLIGHT = {
  COLOR: [40, 245, 190, 100] as [number, number, number, number], // Turquoise/cyan at ~39% opacity
  ICON_SIZE_INCREASE: 8, // Additional pixels for highlight icon
} as const;

/**
 * Coffin corners configuration for Point selection/hover feedback
 * Coffin corners are bracket-like corners that appear around points
 */
export const COFFIN_CORNERS = {
  /** Icon name for hover state (white fill with black stroke) */
  HOVER_ICON: 'coffin-corners-hover',
  /** Icon name for selected state (blue fill with black stroke) */
  SELECTED_ICON: 'coffin-corners-selected',
  /** Size of the coffin corners icon */
  SIZE: 38,
} as const;

/**
 * Default props for DisplayShapeLayer
 */
export const DEFAULT_DISPLAY_PROPS = {
  pickable: true,
  showLabels: true,
  showHighlight: false,
  applyBaseOpacity: true,
  highlightColor: SELECTION_HIGHLIGHT.COLOR,
};
