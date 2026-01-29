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
  DrawEllipseUsingThreePointsMode,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { type Coord, distance } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '@/shared/units';
import {
  formatDistanceTooltip,
  formatEllipseTooltip,
} from '../../shared/constants';

/**
 * Extends DrawEllipseUsingThreePointsMode to display contextual tooltips.
 *
 * Provides different tooltip content based on the drawing stage:
 * - **Stage 1** (after first click): Distance from first point to cursor
 * - **Stage 2** (after second click): Major/minor axes dimensions and area
 *
 * ## Drawing Flow
 * 1. **First click**: Sets the first endpoint of the major axis
 * 2. **Second click**: Sets the second endpoint of the major axis
 *    - While moving to second click, shows distance tooltip (like line/polygon)
 * 3. **Third click**: Sets the minor axis radius
 *    - While moving to third click, shows dimensions and area tooltip
 *
 * ## Geometry Calculations
 * - **Center**: Midpoint between first and second clicks
 * - **Y semi-axis**: Half the distance between clicks 1 and 2
 * - **X semi-axis**: Distance from center to cursor (becomes distance to click 3)
 * - **Area**: π × X semi-axis × Y semi-axis
 *
 * @example
 * ```typescript
 * import { DrawEllipseModeWithTooltip } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/modes';
 *
 * // Used internally by DrawShapeLayer
 * const mode = new DrawEllipseModeWithTooltip();
 * ```
 */
export class DrawEllipseModeWithTooltip extends DrawEllipseUsingThreePointsMode {
  /** Current tooltip state (null when not drawing) */
  private tooltip: Tooltip | null = null;

  /**
   * Handle pointer move events to update the tooltip based on drawing stage.
   *
   * Stage 1 (1 click): Shows distance from first point to cursor.
   * Stage 2 (2 clicks): Shows major/minor axes dimensions and ellipse area.
   *
   * @param event - Pointer move event with cursor position
   * @param props - Mode properties including distance units configuration
   */
  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handlePointerMove(event, props);

    const clickSequence = this.getClickSequence();
    if (!clickSequence.length) {
      this.tooltip = null;
      return;
    }

    const { mapCoords } = event;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);
    const tooltipPosition = mapCoords;

    if (clickSequence.length === 1) {
      // First segment: show distance from first click to cursor (like line/polygon)
      const firstPoint = clickSequence[0] as Coord;
      const currentPoint = mapCoords as Coord;

      const dist = distance(firstPoint, currentPoint, { units: distanceUnits });

      this.tooltip = {
        position: tooltipPosition,
        text: formatDistanceTooltip(dist, unitAbbrev),
      };
    } else if (clickSequence.length === 2) {
      // Second segment: show dimensions and area (like rectangle)
      // The ellipse will have:
      // - center at midpoint of click1 and click2
      // - ySemiAxis = distance(click1, click2) / 2
      // - xSemiAxis = distance(center, cursor)
      const click1 = clickSequence[0] as [number, number];
      const click2 = clickSequence[1] as [number, number];
      const cursorPos = mapCoords as [number, number];

      // Calculate center (midpoint)
      const center: [number, number] = [
        (click1[0] + click2[0]) / 2,
        (click1[1] + click2[1]) / 2,
      ];

      // Calculate semi-axes
      const ySemiAxis = distance(click1, click2, { units: distanceUnits }) / 2;
      const xSemiAxis = distance(center, cursorPos, { units: distanceUnits });

      // Full axes (diameter equivalent)
      const majorAxis = Math.max(xSemiAxis, ySemiAxis) * 2;
      const minorAxis = Math.min(xSemiAxis, ySemiAxis) * 2;

      // Ellipse area = π × a × b
      const ellipseArea = Math.PI * xSemiAxis * ySemiAxis;

      this.tooltip = {
        position: tooltipPosition,
        text: formatEllipseTooltip(
          majorAxis,
          minorAxis,
          ellipseArea,
          unitAbbrev,
        ),
      };
    }
  }

  /**
   * Get the current tooltip array for rendering.
   *
   * @returns Array containing the tooltip if one is active, empty array otherwise
   */
  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }
}
