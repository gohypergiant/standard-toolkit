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
  ResizeCircleMode,
  type Tooltip,
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

/**
 * Extends ResizeCircleMode to display diameter and area tooltip during resize.
 *
 * Features:
 * - Live diameter and area tooltip during circle resize
 * - Uses turf.js for accurate geographic distance calculations
 * - Single-pass getGuides filter to prevent TypeError from sublayer picks
 *
 * Shows the diameter and area of the circle being resized.
 */
export class ResizeCircleModeWithTooltip extends ResizeCircleMode {
  private tooltip: Tooltip | null = null;

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handleDragging(event, props);

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

  override handleStopDragging(
    event: Parameters<ResizeCircleMode['handleStopDragging']>[0],
    props: Parameters<ResizeCircleMode['handleStopDragging']>[1],
  ) {
    super.handleStopDragging(event, props);
    // Clear tooltip when dragging stops
    this.tooltip = null;
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
}
