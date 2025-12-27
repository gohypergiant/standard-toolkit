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
  DrawCircleFromCenterMode,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { distance } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '../../../../shared/units';
import { TOOLTIP_Y_OFFSET } from '../../shared/constants';
import type { Viewport } from '@deck.gl/core';

/**
 * Extends DrawCircleFromCenterMode to display area tooltip.
 *
 * Shows the area of the circle being drawn based on the radius
 * from center point to cursor position.
 */
export class DrawCircleModeWithTooltip extends DrawCircleFromCenterMode {
  private tooltip: Tooltip | null = null;

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

    const centerPoint = clickSequence[clickSequence.length - 1] as [
      number,
      number,
    ];
    const edgePoint = mapCoords as [number, number];

    const radius = distance(centerPoint, edgePoint, { units: distanceUnits });
    const circleArea = Math.PI * radius ** 2;
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    this.tooltip = {
      position:
        viewport?.unproject([
          screenCoords[0],
          screenCoords[1] + TOOLTIP_Y_OFFSET,
        ]) ?? mapCoords,
      text: `${circleArea.toFixed(2)} ${unitAbbrev}²`,
    };
  }

  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }
}
