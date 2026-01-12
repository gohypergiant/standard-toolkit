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

import { TranslateMode, ViewMode } from '@deck.gl-community/editable-layers';
import { BoundingTransformMode } from './bounding-transform-mode';
import { CircleTransformMode } from './circle-transform-mode';
import { VertexTransformMode } from './vertex-transform-mode';
import type { EditMode } from '../types';

/**
 * Cached edit mode instances.
 *
 * CRITICAL: Mode instances must be cached at module level to prevent
 * deck.gl assertion failures. Creating new mode instances on each render
 * causes the EditableGeoJsonLayer to fail with assertion errors.
 *
 * BoundingTransformMode combines ScaleModeWithFreeTransform, RotateMode, and
 * TranslateMode for shapes without vertex editing (ellipses, rectangles),
 * allowing non-uniform scaling plus rotate/translate via bounding box handles.
 * Shows live dimension tooltips during scaling.
 *
 * VertexTransformMode combines ModifyMode with ScaleModeWithFreeTransform,
 * RotateMode, and TranslateMode for shapes that support vertex editing
 * (polygons, lines), allowing vertex manipulation plus scale/rotate/translate.
 *
 * CircleTransformMode combines ResizeCircleMode with TranslateMode
 * for circles, allowing resize from edge plus drag to translate.
 * Shows live diameter/area tooltips during resize.
 *
 * TranslateMode allows dragging to move the shape (used for points).
 */
const EDIT_MODE_INSTANCES = {
  view: new ViewMode(),
  'bounding-transform': new BoundingTransformMode(),
  'vertex-transform': new VertexTransformMode(),
  'circle-transform': new CircleTransformMode(),
  translate: new TranslateMode(),
} as const;

/**
 * Get the cached mode instance for an edit mode.
 *
 * @param mode - The edit mode to get the instance for
 * @returns The cached mode instance
 */
export function getEditModeInstance(
  mode: EditMode,
): (typeof EDIT_MODE_INSTANCES)[EditMode] {
  return EDIT_MODE_INSTANCES[mode];
}

/**
 * Get the ViewMode instance (for when not editing).
 *
 * @returns The cached ViewMode instance
 */
export function getViewModeInstance(): ViewMode {
  return EDIT_MODE_INSTANCES.view;
}
