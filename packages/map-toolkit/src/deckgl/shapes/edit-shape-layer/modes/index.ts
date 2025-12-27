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

import { ViewMode } from '@deck.gl-community/editable-layers';
import { ModifyModeWithSquareConstraint } from './modify-mode-with-square-constraint';
import { ResizeCircleModeWithTooltip } from './resize-circle-mode-with-tooltip';
import type { EditMode } from '../types';

/**
 * Cached edit mode instances.
 *
 * CRITICAL: Mode instances must be cached at module level to prevent
 * deck.gl assertion failures. Creating new mode instances on each render
 * causes the EditableGeoJsonLayer to fail with assertion errors.
 *
 * ModifyModeWithSquareConstraint extends ModifyMode with Shift-to-square
 * constraint support for rectangles.
 */
const EDIT_MODE_INSTANCES = {
  view: new ViewMode(),
  modify: new ModifyModeWithSquareConstraint(),
  'resize-circle': new ResizeCircleModeWithTooltip(),
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
