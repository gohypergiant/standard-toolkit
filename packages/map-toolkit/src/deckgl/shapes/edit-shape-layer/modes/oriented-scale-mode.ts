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

import { centroid as turfCentroid } from '@turf/turf';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import { latToMercatorY, mercatorYToLat } from './utils/mercator';
import {
  type ScaleModePrivate,
  scaleModePrivate,
} from './utils/scale-mode-internals';
import type {
  DraggingEvent,
  ModeProps,
  SimpleFeatureCollection,
  StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import type { Position } from 'geojson';

/**
 * Minimum scale factor — matches the parent's clamping. Prevents the
 * polygon from collapsing or inverting at the extremes of a drag.
 */
const MIN_SCALE = 0.01;

/**
 * Epsilon for near-zero divisor checks in the scale-factor formula.
 */
const NEAR_ZERO = 1e-7;

/**
 * `modeConfig` key the parent transform mode (`VertexTransformMode`)
 * uses to pipe the polygon's cumulative rotation angle through to this
 * scale mode. When present and non-zero, scaling happens in the
 * polygon's local frame (un-rotated by the angle around the polygon's
 * centroid); when missing or zero, the parent's world-axis behavior is
 * used unchanged.
 */
export const BBOX_ORIENTATION_CONFIG_KEY = 'bboxOrientationAngle';

/**
 * Drag-start invariants captured the first frame `OrientedScaleMode`
 * routes to its oriented-bounding-box-aware path. All four fields are
 * constant for the lifetime of a single drag gesture so recomputing
 * them per pointer-move frame is wasted work.
 *
 * - `geometry`: the snapshot `ScaleMode` captures at start.
 * - `origin`: the diagonal-opposite oriented bounding box corner (lat/lon).
 * - `centroid`: the polygon's centroid **projected to Mercator** (x = lon,
 *   y = `latToMercatorY(lat)`). All scale math runs in the Mercator
 *   frame to match the projection deck.gl renders into and stay aligned
 *   with the Mercator-true bounding box `vertex-bbox-math` produces.
 * - `cos` / `sin`: pre-computed rotation matrix coefficients for the
 *   cumulative session angle.
 */
type DragSnapshot = {
  geometry: SimpleFeatureCollection;
  origin: Position;
  centroid: [number, number];
  cos: number;
  sin: number;
};

/**
 * Bundle of "we're mid-drag and have everything we need" state pulled
 * out of `ScaleMode`'s private fields. Returns `null` if the drag isn't
 * active or one of the required pieces is missing — the caller exits
 * early in that case.
 */
type DragContext = {
  origin: Position;
  geometry: SimpleFeatureCollection;
};

/**
 * Read the cumulative rotation angle the parent transform mode piped
 * through `modeConfig`. Strictly type-guards: a missing / non-number /
 * non-finite value short-circuits to `0` so the consumer can route to
 * the parent's world-axis path without the oriented-bounding-box-aware code touching a
 * potentially-`NaN` matrix.
 */
function readOrientationAngle(
  props: ModeProps<SimpleFeatureCollection>,
): number {
  const raw = props.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY];

  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/**
 * `true` when the parent transform mode has piped a non-zero rotation
 * angle through `modeConfig` and the user is doing non-uniform scaling.
 * Uniform scaling is rotation-invariant so we let the parent handle it
 * unchanged.
 */
function shouldUseOrientedPath(
  props: ModeProps<SimpleFeatureCollection>,
): boolean {
  const lockScaling = Boolean(props.modeConfig?.lockScaling);

  return readOrientationAngle(props) !== 0 && !lockScaling;
}

/**
 * Validate ScaleMode's private drag state and return the drag origin
 * (= world-frame opposite oriented bounding box corner) and the drag-start geometry. The
 * cast through `any` is the same boundary every helper in this file
 * accepts to talk to ScaleMode's private fields.
 */
function readDragContext(self: ScaleModePrivate): DragContext | null {
  if (!self._isScaling) {
    return null;
  }

  const oppositeHandle = self._getOppositeScaleHandle(self._selectedEditHandle);

  if (!oppositeHandle) {
    return null;
  }

  if (!self._geometryBeingScaled) {
    return null;
  }

  return {
    origin: oppositeHandle.geometry.coordinates as Position,
    geometry: self._geometryBeingScaled,
  };
}

/**
 * Walk a GeoJSON geometry, applying `transformCoord` to each position.
 * Only `Polygon` and `LineString` are reachable here — `VertexTransformMode`
 * opens this path for those two geometry types only — so we don't carry
 * the `Point` / `MultiPoint` / `MultiLineString` / `MultiPolygon` branches
 * the parent's `scaleGeometry` covers. Any other geometry type falls
 * through unchanged.
 */
function scaleGeometryCoords(
  // biome-ignore lint/suspicious/noExplicitAny: geometry types vary; we dispatch on type below
  geometry: any,
  transformCoord: (coord: Position) => Position,
  // biome-ignore lint/suspicious/noExplicitAny: returns the same geometry shape we received
): any {
  switch (geometry.type) {
    case 'LineString':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map(transformCoord),
      };
    case 'Polygon':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((ring: Position[]) =>
          ring.map(transformCoord),
        ),
      };
    default:
      return geometry;
  }
}

/**
 * Apply non-uniform scaling to every coordinate in `geometry`, with the
 * scale evaluated in the polygon's local frame and anchored at
 * `(originLocalX, originLocalY)`. The hot path here inlines the
 * world → local → scaled → world round-trip with primitive math, so
 * each vertex allocates exactly one `[number, number]` tuple (the
 * return value) instead of three intermediates. For a 100-vertex
 * polygon at 60fps that drops from ~18 000 short-lived arrays per
 * second to ~6 000.
 */
function applyOrientedScale(
  geometry: SimpleFeatureCollection,
  scaleX: number,
  scaleY: number,
  originLocalX: number,
  originLocalY: number,
  centroidMerc: [number, number],
  cos: number,
  sin: number,
): SimpleFeatureCollection {
  const scaleCoord = (coord: Position): Position => {
    // Project to Mercator, then world → local (un-rotate around the
    // Mercator centroid).
    const coordMercY = latToMercatorY(coord[1] as number);
    const deltaX = (coord[0] as number) - centroidMerc[0];
    const deltaY = coordMercY - centroidMerc[1];
    const localX = deltaX * cos - deltaY * sin;
    const localY = deltaX * sin + deltaY * cos;
    // Scale around localOrigin in the Mercator-local frame.
    const scaledX = originLocalX + (localX - originLocalX) * scaleX;
    const scaledY = originLocalY + (localY - originLocalY) * scaleY;
    // Local → Mercator world, then back to lat/lon for the GeoJSON output.
    const worldMercX = scaledX * cos + scaledY * sin + centroidMerc[0];
    const worldMercY = -scaledX * sin + scaledY * cos + centroidMerc[1];

    return [worldMercX, mercatorYToLat(worldMercY)];
  };

  const scaledFeatures = geometry.features.map((feature) => ({
    ...feature,
    geometry: scaleGeometryCoords(feature.geometry, scaleCoord),
  }));

  return {
    type: 'FeatureCollection',
    // biome-ignore lint/suspicious/noExplicitAny: feature-type variance across geometry kinds
    features: scaledFeatures as any,
  };
}

/**
 * Project drag positions into the polygon's local frame, derive the
 * per-axis scale factors, and apply them to every coordinate of the
 * snapshot geometry. The returned feature collection is what
 * `onEdit('scaling' | 'scaled', ...)` receives; the parent's
 * `_getUpdatedData` then merges it into the editable-layer state.
 */
function computeScaledFeatures(
  snapshot: DragSnapshot,
  event: DraggingEvent | StopDraggingEvent,
): SimpleFeatureCollection {
  const { centroid: centroidMerc, cos, sin } = snapshot;

  // Un-rotate the three world positions we care about (drag start,
  // current cursor, scale origin) into the polygon's local Mercator
  // frame. The y-coordinate of each is projected through `latToMercatorY`
  // before subtracting the Mercator centroid. Math is inlined here
  // instead of behind a closure to keep the hot path allocation-free.
  const originMercY = latToMercatorY(snapshot.origin[1] as number);
  const startMercY = latToMercatorY(event.pointerDownMapCoords[1] as number);
  const currentMercY = latToMercatorY(event.mapCoords[1] as number);

  const originDx = (snapshot.origin[0] as number) - centroidMerc[0];
  const originDy = originMercY - centroidMerc[1];
  const originLocalX = originDx * cos - originDy * sin;
  const originLocalY = originDx * sin + originDy * cos;
  const startWorldDx =
    (event.pointerDownMapCoords[0] as number) - centroidMerc[0];
  const startWorldDy = startMercY - centroidMerc[1];
  const startLocalX = startWorldDx * cos - startWorldDy * sin;
  const startLocalY = startWorldDx * sin + startWorldDy * cos;
  const currentWorldDx = (event.mapCoords[0] as number) - centroidMerc[0];
  const currentWorldDy = currentMercY - centroidMerc[1];
  const currentLocalX = currentWorldDx * cos - currentWorldDy * sin;
  const currentLocalY = currentWorldDx * sin + currentWorldDy * cos;

  const startDeltaX = startLocalX - originLocalX;
  const startDeltaY = startLocalY - originLocalY;
  const currentDeltaX = currentLocalX - originLocalX;
  const currentDeltaY = currentLocalY - originLocalY;

  const rawScaleX =
    Math.abs(startDeltaX) > NEAR_ZERO ? currentDeltaX / startDeltaX : 1;
  const rawScaleY =
    Math.abs(startDeltaY) > NEAR_ZERO ? currentDeltaY / startDeltaY : 1;
  const scaleX = Math.max(rawScaleX, MIN_SCALE);
  const scaleY = Math.max(rawScaleY, MIN_SCALE);

  return applyOrientedScale(
    snapshot.geometry,
    scaleX,
    scaleY,
    originLocalX,
    originLocalY,
    centroidMerc,
    cos,
    sin,
  );
}

/**
 * Clear the ScaleMode-private fields that mark a drag as in-progress.
 * Mirrors the parent's `resetScaleState` cleanup so a follow-up gesture
 * starts from a known empty state.
 */
function resetScaleState(
  self: ScaleModePrivate,
  props: ModeProps<SimpleFeatureCollection>,
): void {
  props.onUpdateCursor(null);
  self._geometryBeingScaled = null;
  self._selectedEditHandle = null;
  self._cursor = null;
  self._isScaling = false;
}

/**
 * Extends `ScaleModeWithFreeTransform` with oriented-bounding-box
 * scaling for rotated polygons and lines.
 *
 * Plain world-axis non-uniform scaling distorts a rotated polygon —
 * dragging a corner along world X stretches the polygon along world X,
 * which after the rotation has a component along the polygon's local Y
 * too, so the shape visibly shears (a square becomes a parallelogram,
 * thin polygons collapse to slivers). This subclass projects the cursor
 * positions and the polygon's vertices into the polygon's *local* frame
 * (un-rotated by `bboxOrientationAngle` around the polygon's turf
 * centroid projected to Mercator), computes scale factors there, applies
 * them along the polygon's local axes, and re-projects through Mercator
 * back to lat/lon. The oriented bounding box stays a clean rotated
 * rectangle around a coherently scaled polygon, matching the approach
 * `RectangleScaleMode` uses for rotated rectangles.
 *
 * All scale math runs in **Web Mercator** (x = lon, y =
 * `latToMercatorY(lat)`) so the polygon scales in the same projection
 * deck.gl renders into and stays aligned with the Mercator-true bounding
 * box `vertex-bbox-math` produces. Doing the math in raw lat/lon would
 * make the polygon drift away from the visible bbox corners at
 * non-equator latitudes (the bbox is a Mercator-true rectangle on
 * screen; a lat/lon-Euclidean scale would scale the polygon along
 * different axes than the bbox is drawn along).
 *
 * Falls through to the parent's behavior when:
 * - `modeConfig.bboxOrientationAngle` is missing or zero (unrotated
 *   polygon — world axes ARE the local axes), or
 * - `modeConfig.lockScaling` is true (uniform scale is rotation-invariant
 *   so the parent's world-frame uniform formula gives the right result).
 *
 * ## Drag-start caching
 *
 * `dragSnapshot` caches the four invariants (geometry, origin, centroid,
 * cos/sin) on the first oriented-bounding-box-aware frame of a drag and reuses them for
 * the remainder of the gesture. Pointer-move events fire ~60×/sec and
 * `turfCentroid` walks every coordinate; without the cache that walk
 * happens on every frame against an unchanging geometry. The cache is
 * cleared on drag start (parent path) and drag stop.
 *
 * @example
 * ```typescript
 * import { OrientedScaleMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/oriented-scale-mode';
 *
 * // Composed inside VertexTransformMode; pipe the bbox orientation
 * // angle through `modeConfig.bboxOrientationAngle` to switch to the
 * // oriented-bounding-box-aware scaling path.
 * const mode = new OrientedScaleMode();
 * ```
 */
export class OrientedScaleMode extends ScaleModeWithFreeTransform {
  private dragSnapshot: DragSnapshot | null = null;

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (!shouldUseOrientedPath(props)) {
      this.dragSnapshot = null;
      super.handleDragging(event, props);

      return;
    }

    const snapshot = this.ensureDragSnapshot(props);

    if (!snapshot) {
      return;
    }

    this.runOrientedDrag(event, props, 'scaling', snapshot);
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    const snapshot = this.dragSnapshot;
    this.dragSnapshot = null;

    if (!shouldUseOrientedPath(props)) {
      super.handleStopDragging(event, props);

      return;
    }

    if (!snapshot) {
      return;
    }

    this.runOrientedDrag(event, props, 'scaled', snapshot);
  }

  /**
   * Lazily capture the drag-start snapshot. Returns the cached value if
   * one exists; otherwise reads ScaleMode's private drag state, computes
   * the centroid and cos/sin once, and caches the bundle for the rest of
   * the drag.
   */
  private ensureDragSnapshot(
    props: ModeProps<SimpleFeatureCollection>,
  ): DragSnapshot | null {
    if (this.dragSnapshot) {
      return this.dragSnapshot;
    }

    const self = scaleModePrivate(this);
    const context = readDragContext(self);

    if (!context) {
      return null;
    }

    const angleDeg = readOrientationAngle(props);
    // biome-ignore lint/suspicious/noExplicitAny: turf type variance
    const turfCoords = turfCentroid(context.geometry as any).geometry
      .coordinates as [number, number];
    const angleRad = (angleDeg * Math.PI) / 180;
    // Project the lat/lon centroid to Mercator. All un-rotate / re-rotate
    // / scale math runs in the Mercator frame so the polygon scales
    // consistently with the Mercator-true bounding box rendered by
    // `vertex-bbox-math` — same convention `RectangleScaleMode` and
    // `EllipseScaleMode` already use.
    const centroidMerc: [number, number] = [
      turfCoords[0],
      latToMercatorY(turfCoords[1]),
    ];
    this.dragSnapshot = {
      geometry: context.geometry,
      origin: context.origin,
      centroid: centroidMerc,
      cos: Math.cos(angleRad),
      sin: Math.sin(angleRad),
    };

    return this.dragSnapshot;
  }

  /**
   * Run a single non-uniform scale step in the polygon's local frame
   * and emit the resulting `scaling` / `scaled` edit action. Reuses the
   * cached drag-start snapshot rather than recomputing the centroid /
   * cos / sin each frame.
   */
  private runOrientedDrag(
    event: DraggingEvent | StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
    editType: 'scaling' | 'scaled',
    snapshot: DragSnapshot,
  ): void {
    const self = scaleModePrivate(this);

    const scaledFeatures = computeScaledFeatures(snapshot, event);
    const updatedData = self._getUpdatedData(props, scaledFeatures);

    props.onEdit({
      updatedData,
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    });

    if (editType === 'scaled') {
      resetScaleState(self, props);

      return;
    }

    props.onUpdateCursor(self._cursor);
    // `cancelPan` is only present on `DraggingEvent`; `StopDraggingEvent`
    // doesn't need it (the drag is already ending). The runtime `in`
    // check is a structural type-narrow rather than an editType branch,
    // so it stays robust if upstream re-shapes the event types.
    if ('cancelPan' in event) {
      event.cancelPan();
    }
  }
}
