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

import {
  type ClickEvent,
  type DraggingEvent,
  type FeatureCollection,
  GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type StartDraggingEvent,
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';

/**
 * Edit mode for Point shapes that supports both click-to-place and drag behaviors.
 *
 * ## Capabilities
 * This mode provides two ways to reposition a point:
 * - **Click on empty space**: Instantly moves the point to the clicked location
 * - **Drag the point**: Traditional click-and-drag behavior (via TranslateMode)
 *
 * ## Behavior Details
 * - Clicking anywhere on the map (that isn't the point itself) repositions the point
 * - Clicking directly on the point and dragging works as traditional translation
 * - Both behaviors emit the 'translated' edit type for consistency with existing event handling
 *
 * @example
 * ```typescript
 * import { PointTranslateMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/point-translate-mode';
 * import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
 *
 * // Used internally by EditShapeLayer for points
 * const mode = new PointTranslateMode();
 *
 * const layer = new EditableGeoJsonLayer({
 *   mode,
 *   data: pointFeatureCollection,
 *   selectedFeatureIndexes: [0],
 *   onEdit: handleEdit,
 * });
 * ```
 */
export class PointTranslateMode extends GeoJsonEditMode {
  private translateMode = new TranslateMode();

  /**
   * Handle click events to reposition the point.
   *
   * If the click is on empty map space (not on the point itself),
   * moves the point to the clicked location immediately.
   *
   * @param event - Click event containing map coordinates and pick information
   * @param props - Mode props containing data, selected indexes, and edit callback
   */
  override handleClick(
    event: ClickEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // If clicked on the point itself or a guide, let drag handle it
    const clickedOnFeature = event.picks?.some(
      (pick) => pick.isGuide || pick.featureIndex !== undefined,
    );

    if (clickedOnFeature) {
      return;
    }

    const { mapCoords } = event;
    const selectedIndex = props.selectedIndexes?.[0];

    if (selectedIndex === undefined) {
      return;
    }

    const feature = props.data.features[selectedIndex];

    if (!feature) {
      return;
    }

    // Create updated feature with new coordinates
    const updatedFeature = {
      ...feature,
      geometry: {
        type: 'Point' as const,
        coordinates: mapCoords,
      },
    };

    // Emit edit action with 'translated' type to work with existing completion handlers
    props.onEdit({
      updatedData: {
        ...props.data,
        features: [updatedFeature],
      },
      editType: 'translated',
      editContext: {
        featureIndexes: [selectedIndex],
      },
    });
  }

  /**
   * Delegate pointer move events to TranslateMode for cursor updates.
   *
   * @param event - Pointer move event with current cursor position
   * @param props - Mode props containing state and configuration
   */
  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    this.translateMode.handlePointerMove(event, props);
  }

  /**
   * Delegate start dragging to TranslateMode for traditional drag behavior.
   *
   * @param event - Drag start event with pointer down coordinates
   * @param props - Mode props containing data and edit callback
   */
  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    this.translateMode.handleStartDragging(event, props);
  }

  /**
   * Delegate dragging to TranslateMode for traditional drag behavior.
   *
   * @param event - Dragging event with current and previous pointer positions
   * @param props - Mode props containing data and edit callback
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    this.translateMode.handleDragging(event, props);
  }

  /**
   * Delegate stop dragging to TranslateMode for traditional drag behavior.
   *
   * @param event - Drag stop event with final pointer position
   * @param props - Mode props containing data and edit callback
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    this.translateMode.handleStopDragging(event, props);
  }

  /**
   * Delegate guide rendering to TranslateMode.
   *
   * @param props - Mode props containing data and selected indexes
   * @returns Guide feature collection for rendering edit handles
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    return this.translateMode.getGuides(props);
  }
}
