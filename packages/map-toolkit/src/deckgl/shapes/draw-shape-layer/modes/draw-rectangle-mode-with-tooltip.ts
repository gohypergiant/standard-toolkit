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
  DrawRectangleMode,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { featureCollection, point } from '@turf/helpers';
import {
  area,
  bbox,
  bboxPolygon,
  convertArea,
  destination,
  distance,
} from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { formatRectangleTooltip } from '../../shared/constants';
import type { Position } from 'geojson';

/**
 * Extends DrawRectangleMode to display dimensions and area tooltip.
 *
 * Shows the width, height, and total area of the rectangle being drawn.
 * Hold Shift to constrain to a square.
 */
export class DrawRectangleModeWithTooltip extends DrawRectangleMode {
  private tooltip: Tooltip | null = null;
  private isShiftPressed = false;

  /**
   * Override getTwoClickPolygon to support Shift-constrained squares.
   * When Shift is held, the rectangle is constrained to a square using
   * real-world distances to account for lat/lon distortion.
   */
  override getTwoClickPolygon(
    coord1: Position,
    coord2: Position,
    modeConfig: ModeProps<FeatureCollection>['modeConfig'],
  ) {
    let finalCoord2 = coord2;

    // If Shift is pressed, constrain to a square using real distances
    if (this.isShiftPressed && coord1 && coord2) {
      const lon1 = coord1[0] ?? 0;
      const lat1 = coord1[1] ?? 0;
      const lon2 = coord2[0] ?? 0;
      const lat2 = coord2[1] ?? 0;

      // Calculate real-world distances using turf
      // Horizontal distance (along latitude)
      const horizontalDist = distance(
        point([lon1, lat1]),
        point([lon2, lat1]),
        {
          units: 'kilometers',
        },
      );
      // Vertical distance (along longitude)
      const verticalDist = distance(point([lon1, lat1]), point([lon1, lat2]), {
        units: 'kilometers',
      });

      // Use the larger distance for the square side
      const maxDist = Math.max(horizontalDist, verticalDist);

      // Determine direction signs
      const lonSign = lon2 >= lon1 ? 1 : -1;
      const latSign = lat2 >= lat1 ? 1 : -1;

      // Calculate new corner using destination() for accurate geographic positioning
      // Move horizontally from coord1
      const horizontalPoint = destination(
        point([lon1, lat1]),
        maxDist,
        lonSign > 0 ? 90 : 270,
        {
          units: 'kilometers',
        },
      );
      // Move vertically from that point
      const cornerPoint = destination(
        horizontalPoint,
        maxDist,
        latSign > 0 ? 0 : 180,
        {
          units: 'kilometers',
        },
      );

      finalCoord2 = cornerPoint.geometry.coordinates;
    }

    // Call parent implementation with potentially adjusted coordinates
    return super.getTwoClickPolygon(coord1, finalCoord2, modeConfig);
  }

  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // Track shift key state from the source event
    const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
    this.isShiftPressed = sourceEvent?.shiftKey ?? false;

    super.handlePointerMove(event, props);

    const clickSequence = this.getClickSequence();
    const firstClick = clickSequence[clickSequence.length - 1];
    if (!firstClick) {
      this.tooltip = null;
      return;
    }

    const { mapCoords } = event;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    const firstClickPoint = point(firstClick);
    const currentPoint = point(mapCoords);

    // Calculate dimensions by finding the corner point
    const cornerPoint = point([
      firstClick[0] as number,
      mapCoords[1] as number,
    ]);
    const dimension1 = distance(firstClickPoint, cornerPoint, {
      units: distanceUnits,
    });
    const dimension2 = distance(currentPoint, cornerPoint, {
      units: distanceUnits,
    });

    // Calculate area properly accounting for Earth's curvature
    const points = featureCollection([firstClickPoint, currentPoint]);
    const bboxPoly = bboxPolygon(bbox(points));
    const rectArea = area(bboxPoly);
    const convertedArea = convertArea(rectArea, 'meters', distanceUnits);
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    this.tooltip = {
      position: mapCoords,
      text: formatRectangleTooltip(
        dimension1,
        dimension2,
        convertedArea,
        unitAbbrev,
      ),
    };
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }
}
