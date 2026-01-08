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

import {
  type DraggingEvent,
  type FeatureCollection,
  ImmutableFeatureCollection,
  type ModeProps,
  RotateMode,
  type StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import { bearing, centroid, transformRotate } from '@turf/turf';
import type { Position } from 'geojson';

/** Snap interval in degrees (45° = 8 positions around the circle) */
const SNAP_INTERVAL_DEGREES = 45;

/**
 * Calculate the angle between two points relative to a centroid.
 * Uses turfBearing for geographic bearing convention (matches parent RotateMode).
 * Returns angle in degrees.
 *
 * Note: centroid must be a turf Point Feature (not just coordinates) to match
 * the parent RotateMode's behavior exactly.
 */
function getRotationAngle(
  centroidFeature: ReturnType<typeof centroid>,
  startPoint: Position,
  endPoint: Position,
): number {
  const bearing1 = bearing(centroidFeature, startPoint);
  const bearing2 = bearing(centroidFeature, endPoint);
  return bearing2 - bearing1;
}

/**
 * Snap an angle to the nearest interval.
 */
function snapAngle(angle: number, interval: number): number {
  return Math.round(angle / interval) * interval;
}

/**
 * Extends RotateMode to support snapping rotation to 45° intervals.
 *
 * Features:
 * - Default: Free rotation
 * - With modeConfig.snapRotation = true: Snap to 45° intervals (0°, 45°, 90°, etc.)
 *
 * This allows precise alignment of shapes to common angles.
 */
export class RotateModeWithSnap extends RotateMode {
  /**
   * Override handleDragging to support snapped rotation.
   * When snapRotation is true, rotates to nearest 45° interval.
   * When snapRotation is false, delegates to parent for standard rotation.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    const snapRotation = props.modeConfig?.snapRotation ?? false;

    // If not snapping, use parent's rotation logic
    if (!snapRotation) {
      super.handleDragging(event, props);
      return;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    const self = this as any;

    if (!self._isRotating) {
      return;
    }

    const rotateAction = this.getRotateActionWithSnap(
      event.pointerDownMapCoords,
      event.mapCoords,
      'rotating',
      props,
    );

    if (rotateAction) {
      props.onEdit(rotateAction);
    }

    event.cancelPan();
  }

  /**
   * Override handleStopDragging to emit the final rotated geometry with snap.
   * When snapRotation is false, delegates to parent for standard rotation.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    const snapRotation = props.modeConfig?.snapRotation ?? false;

    // If not snapping, use parent's rotation logic
    if (!snapRotation) {
      super.handleStopDragging(event, props);
      return;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    const self = this as any;

    if (self._isRotating) {
      const rotateAction = this.getRotateActionWithSnap(
        event.pointerDownMapCoords,
        event.mapCoords,
        'rotated',
        props,
      );

      if (rotateAction) {
        props.onEdit(rotateAction);
      }

      // Reset state
      self._geometryBeingRotated = null;
      self._selectedEditHandle = null;
      self._isRotating = false;
    }
  }

  /**
   * Get a rotate action, optionally snapping to 45° intervals.
   */
  private getRotateActionWithSnap(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    const self = this as any;

    if (!self._geometryBeingRotated) {
      return null;
    }

    const geometry = self._geometryBeingRotated as FeatureCollection;
    // @ts-expect-error turf types differ from editable-layers types
    const centerFeature = centroid(geometry);

    // Calculate the rotation angle (pass centroid Feature to match parent RotateMode)
    let angle = getRotationAngle(centerFeature, startDragPoint, currentPoint);

    // Snap to 45° intervals if enabled
    const snapRotation = props.modeConfig?.snapRotation ?? false;
    if (snapRotation) {
      angle = snapAngle(angle, SNAP_INTERVAL_DEGREES);
    }

    // Apply the rotation using turf (use centroid Feature as pivot to match parent)
    // @ts-expect-error turf types differ from editable-layers types
    const rotatedFeatures: FeatureCollection = transformRotate(
      // @ts-expect-error turf types differ from editable-layers types
      geometry,
      angle,
      {
        pivot: centerFeature,
      },
    );

    // Build the updated data using ImmutableFeatureCollection (matches parent RotateMode)
    const selectedIndexes = props.selectedIndexes;
    let updatedData = new ImmutableFeatureCollection(props.data);

    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = rotatedFeatures.features[i];
      if (selectedIndex !== undefined && movedFeature) {
        updatedData = updatedData.replaceGeometry(
          selectedIndex,
          movedFeature.geometry,
        );
      }
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      editContext: {
        featureIndexes: selectedIndexes,
      },
    };
  }
}
