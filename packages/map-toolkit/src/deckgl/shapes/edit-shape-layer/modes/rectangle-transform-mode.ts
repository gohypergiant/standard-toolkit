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
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import { formatRectangleTooltip } from '../../shared/constants';
import { computeRectangleMeasurementsFromCorners } from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RectangleScaleMode } from './rectangle-scale-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { latToMercatorY, mercatorYToLat } from './mercator';
import {
  computePolygonBounds,
  computeRotateStemTip,
  filterGuidesForRotation,
  type PolygonBounds,
  postProcessTransformGuides,
} from './transform-mode-guides';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Pick whichever of the rectangle's 4 edges is currently most-northern
 * (highest mean latitude) and return its midpoint plus the two corner
 * positions of that edge. The corners let the caller compute the edge's
 * outward perpendicular for stem orientation. Returns null when the
 * ring is missing or has fewer than 4 corners.
 */
function topEdgeMidpointWithEndpoints(ring: Position[] | undefined): {
  midpoint: [number, number];
  start: [number, number];
  end: [number, number];
} | null {
  if (!ring || ring.length < 4) {
    return null;
  }

  let best: {
    midpoint: [number, number];
    start: [number, number];
    end: [number, number];
  } | null = null;
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
      best = {
        midpoint: [(aLon + bLon) / 2, midLat],
        start: [aLon, aLat],
        end: [bLon, bLat],
      };
    }
  }

  return best;
}

/**
 * Compute the rotate-handle stem tip for a rectangle: position the tip
 * **perpendicular to the most-northern edge** in Mercator space, at the
 * same visual distance the deck.gl formula would produce when going
 * straight north. This means the stem rotates with the rectangle —
 * pointing "up out of the top edge" regardless of how the rectangle is
 * spun, instead of always pointing toward true north.
 *
 * The Mercator-space length is matched to the lat-degree offset that
 * `computeRotateStemTip` would produce for the same bounds, so an
 * axis-aligned rectangle's stem visually matches the ellipse's stem.
 */
function computePerpendicularStemTip(
  midpoint: [number, number],
  edgeStart: [number, number],
  edgeEnd: [number, number],
  bounds: PolygonBounds,
): [number, number] {
  const baseLat = midpoint[1];

  // Reuse the shared straight-up-tip helper to get the lat-offset, then
  // convert that to Mercator-y units so we can apply it along an
  // arbitrary direction without distorting the visual length.
  const straightTip = computeRotateStemTip(midpoint, bounds);
  const baseMercY = latToMercatorY(baseLat);
  const stemLengthMerc = latToMercatorY(straightTip[1]) - baseMercY;

  // Edge direction in Mercator. Mercator x = lon (already), y =
  // latToMercatorY(lat). The edge is rectangular in Mercator, so this
  // gives the on-screen edge orientation.
  const startMercY = latToMercatorY(edgeStart[1]);
  const endMercY = latToMercatorY(edgeEnd[1]);
  const edgeDx = edgeEnd[0] - edgeStart[0];
  const edgeDy = endMercY - startMercY;
  const edgeLen = Math.hypot(edgeDx, edgeDy);

  if (edgeLen === 0) {
    // Degenerate edge: fall back to straight-up.
    return straightTip;
  }

  // Perpendicular candidate (rotate edge by -90°).
  let normalX = edgeDy / edgeLen;
  let normalY = -edgeDx / edgeLen;

  // Ensure outward orientation by checking the dot product with the
  // vector from rectangle center → midpoint. If the perpendicular points
  // toward the interior (negative dot), flip it.
  const centerLon = (bounds.minLon + bounds.maxLon) / 2;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerMercY = latToMercatorY(centerLat);
  const radialX = midpoint[0] - centerLon;
  const radialY = baseMercY - centerMercY;

  if (radialX * normalX + radialY * normalY < 0) {
    normalX = -normalX;
    normalY = -normalY;
  }

  const tipMercX = midpoint[0] + normalX * stemLengthMerc;
  const tipMercY = baseMercY + normalY * stemLengthMerc;

  return [tipMercX, mercatorYToLat(tipMercY)];
}

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
   * place the rotate handle outside the rectangle's most-northern edge
   * with a connector stem (Figma/Inkscape pattern).
   *
   * Both ScaleMode and RotateMode emit an envelope as part of their guides;
   * we keep scale's envelope (which now follows the rotated rectangle's
   * actual outline) and drop rotate's axis-aligned bbox envelope. During
   * rotation drag, all chrome is dropped via `filterGuidesForRotation` so
   * only the rotating shape and pivot remain.
   *
   * The rotate handle's stem **base** is the midpoint of the
   * most-northern edge; the **tip** is offset directly north by
   * `computeRotateStemTip`, which mirrors the deck.gl `RotateMode`
   * formula. A connector LineString with `mode: 'rotate-stem'` is
   * appended so the handle reads as "the dot connected to the shape by
   * a line is the rotate handle".
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
   * Compute the rotate-handle stem: the midpoint of the rectangle's
   * most-northern edge (`base`) and a `tip` positioned **perpendicular
   * to that edge in Mercator space**, so the stem rotates with the
   * rectangle instead of always pointing toward true north. Stem length
   * matches the deck.gl `RotateMode` formula. Returns null when no
   * rectangle is selected.
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
      feature.properties?.shape !== 'Rectangle' ||
      feature.geometry.type !== 'Polygon'
    ) {
      return null;
    }

    const ring = (feature.geometry as Polygon).coordinates[0];
    const edge = topEdgeMidpointWithEndpoints(ring);

    if (!edge) {
      return null;
    }

    const bounds = computePolygonBounds(ring);

    if (!bounds) {
      return null;
    }

    const tip = computePerpendicularStemTip(
      edge.midpoint,
      edge.start,
      edge.end,
      bounds,
    );

    return { base: edge.midpoint, tip };
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
