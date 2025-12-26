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
  type ClickEvent,
  DrawPolygonMode,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { type Coord, distance } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../constants';
import type { Viewport } from '@deck.gl/core';

/**
 * Extends DrawPolygonMode to display distance tooltip between points.
 *
 * Shows the distance from the last clicked point to the current cursor position
 * while drawing a polygon.
 *
 * Includes a workaround for the double-click to finish issue in @deck.gl-community/editable-layers ~9.1.
 * This will be fixed in a future version (PR #225).
 */
export class DrawPolygonModeWithTooltip extends DrawPolygonMode {
  private tooltip: Tooltip | null = null;
  private lastModeProps: ModeProps<FeatureCollection> | null = null;

  /**
   * Finish drawing the polygon.
   * Extracted to share between double-click workaround and parent class logic.
   */
  private finishDrawing(props: ModeProps<FeatureCollection>): void {
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
   * Handle double-click to finish drawing.
   * This is called externally via a DOM event listener as a workaround for
   * @deck.gl-community/editable-layers ~9.1 which doesn't register 'dblclick' in EVENT_TYPES.
   * @see https://github.com/visgl/deck.gl-community/pull/225
   */
  handleDoubleClick(): void {
    if (this.lastModeProps) {
      this.finishDrawing(this.lastModeProps);
    }
  }

  /**
   * Override handleClick to store props for double-click workaround.
   */
  override handleClick(
    event: ClickEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // Store props so handleDoubleClick can access them
    this.lastModeProps = props;
    super.handleClick(event, props);
  }

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

    const { mapCoords, screenCoords } = event;
    const viewport: Viewport | undefined = props.modeConfig?.viewport;
    const distanceUnits =
      props.modeConfig?.distanceUnits ?? DEFAULT_DISTANCE_UNITS;

    const lastPoint = clickSequence[clickSequence.length - 1] as Coord;
    const currentPoint = mapCoords as Coord;

    const dist = distance(lastPoint, currentPoint, { units: distanceUnits });
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? mapCoords,
      text: `${dist.toFixed(2)} ${unitAbbrev}`,
    };
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }
}
