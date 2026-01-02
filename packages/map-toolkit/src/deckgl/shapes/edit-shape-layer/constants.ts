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

import type { CSSCursorType } from '../../../map-cursor/types';
import type { EditMode } from './types';

/**
 * Mode name for the map-mode integration
 */
export const EDIT_SHAPE_MODE = 'edit-shape';

/**
 * Identifier for the edit shape layer.
 * Used as the owner for map-mode/cursor and as the default layer ID.
 */
export const EDIT_SHAPE_LAYER_ID = 'edit-shape-layer';

/**
 * Cursor mapping for each edit mode
 */
export const EDIT_CURSOR_MAP: Record<EditMode, CSSCursorType> = {
  view: 'default',
  'bounding-transform': 'crosshair',
  'vertex-transform': 'crosshair',
  'circle-transform': 'crosshair',
  translate: 'crosshair',
};

/**
 * Continuous edit event types that fire during dragging.
 * These are emitted repeatedly while the user drags.
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
