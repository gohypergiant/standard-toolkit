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
import { rhumbDestination } from '@turf/turf';
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import { formatRectangleTooltip } from '../../shared/constants';
import { computeRectangleMeasurementsFromCorners } from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import {
  EllipseScaleMode,
  type EllipseInfo,
  readEllipseInfo,
} from './ellipse-scale-mode';
import { latToMercatorY, mercatorYToLat } from './mercator';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import {
  computePolygonBounds,
  computeRotateStemTip,
  filterGuidesForRotation,
  type PolygonBounds,
  postProcessTransformGuides,
} from './transform-mode-guides';
import type { Feature, Polygon } from 'geojson';

/**
 * Compute the rotate-handle stem from whichever of the four axis-endpoint
 * scale handles is currently most-northern. Stem direction is outward
 * along that axis (which is perpendicular to the ellipse curve's tangent
 * at the endpoint), and length matches the deck.gl `RotateMode` formula
 * in Mercator-space distance. Falls back to the shared straight-north
 * tip if the axis direction degenerates.
 *
 * Mirrors the rectangle's "stem comes off the most-northern edge"
 * behavior: as the ellipse rotates, the stem's base hops between the four
 * axis endpoints to always sit on whichever one is currently on top.
 */
function computeNorthernmostAxisStem(
  info: EllipseInfo,
  bounds: PolygonBounds,
): { base: [number, number]; tip: [number, number] } {
  const center2D: [number, number] = [
    info.center[0] as number,
    info.center[1] as number,
  ];
  const distanceOptions = { units: info.units };

  // turf's ellipse convention: ySemi at compass bearing `angle`, xSemi
  // at `angle + 90`. Compute all four axis endpoints.
  const candidates: [number, number][] = [
    rhumbDestination(center2D, info.ySemiValue, info.angle, distanceOptions)
      .geometry.coordinates as [number, number],
    rhumbDestination(
      center2D,
      info.xSemiValue,
      info.angle + 90,
      distanceOptions,
    ).geometry.coordinates as [number, number],
    rhumbDestination(
      center2D,
      info.ySemiValue,
      info.angle + 180,
      distanceOptions,
    ).geometry.coordinates as [number, number],
    rhumbDestination(
      center2D,
      info.xSemiValue,
      info.angle + 270,
      distanceOptions,
    ).geometry.coordinates as [number, number],
  ];

  let base = candidates[0] as [number, number];
  for (const candidate of candidates) {
    if (candidate[1] > base[1]) {
      base = candidate;
    }
  }

  // Stem direction in Mercator: outward along the radial from center to
  // the chosen endpoint (= perpendicular to the ellipse's tangent at that
  // point, since axes meet the curve at right angles). Stem length
  // matches the deck.gl formula in Mercator-y units to preserve
  // on-screen consistency.
  const baseMercY = latToMercatorY(base[1]);
  const centerMercY = latToMercatorY(center2D[1]);
  const dirX = base[0] - center2D[0];
  const dirY = baseMercY - centerMercY;
  const dirLen = Math.hypot(dirX, dirY);

  if (dirLen === 0) {
    // Degenerate axis (zero-length) — fall back to straight north.
    return { base, tip: computeRotateStemTip(base, bounds) };
  }

  const unitX = dirX / dirLen;
  const unitY = dirY / dirLen;

  const straightTip = computeRotateStemTip(base, bounds);
  const stemLengthMerc = latToMercatorY(straightTip[1]) - baseMercY;

  const tipMercX = base[0] + unitX * stemLengthMerc;
  const tipMercY = baseMercY + unitY * stemLengthMerc;

  return {
    base,
    tip: [tipMercX, mercatorYToLat(tipMercY)],
  };
}

/**
 * Transform mode for ellipses that preserves rotation through every gesture.
 *
 * This mode mirrors the composition of `BoundingTransformMode` (translate +
 * scale + rotate) but swaps the standard `ScaleModeWithFreeTransform` out
 * for `EllipseScaleMode`. The replacement places the scale handles at the
 * ellipse's four axis endpoints (on the curve where the major and minor
 * axes meet the boundary), and its drag math projects the cursor onto the
 * dragged axis in Mercator space — so a corner drag changes only the
 * dragged axis (or both axes uniformly with Shift), and the polygon stays
 * a clean rotated ellipse instead of being stretched into a non-ellipse.
 *
 * ## Capabilities
 * - **Translation** (TranslateMode): Drag the shape body to move it.
 * - **Ellipse-aware scaling** (EllipseScaleMode): Drag an axis-endpoint
 *   handle to resize that axis. With Shift, both axes scale uniformly.
 * - **Rotation** (RotateModeWithSnap): Drag the rotate handle to rotate.
 *   Default free rotation; with Shift, snap to 45° intervals.
 *
 * ## Handle Priority Logic
 * 1. Hovering a scale handle (axis endpoint) → scaling
 * 2. Hovering the rotate handle → rotation
 * 3. Anywhere else on the shape → translation
 *
 * ## When to use
 * Use this mode for `EllipseShape`. Other axis-bounded shapes use
 * different modes: rectangles use `RectangleTransformMode`, wagon wheels
 * use `LockedBoundingTransformMode`, etc.
 *
 * @example
 * ```typescript
 * import { EllipseTransformMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/ellipse-transform-mode';
 *
 * const mode = new EllipseTransformMode();
 * ```
 */
export class EllipseTransformMode extends BaseTransformMode {
  private translateMode: TranslateMode;
  private scaleMode: EllipseScaleMode;
  private rotateMode: RotateModeWithSnap;

  /**
   * Constructs the composite mode by instantiating its three sub-modes
   * (ellipse-aware scale, snap-aware rotate, translate) and registering
   * them with `BaseTransformMode` in priority order — scale and rotate
   * first so their handles take precedence over translate.
   */
  constructor() {
    const translateMode = new TranslateMode();
    const scaleMode = new EllipseScaleMode();
    const rotateMode = new RotateModeWithSnap();

    super([scaleMode, rotateMode, translateMode]);

    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  /**
   * Wires scale-handle picks to EllipseScaleMode (Shift → uniform scale)
   * and rotate-handle picks to RotateModeWithSnap (Shift → 45° snap).
   */
  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Scale handle: axis-endpoint handles on the ellipse.
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

    this.updateEllipseTooltip(event, props);
  }

  /**
   * Filter duplicate envelope guides emitted by stacked sub-modes and
   * reposition the rotate handle to sit just above the ellipse's topmost
   * curve point with a short connector stem (Figma/Inkscape pattern).
   *
   * Both ScaleMode and RotateMode emit an envelope as part of their guides;
   * we keep scale's envelope (which is the ellipse's actual outline thanks
   * to `EllipseScaleMode.getGuides`) and drop rotate's axis-aligned bbox
   * envelope. During rotation drag, all chrome is dropped via
   * `filterGuidesForRotation` so only the rotating shape and pivot remain.
   *
   * The rotate handle is repositioned to `(topmostVertex.lat + offset)`
   * where `offset` is a small fraction of the polygon's lat span. A
   * `LineString` connector with `mode: 'rotate-stem'` is appended so the
   * handle reads as "the dot connected to the shape by a line is the
   * rotate handle". The offset keeps the handle visually distinct from
   * the +ySemi scale handle even when the ellipse is axis-aligned (where
   * the topmost vertex coincides with the +ySemi axis endpoint).
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const allGuides = super.getGuides(props);

    if (this.rotateMode.getIsRotating()) {
      return filterGuidesForRotation(allGuides);
    }

    return postProcessTransformGuides(allGuides, this.computeRotateStem(props));
  }

  /**
   * Compute the rotate-handle stem for the ellipse:
   * - **Base** is whichever of the four axis-endpoint scale handles is
   *   currently most-northern. As the ellipse rotates, the stem's base
   *   hops between the four endpoints — mirroring the rectangle's
   *   "stem comes off the most-northern edge" behavior.
   * - **Tip** is offset outward along the radial from center to the
   *   chosen endpoint (= perpendicular to the ellipse's tangent at that
   *   point, since the ellipse axes meet the curve at right angles).
   * - **Length** matches the deck.gl `RotateMode` connector formula in
   *   Mercator-space distance, so the stem stays visually consistent with
   *   the rectangle's stem.
   */
  private computeRotateStem(
    props: ModeProps<FeatureCollection>,
  ): { base: [number, number]; tip: [number, number] } | null {
    const selectedIndex = props.selectedIndexes?.[0];

    if (selectedIndex === undefined) {
      return null;
    }

    const feature = props.data.features[selectedIndex];

    if (
      !feature ||
      feature.properties?.shape !== 'Ellipse' ||
      feature.geometry.type !== 'Polygon'
    ) {
      return null;
    }

    const ring = (feature.geometry as Polygon).coordinates[0];
    const bounds = computePolygonBounds(ring);

    if (!bounds) {
      return null;
    }

    const info = readEllipseInfo(feature);

    if (!info) {
      return null;
    }

    return computeNorthernmostAxisStem(info, bounds);
  }

  /**
   * Update the tooltip with ellipse dimensions and area, called during a
   * scale drag. Reuses `formatRectangleTooltip` since the ellipse's
   * bounding-box dimensions are the same fields as the rectangle's.
   */
  private updateEllipseTooltip(
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

    // For an ellipse polygon, the bounding-rectangle measurement is a fair
    // approximation: width = 2 × xSemiAxis, height = 2 × ySemiAxis.
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
