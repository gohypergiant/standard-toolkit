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
import { latToMercatorY, mercatorYToLat } from './utils/mercator';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { SessionCache } from './utils/session-cache';
import {
  computePolygonBounds,
  computeRotateStemTip,
  filterGuidesForRotation,
  type PolygonBounds,
  postProcessTransformGuides,
} from './utils/transform-mode-guides';
import type { Feature, Polygon } from 'geojson';

/**
 * Compute a single axis endpoint at `axisIndex`, where the four
 * endpoints are indexed in the order:
 * `0 = +ySemi` (bearing `angle`), `1 = +xSemi` (bearing `angle + 90`),
 * `2 = -ySemi` (bearing `angle + 180`), `3 = -xSemi` (bearing
 * `angle + 270`).
 *
 * Pulled out of the full-endpoints helper so per-frame consumers (the
 * rotate-stem path that already knows which index it wants via the
 * shape-level lock) avoid running `rhumbDestination` three extra times
 * just to discard three of the results.
 */
function computeAxisEndpointAt(
  info: EllipseInfo,
  axisIndex: number,
): [number, number] {
  const center2D: [number, number] = [
    info.center[0] as number,
    info.center[1] as number,
  ];
  // Even indices (0, 2) live on the ySemi axis; odd indices (1, 3) on
  // the xSemi axis. Each step around the indices adds 90° of bearing.
  const semiValue = axisIndex % 2 === 0 ? info.ySemiValue : info.xSemiValue;
  const bearing = info.angle + axisIndex * 90;

  return rhumbDestination(center2D, semiValue, bearing, {
    units: info.units,
  }).geometry.coordinates as [number, number];
}

/**
 * Compute all four axis endpoints. Used when we need to compare across
 * endpoints (e.g. picking the most-northern one at edit-session start);
 * for the hot-path "read just one by known index" case prefer
 * {@link computeAxisEndpointAt}.
 */
function computeAxisEndpoints(info: EllipseInfo): [number, number][] {
  return [0, 1, 2, 3].map((index) => computeAxisEndpointAt(info, index));
}

/**
 * Pick the index (0–3) of the most-northern axis endpoint. Used at
 * edit-session start to lock the rotate handle to whichever endpoint
 * is currently on top; the handle then stays attached to that
 * shape-local endpoint for the rest of the session, even after rotations
 * move it off the geographic top.
 */
function pickNorthernmostAxisIndex(info: EllipseInfo): number {
  const endpoints = computeAxisEndpoints(info);
  let bestIndex = 0;
  let bestLat = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < endpoints.length; i++) {
    const candidate = endpoints[i];

    if (candidate && candidate[1] > bestLat) {
      bestLat = candidate[1];
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Build the rotate-handle stem rooted at a specific axis endpoint
 * (selected by `axisIndex`, see {@link computeAxisEndpointAt}). Stem
 * direction is outward along the radial from center to the endpoint
 * (= perpendicular to the ellipse's tangent there), and length matches
 * the deck.gl `RotateMode` formula in Mercator-space distance. Falls
 * back to the shared straight-north tip if the radial degenerates.
 */
function computeAxisStem(
  info: EllipseInfo,
  bounds: PolygonBounds,
  axisIndex: number,
): { base: [number, number]; tip: [number, number] } {
  // Compute just the one endpoint we need rather than all four —
  // `rhumbDestination` allocates a Point Feature on each call, and this
  // function runs every render frame.
  const safeIndex = axisIndex >= 0 && axisIndex < 4 ? axisIndex : 0;
  const base = computeAxisEndpointAt(info, safeIndex);

  const center2D: [number, number] = [
    info.center[0] as number,
    info.center[1] as number,
  ];

  const baseMercY = latToMercatorY(base[1]);
  const centerMercY = latToMercatorY(center2D[1]);
  const dirX = base[0] - center2D[0];
  const dirY = baseMercY - centerMercY;
  const dirLen = Math.hypot(dirX, dirY);

  if (dirLen === 0) {
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
   * Locked rotate-handle anchor for the current edit session: the index
   * of the axis endpoint (0–3, see {@link computeAxisEndpointAt}) chosen
   * the first time `getGuides` runs for a given shape. Locking by
   * `shapeId` keeps the handle attached to the same shape-local point
   * for the whole edit session — the handle starts on the geographic
   * top and rides along with subsequent rotations rather than hopping
   * to the new most-northern endpoint after each gesture. Reset on
   * session boundary by {@link resetLockedAnchor} (called from the edit
   * layer when the editing shape ID changes).
   */
  private anchorCache = new SessionCache<number>();

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
   * place the rotate handle outside whichever of the ellipse's four
   * axis endpoints is currently most-northern, with a connector stem.
   *
   * Both ScaleMode and RotateMode emit an envelope as part of their guides;
   * we keep scale's envelope (which is the ellipse's actual outline thanks
   * to `EllipseScaleMode.getGuides`) and drop rotate's axis-aligned bbox
   * envelope. During rotation drag, all chrome is dropped via
   * `filterGuidesForRotation` so only the rotating shape and pivot remain.
   *
   * The handle's stem **base** is the most-northern axis endpoint; the
   * **tip** is offset outward along the radial from center. A connector
   * LineString with `mode: 'rotate-stem'` is appended so the handle
   * reads as "the dot connected to the shape by a line is the rotate
   * handle". The handle reappears at the new geographic top after each
   * rotation completes, matching the user expectation that the rotate
   * stem always sits at the visual top of the shape.
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
   * Clear the session-locked rotate-anchor cache. The edit layer calls
   * this when the editing shape ID changes (a new edit session begins),
   * so the handle re-locks to whichever endpoint is currently most-northern
   * for the freshly-opened shape.
   */
  resetLockedAnchor(): void {
    this.anchorCache.reset();
  }

  /**
   * Compute the rotate-handle stem for the ellipse:
   * - **Base** is the locked axis endpoint for this edit session. The
   *   first call after the lock is cleared picks whichever of the four
   *   endpoints is currently most-northern; subsequent calls reuse that
   *   choice so the handle stays attached to the same shape-local point
   *   while the user rotates.
   * - **Tip** is offset outward along the radial from center to that
   *   endpoint (= perpendicular to the ellipse's tangent there).
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

    const axisIndex = this.getOrLockAxisIndex(feature, info);

    return computeAxisStem(info, bounds, axisIndex);
  }

  /**
   * Return the locked axis-endpoint index for this edit session, locking
   * a fresh choice if none is cached. The cache is keyed by the shape's
   * stable `properties.shapeId` so it survives transforms (which produce
   * new feature objects) but resets when {@link resetLockedAnchor} runs
   * at session boundary. If a feature has no `shapeId` (legacy or test
   * fixtures), fall back to recomputing the most-northern endpoint each
   * frame — at worst the handle hops, which preserves the prior behavior.
   */
  private getOrLockAxisIndex(
    // biome-ignore lint/suspicious/noExplicitAny: feature properties shape varies
    feature: { properties?: any },
    info: EllipseInfo,
  ): number {
    const shapeId =
      typeof feature.properties?.shapeId === 'string'
        ? feature.properties.shapeId
        : undefined;

    return (
      this.anchorCache.getOrInit(shapeId, () =>
        pickNorthernmostAxisIndex(info),
      ) ?? pickNorthernmostAxisIndex(info)
    );
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
