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

import { DrawPointMode, ViewMode } from '@deck.gl-community/editable-layers';
import { ShapeFeatureType } from '../../shared/types';
import { DrawCircleModeWithTooltip } from './draw-circle-mode-with-tooltip';
import { DrawEllipseModeWithTooltip } from './draw-ellipse-mode-with-tooltip';
import { DrawLineStringModeWithTooltip } from './draw-line-string-mode-with-tooltip';
import { DrawPolygonModeWithTooltip } from './draw-polygon-mode-with-tooltip';
import { DrawRectangleModeWithTooltip } from './draw-rectangle-mode-with-tooltip';

export { DrawCircleModeWithTooltip } from './draw-circle-mode-with-tooltip';
export { DrawEllipseModeWithTooltip } from './draw-ellipse-mode-with-tooltip';
export { DrawLineStringModeWithTooltip } from './draw-line-string-mode-with-tooltip';
export { DrawPolygonModeWithTooltip } from './draw-polygon-mode-with-tooltip';
export { DrawRectangleModeWithTooltip } from './draw-rectangle-mode-with-tooltip';

/**
 * Cached mode instances.
 *
 * CRITICAL: Mode instances must be cached at module level to prevent
 * deck.gl assertion failures. Creating new mode instances on each render
 * causes the EditableGeoJsonLayer to fail with assertion errors.
 */
const MODE_INSTANCES = {
  [ShapeFeatureType.Point]: new DrawPointMode(),
  [ShapeFeatureType.LineString]: new DrawLineStringModeWithTooltip(),
  [ShapeFeatureType.Polygon]: new DrawPolygonModeWithTooltip(),
  [ShapeFeatureType.Rectangle]: new DrawRectangleModeWithTooltip(),
  [ShapeFeatureType.Circle]: new DrawCircleModeWithTooltip(),
  [ShapeFeatureType.Ellipse]: new DrawEllipseModeWithTooltip(),
  view: new ViewMode(),
};

/**
 * Get the cached mode instance for a shape type.
 *
 * @param shapeType - The shape type to get the mode for
 * @returns The cached mode instance for drawing that shape type
 */
export function getModeInstance(
  shapeType: ShapeFeatureType,
): (typeof MODE_INSTANCES)[ShapeFeatureType] {
  return MODE_INSTANCES[shapeType];
}

/**
 * Get the view mode instance (for when not drawing).
 *
 * @returns The cached ViewMode instance
 */
export function getViewModeInstance(): ViewMode {
  return MODE_INSTANCES.view;
}

/**
 * Trigger double-click finish on the active mode.
 * This is a workaround for @deck.gl-community/editable-layers ~9.1 which doesn't
 * register 'dblclick' in EVENT_TYPES. We listen for dblclick at the DOM level
 * and call this function to finish drawing.
 *
 * @param shapeType - The shape type currently being drawn
 * @see https://github.com/visgl/deck.gl-community/pull/225
 */
export function triggerDoubleClickFinish(shapeType: ShapeFeatureType): void {
  const mode = MODE_INSTANCES[shapeType];

  // Only Polygon and LineString modes support double-click to finish
  if (
    mode instanceof DrawPolygonModeWithTooltip ||
    mode instanceof DrawLineStringModeWithTooltip
  ) {
    mode.handleDoubleClick();
  }
}
