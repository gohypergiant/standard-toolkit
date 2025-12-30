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
 * Cursor mapping for each shape type (all use crosshair)
 */
export const DRAW_CURSOR_MAP: Record<ShapeFeatureType, CSSCursorType> = {
  [ShapeFeatureType.Point]: DRAW_CURSOR,
  [ShapeFeatureType.LineString]: DRAW_CURSOR,
  [ShapeFeatureType.Polygon]: DRAW_CURSOR,
  [ShapeFeatureType.Rectangle]: DRAW_CURSOR,
  [ShapeFeatureType.Circle]: DRAW_CURSOR,
  [ShapeFeatureType.Ellipse]: DRAW_CURSOR,
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
