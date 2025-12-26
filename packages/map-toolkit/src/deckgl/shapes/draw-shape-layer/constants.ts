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

import { ShapeFeatureType } from '../shared/types';
import type { Color } from '@deck.gl/core';
import type { FeatureCollection } from 'geojson';
import type { CSSCursorType } from '../../../map-cursor/types';

/**
 * Mode name for the map-mode integration
 */
export const DRAW_SHAPE_MODE = 'draw-shape';

/**
 * Identifier for the draw shape layer.
 * Used as the owner for map-mode/cursor and as the default layer ID.
 */
export const DRAW_SHAPE_LAYER_ID = 'draw-shape-layer';

/**
 * Cursor type to use when drawing shapes
 */
export const DRAW_CURSOR: CSSCursorType = 'crosshair';

/**
 * Y-offset in screen pixels for tooltip positioning below cursor.
 * Set to 60 to provide clearance below the crosshair cursor.
 */
export const TOOLTIP_Y_OFFSET = 60;

/**
 * Cursor mapping for each shape type (all use crosshair)
 */
export const DRAW_CURSOR_MAP: Record<ShapeFeatureType, CSSCursorType> = {
  [ShapeFeatureType.Point]: DRAW_CURSOR,
  [ShapeFeatureType.LineString]: DRAW_CURSOR,
  [ShapeFeatureType.Polygon]: DRAW_CURSOR,
  [ShapeFeatureType.Rectangle]: DRAW_CURSOR,
  [ShapeFeatureType.Circle]: DRAW_CURSOR,
};

/**
 * Default tentative fill color (white at 8% opacity - rgba(255, 255, 255, 0.08))
 * 0.08 * 255 ≈ 20
 */
export const DEFAULT_TENTATIVE_FILL_COLOR: Color = [255, 255, 255, 20];

/**
 * Default tentative line color (outline-interactive-hover: #888a8f)
 */
export const DEFAULT_TENTATIVE_LINE_COLOR: Color = [136, 138, 143, 255];

/**
 * Default edit handle color (white)
 */
export const DEFAULT_EDIT_HANDLE_COLOR: Color = [255, 255, 255, 255];

/**
 * Empty feature collection for initializing the editable layer
 */
export const EMPTY_FEATURE_COLLECTION: FeatureCollection = {
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
 * Sublayer props for EditableGeoJsonLayer's internal layers.
 * Configures tooltips, edit handles, and guide lines for drawing/editing shapes.
 */
export const TOOLTIP_SUBLAYER_PROPS = {
  tooltips: {
    getSize: 12,
    getColor: [255, 255, 255],
    outlineWidth: 7,
    outlineColor: [0, 0, 0],
    fontFamily: 'Roboto MonoVariable, monospace',
    fontWeight: 'bold',
    fontSettings: {
      sdf: true,
      fontSize: 32,
      cutoff: 0.22,
    },
    characterSet: TOOLTIP_CHARACTER_SET,
    getTextAnchor: 'start',
    getAlignmentBaseline: 'bottom',
    getPixelOffset: [8, 0],
  },
  // Edit handle styling (vertex points)
  editHandlePointOutline: {
    getFillColor: DEFAULT_EDIT_HANDLE_COLOR,
    getRadius: 6,
  },
  editHandlePoint: {
    getFillColor: DEFAULT_EDIT_HANDLE_COLOR,
    getRadius: 4,
  },
};
