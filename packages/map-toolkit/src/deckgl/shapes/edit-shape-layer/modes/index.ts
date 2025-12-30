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

import { TranslateMode, ViewMode } from '@deck.gl-community/editable-layers';
import { EllipseTransformMode } from './ellipse-transform-mode';
import { ModifyTransformMode } from './modify-transform-mode';
import { ResizeCircleTranslateMode } from './resize-circle-translate-mode';
import type { EditMode } from '../types';

/**
 * Cached edit mode instances.
 *
 * CRITICAL: Mode instances must be cached at module level to prevent
 * deck.gl assertion failures. Creating new mode instances on each render
 * causes the EditableGeoJsonLayer to fail with assertion errors.
 *
 * EllipseTransformMode combines ScaleModeWithFreeTransform, RotateMode, and
 * TranslateMode for ellipses, allowing non-uniform scaling plus rotate/translate.
 *
 * ModifyTransformMode combines ModifyMode with TransformMode for polygons,
 * rectangles, and lines, allowing vertex editing plus scale/rotate/translate.
 *
 * ResizeCircleTranslateMode combines ResizeCircleMode with TranslateMode
 * for circles, allowing resize from edge plus drag to translate.
 *
 * TranslateMode allows dragging to move the shape (used for points).
 */
const EDIT_MODE_INSTANCES = {
  view: new ViewMode(),
  'ellipse-transform': new EllipseTransformMode(),
  'modify-transform': new ModifyTransformMode(),
  'resize-circle': new ResizeCircleTranslateMode(),
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
