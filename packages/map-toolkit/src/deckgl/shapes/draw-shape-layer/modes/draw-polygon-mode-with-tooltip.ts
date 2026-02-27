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
  DrawPolygonMode,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type SimpleFeatureCollection,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { type Coord, distance } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '@/shared/units';
import { formatDistanceTooltip } from '../../shared/constants';

/**
 * Extends DrawPolygonMode to display distance tooltip between points.
 *
 * Shows the distance from the last clicked point to the current cursor position
 * while drawing a polygon. The tooltip updates in real-time as the cursor moves.
 *
 * ## Drawing Flow
 * 1. Click to add first vertex
 * 2. Move cursor (tooltip shows distance from last vertex)
 * 3. Click to add more vertices
 * 4. Double-click or click the starting point to close the polygon
 *
 *
 * @example
 * ```typescript
 * import { DrawPolygonModeWithTooltip } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/modes';
 *
 * // Used internally by DrawShapeLayer
 * const mode = new DrawPolygonModeWithTooltip();
 * ```
 */
export class DrawPolygonModeWithTooltip extends DrawPolygonMode {
  /** Current tooltip state (null when not drawing) */
  private tooltip: Tooltip | null = null;

  /**
   * Finish drawing the polygon.
   *
   * Creates a Polygon geometry from the click sequence and emits an edit action.
   * Requires at least 3 points to create a valid polygon. Automatically closes
   * the polygon by adding the first point to the end of the coordinate ring.
   *
   * @param props - Mode properties with onEdit callback
   */
  override finishDrawing(props: ModeProps<SimpleFeatureCollection>): void {
    const clickSequence = this.getClickSequence();
    const firstPoint = clickSequence[0];
    if (clickSequence.length <= 2 || !firstPoint) {
      return;
    }

    const polygonToAdd = {
      type: 'Polygon' as const,
      coordinates: [[...clickSequence, firstPoint]],
    };

    this.resetClickSequence();
    this.tooltip = null;

    const editAction = this.getAddFeatureOrBooleanPolygonAction(
      polygonToAdd,
      props,
    );
    if (editAction) {
      props.onEdit(editAction);
    }
  }

  /**
   * Handle pointer move events to update the tooltip with distance.
   *
   * Calculates the distance from the last clicked vertex to the current
   * cursor position and displays it in the configured distance units.
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

    const lastPoint = clickSequence.at(-1) as Coord;
    const currentPoint = mapCoords as Coord;

    const dist = distance(lastPoint, currentPoint, { units: distanceUnits });
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    this.tooltip = {
      position: mapCoords,
      text: formatDistanceTooltip(dist, unitAbbrev),
    };
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
