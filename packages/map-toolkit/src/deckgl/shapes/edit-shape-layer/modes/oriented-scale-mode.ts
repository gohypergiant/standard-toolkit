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

import type {
  DraggingEvent,
  ModeProps,
  SimpleFeatureCollection,
  StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import { centroid as turfCentroid } from '@turf/turf';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
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
const BBOX_ORIENTATION_CONFIG_KEY = 'bboxOrientationAngle';

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
 * centroid), computes scale factors there, applies them along the
 * polygon's local axes, and re-projects to world. The OBB stays a clean
 * rotated rectangle around a coherently scaled polygon, matching the
 * approach `RectangleScaleMode` uses for rotated rectangles.
 *
 * Falls through to the parent's behavior when:
 * - `modeConfig.bboxOrientationAngle` is missing or zero (unrotated
 *   polygon — world axes ARE the local axes), or
 * - `modeConfig.lockScaling` is true (uniform scale is rotation-invariant
 *   so the parent's world-frame uniform formula gives the right result).
 */
export class OrientedScaleMode extends ScaleModeWithFreeTransform {
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (!shouldUseOrientedPath(props)) {
      super.handleDragging(event, props);
      return;
    }
    this.handleOrientedDrag(event, props, 'scaling');
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (!shouldUseOrientedPath(props)) {
      super.handleStopDragging(event, props);
      return;
    }
    this.handleOrientedDrag(event, props, 'scaled');
  }

  /**
   * Run a single non-uniform scale step in the polygon's local frame
   * and emit the resulting `scaling` / `scaled` edit action. Mirrors
   * the parent's flow (capture origin from the diagonal-opposite scale
   * handle, snapshot geometry, compute factors, transform vertices,
   * call `onEdit`) but every step happens after un-rotating into the
   * local frame.
   */
  private handleOrientedDrag(
    event: DraggingEvent | StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
    editType: 'scaling' | 'scaled',
  ): void {
    // biome-ignore lint/suspicious/noExplicitAny: ScaleMode private state
    const self = this as any;

    if (!self._isScaling) {
      return;
    }

    const oppositeHandle = self._getOppositeScaleHandle(
      self._selectedEditHandle,
    );
    if (!oppositeHandle) {
      return;
    }
    const geometry = self._geometryBeingScaled as
      | SimpleFeatureCollection
      | undefined;
    if (!geometry) {
      return;
    }

    const angleDeg = props.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY] as number;
    const origin = oppositeHandle.geometry.coordinates as Position;
    // biome-ignore lint/suspicious/noExplicitAny: turf type variance
    const centroid = turfCentroid(geometry as any).geometry.coordinates as [
      number,
      number,
    ];

    const transforms = createLocalTransforms(centroid, angleDeg);

    const startLocal = transforms.toLocal(event.pointerDownMapCoords);
    const currentLocal = transforms.toLocal(event.mapCoords);
    const originLocal = transforms.toLocal(origin);

    const factors = computeLocalScaleFactors(
      startLocal,
      currentLocal,
      originLocal,
    );

    const scaledFeatures = applyOrientedScale(
      geometry,
      factors,
      originLocal,
      transforms,
    );

    const updatedData = self._getUpdatedData(props, scaledFeatures);

    props.onEdit({
      updatedData,
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    });

    if (editType === 'scaled') {
      props.onUpdateCursor(null);
      self._geometryBeingScaled = null;
      self._selectedEditHandle = null;
      self._cursor = null;
      self._isScaling = false;
      return;
    }

    props.onUpdateCursor(self._cursor);
    event.cancelPan();
  }
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
  const angleDeg = props.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY] as
    | number
    | undefined;
  const lockScaling = Boolean(props.modeConfig?.lockScaling);
  return Boolean(angleDeg) && !lockScaling;
}

type LocalTransforms = {
  toLocal: (worldPosition: Position) => [number, number];
  fromLocal: (localPosition: [number, number]) => [number, number];
};

/**
 * Build the world↔local transform pair for the polygon's local frame
 * at the given centroid and compass-degree rotation angle. Compass
 * convention matches `turfTransformRotate` and the
 * `vertex-transform-mode` oriented-bounding-box math: positive angle
 * rotates north→east. The forward (world→local) transform is the
 * inverse of the layer's `+angleDeg` rotation, so it un-rotates the
 * polygon into a frame where the bounding box is axis-aligned.
 */
function createLocalTransforms(
  centroid: [number, number],
  angleDeg: number,
): LocalTransforms {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  return {
    toLocal: (worldPosition) => {
      const deltaX = (worldPosition[0] as number) - centroid[0];
      const deltaY = (worldPosition[1] as number) - centroid[1];
      // Inverse of compass-positive rotation by angleDeg.
      return [deltaX * cos - deltaY * sin, deltaX * sin + deltaY * cos];
    },
    fromLocal: (localPosition) => [
      localPosition[0] * cos + localPosition[1] * sin + centroid[0],
      -localPosition[0] * sin + localPosition[1] * cos + centroid[1],
    ],
  };
}

/**
 * Compute X/Y scale factors in the polygon's local frame, mirroring
 * the parent's per-axis ratio formula but on the un-rotated coordinates.
 * Clamps to {@link MIN_SCALE} to prevent polygon collapse / inversion;
 * defaults a near-zero start delta to scale 1 (no change on that axis).
 */
function computeLocalScaleFactors(
  startLocal: [number, number],
  currentLocal: [number, number],
  originLocal: [number, number],
): { scaleX: number; scaleY: number } {
  const startDx = startLocal[0] - originLocal[0];
  const startDy = startLocal[1] - originLocal[1];
  const currentDx = currentLocal[0] - originLocal[0];
  const currentDy = currentLocal[1] - originLocal[1];

  const rawScaleX = Math.abs(startDx) > NEAR_ZERO ? currentDx / startDx : 1;
  const rawScaleY = Math.abs(startDy) > NEAR_ZERO ? currentDy / startDy : 1;

  return {
    scaleX: Math.max(rawScaleX, MIN_SCALE),
    scaleY: Math.max(rawScaleY, MIN_SCALE),
  };
}

/**
 * Apply non-uniform scaling to every coordinate in `geometry`, with the
 * scale evaluated in the polygon's local frame and anchored at
 * `originLocal`. Each coordinate round-trips world → local → scaled →
 * world; the resulting polygon stays oriented at the same rotation
 * angle as before (since rotations and uniform translations compose
 * linearly with the local-frame scale).
 */
function applyOrientedScale(
  geometry: SimpleFeatureCollection,
  factors: { scaleX: number; scaleY: number },
  originLocal: [number, number],
  transforms: LocalTransforms,
): SimpleFeatureCollection {
  const scaleCoord = (coord: Position): Position => {
    const local = transforms.toLocal(coord);
    const scaled: [number, number] = [
      originLocal[0] + (local[0] - originLocal[0]) * factors.scaleX,
      originLocal[1] + (local[1] - originLocal[1]) * factors.scaleY,
    ];
    return transforms.fromLocal(scaled);
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
 * Walk a GeoJSON geometry, applying `transformCoord` to each position.
 * Mirrors the parent's `scaleGeometry` shape so the OBB-aware path
 * supports the same geometry kinds (Point, LineString, Polygon, and
 * their Multi* variants).
 */
function scaleGeometryCoords(
  // biome-ignore lint/suspicious/noExplicitAny: geometry types vary; we dispatch on type below
  geometry: any,
  transformCoord: (coord: Position) => Position,
  // biome-ignore lint/suspicious/noExplicitAny: returns the same geometry shape we received
): any {
  switch (geometry.type) {
    case 'Point':
      return { ...geometry, coordinates: transformCoord(geometry.coordinates) };
    case 'LineString':
    case 'MultiPoint':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map(transformCoord),
      };
    case 'Polygon':
    case 'MultiLineString':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((ring: Position[]) =>
          ring.map(transformCoord),
        ),
      };
    case 'MultiPolygon':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((polygon: Position[][]) =>
          polygon.map((ring: Position[]) => ring.map(transformCoord)),
        ),
      };
    default:
      return geometry;
  }
}

/**
 * Re-export so `VertexTransformMode` can use the same key when it pipes
 * the rotation angle through `modeConfig`.
 */
export { BBOX_ORIENTATION_CONFIG_KEY };
