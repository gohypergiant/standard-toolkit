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
 * Returns the pre-instantiated drawing mode for the specified shape type.
 * Modes are cached at module level to prevent deck.gl assertion failures
 * that occur when creating new mode instances on each render.
 *
 * @param shapeType - The shape type to get the mode for
 * @returns The cached mode instance for drawing that shape type
 *
 * @example
 * ```typescript
 * import { getModeInstance } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/modes';
 * import { ShapeFeatureType } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * // Get the mode for drawing circles
 * const circleMode = getModeInstance(ShapeFeatureType.Circle);
 *
 * // Use with EditableGeoJsonLayer
 * const layer = new EditableGeoJsonLayer({
 *   mode: circleMode,
 *   // ... other props
 * });
 * ```
 */
export function getModeInstance(
  shapeType: ShapeFeatureType,
): (typeof MODE_INSTANCES)[ShapeFeatureType] {
  return MODE_INSTANCES[shapeType];
}

/**
 * Get the view mode instance (for when not drawing).
 *
 * Returns the pre-instantiated ViewMode which is the default mode when
 * no drawing operation is active. This mode allows viewing and interacting
 * with the map without drawing new shapes.
 *
 * @returns The cached ViewMode instance
 *
 * @example
 * ```typescript
 * import { getViewModeInstance } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/modes';
 *
 * // Get the view mode (default when not drawing)
 * const viewMode = getViewModeInstance();
 *
 * // Use with EditableGeoJsonLayer
 * const layer = new EditableGeoJsonLayer({
 *   mode: viewMode,
 *   // ... other props
 * });
 * ```
 */
export function getViewModeInstance(): ViewMode {
  return MODE_INSTANCES.view;
}

/**
 * Trigger double-click finish on the active drawing mode.
 *
 * This is a workaround for @deck.gl-community/editable-layers ~9.1 which doesn't
 * register 'dblclick' in EVENT_TYPES. We listen for dblclick at the DOM level
 * and call this function to finish drawing.
 *
 * Only LineString and Polygon modes support double-click to finish. Other shape
 * types are completed with a single click and ignore this call.
 *
 * @param shapeType - The shape type currently being drawn
 * @see https://github.com/visgl/deck.gl-community/pull/225
 *
 * @example
 * ```typescript
 * import { triggerDoubleClickFinish } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/modes';
 * import { ShapeFeatureType } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * // Listen for double-click at the DOM level
 * mapContainer.addEventListener('dblclick', () => {
 *   if (currentShapeType === ShapeFeatureType.Polygon) {
 *     triggerDoubleClickFinish(currentShapeType);
 *   }
 * });
 * ```
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
