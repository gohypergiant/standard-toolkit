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
/**
 * Drawing Constants
 *
 * Constants used by the DrawShapeLayer for map-mode and cursor integration.
 *
 * ## Map Mode Integration
 * The drawing system uses a protected mode (`DRAW_SHAPE_MODE`) that prevents
 * other map features from changing the mode or cursor while a shape is being drawn.
 * This ensures drawing operations are not interrupted by other interactions.
 *
 * ## Cursor Management
 * All shape types use the crosshair cursor (`DRAW_CURSOR`) during drawing operations.
 * The cursor is automatically set when drawing starts and restored when complete.
 *
 * ## Layer Identification
 * The `DRAW_SHAPE_LAYER_ID` serves dual purposes:
 * - Default ID for the EditableGeoJsonLayer instance
 * - Owner identifier for map-mode and cursor requests
 *
 * @example
 * ```typescript
 * import { DRAW_SHAPE_MODE, DRAW_CURSOR, DRAW_SHAPE_LAYER_ID } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer';
 *
 * // Request drawing mode and cursor
 * requestModeAndCursor(mapId, DRAW_SHAPE_MODE, DRAW_CURSOR, DRAW_SHAPE_LAYER_ID);
 *
 * // Release when done
 * releaseModeAndCursor(mapId, DRAW_SHAPE_LAYER_ID);
 * ```
 */
import { ShapeFeatureType } from '../shared/types';
import type { CSSCursorType } from '@/map-cursor/types';

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
