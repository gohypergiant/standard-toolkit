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
 * Base fill opacity multiplier (20%) for standard semi-transparent look
 */
export const BASE_FILL_OPACITY = 0.2;

/**
 * Default stroke width in pixels when not specified in styleProperties
 */
export const DEFAULT_STROKE_WIDTH = 2;

/**
 * Additional pixels added to stroke width on hover
 */
export const HOVER_WIDTH_INCREASE = 2;

/**
 * Additional pixels added to stroke width for selection highlight
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
 * Default colors as RGBA arrays for DeckGL layers
 */
export const DEFAULT_COLORS = {
  /** Default fill color (background-surface-muted gray at full alpha) */
  fill: [255, 255, 255, 255] as Color,
  /** Default stroke color (outline-interactive-hover gray at full alpha) */
  stroke: [136, 138, 143, 255] as Color,
  /** Highlight/selection color (turquoise at ~39% alpha) */
  highlight: [40, 245, 190, 100] as Color,
} as const;

/**
 * Default style properties for new shapes
 */
export const DEFAULT_STYLE_PROPERTIES: StyleProperties = {
  fillColor: DEFAULT_COLORS.fill,
  strokeColor: DEFAULT_COLORS.stroke,
  strokeWidth: 2,
  strokePattern: 'solid',
};

/**
 * Stroke width options
 */
export const STROKE_WIDTHS = [1, 2, 4, 8] as const;

/**
 * Stroke pattern options
 */
export const STROKE_PATTERNS = ['solid', 'dashed', 'dotted'] as const;

/**
 * Dash array patterns for stroke rendering
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
 * Default tentative line color (outline-interactive-hover: #888a8f)
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
 * Vertical offset in pixels for tooltip positioning below the cursor.
 * Used by draw and edit mode tooltips.
 */
export const TOOLTIP_Y_OFFSET = 60;

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
