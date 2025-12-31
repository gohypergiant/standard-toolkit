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
  CompositeMode,
  type DraggingEvent,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type StartDraggingEvent,
  type StopDraggingEvent,
  type Tooltip,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import { distance, point } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../../shared/constants';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import type { Viewport } from '@deck.gl/core';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Format a distance value for display
 */
function formatDistance(value: number): string {
  return value.toFixed(2);
}

type ActiveMode =
  | ScaleModeWithFreeTransform
  | RotateModeWithSnap
  | TranslateMode
  | null;

/**
 * Transform mode for shapes that use bounding box manipulation (no vertex editing).
 *
 * Use this mode for shapes like ellipses and rectangles where individual vertex
 * editing is not meaningful or desired. Instead, shapes are manipulated via their
 * bounding box handles.
 *
 * This composite mode provides:
 * - **Translation** (TranslateMode): Drag the shape body to move it
 * - **Scaling** (ScaleModeWithFreeTransform): Drag corner handles to resize
 *   - Default: Non-uniform scaling (can stretch/squish)
 *   - With Shift: Uniform scaling (maintains aspect ratio)
 * - **Rotation** (RotateMode): Drag top handle to rotate
 * - **Live tooltip**: Shows dimensions and area during scaling
 *
 * Unlike VertexTransformMode, this mode does NOT include vertex editing handles.
 *
 * Priority logic:
 * - If hovering over a scale handle, scaling takes priority
 * - If hovering over the rotate handle, rotation takes priority
 * - Otherwise, dragging the shape body translates it
 */
export class BoundingTransformMode extends CompositeMode {
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithFreeTransform;
  private rotateMode: RotateModeWithSnap;

  /** Track which mode is currently handling the drag operation */
  private activeDragMode: ActiveMode = null;

  /** Track current Shift state for dynamic uniform/free scaling toggle */
  private isShiftHeld = false;

  /** Tooltip for scale operations */
  private tooltip: Tooltip | null = null;

  constructor() {
    const translateMode = new TranslateMode();
    const scaleMode = new ScaleModeWithFreeTransform();
    const rotateMode = new RotateModeWithSnap();

    // Order: scale and rotate first so their handles take priority over translate
    super([scaleMode, rotateMode, translateMode]);

    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    let updatedCursor: string | null | undefined = null;

    // Call parent which will iterate through modes
    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor: string | null | undefined) => {
        updatedCursor = cursor || updatedCursor;
      },
    });

    props.onUpdateCursor(updatedCursor);
  }

  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (event.picks.length) {
      event.cancelPan();
    }

    const picks = event.picks ?? [];

    // Check if we're picking a ScaleMode handle
    const isScaleHandle = picks.some(
      (pick) =>
        pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
    );

    // Check if we're picking a RotateMode handle
    const isRotateHandle = picks.some(
      (pick) =>
        pick.isGuide && pick.object?.properties?.editHandleType === 'rotate',
    );

    // Determine which mode should handle this drag
    if (isScaleHandle) {
      this.activeDragMode = this.scaleMode;
    } else if (isRotateHandle) {
      this.activeDragMode = this.rotateMode;
    } else {
      // Default to translate for dragging the shape body
      this.activeDragMode = this.translateMode;
    }

    // Only call the active mode's handleStartDragging
    this.activeDragMode.handleStartDragging(event, props);
  }

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode) {
      const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
      this.isShiftHeld = sourceEvent?.shiftKey ?? false;

      // For ScaleMode, read current Shift state to allow dynamic toggling
      // Shift held = uniform scaling (lock aspect ratio)
      // No shift = free scaling (can squish/stretch)
      if (this.activeDragMode === this.scaleMode) {
        const propsWithScaleConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            lockScaling: this.isShiftHeld,
          },
        };

        this.activeDragMode.handleDragging(event, propsWithScaleConfig);

        // Update tooltip with shape dimensions
        this.updateShapeTooltip(event, props);
      } else if (this.activeDragMode === this.rotateMode) {
        // For RotateMode, Shift held = snap to 45° intervals
        const propsWithRotateConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            snapRotation: this.isShiftHeld,
          },
        };

        this.activeDragMode.handleDragging(event, propsWithRotateConfig);
      } else {
        this.activeDragMode.handleDragging(event, props);
      }
    }
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode) {
      // For ScaleMode, use the last known Shift state from handleDragging
      // to ensure the final geometry uses the same scale calculation
      if (this.activeDragMode === this.scaleMode) {
        const propsWithScaleConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            lockScaling: this.isShiftHeld,
          },
        };
        this.activeDragMode.handleStopDragging(event, propsWithScaleConfig);
      } else if (this.activeDragMode === this.rotateMode) {
        // For RotateMode, use the last known Shift state for snap calculation
        const propsWithRotateConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            snapRotation: this.isShiftHeld,
          },
        };
        this.activeDragMode.handleStopDragging(event, propsWithRotateConfig);
      } else {
        this.activeDragMode.handleStopDragging(event, props);
      }
      this.activeDragMode = null;
      this.isShiftHeld = false;
      this.tooltip = null;
    }
  }

  override getGuides(props: ModeProps<FeatureCollection>) {
    // Get guides from all modes
    const allGuides = super.getGuides(props);

    // Filter out duplicate envelope guides (scale and rotate both have them)
    // Keep scale envelope, filter rotate's duplicate
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, safely accessing with optional chaining
    const nonEnvelopeGuides = allGuides.features.filter((guide: any) => {
      const properties = guide.properties || {};
      const editHandleType = properties.editHandleType;
      const mode = properties.mode;

      // Both scale and rotate modes have the same enveloping box as a guide - only need one
      const guidesToFilterOut: string[] = [mode as string];

      // Do not render scaling edit handles if rotating
      if (this.rotateMode.getIsRotating()) {
        guidesToFilterOut.push(editHandleType as string);
      }

      return !guidesToFilterOut.includes('scale');
    });

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
    return featureCollection(nonEnvelopeGuides as any) as any;
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }

  /**
   * Update the tooltip with shape dimensions and area.
   * Called during scaling to show live measurements.
   * Handles both rectangles (5 points) and ellipses (many points).
   */
  private updateShapeTooltip(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    const { screenCoords } = event;
    const viewport: Viewport | undefined = props.modeConfig?.viewport;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    // Get the selected feature
    const selectedIndexes = props.selectedIndexes;
    const selectedIndex = selectedIndexes?.[0];
    if (selectedIndex === undefined) {
      this.tooltip = null;
      return;
    }

    const feature = props.data.features[selectedIndex] as
      | Feature<Polygon>
      | undefined;
    if (!feature || feature.geometry.type !== 'Polygon') {
      this.tooltip = null;
      return;
    }

    const coordinates = feature.geometry.coordinates[0];
    if (!coordinates || coordinates.length < 4) {
      this.tooltip = null;
      return;
    }

    // Check if this is a rectangle (has shape: 'Rectangle' property)
    const isRectangle = feature.properties?.shape === 'Rectangle';

    let text: string;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    if (isRectangle) {
      // Rectangle: calculate width and height from corners
      const corner0 = coordinates[0] as [number, number];
      const corner1 = coordinates[1] as [number, number];
      const corner2 = coordinates[2] as [number, number];

      const width = distance(point(corner0), point(corner1), {
        units: distanceUnits,
      });
      const height = distance(point(corner1), point(corner2), {
        units: distanceUnits,
      });
      const rectArea = width * height;

      text = `${formatDistance(width)} ${unitAbbrev} x ${formatDistance(height)} ${unitAbbrev}\n${formatDistance(rectArea)} ${unitAbbrev}²`;
    } else {
      // Ellipse: calculate major/minor axes
      const { majorAxis, minorAxis } = this.calculateEllipseAxes(
        coordinates as Position[],
        distanceUnits,
      );

      // Ellipse area = π × a × b (where a and b are semi-axes)
      const semiMajor = majorAxis / 2;
      const semiMinor = minorAxis / 2;
      const ellipseArea = Math.PI * semiMajor * semiMinor;

      text = `${formatDistance(majorAxis)} ${unitAbbrev} x ${formatDistance(minorAxis)} ${unitAbbrev}\n${formatDistance(ellipseArea)} ${unitAbbrev}²`;
    }

    // Position tooltip below the cursor
    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? event.mapCoords,
      text,
    };
  }

  /**
   * Calculate the major and minor axes of an ellipse from its polygon coordinates.
   *
   * For an ellipse approximated as a polygon, we find the longest and shortest
   * diameters by measuring distances between opposite points on the perimeter.
   */
  private calculateEllipseAxes(
    coordinates: Position[],
    distanceUnits: string,
  ): { majorAxis: number; minorAxis: number } {
    // Remove the closing point if it duplicates the first
    const points =
      coordinates[0]?.[0] === coordinates[coordinates.length - 1]?.[0] &&
      coordinates[0]?.[1] === coordinates[coordinates.length - 1]?.[1]
        ? coordinates.slice(0, -1)
        : coordinates;

    if (points.length < 4) {
      return { majorAxis: 0, minorAxis: 0 };
    }

    // For an ellipse polygon, opposite points are at index i and i + n/2
    const halfLen = Math.floor(points.length / 2);
    let maxDist = 0;
    let minDist = Number.POSITIVE_INFINITY;

    // Sample several diameter measurements
    for (let i = 0; i < halfLen; i++) {
      const p1 = points[i];
      const p2 = points[i + halfLen];
      if (!(p1 && p2)) {
        continue;
      }

      const dist = distance(
        [p1[0] as number, p1[1] as number],
        [p2[0] as number, p2[1] as number],
        // biome-ignore lint/suspicious/noExplicitAny: turf units type mismatch
        { units: distanceUnits as any },
      );

      if (dist > maxDist) {
        maxDist = dist;
      }
      if (dist < minDist) {
        minDist = dist;
      }
    }

    return {
      majorAxis: maxDist,
      minorAxis: minDist === Number.POSITIVE_INFINITY ? maxDist : minDist,
    };
  }
}
