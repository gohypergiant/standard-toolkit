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
  type PointerMoveEvent,
  type StartDraggingEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { destination, distance, point } from '@turf/turf';
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
 * Extends ModifyMode to support Shift-constrained square editing for rectangles
 * and displays dimension/area tooltips during rectangle editing.
 *
 * When editing a rectangle with Shift held, the rectangle is constrained to a square
 * using real-world distances to account for lat/lon distortion.
 *
 * This mode preserves all standard ModifyMode behavior including lockRectangles.
 */
export class ModifyModeWithSquareConstraint extends ModifyMode {
  private isShiftPressed = false;
  private isDraggingRectangleCorner = false;
  private rectangleAnchorCorner: Position | null = null;
  private draggedCornerIndex: number | null = null;
  private featureIndex: number | null = null;
  private tooltip: Tooltip | null = null;

  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // Track shift key state
    const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
    this.isShiftPressed = sourceEvent?.shiftKey ?? false;

    super.handlePointerMove(event, props);
  }

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
          this.draggedCornerIndex = positionIndexes[0] as number;

          // Find the anchor corner (opposite corner from the one being dragged)
          const coords = feature.geometry.coordinates[0];
          if (coords && coords.length >= 5) {
            // Rectangle corners are at indices 0, 1, 2, 3 (4 is same as 0)
            // Opposite corner is 2 positions away (0↔2, 1↔3)
            const anchorIndex = (this.draggedCornerIndex + 2) % 4;
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
    // Track shift key state during drag
    const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
    this.isShiftPressed = sourceEvent?.shiftKey ?? false;

    // If shift is pressed and we're dragging a rectangle corner, apply square constraint
    if (
      this.isShiftPressed &&
      this.isDraggingRectangleCorner &&
      this.rectangleAnchorCorner !== null &&
      this.draggedCornerIndex !== null &&
      this.featureIndex !== null
    ) {
      this.handleSquareConstrainedDrag(event, props);
    } else {
      super.handleDragging(event, props);

      // Update tooltip for rectangle editing (non-shift case)
      if (
        this.isDraggingRectangleCorner &&
        this.rectangleAnchorCorner !== null &&
        this.featureIndex !== null
      ) {
        this.updateRectangleTooltip(event, props);
      }
    }
  }

  override handleStopDragging(
    event: Parameters<ModifyMode['handleStopDragging']>[0],
    props: Parameters<ModifyMode['handleStopDragging']>[1],
  ) {
    // Reset rectangle dragging state
    this.isDraggingRectangleCorner = false;
    this.rectangleAnchorCorner = null;
    this.draggedCornerIndex = null;
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

    // Only filter if there are picks that might cause issues
    if (picks && picks.length > 0) {
      // Check if any pick needs filtering (optimization: avoid array operations if not needed)
      const needsFiltering = picks.some(
        (pick) => !pick.isGuide && pick.object?.geometry?.type === undefined,
      );

      if (needsFiltering) {
        const filteredPicks = picks.filter(
          (pick) => pick.isGuide || pick.object?.geometry?.type !== undefined,
        );

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
   * Handle dragging with square constraint.
   * Builds the square geometry directly and emits an edit action.
   */
  private handleSquareConstrainedDrag(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.rectangleAnchorCorner === null || this.featureIndex === null) {
      return;
    }

    const anchor = this.rectangleAnchorCorner;
    const cursor = event.mapCoords;

    const anchorLon = anchor[0] ?? 0;
    const anchorLat = anchor[1] ?? 0;
    const cursorLon = cursor[0] ?? 0;
    const cursorLat = cursor[1] ?? 0;

    // Calculate real-world distances using turf
    const anchorPoint = point([anchorLon, anchorLat]);

    // Horizontal distance (along latitude)
    const horizontalDist = distance(
      anchorPoint,
      point([cursorLon, anchorLat]),
      { units: 'kilometers' },
    );

    // Vertical distance (along longitude)
    const verticalDist = distance(anchorPoint, point([anchorLon, cursorLat]), {
      units: 'kilometers',
    });

    // Use the larger distance for the square side
    const maxDist = Math.max(horizontalDist, verticalDist);

    // Determine direction signs
    const lonSign = cursorLon >= anchorLon ? 1 : -1;
    const latSign = cursorLat >= anchorLat ? 1 : -1;

    // Calculate new corner using destination() for accurate geographic positioning
    // Move horizontally from anchor
    const horizontalPoint = destination(
      anchorPoint,
      maxDist,
      lonSign > 0 ? 90 : 270,
      { units: 'kilometers' },
    );

    // Move vertically from that point to get the dragged corner
    const draggedCornerPoint = destination(
      horizontalPoint,
      maxDist,
      latSign > 0 ? 0 : 180,
      { units: 'kilometers' },
    );
    const draggedCorner = draggedCornerPoint.geometry.coordinates as Position;

    // Build the square coordinates
    // Adjacent corners share one coordinate with anchor and one with dragged corner
    const adjacentCorner1: Position = [anchorLon, draggedCorner[1] as number];
    const adjacentCorner2: Position = [draggedCorner[0] as number, anchorLat];

    // Build coordinates in the correct order based on which corner is being dragged
    // The order must maintain the same winding as the original rectangle
    const squareCoords = this.buildSquareCoordinates(
      anchor,
      draggedCorner,
      adjacentCorner1,
      adjacentCorner2,
    );

    // Get the current feature and update its geometry
    const feature = props.data.features[this.featureIndex] as Feature<Polygon>;
    const updatedFeature: Feature<Polygon> = {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: [squareCoords],
      },
    };

    // Build updated data - cast to the editable-layers Feature type
    const updatedFeatures = [...props.data.features];
    updatedFeatures[this.featureIndex] =
      updatedFeature as FeatureCollection['features'][number];

    const updatedData: FeatureCollection = {
      ...props.data,
      features: updatedFeatures,
    };

    // Emit the edit action
    props.onEdit({
      updatedData,
      editType: 'movePosition',
      editContext: {
        featureIndexes: [this.featureIndex],
      },
    });

    // Update tooltip with square dimensions
    this.updateSquareTooltip(event, props, maxDist);
  }

  /**
   * Update the tooltip for a square being edited with shift constraint.
   * Uses the known square side length for accurate display.
   */
  private updateSquareTooltip(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
    sideDistanceKm: number,
  ) {
    const { screenCoords } = event;
    const viewport: Viewport | undefined = props.modeConfig?.viewport;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    // Convert side length from kilometers to the configured units
    // sideDistanceKm is already in kilometers from the calculation
    let sideLength: number;
    if (distanceUnits === 'kilometers') {
      sideLength = sideDistanceKm;
    } else if (distanceUnits === 'miles') {
      sideLength = sideDistanceKm * 0.621371;
    } else if (distanceUnits === 'meters') {
      sideLength = sideDistanceKm * 1000;
    } else if (distanceUnits === 'feet') {
      sideLength = sideDistanceKm * 3280.84;
    } else if (distanceUnits === 'nauticalmiles') {
      sideLength = sideDistanceKm * 0.539957;
    } else {
      sideLength = sideDistanceKm;
    }

    // For a square, area = side²
    const squareArea = sideLength * sideLength;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    // Position tooltip below the cursor
    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? event.mapCoords,
      text: `${formatDistance(sideLength)} ${unitAbbrev} x ${formatDistance(sideLength)} ${unitAbbrev}\n${formatDistance(squareArea)} ${unitAbbrev}²`,
    };
  }

  /**
   * Build square coordinates in the correct winding order.
   * Rectangle corners follow: anchor -> adj1 -> dragged -> adj2 -> anchor (closed)
   * We determine which adjacent corner comes first based on standard rectangle winding.
   */
  private buildSquareCoordinates(
    anchor: Position,
    dragged: Position,
    adj1: Position,
    adj2: Position,
  ): Position[] {
    // Standard rectangle winding: go around the perimeter
    // From anchor, we go to the adjacent corner that shares the same longitude (vertical edge first)
    // Then to the dragged corner, then to the other adjacent corner, back to anchor

    // adj1 has [anchorLon, draggedLat] - shares longitude with anchor
    // adj2 has [draggedLon, anchorLat] - shares latitude with anchor

    // Standard winding order for rectangles drawn from top-left:
    // anchor (e.g., top-left) -> adj1 (bottom-left) -> dragged (bottom-right) -> adj2 (top-right) -> anchor
    return [anchor, adj1, dragged, adj2, anchor];
  }

  /**
   * Update the tooltip with rectangle dimensions and area.
   * Called during rectangle dragging to show live measurements.
   *
   * PERFORMANCE: Uses simple width × height for area instead of turf.area()
   * to reduce computational overhead during high-frequency drag events.
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
    const corner0 = coords[0] as Position;
    const corner1 = coords[1] as Position;
    const corner2 = coords[2] as Position;

    // Calculate width and height using turf distance
    const width = distance(point(corner0), point(corner1), {
      units: distanceUnits,
    });
    const height = distance(point(corner1), point(corner2), {
      units: distanceUnits,
    });

    // For rectangles, area = width × height (faster than turf.area + convertArea)
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
