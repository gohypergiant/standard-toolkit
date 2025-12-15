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

import type { Color } from '@deck.gl/core';
import type { StyleProperties } from './types';

/**
 * Layer IDs for shape layers
 */
export const SHAPE_LAYER_IDS = {
  DISPLAY: 'DISPLAY_SHAPES',
  DISPLAY_HIGHLIGHT: 'DISPLAY_SHAPES::Highlight',
  DISPLAY_LABELS: 'DISPLAY_SHAPES::Labels',
  EDIT: 'EDIT_SHAPES',
  EDIT_HIGHLIGHT_HOVERED: 'EDIT_SHAPES::Highlight::Hovered',
  EDIT_HIGHLIGHT_SELECTED: 'EDIT_SHAPES::Highlight::Selected',
} as const;

/**
 * Base fill opacity multiplier (60%) for standard semi-transparent look
 */
export const BASE_FILL_OPACITY = 0.6;

/**
 * Default stroke width in pixels when not specified in styleProperties
 */
export const DEFAULT_STROKE_WIDTH = 4;

/**
 * Additional pixels added to stroke width on hover
 */
export const HOVER_WIDTH_INCREASE = 2;

/**
 * Additional pixels added to stroke width for selection highlight
 */
export const HIGHLIGHT_WIDTH_INCREASE = 10;

/**
 * Fixed opacity for label background (0-255)
 */
export const LABEL_BACKGROUND_OPACITY = 200;

/**
 * Fixed opacity for label border (0-255)
 */
export const LABEL_BORDER_OPACITY = 255;

/**
 * Default style properties for new shapes
 */
export const DEFAULT_STYLE_PROPERTIES: StyleProperties = {
  fillColor: [98, 166, 255, 255] as Color,
  strokeColor: [98, 166, 255, 255] as Color,
  strokeWidth: 2,
  strokePattern: 'solid',
};

/**
 * Default colors as RGBA arrays for DeckGL layers
 */
export const DEFAULT_COLORS = {
  /** Default fill color (blue at full alpha) */
  fill: [98, 166, 255, 255] as Color,
  /** Default stroke color (blue at full alpha) */
  stroke: [98, 166, 255, 255] as Color,
  /** Highlight/selection color (turquoise at ~39% alpha) */
  highlight: [40, 245, 190, 100] as Color,
} as const;

/**
 * Validation constants
 */
export const MIN_POLYGON_POINTS = 3;
export const MIN_LINE_POINTS = 2;
export const MIN_RING_POINTS = 4; // Polygon rings must be closed
export const MAX_COORDINATE_VALUE = 180;
export const MIN_COORDINATE_VALUE = -180;
export const MAX_LATITUDE = 90;
export const MIN_LATITUDE = -90;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_SHAPE_ID: 'Shape ID is required and must be valid',
  INVALID_SHAPE_NAME: 'Shape name is required',
  INVALID_GEOMETRY: 'Invalid geometry',
  INVALID_COORDINATES: 'Invalid coordinates',
  OUT_OF_RANGE_LONGITUDE: `Longitude must be between ${MIN_COORDINATE_VALUE} and ${MAX_COORDINATE_VALUE}`,
  OUT_OF_RANGE_LATITUDE: `Latitude must be between ${MIN_LATITUDE} and ${MAX_LATITUDE}`,
  INSUFFICIENT_POINTS_LINE: `LineString must have at least ${MIN_LINE_POINTS} points`,
  INSUFFICIENT_POINTS_POLYGON: `Polygon must have at least ${MIN_POLYGON_POINTS} points`,
  UNCLOSED_RING:
    'Polygon ring must be closed (first and last points must match)',
  SELF_INTERSECTING: 'Polygon has self-intersecting edges',
  DUPLICATE_POINTS: 'Shape contains duplicate consecutive points',
  INVALID_CIRCLE_RADIUS: 'Circle radius must be greater than 0',
  INVALID_CIRCLE_CENTER: 'Circle center coordinates are invalid',
  SHAPE_NEEDS_CORRECTION:
    'Shape has validation errors and needs to be corrected before saving',
} as const;

/**
 * Circle rendering constants
 */
export const CIRCLE_MIN_STEPS = 12; // Small circles
export const CIRCLE_MAX_STEPS = 120; // Large circles
export const CIRCLE_RADIUS_THRESHOLD_SMALL = 0.1; // km
export const CIRCLE_RADIUS_THRESHOLD_LARGE = 50; // km

/**
 * Coordinate formatting
 */
export const COORDINATE_DECIMAL_PLACES = 6;

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
