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
 * Features:
 * - Default: Free scaling - can stretch/squish in any direction
 * - With modeConfig.lockScaling = true: Uniform scaling (maintains aspect ratio)
 *
 * Non-uniform scaling works by applying separate X and Y scale factors
 * based on the cursor movement relative to the opposite corner.
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
   * Scale factors are clamped to prevent negative values (no shape inversion).
   */
  private calculateScaleFactors(
    event: DraggingEvent | StopDraggingEvent,
    origin: Position,
  ): ScaleFactors {
    const startDragPoint = event.pointerDownMapCoords;
    const currentPoint = event.mapCoords;

    const startDeltaX = (startDragPoint[0] ?? 0) - (origin[0] ?? 0);
    const startDeltaY = (startDragPoint[1] ?? 0) - (origin[1] ?? 0);
    const currentDeltaX = (currentPoint[0] ?? 0) - (origin[0] ?? 0);
    const currentDeltaY = (currentPoint[1] ?? 0) - (origin[1] ?? 0);

    const epsilon = 0.0000001;
    // Minimum scale to prevent shape from collapsing or inverting
    const minScale = 0.01;

    // Calculate scale factors - ratio of current to start distance from origin
    // Clamp to minScale to prevent negative values (shape inversion)
    const rawScaleX =
      Math.abs(startDeltaX) > epsilon ? currentDeltaX / startDeltaX : 1;
    const rawScaleY =
      Math.abs(startDeltaY) > epsilon ? currentDeltaY / startDeltaY : 1;

    const scaleX = Math.max(rawScaleX, minScale);
    const scaleY = Math.max(rawScaleY, minScale);

    return { scaleX, scaleY };
  }

  /**
   * Calculate a uniform scale factor for aspect-ratio-preserving scaling.
   * Uses distance ratio along the drag direction so the corner follows
   * the cursor's projection onto the original drag line.
   * Clamped to prevent negative values (no shape inversion).
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

    // Distance from origin to start point
    const startDist = Math.sqrt(startDeltaX ** 2 + startDeltaY ** 2);

    if (startDist < 0.0000001) {
      return 1;
    }

    // Project current point onto the line from origin through start point
    // using dot product: projection = (current · start) / |start|²
    const dotProduct =
      currentDeltaX * startDeltaX + currentDeltaY * startDeltaY;
    const projectedDist = dotProduct / startDist;

    // Scale factor is the ratio of projected distance to original distance
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
   */
  private scaleGeometry(
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry types are complex
    geometry: any,
    scaleX: number,
    scaleY: number,
    origin: Position,
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry types are complex
  ): any {
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
