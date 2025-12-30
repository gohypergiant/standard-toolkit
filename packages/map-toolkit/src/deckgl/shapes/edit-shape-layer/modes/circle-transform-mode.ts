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
  type GuideFeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  ResizeCircleMode,
  type StartDraggingEvent,
  type StopDraggingEvent,
  type Tooltip,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { centroid, distance } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../../shared/constants';
import type { Viewport } from '@deck.gl/core';
import type { Feature, Polygon } from 'geojson';

/**
 * Format a distance value for display
 */
function formatDistance(value: number): string {
  return value.toFixed(2);
}

type ActiveMode = ResizeCircleMode | TranslateMode | null;

/**
 * Transform mode for circles combining resize and translate.
 *
 * This composite mode provides:
 * - **Resize** (ResizeCircleMode): Drag edge to resize from center
 * - **Translation** (TranslateMode): Drag the circle body to move it
 * - **Live tooltip**: Shows diameter and area during resize
 *
 * Priority logic:
 * - If dragging on the edge/handle, resize takes priority
 * - If dragging on the circle body, translate takes priority
 */
export class CircleTransformMode extends CompositeMode {
  private resizeMode: ResizeCircleMode;
  private translateMode: TranslateMode;

  /** Track which mode is currently handling the drag operation */
  private activeDragMode: ActiveMode = null;

  /** Tooltip for resize operations */
  private tooltip: Tooltip | null = null;

  constructor() {
    const resizeMode = new ResizeCircleMode();
    const translateMode = new TranslateMode();

    // Order matters: resize first so edge handles take priority
    super([resizeMode, translateMode]);

    this.resizeMode = resizeMode;
    this.translateMode = translateMode;
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

    // Check if we're picking a resize handle (intermediate point on circle edge)
    const isResizeHandle = picks.some(
      (pick) =>
        pick.isGuide &&
        pick.object?.properties?.guideType === 'editHandle' &&
        pick.object?.properties?.editHandleType === 'intermediate',
    );

    // Determine which mode should handle this drag
    if (isResizeHandle) {
      this.activeDragMode = this.resizeMode;
    } else {
      // Default to translate for dragging the circle body
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
      this.activeDragMode.handleDragging(event, props);

      // Update tooltip if resizing
      if (this.activeDragMode === this.resizeMode) {
        this.updateCircleTooltip(event, props);
      }
    }
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode) {
      this.activeDragMode.handleStopDragging(event, props);
      this.activeDragMode = null;
      this.tooltip = null;
    }
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }

  /**
   * Override getGuides to filter out picks without valid geometry.
   *
   * The parent ResizeCircleMode.getGuides accesses `featureAsPick.object.geometry.type`
   * which can throw if a pick's object doesn't have a geometry property.
   * This can happen when picks include sublayer elements (like tooltip text)
   * that aren't GeoJSON features.
   *
   * We filter the lastPointerMoveEvent.picks to only include picks with valid
   * geometry before calling the parent implementation.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const picks = props.lastPointerMoveEvent?.picks;

    // Only filter if there are picks - single pass filter (no separate some() check)
    if (picks && picks.length > 0) {
      // Single-pass: filter and check if we removed anything
      const filteredPicks: typeof picks = [];
      let didFilter = false;

      for (const pick of picks) {
        if (pick.isGuide || pick.object?.geometry?.type !== undefined) {
          filteredPicks.push(pick);
        } else {
          didFilter = true;
        }
      }

      if (didFilter) {
        // Create a modified props with filtered picks
        const filteredProps: ModeProps<FeatureCollection> = {
          ...props,
          lastPointerMoveEvent: {
            ...props.lastPointerMoveEvent,
            picks: filteredPicks,
          },
        };

        return super.getGuides(filteredProps);
      }
    }

    return super.getGuides(props);
  }

  /**
   * Update the tooltip with circle diameter and area.
   * Called during resize to show live measurements.
   */
  private updateCircleTooltip(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    const { screenCoords } = event;
    const viewport: Viewport | undefined = props.modeConfig?.viewport;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    // Get the selected feature to calculate radius from its geometry
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

    // Calculate center and radius from the polygon geometry
    const coordinates = feature.geometry.coordinates[0];
    if (!coordinates || coordinates.length < 3) {
      this.tooltip = null;
      return;
    }

    const centerFeature = centroid(feature);
    const center = centerFeature.geometry.coordinates as [number, number];
    const firstPoint = coordinates[0] as [number, number];
    const radius = distance(center, firstPoint, { units: distanceUnits });
    const diameter = radius * 2;
    const circleArea = Math.PI * radius ** 2;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    // Position tooltip below the cursor
    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? event.mapCoords,
      text: `d: ${formatDistance(diameter)} ${unitAbbrev}\n${formatDistance(circleArea)} ${unitAbbrev}²`,
    };
  }
}
