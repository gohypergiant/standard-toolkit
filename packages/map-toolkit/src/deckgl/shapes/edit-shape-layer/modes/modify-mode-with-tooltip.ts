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
  type GuideFeatureCollection,
  type ModeProps,
  ModifyMode,
  type StartDraggingEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { distance, point } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../../shared/constants';
import type { Viewport } from '@deck.gl/core';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Format a distance value for display
 */
function formatDistance(value: number): string {
  return value.toFixed(2);
}

/**
 * Extends ModifyMode to display dimension/area tooltips during rectangle editing.
 *
 * Features:
 * - Live dimension/area tooltip during rectangle vertex editing
 * - Uses turf.js for accurate geographic distance calculations
 * - Single-pass getGuides filter to prevent TypeError from sublayer picks
 *
 * This mode preserves all standard ModifyMode behavior.
 */
export class ModifyModeWithTooltip extends ModifyMode {
  private isDraggingRectangleCorner = false;
  private rectangleAnchorCorner: Position | null = null;
  private featureIndex: number | null = null;
  private tooltip: Tooltip | null = null;

  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // Check if we're starting to drag a rectangle corner
    const picks = event.picks ?? [];
    const editHandlePick = picks.find(
      (pick) =>
        pick.isGuide && pick.object?.properties?.guideType === 'editHandle',
    );

    if (editHandlePick) {
      const featureIndex = editHandlePick.object?.properties?.featureIndex;
      const positionIndexes =
        editHandlePick.object?.properties?.positionIndexes;

      if (featureIndex !== undefined && positionIndexes?.length > 0) {
        const feature = props.data.features[featureIndex] as
          | Feature<Polygon>
          | undefined;

        // Check if this is a rectangle (has shape: 'Rectangle' property)
        if (feature?.properties?.shape === 'Rectangle') {
          this.isDraggingRectangleCorner = true;
          this.featureIndex = featureIndex;
          const draggedCornerIndex = positionIndexes[0] as number;

          // Find the anchor corner (opposite corner from the one being dragged)
          const coords = feature.geometry.coordinates[0];
          if (coords && coords.length >= 5) {
            // Rectangle corners are at indices 0, 1, 2, 3 (4 is same as 0)
            // Opposite corner is 2 positions away (0↔2, 1↔3)
            const anchorIndex = (draggedCornerIndex + 2) % 4;
            this.rectangleAnchorCorner = coords[anchorIndex] as Position;
          }
        }
      }
    }

    super.handleStartDragging(event, props);
  }

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handleDragging(event, props);

    // Update tooltip for rectangle editing
    if (
      this.isDraggingRectangleCorner &&
      this.rectangleAnchorCorner !== null &&
      this.featureIndex !== null
    ) {
      this.updateRectangleTooltip(event, props);
    }
  }

  override handleStopDragging(
    event: Parameters<ModifyMode['handleStopDragging']>[0],
    props: Parameters<ModifyMode['handleStopDragging']>[1],
  ) {
    // Reset rectangle dragging state
    this.isDraggingRectangleCorner = false;
    this.rectangleAnchorCorner = null;
    this.featureIndex = null;
    this.tooltip = null;

    super.handleStopDragging(event, props);
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }

  /**
   * Override getGuides to filter out picks without valid geometry.
   *
   * The parent ModifyMode.getGuides accesses `featureAsPick.object.geometry.type`
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
   * Update the tooltip with rectangle dimensions and area.
   * Called during rectangle dragging to show live measurements.
   */
  private updateRectangleTooltip(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.rectangleAnchorCorner === null || this.featureIndex === null) {
      this.tooltip = null;
      return;
    }

    const { screenCoords } = event;
    const viewport: Viewport | undefined = props.modeConfig?.viewport;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    // Get the current feature to calculate dimensions from its geometry
    const feature = props.data.features[this.featureIndex] as
      | Feature<Polygon>
      | undefined;
    if (!feature || feature.geometry.type !== 'Polygon') {
      this.tooltip = null;
      return;
    }

    // Calculate dimensions from the current rectangle geometry
    const coords = feature.geometry.coordinates[0];
    if (!coords || coords.length < 5) {
      this.tooltip = null;
      return;
    }

    // Get the four corners of the rectangle
    const corner0 = coords[0] as [number, number];
    const corner1 = coords[1] as [number, number];
    const corner2 = coords[2] as [number, number];

    // Calculate width and height using turf
    const width = distance(point(corner0), point(corner1), {
      units: distanceUnits,
    });
    const height = distance(point(corner1), point(corner2), {
      units: distanceUnits,
    });

    // For rectangles, area = width × height
    const rectArea = width * height;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    // Position tooltip below the cursor
    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? event.mapCoords,
      text: `${formatDistance(width)} ${unitAbbrev} x ${formatDistance(height)} ${unitAbbrev}\n${formatDistance(rectArea)} ${unitAbbrev}²`,
    };
  }
}
