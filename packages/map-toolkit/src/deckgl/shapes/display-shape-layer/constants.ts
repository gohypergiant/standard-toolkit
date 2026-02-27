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
import { PathStyleExtension } from '@deck.gl/extensions';
import { DEFAULT_COLORS } from '../shared/constants';
import type { Rgba255Tuple } from '@accelint/predicates';

/**
 * Map interaction constants.
 *
 * Values derived from ngc2 for consistency with existing UI patterns.
 * Controls sizing and interaction feedback for shape rendering.
 */
export const MAP_INTERACTION = {
  LINE_WIDTH_MIN_PIXELS: 1, // Minimum line width in pixels
  ICON_SIZE: 38, // Size of shape icons
  ICON_HOVER_SIZE_INCREASE: 5, // Additional pixels added on hover
} as const;

/**
 * Coffin corners configuration for Point selection/hover feedback.
 *
 * Coffin corners are bracket-like corners that appear around Point shapes
 * with icons to indicate hover and selection states. They provide visual
 * feedback without obscuring the icon itself.
 */
export const COFFIN_CORNERS = {
  /** Icon name for hover state (white corners with background fill) */
  HOVER_ICON: 'coffin-corners-hover',
  /** Icon name for selected state (blue corners, no fill) */
  SELECTED_ICON: 'coffin-corners-selected',
  /** Icon name for selected+hover state (blue corners with background fill) */
  SELECTED_HOVER_ICON: 'coffin-corners-selected-hover',
  /** Size of the coffin corners icon */
  SIZE: 38,
} as const;

/**
 * Default props for DisplayShapeLayer.
 *
 * Provides sensible defaults for interactive shape display with labels,
 * standard opacity handling, and minimal visual feedback. These can be
 * overridden via layer props.
 */
export const DEFAULT_DISPLAY_PROPS = {
  pickable: true,
  showLabels: 'always' as const,
  showHighlight: false,
  applyBaseOpacity: true,
  highlightColor: DEFAULT_COLORS.highlight,
};

/**
 * Material settings for lighting effects on polygon shapes.
 * Controls fill brightness for hover and selection overlay layers.
 * Keys mirror BRIGHTNESS_FACTOR for consistency.
 */
export const MATERIAL_SETTINGS = {
  // Normal state - standard lighting
  NORMAL: {
    ambient: 0.35,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [255, 255, 255] as [number, number, number],
  },
  // Hovered or selected (single active state)
  HOVER_OR_SELECT: {
    ambient: 0.6,
    diffuse: 0.8,
    shininess: 64,
    specularColor: [255, 255, 255] as [number, number, number],
  },
  // Hovered and selected simultaneously - brighter
  HOVER_AND_SELECT: {
    ambient: 0.75,
    diffuse: 0.95,
    shininess: 80,
    specularColor: [255, 255, 255] as [number, number, number],
  },
} as const;

/**
 * Brightness multipliers for interaction state feedback.
 * Applied via brightenColor() to line colors, curtains, and elevation indicators.
 * - HOVER_OR_SELECT: shape is hovered or selected (single active state)
 * - HOVER_AND_SELECT: shape is both hovered and selected simultaneously
 */
export const BRIGHTNESS_FACTOR = {
  HOVER_OR_SELECT: 1.4,
  HOVER_AND_SELECT: 1.7,
} as const;

/**
 * Opacity multiplier for interaction overlay layers (hover, select).
 * Applied to the shape's fill alpha — sits between the base opacity (0.2)
 * and full opacity (1.0) so the overlay reads clearly without being too solid.
 */
export const OVERLAY_FILL_OPACITY = 0.25;

/** Reusable deck.gl PathStyleExtension enabling dash patterns on GeoJsonLayer lines. */
export const DASH_EXTENSION = [new PathStyleExtension({ dash: true })];

/** Mutable [r, g, b, a] tuple of DEFAULT_COLORS.highlight, pre-spread at module load for hot-path usage. */
export const HIGHLIGHT_COLOR_TUPLE: Rgba255Tuple = [
  ...DEFAULT_COLORS.highlight,
] as unknown as Rgba255Tuple;
