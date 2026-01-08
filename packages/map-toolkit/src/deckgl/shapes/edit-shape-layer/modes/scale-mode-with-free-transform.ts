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
  type ModeProps,
  ScaleMode,
  type StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import type { Position } from 'geojson';

type ScaleFactors = {
  scaleX: number;
  scaleY: number;
};

type ScaleContext = {
  origin: Position;
  scaleFactors: ScaleFactors;
  geometry: FeatureCollection;
};

/**
 * Extends ScaleMode to support non-uniform (free) scaling.
 *
 * ## Features
 * - Default: Free scaling - can stretch/squish in any direction
 * - With modeConfig.lockScaling = true: Uniform scaling (maintains aspect ratio)
 *
 * ## How Non-Uniform Scaling Works
 *
 * Non-uniform scaling applies separate X and Y scale factors based on cursor
 * movement relative to the opposite corner (the "origin" or anchor point).
 *
 * ```
 *   Origin (opposite corner)           Drag Handle (start)
 *   ●───────────────────────────────────●
 *   │                                   │
 *   │     startDelta = start - origin   │
 *   │     currentDelta = current - origin
 *   │                                   │
 *   │     scaleX = currentDeltaX / startDeltaX
 *   │     scaleY = currentDeltaY / startDeltaY
 *   │                                   │
 *   ●───────────────────────────────────● Cursor (current)
 * ```
 *
 * Each coordinate is transformed: `newCoord = origin + (oldCoord - origin) × scale`
 *
 * ## Why We Override Parent's Uniform Scaling
 *
 * The parent ScaleMode calculates uniform scale factors in screen coordinates,
 * which can distort rotated shapes. We calculate our own uniform factor using
 * vector projection to ensure the corner follows the cursor's projection onto
 * the original drag line, preserving shape orientation.
 *
 * ## Minimum Scale Clamping
 *
 * All scale factors are clamped to a minimum of 0.01 to prevent:
 * - Shape inversion (negative scale flipping the shape inside-out)
 * - Shape collapse (scale of 0 making the shape a point/line)
 */
export class ScaleModeWithFreeTransform extends ScaleMode {
  /**
   * Override handleDragging to support non-uniform scaling.
   * When lockScaling is false (default), applies separate X/Y scale factors.
   * When lockScaling is true, applies uniform scaling (same factor for X and Y).
   *
   * Note: We don't use parent's handleDragging for uniform scaling because it
   * calculates scale factors in screen coordinates which distorts rotated shapes.
   * Instead, we calculate our own uniform scale factor based on distance ratios.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    const self = this as any;

    if (!self._isScaling) {
      return;
    }

    props.onUpdateCursor(self._cursor);

    const scaleContext = this.getScaleContext(event, self);
    if (!scaleContext) {
      return;
    }

    const lockScaling = props.modeConfig?.lockScaling ?? false;
    const { origin, scaleFactors, geometry } = scaleContext;

    // For uniform scaling, use a single scale factor for both axes
    // Calculate based on distance from origin to preserve aspect ratio
    const finalScaleX = lockScaling
      ? this.calculateUniformScaleFactor(event, origin)
      : scaleFactors.scaleX;
    const finalScaleY = lockScaling
      ? this.calculateUniformScaleFactor(event, origin)
      : scaleFactors.scaleY;

    const scaledFeatures = this.applyNonUniformScale(
      geometry,
      finalScaleX,
      finalScaleY,
      origin,
    );

    const updatedData = self._getUpdatedData(props, scaledFeatures);

    props.onEdit({
      updatedData,
      editType: 'scaling',
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    });

    event.cancelPan();
  }

  /**
   * Override handleStopDragging to emit the final scaled geometry.
   * Uses the same uniform/non-uniform scaling logic as handleDragging.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    const self = this as any;

    if (self._isScaling) {
      this.emitFinalScaledGeometry(event, props, self);
      this.resetScaleState(props, self);
    }
  }

  /**
   * Get the scale context (origin, scale factors, geometry) for the current drag.
   * Returns null if required data is not available.
   */
  private getScaleContext(
    event: DraggingEvent | StopDraggingEvent,
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    self: any,
  ): ScaleContext | null {
    if (!self._selectedEditHandle) {
      return null;
    }

    const oppositeHandle = self._getOppositeScaleHandle(
      self._selectedEditHandle,
    );
    if (!oppositeHandle) {
      return null;
    }

    const geometry = self._geometryBeingScaled;
    if (!geometry) {
      return null;
    }

    const origin: Position = oppositeHandle.geometry.coordinates;
    const scaleFactors = this.calculateScaleFactors(event, origin);

    return { origin, scaleFactors, geometry };
  }

  /**
   * Calculate separate X and Y scale factors based on cursor movement.
   *
   * ## Math Explanation
   *
   * For each axis, we compute: `scale = currentDelta / startDelta`
   *
   * Where:
   * - `startDelta` = distance from origin to where drag started (the handle position)
   * - `currentDelta` = distance from origin to current cursor position
   *
   * Example: If the handle started 100px from origin and cursor is now 150px from origin,
   * scale = 150/100 = 1.5 (shape grows to 150% of original size along that axis).
   *
   * ## Edge Cases
   * - If `startDelta` is near zero (handle very close to origin), we return scale=1
   *   to avoid division by zero and prevent erratic behavior
   * - Negative scale values are clamped to 0.01 minimum to prevent shape inversion
   */
  private calculateScaleFactors(
    event: DraggingEvent | StopDraggingEvent,
    origin: Position,
  ): ScaleFactors {
    const startDragPoint = event.pointerDownMapCoords;
    const currentPoint = event.mapCoords;

    // Calculate deltas from the anchor point (origin) to drag positions
    const startDeltaX = (startDragPoint[0] ?? 0) - (origin[0] ?? 0);
    const startDeltaY = (startDragPoint[1] ?? 0) - (origin[1] ?? 0);
    const currentDeltaX = (currentPoint[0] ?? 0) - (origin[0] ?? 0);
    const currentDeltaY = (currentPoint[1] ?? 0) - (origin[1] ?? 0);

    // Epsilon for near-zero checks to avoid division by zero
    const epsilon = 0.0000001;
    // Minimum scale to prevent shape from collapsing or inverting
    const minScale = 0.01;

    // Scale = ratio of (current distance from origin) / (original distance from origin)
    // If original distance is near-zero, default to scale=1 (no change)
    const rawScaleX =
      Math.abs(startDeltaX) > epsilon ? currentDeltaX / startDeltaX : 1;
    const rawScaleY =
      Math.abs(startDeltaY) > epsilon ? currentDeltaY / startDeltaY : 1;

    // Clamp to prevent negative values (which would invert/flip the shape)
    const scaleX = Math.max(rawScaleX, minScale);
    const scaleY = Math.max(rawScaleY, minScale);

    return { scaleX, scaleY };
  }

  /**
   * Calculate a uniform scale factor for aspect-ratio-preserving scaling.
   *
   * ## Why Use Projection Instead of Simple Distance Ratio?
   *
   * A naive approach would be: `scale = distance(origin, cursor) / distance(origin, start)`
   *
   * But this fails for diagonal movements - if you drag a corner handle and move
   * perpendicular to the diagonal, the simple distance changes even though you
   * don't want the shape to scale.
   *
   * ## Vector Projection Math
   *
   * Instead, we project the cursor position onto the line defined by
   * (origin → start drag point). This way, only movement along the original
   * drag direction affects the scale.
   *
   * ```
   *   Origin          Start (drag handle)
   *   ●──────────────────●
   *                       \
   *                        \  Cursor moved diagonally
   *                         ●
   *                        /
   *                       / Projected point (what we measure from)
   *   ●──────────────────●
   *   Origin          Projection
   * ```
   *
   * The projection formula uses the dot product:
   * ```
   * projectedDist = (current · start) / |start|
   * scale = projectedDist / |start|
   * ```
   *
   * This equals: `scale = (current · start) / |start|²`
   */
  private calculateUniformScaleFactor(
    event: DraggingEvent | StopDraggingEvent,
    origin: Position,
  ): number {
    const startDragPoint = event.pointerDownMapCoords;
    const currentPoint = event.mapCoords;

    // Vector from origin to start drag point (defines the scaling direction)
    const startDeltaX = (startDragPoint[0] ?? 0) - (origin[0] ?? 0);
    const startDeltaY = (startDragPoint[1] ?? 0) - (origin[1] ?? 0);

    // Vector from origin to current cursor position
    const currentDeltaX = (currentPoint[0] ?? 0) - (origin[0] ?? 0);
    const currentDeltaY = (currentPoint[1] ?? 0) - (origin[1] ?? 0);

    // Distance from origin to start point (|start|)
    const startDist = Math.sqrt(startDeltaX ** 2 + startDeltaY ** 2);

    if (startDist < 0.0000001) {
      return 1;
    }

    // Dot product: current · start = |current| × |start| × cos(θ)
    // This gives us the component of 'current' that lies along 'start'
    const dotProduct =
      currentDeltaX * startDeltaX + currentDeltaY * startDeltaY;

    // Project current point onto start vector: projectedDist = (current · start) / |start|
    const projectedDist = dotProduct / startDist;

    // Scale factor = projectedDist / |start| = (current · start) / |start|²
    // Clamp to minScale to prevent negative values (shape inversion)
    const minScale = 0.01;
    const rawScale = projectedDist / startDist;
    return Math.max(rawScale, minScale);
  }

  /**
   * Emit the final scaled geometry when dragging stops.
   */
  private emitFinalScaledGeometry(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    self: any,
  ) {
    const scaleContext = this.getScaleContext(event, self);
    if (!scaleContext) {
      return;
    }

    const lockScaling = props.modeConfig?.lockScaling ?? false;
    const { origin, scaleFactors, geometry } = scaleContext;

    // For uniform scaling, use a single scale factor for both axes
    const finalScaleX = lockScaling
      ? this.calculateUniformScaleFactor(event, origin)
      : scaleFactors.scaleX;
    const finalScaleY = lockScaling
      ? this.calculateUniformScaleFactor(event, origin)
      : scaleFactors.scaleY;

    const scaledFeatures = this.applyNonUniformScale(
      geometry,
      finalScaleX,
      finalScaleY,
      origin,
    );

    const updatedData = self._getUpdatedData(props, scaledFeatures);

    props.onEdit({
      updatedData,
      editType: 'scaled',
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    });
  }

  /**
   * Reset the scale state after dragging stops.
   */
  private resetScaleState(
    props: ModeProps<FeatureCollection>,
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private properties from parent class
    self: any,
  ) {
    props.onUpdateCursor(null);
    self._geometryBeingScaled = null;
    self._selectedEditHandle = null;
    self._cursor = null;
    self._isScaling = false;
  }

  /**
   * Apply non-uniform scaling to geometry.
   * Transforms each coordinate by scaling X and Y independently around the origin.
   */
  private applyNonUniformScale(
    geometry: FeatureCollection,
    scaleX: number,
    scaleY: number,
    origin: Position,
  ): FeatureCollection {
    const scaledFeatures = geometry.features.map((feature) => {
      const scaledGeometry = this.scaleGeometry(
        feature.geometry,
        scaleX,
        scaleY,
        origin,
      );
      return {
        ...feature,
        geometry: scaledGeometry,
      };
    });

    return {
      type: 'FeatureCollection',
      // biome-ignore lint/suspicious/noExplicitAny: GeoJSON feature type variance
      features: scaledFeatures as any,
    };
  }

  /**
   * Scale a geometry's coordinates non-uniformly around an origin point.
   *
   * ## Coordinate Transformation
   *
   * Each coordinate is transformed using: `new = origin + (old - origin) × scale`
   *
   * This is equivalent to:
   * 1. Translate so origin is at (0,0): `temp = old - origin`
   * 2. Scale: `temp = temp × scale`
   * 3. Translate back: `new = temp + origin`
   *
   * The origin (opposite corner from the drag handle) stays fixed while
   * all other points move proportionally.
   */
  private scaleGeometry(
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry types are complex - includes Point, LineString, Polygon, Multi* variants
    geometry: any,
    scaleX: number,
    scaleY: number,
    origin: Position,
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry types are complex - return type varies by input
  ): any {
    // Transform a single coordinate around the origin point
    const scaleCoord = (coord: Position): Position => {
      return [
        (origin[0] ?? 0) + ((coord[0] ?? 0) - (origin[0] ?? 0)) * scaleX,
        (origin[1] ?? 0) + ((coord[1] ?? 0) - (origin[1] ?? 0)) * scaleY,
      ];
    };

    switch (geometry.type) {
      case 'Point':
        return {
          ...geometry,
          coordinates: scaleCoord(geometry.coordinates),
        };
      case 'LineString':
      case 'MultiPoint':
        return {
          ...geometry,
          coordinates: geometry.coordinates.map(scaleCoord),
        };
      case 'Polygon':
      case 'MultiLineString':
        return {
          ...geometry,
          coordinates: geometry.coordinates.map((ring: Position[]) =>
            ring.map(scaleCoord),
          ),
        };
      case 'MultiPolygon':
        return {
          ...geometry,
          coordinates: geometry.coordinates.map((polygon: Position[][]) =>
            polygon.map((ring: Position[]) => ring.map(scaleCoord)),
          ),
        };
      default:
        return geometry;
    }
  }
}
