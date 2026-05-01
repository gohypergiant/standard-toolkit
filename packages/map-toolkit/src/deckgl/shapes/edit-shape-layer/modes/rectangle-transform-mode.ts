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
  DISTANCE_UNIT_SYMBOLS,
  type DistanceUnit,
} from '@accelint/constants/units';
import {
  type DraggingEvent,
  type FeatureCollection,
  type GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import { formatRectangleTooltip } from '../../shared/constants';
import { computeRectangleMeasurementsFromCorners } from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RectangleScaleMode } from './rectangle-scale-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import type { Feature, Polygon } from 'geojson';

/**
 * Transform mode for rectangles that preserves rotation through every gesture.
 *
 * This mode mirrors the composition of `BoundingTransformMode` (translate +
 * scale + rotate) but swaps the standard `ScaleModeWithFreeTransform` out for
 * `RectangleScaleMode`. The replacement places the scale handles at the
 * rectangle's actual rotated corners (not the lat/lon-axis-aligned bbox), and
 * its drag math projects the new corner onto the rectangle's local edge
 * directions — so a corner drag produces a clean rotated rectangle instead
 * of distorting the shape into a parallelogram.
 *
 * ## Capabilities
 * - **Translation** (TranslateMode): Drag the shape body to move it.
 * - **Rectangle-aware scaling** (RectangleScaleMode): Drag corner handles to
 *   resize. Default free scaling; with Shift, uniform scaling.
 * - **Rotation** (RotateModeWithSnap): Drag the rotate handle to rotate.
 *   Default free rotation; with Shift, snap to 45° intervals.
 *
 * ## Handle Priority Logic
 * 1. Hovering a scale handle → scaling
 * 2. Hovering the rotate handle → rotation
 * 3. Anywhere else on the shape → translation
 *
 * ## When to use
 * Use this mode for `RectangleShape`. Other axis-bounded shapes (like
 * ellipses) should continue to use `BoundingTransformMode`, where the
 * lat/lon-axis-aligned bbox-corner scaling is correct because an ellipse is
 * rotationally symmetric about its axes.
 *
 * @example
 * ```typescript
 * import { RectangleTransformMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/rectangle-transform-mode';
 *
 * const mode = new RectangleTransformMode();
 * ```
 */
export class RectangleTransformMode extends BaseTransformMode {
  private translateMode: TranslateMode;
  private scaleMode: RectangleScaleMode;
  private rotateMode: RotateModeWithSnap;

  /**
   * Constructs the composite mode by instantiating its three sub-modes
   * (rectangle-aware scale, snap-aware rotate, translate) and registering
   * them with `BaseTransformMode` in priority order — scale and rotate
   * first so their handles take precedence over translate.
   */
  constructor() {
    const translateMode = new TranslateMode();
    const scaleMode = new RectangleScaleMode();
    const rotateMode = new RotateModeWithSnap();

    // Order: scale and rotate first so their handles take priority over translate.
    super([scaleMode, rotateMode, translateMode]);

    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  /**
   * Wires scale-handle picks to RectangleScaleMode (Shift → uniform scale)
   * and rotate-handle picks to RotateModeWithSnap (Shift → 45° snap).
   */
  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Scale handle: corner handles on the rectangle.
        match: (pick) =>
          Boolean(
            pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
          ),
        mode: this.scaleMode,
        shiftConfig: { configKey: 'lockScaling' },
      },
      {
        // Rotate handle: top handle from the rotate mode's envelope.
        match: (pick) =>
          Boolean(
            pick.isGuide &&
              pick.object?.properties?.editHandleType === 'rotate',
          ),
        mode: this.rotateMode,
        shiftConfig: { configKey: 'snapRotation' },
      },
    ];
  }

  /**
   * Defaults to translate when no scale or rotate handle is under the
   * pointer, so dragging the shape body moves it.
   */
  protected override getDefaultMode(): GeoJsonEditMode {
    // biome-ignore lint/suspicious/noExplicitAny: Library type inconsistency — see HandleMatcher JSDoc in base-transform-mode
    return this.translateMode as any;
  }

  /**
   * Update tooltip with shape dimensions during scaling.
   */
  protected override onDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    if (this.activeDragMode !== this.scaleMode) {
      return;
    }

    this.updateRectangleTooltip(event, props);
  }

  /**
   * Filter duplicate envelope guides emitted by stacked sub-modes and
   * reposition the rotate handle so it sits on the rectangle's actual top
   * edge instead of the axis-aligned bbox.
   *
   * Both ScaleMode and RotateMode emit an envelope as part of their guides;
   * we keep scale's envelope (which now follows the rotated rectangle's
   * actual outline) and drop rotate's axis-aligned bbox envelope. We also
   * hide scale handles while a rotation drag is in progress to avoid clutter.
   *
   * RotateMode places the rotate handle at the top-center of the polygon's
   * lat/lon-axis-aligned bbox, which floats far outside a rotated rectangle.
   * For rectangles we move the handle onto the midpoint of whichever edge is
   * currently most-northern (highest mean latitude), so it always sits on
   * the visually-top edge regardless of how far the rectangle has been spun.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const allGuides = super.getGuides(props);

    const rotateHandlePos = this.getRectangleTopEdgeMidpoint(props);

    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
    const processed: any[] = [];
    for (const guide of allGuides.features) {
      // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
      const guideAny = guide as any;
      const properties = guideAny?.properties ?? {};
      const guideType = properties.guideType;
      const editHandleType = properties.editHandleType;
      const mode = properties.mode;

      // Drop rotate-mode envelope; keep scale-mode envelope (which is the
      // rectangle's actual outline thanks to RectangleScaleMode.getGuides).
      if (
        mode !== 'scale' &&
        editHandleType === undefined &&
        guideType === undefined
      ) {
        continue;
      }

      // Hide scale handles while actively rotating.
      if (this.rotateMode.getIsRotating() && editHandleType === 'scale') {
        continue;
      }

      // Reposition the rotate handle onto the rectangle's top edge.
      if (
        rotateHandlePos &&
        editHandleType === 'rotate' &&
        guideAny?.geometry?.type === 'Point'
      ) {
        processed.push({
          ...guideAny,
          geometry: { ...guideAny.geometry, coordinates: rotateHandlePos },
        });
        continue;
      }

      processed.push(guide);
    }

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
    return featureCollection(processed as any) as any;
  }

  /**
   * Midpoint of whichever rectangle edge is currently most-northern (i.e.
   * has the highest mean latitude). Returns null when no rectangle is
   * selected.
   */
  private getRectangleTopEdgeMidpoint(
    props: ModeProps<FeatureCollection>,
  ): [number, number] | null {
    const selectedIndex = props.selectedIndexes?.[0];

    if (selectedIndex === undefined) {
      return null;
    }

    const feature = props.data.features[selectedIndex];

    if (
      !feature ||
      feature.properties?.shape !== 'Rectangle' ||
      feature.geometry.type !== 'Polygon'
    ) {
      return null;
    }

    const ring = (feature.geometry as Polygon).coordinates[0];

    if (!ring || ring.length < 4) {
      return null;
    }

    let bestMidpoint: [number, number] | null = null;
    let bestLat = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < 4; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % 4];

      if (!(a && b)) {
        continue;
      }

      const aLon = a[0] as number;
      const aLat = a[1] as number;
      const bLon = b[0] as number;
      const bLat = b[1] as number;
      const midLat = (aLat + bLat) / 2;

      if (midLat > bestLat) {
        bestLat = midLat;
        bestMidpoint = [(aLon + bLon) / 2, midLat];
      }
    }

    return bestMidpoint;
  }

  /**
   * Update the tooltip with rectangle dimensions and area, called during
   * scale drag.
   */
  private updateRectangleTooltip(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    const { mapCoords } = event;
    const distanceUnits =
      (props.modeConfig?.distanceUnits as DistanceUnit) ??
      DEFAULT_DISTANCE_UNITS;

    const selectedIndex = props.selectedIndexes?.[0];

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

    const ring = feature.geometry.coordinates[0];

    if (!ring || ring.length < 4) {
      this.tooltip = null;

      return;
    }

    const corner0 = ring[0] as [number, number];
    const corner1 = ring[1] as [number, number];
    const corner2 = ring[2] as [number, number];

    const measurements = computeRectangleMeasurementsFromCorners(
      corner0,
      corner1,
      corner2,
      distanceUnits,
    );

    const unitAbbrev = DISTANCE_UNIT_SYMBOLS[distanceUnits];

    this.tooltip = {
      position: mapCoords,
      text: formatRectangleTooltip(
        measurements.width,
        measurements.height,
        measurements.area,
        unitAbbrev,
      ),
    };
  }
}
