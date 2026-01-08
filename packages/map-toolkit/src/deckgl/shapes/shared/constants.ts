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

import { DEFAULT_TEXT_STYLE } from '../../text-settings';
import type { Color } from '@deck.gl/core';
import type { StyleProperties } from './types';

/**
 * Layer IDs for shape layers
 */
export const SHAPE_LAYER_IDS = {
  DISPLAY: 'DISPLAY_SHAPES',
  DISPLAY_HIGHLIGHT: 'DISPLAY_SHAPES::Highlight',
  DISPLAY_LABELS: 'DISPLAY_SHAPES::Labels',
} as const;

/**
 * Base fill opacity multiplier for standard semi-transparent look.
 * Multiplies alpha by 0.2 (reduces to 20% of original opacity).
 */
export const BASE_FILL_OPACITY = 0.2;

/**
 * Default border/outline width in pixels when not specified in styleProperties
 */
export const DEFAULT_LINE_WIDTH = 2;

/**
 * Additional pixels added to border/outline width on hover
 */
export const HOVER_WIDTH_INCREASE = 2;

/**
 * Additional pixels added to border/outline width for selection highlight
 */
export const HIGHLIGHT_WIDTH_INCREASE = 5;

/**
 * Fixed opacity for label background (0-255)
 */
export const LABEL_BACKGROUND_OPACITY = 200;

/**
 * Fixed opacity for label border (0-255)
 */
export const LABEL_BORDER_OPACITY = 255;

/**
 * Default colors as RGBA arrays for DeckGL layers.
 *
 * These are the canonical color values used throughout the shapes system.
 * All other color constants should derive from these to maintain consistency.
 */
export const DEFAULT_COLORS = {
  /** Default fill color (white at full alpha) */
  fill: [255, 255, 255, 255] as Color,
  /** Default border/outline color (outline-interactive-hover: #888a8f) */
  line: [136, 138, 143, 255] as Color,
  /** Highlight/selection color (turquoise at ~39% alpha) */
  highlight: [40, 245, 190, 100] as Color,
} as const;

/**
 * Tentative (during-drawing) colors.
 *
 * These colors are used for the shape preview while drawing.
 * Fill is semi-transparent (8% opacity) to not obscure underlying features.
 * Border/outline uses the same color as saved shapes for consistency.
 */
export const DEFAULT_TENTATIVE_COLORS = {
  /** Tentative fill color (white at 8% opacity: 0.08 * 255 ≈ 20) */
  fill: [255, 255, 255, 20] as Color,
  /** Tentative border/outline color (same as saved shapes for consistency) */
  line: DEFAULT_COLORS.line,
} as const;

/**
 * Default style properties for saved shapes.
 *
 * These are applied when a shape is completed/saved.
 * Can be overridden via styleDefaults in draw options.
 */
export const DEFAULT_STYLE_PROPERTIES: StyleProperties = {
  fillColor: DEFAULT_COLORS.fill,
  lineColor: DEFAULT_COLORS.line,
  lineWidth: 2,
  linePattern: 'solid',
};

/**
 * Border/outline width options (in pixels)
 */
export const LINE_WIDTHS = [1, 2, 4, 8] as const;

/**
 * Border/outline pattern options
 */
export const LINE_PATTERNS = ['solid', 'dashed', 'dotted'] as const;

/**
 * Dash array patterns for border/outline rendering
 */
export const DASH_ARRAYS: Record<
  'solid' | 'dashed' | 'dotted',
  [number, number] | null
> = {
  solid: null,
  dashed: [8, 4],
  dotted: [2, 4],
};

/**
 * Default tentative fill color (white at 8% opacity - rgba(255, 255, 255, 0.08))
 * Used when drawing new shapes before they're completed.
 * 0.08 * 255 ≈ 20
 */
export const DEFAULT_TENTATIVE_FILL_COLOR: Color = [255, 255, 255, 20];

/**
 * Default tentative border/outline color (outline-interactive-hover: #888a8f)
 * Used when drawing new shapes before they're completed.
 */
export const DEFAULT_TENTATIVE_LINE_COLOR: Color = [136, 138, 143, 255];

/**
 * Default edit handle color (white) - used by both draw and edit layers
 */
export const DEFAULT_EDIT_HANDLE_COLOR: Color = [255, 255, 255, 255];

/**
 * Edit handle outline color (dark for contrast)
 */
export const DEFAULT_EDIT_HANDLE_OUTLINE_COLOR: Color = [0, 0, 0, 200];

/**
 * Empty feature collection for initializing editable layers
 */
export const EMPTY_FEATURE_COLLECTION: import('geojson').FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * Custom character set for deck.gl TextLayer used by tooltip rendering.
 *
 * deck.gl's TextLayer uses SDF (Signed Distance Field) font rendering which
 * by default only supports basic ASCII characters (32-128). Special characters
 * like degree symbol (°) and superscript 2 (²) must be explicitly included
 * for tooltip text like "100.5 km²" to render correctly.
 */
export const TOOLTIP_CHARACTER_SET: string[] = ['°', '²'];

// Add standard ASCII characters (space through tilde + DEL)
for (let i = 32; i <= 128; i++) {
  TOOLTIP_CHARACTER_SET.push(String.fromCharCode(i));
}

/**
 * Sublayer props for tooltip text rendering.
 * Used by both draw-shape-layer and edit-shape-layer for area/distance tooltips.
 */
export const TOOLTIP_SUBLAYER_PROPS = {
  tooltips: {
    ...DEFAULT_TEXT_STYLE,
    fontFamily: 'Roboto MonoVariable, monospace',
    characterSet: TOOLTIP_CHARACTER_SET,
    getTextAnchor: 'start',
    getAlignmentBaseline: 'bottom',
    getPixelOffset: [8, 0],
  },
};

/**
 * Shared edit handle sublayer props for EditableGeoJsonLayer.
 * Used by both draw-shape-layer and edit-shape-layer.
 */
export const EDIT_HANDLE_SUBLAYER_PROPS = {
  editHandlePointOutline: {
    getFillColor: DEFAULT_EDIT_HANDLE_COLOR,
    getRadius: 6,
  },
  editHandlePoint: {
    getFillColor: DEFAULT_EDIT_HANDLE_COLOR,
    getRadius: 4,
  },
};

/**
 * Combined sublayer props for EditableGeoJsonLayer with tooltips and edit handles.
 * Used by both draw-shape-layer and edit-shape-layer.
 */
export const EDITABLE_LAYER_SUBLAYER_PROPS = {
  ...TOOLTIP_SUBLAYER_PROPS,
  ...EDIT_HANDLE_SUBLAYER_PROPS,
};

/**
 * Format a distance value for tooltip display.
 * Used by draw and edit mode tooltips for consistent formatting.
 *
 * @param value - The distance value to format
 * @returns The formatted string with 2 decimal places
 */
export function formatDistance(value: number): string {
  return value.toFixed(2);
}

// =============================================================================
// Tooltip Text Formatters
// =============================================================================
// These functions generate consistent tooltip text for both draw and edit modes.

/**
 * Format circle tooltip text showing diameter and area.
 *
 * @param diameter - Circle diameter in the specified units
 * @param area - Circle area in the specified units squared
 * @param unitAbbrev - Unit abbreviation (e.g., 'km', 'mi')
 * @returns Formatted tooltip text: "d: {diameter} {unit}\n{area} {unit}²"
 */
export function formatCircleTooltip(
  diameter: number,
  area: number,
  unitAbbrev: string,
): string {
  return `d: ${formatDistance(diameter)} ${unitAbbrev}\n${formatDistance(area)} ${unitAbbrev}²`;
}

/**
 * Format rectangle tooltip text showing dimensions and area.
 *
 * @param width - Rectangle width in the specified units
 * @param height - Rectangle height in the specified units
 * @param area - Rectangle area in the specified units squared
 * @param unitAbbrev - Unit abbreviation (e.g., 'km', 'mi')
 * @returns Formatted tooltip text: "{width} {unit} x {height} {unit}\n{area} {unit}²"
 */
export function formatRectangleTooltip(
  width: number,
  height: number,
  area: number,
  unitAbbrev: string,
): string {
  return `${formatDistance(width)} ${unitAbbrev} x ${formatDistance(height)} ${unitAbbrev}\n${formatDistance(area)} ${unitAbbrev}²`;
}

/**
 * Format ellipse tooltip text showing axes and area.
 *
 * @param majorAxis - Ellipse major axis (full length) in the specified units
 * @param minorAxis - Ellipse minor axis (full length) in the specified units
 * @param area - Ellipse area in the specified units squared
 * @param unitAbbrev - Unit abbreviation (e.g., 'km', 'mi')
 * @returns Formatted tooltip text: "{major} {unit} x {minor} {unit}\n{area} {unit}²"
 */
export function formatEllipseTooltip(
  majorAxis: number,
  minorAxis: number,
  area: number,
  unitAbbrev: string,
): string {
  return `${formatDistance(majorAxis)} ${unitAbbrev} x ${formatDistance(minorAxis)} ${unitAbbrev}\n${formatDistance(area)} ${unitAbbrev}²`;
}

/**
 * Format simple distance tooltip text.
 *
 * @param distance - Distance value in the specified units
 * @param unitAbbrev - Unit abbreviation (e.g., 'km', 'mi')
 * @returns Formatted tooltip text: "{distance} {unit}"
 */
export function formatDistanceTooltip(
  distance: number,
  unitAbbrev: string,
): string {
  return `${formatDistance(distance)} ${unitAbbrev}`;
}

// =============================================================================
// Edit Event Type Classification
// =============================================================================

/**
 * Continuous edit event types that fire during dragging.
 * These are emitted repeatedly while the user drags during an edit operation.
 */
export const CONTINUOUS_EDIT_TYPES = new Set([
  'movePosition',
  'unionGeometry',
  'scaling',
  'rotating',
  'translating',
]);

/**
 * Completion edit event types that fire when dragging ends.
 * These are emitted once when the user finishes an edit action.
 */
export const COMPLETION_EDIT_TYPES = new Set([
  'finishMovePosition',
  'addPosition',
  'removePosition',
  'scaled',
  'rotated',
  'translated',
]);
