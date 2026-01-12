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
  type ModeProps,
  ResizeCircleMode,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { centroid } from '@turf/turf';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitAbbreviation,
} from '@/shared/units';
import { formatCircleTooltip } from '../../shared/constants';
import { computeCircleMeasurements } from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import type { Feature, Polygon } from 'geojson';

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
export class CircleTransformMode extends BaseTransformMode {
  private resizeMode: ResizeCircleMode;
  private translateMode: TranslateMode;

  constructor() {
    const resizeMode = new ResizeCircleMode();
    const translateMode = new TranslateMode();

    // Order matters: resize first so edge handles take priority
    super([resizeMode, translateMode]);

    this.resizeMode = resizeMode;
    this.translateMode = translateMode;
  }

  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Resize handle: intermediate point on circle edge
        match: (pick) =>
          Boolean(
            pick.isGuide &&
              pick.object?.properties?.guideType === 'editHandle' &&
              pick.object?.properties?.editHandleType === 'intermediate',
          ),
        mode: this.resizeMode,
        // No shift config - resize doesn't have modifiers
      },
    ];
  }

  protected override getDefaultMode(): GeoJsonEditMode {
    return this.translateMode;
  }

  /**
   * Update the tooltip with circle diameter and area during resize.
   */
  protected override onDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // Only show tooltip when resizing
    if (this.activeDragMode !== this.resizeMode) {
      return;
    }

    const { mapCoords } = event;
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
    const { diameter, area } = computeCircleMeasurements(
      center,
      firstPoint,
      distanceUnits,
    );
    const unitAbbrev = getDistanceUnitAbbreviation(distanceUnits);

    // Position tooltip at cursor - offset is applied via getPixelOffset in sublayer props
    this.tooltip = {
      position: mapCoords,
      text: formatCircleTooltip(diameter, area, unitAbbrev),
    };
  }
}
