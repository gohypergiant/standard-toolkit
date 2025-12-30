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

import { distance, point } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../../shared/constants';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import type { Viewport } from '@deck.gl/core';
import type {
  DraggingEvent,
  FeatureCollection,
  ModeProps,
  StopDraggingEvent,
  Tooltip,
} from '@deck.gl-community/editable-layers';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Format a distance value for display
 */
function formatDistance(value: number): string {
  return value.toFixed(2);
}

/**
 * Extends ScaleModeWithFreeTransform to display dimension tooltips during scaling.
 *
 * Features:
 * - Live dimension and area tooltip during ellipse and rectangle scaling
 * - Uses turf.js for accurate geographic distance calculations
 * - Inherits all non-uniform/uniform scaling behavior from parent
 *
 * For ellipses: Shows major axis, minor axis, and area
 * For rectangles: Shows width, height, and area
 */
export class ScaleModeWithTooltip extends ScaleModeWithFreeTransform {
  private tooltip: Tooltip | null = null;

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handleDragging(event, props);

    // Update tooltip with shape dimensions
    this.updateShapeTooltip(event, props);
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handleStopDragging(event, props);
    // Clear tooltip when dragging stops
    this.tooltip = null;
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
