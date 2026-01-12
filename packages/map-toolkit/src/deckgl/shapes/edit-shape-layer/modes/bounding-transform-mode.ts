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
  type DraggingEvent,
  type FeatureCollection,
  type GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '@/shared/units';
import {
  formatEllipseTooltip,
  formatRectangleTooltip,
} from '../../shared/constants';
import {
  computeEllipseMeasurementsFromPolygon,
  computeRectangleMeasurementsFromCorners,
} from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import type { Feature, Polygon } from 'geojson';

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
 * - **Rotation** (RotateModeWithSnap): Drag top handle to rotate
 *   - Default: Free rotation
 *   - With Shift: Snap to 45° intervals
 * - **Live tooltip**: Shows dimensions and area during scaling
 *
 * Unlike VertexTransformMode, this mode does NOT include vertex editing handles.
 *
 * Priority logic:
 * - If hovering over a scale handle, scaling takes priority
 * - If hovering over the rotate handle, rotation takes priority
 * - Otherwise, dragging the shape body translates it
 */
export class BoundingTransformMode extends BaseTransformMode {
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithFreeTransform;
  private rotateMode: RotateModeWithSnap;

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

  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Scale handle: corner handles on bounding box
        match: (pick) =>
          Boolean(
            pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
          ),
        mode: this.scaleMode,
        shiftConfig: { configKey: 'lockScaling' },
      },
      {
        // Rotate handle: top handle on bounding box
        match: (pick) =>
          Boolean(
            pick.isGuide &&
              pick.object?.properties?.editHandleType === 'rotate',
          ),
        mode: this.rotateMode,
        shiftConfig: { configKey: 'snapRotation' },
      },
    ];
  }

  protected override getDefaultMode(): GeoJsonEditMode {
    return this.translateMode;
  }

  /**
   * Update tooltip with shape dimensions during scaling.
   */
  protected override onDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // Only show tooltip when scaling
    if (this.activeDragMode !== this.scaleMode) {
      return;
    }

    this.updateShapeTooltip(event, props);
  }

  /**
   * Override getGuides to filter duplicate envelope guides.
   *
   * Both ScaleMode and RotateMode render the same bounding box envelope.
   * We keep scale's envelope and filter rotate's duplicate.
   * We also hide scale handles while rotating to avoid visual clutter.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const allGuides = super.getGuides(props);

    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, safely accessing with optional chaining
    const filteredGuides = allGuides.features.filter((guide: any) => {
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
    return featureCollection(filteredGuides as any) as any;
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
    const { mapCoords } = event;
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

      const { width, height, area } = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        distanceUnits,
      );

      text = formatRectangleTooltip(width, height, area, unitAbbrev);
    } else {
      // Ellipse: calculate major/minor axes using consolidated utility
      const {
        majorAxis,
        minorAxis,
        area: ellipseArea,
      } = computeEllipseMeasurementsFromPolygon(
        coordinates as [number, number][],
        distanceUnits,
      );

      text = formatEllipseTooltip(
        majorAxis,
        minorAxis,
        ellipseArea,
        unitAbbrev,
      );
    }

    // Position tooltip at cursor - offset is applied via getPixelOffset in sublayer props
    this.tooltip = {
      position: mapCoords,
      text,
    };
  }
}
