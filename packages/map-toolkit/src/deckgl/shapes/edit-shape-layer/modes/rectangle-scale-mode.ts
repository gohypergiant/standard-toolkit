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
  type GuideFeatureCollection,
  ImmutableFeatureCollection,
  type ModeProps,
  type SimpleFeatureCollection,
  type StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import { featureCollection, point, polygonToLine } from '@turf/turf';
import { recomputeRectangleCorners } from './rectangle-scale-math';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import type { Feature, Point, Polygon, Position } from 'geojson';

/**
 * Local mirror of editable-layers' internal `EditHandleFeature` type
 * (defined in its `edit-modes/types.d.ts` but not re-exported from the
 * package entry). Mirrors the runtime shape produced by ScaleMode-style
 * guides so the parent class can consume our cornerHandles unchanged.
 */
type EditHandleFeature = Feature<
  Point,
  {
    guideType: 'editHandle';
    editHandleType:
      | 'existing'
      | 'intermediate'
      | 'snap-source'
      | 'snap-target'
      | 'scale'
      | 'rotate';
    positionIndexes?: number[];
    featureIndex?: number;
  }
>;

/**
 * Subclass of `ScaleModeWithFreeTransform` that produces a clean rotated
 * rectangle from a corner drag, instead of distorting it into a parallelogram.
 *
 * The standard `ScaleModeWithFreeTransform` places its scale handles at the
 * lat/lon-axis-aligned bounding box of the polygon and applies axis-aligned
 * scale factors along latitude and longitude. For an axis-aligned rectangle
 * this is correct (the bbox equals the rectangle), but for a rotated
 * rectangle the bbox corners aren't the rectangle's corners and an
 * axis-aligned scale distorts the shape into a parallelogram.
 *
 * This mode replaces both pieces for rectangle features (those with
 * `properties.shape === 'Rectangle'`):
 *
 * - **Handles** sit at the rectangle's actual rotated corners (polygon
 *   vertices), and the envelope guide is the rectangle's outline.
 * - **Drag math** projects the new corner onto the rectangle's local edge
 *   directions, so the rectangle invariant is preserved through any
 *   rotation.
 *
 * Non-rectangle features fall through to the standard
 * `ScaleModeWithFreeTransform` behavior, which is correct for shapes whose
 * bbox is meaningful (like ellipses).
 *
 * @example
 * ```typescript
 * import { RectangleScaleMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/rectangle-scale-mode';
 *
 * const mode = new RectangleScaleMode();
 * ```
 */
export class RectangleScaleMode extends ScaleModeWithFreeTransform {
  /**
   * Returns scale guides positioned at the rectangle's actual rotated
   * corners (and an envelope matching the rectangle's outline) instead of
   * the parent's lat/lon-axis-aligned bbox handles. Falls back to the
   * parent's behavior for non-rectangle features.
   */
  override getGuides(
    props: ModeProps<SimpleFeatureCollection>,
  ): GuideFeatureCollection {
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props);
    const firstFeature = selectedGeometry.features[0];

    const isRectangle =
      firstFeature?.properties?.shape === 'Rectangle' &&
      firstFeature.geometry.type === 'Polygon';

    if (!isRectangle) {
      return super.getGuides(props);
    }

    const ring = (firstFeature.geometry as Polygon).coordinates[0];

    if (!ring || ring.length < 5) {
      return super.getGuides(props);
    }

    // Use the rectangle's actual 4 corners as scale handles. positionIndexes
    // matches the polygon ring order so the inherited `_getOppositeScaleHandle`
    // logic ((idx + 2) % 4) still picks the diagonally-opposite corner.
    const cornerHandles: EditHandleFeature[] = [];
    for (let i = 0; i < 4; i++) {
      const corner = ring[i];

      if (!corner) {
        continue;
      }

      cornerHandles.push(
        point(corner, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          positionIndexes: [i],
        }) as EditHandleFeature,
      );
    }

    // biome-ignore lint/suspicious/noExplicitAny: Accessing the parent's protected scratch field
    (this as any)._cornerGuidePoints = cornerHandles;

    // Use the rectangle polygon itself as the envelope so the scale-mode
    // guide outline visually matches the actual shape (no axis-aligned bbox).
    // biome-ignore lint/suspicious/noExplicitAny: turf's polygonToLine return type doesn't expose a typed `properties` field
    const envelope = polygonToLine(firstFeature as Feature<Polygon>) as any;

    envelope.properties = {
      ...(envelope.properties ?? {}),
      mode: 'scale',
    };

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON guide types
    return featureCollection([envelope, ...cornerHandles]) as any;
  }

  /**
   * Routes corner drags through `tryRectangleDrag` so rotation-preserving
   * projection math is applied, and falls back to the parent's standard
   * scale behavior for non-rectangle features.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (!this.tryRectangleDrag(event, 'scaling', props)) {
      super.handleDragging(event, props);
    }
  }

  /**
   * Finalizes a rectangle-aware drag by emitting the final geometry and
   * clearing the parent's scratch state and cursor; falls back to the
   * parent's stop-drag for non-rectangle features.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (this.tryRectangleDrag(event, 'scaled', props)) {
      // biome-ignore lint/suspicious/noExplicitAny: Accessing the parent's protected scratch fields
      const self = this as any;

      props.onUpdateCursor(null);
      self._geometryBeingScaled = null;
      self._selectedEditHandle = null;
      self._cursor = null;
      self._isScaling = false;

      return;
    }

    super.handleStopDragging(event, props);
  }

  /**
   * Attempt rectangle-aware drag for the active feature; return true when the
   * drag was handled, false when the feature isn't a rectangle (so the caller
   * should defer to the standard scale path).
   */
  private tryRectangleDrag(
    event: DraggingEvent | StopDraggingEvent,
    editType: 'scaling' | 'scaled',
    props: ModeProps<SimpleFeatureCollection>,
  ): boolean {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing the parent's protected scratch fields
    const self = this as any;

    if (!self._isScaling) {
      return false;
    }

    const handle = self._selectedEditHandle as EditHandleFeature | null;
    const geometry = self._geometryBeingScaled as
      | SimpleFeatureCollection
      | null
      | undefined;

    if (!(handle && geometry)) {
      return false;
    }

    const feature = geometry.features[0];

    if (
      !feature ||
      feature.properties?.shape !== 'Rectangle' ||
      feature.geometry.type !== 'Polygon'
    ) {
      return false;
    }

    const positionIndexes = handle.properties.positionIndexes as
      | number[]
      | undefined;
    const draggedIndex = positionIndexes?.[0];

    if (typeof draggedIndex !== 'number') {
      return false;
    }

    const polygon = feature.geometry as Polygon;
    const originalRing = polygon.coordinates[0];

    if (!originalRing || originalRing.length < 5) {
      return false;
    }

    const lockAspect = Boolean(props.modeConfig?.lockScaling);

    const newCorners = recomputeRectangleCorners(
      originalRing.slice(0, 4) as Position[],
      draggedIndex,
      event.mapCoords,
      lockAspect,
    );

    if (!newCorners) {
      return false;
    }

    const closedRing: Position[] = [...newCorners, newCorners[0] as Position];

    const updatedData = new ImmutableFeatureCollection(props.data)
      .replaceGeometry(props.selectedIndexes[0] as number, {
        type: 'Polygon',
        coordinates: [closedRing],
      })
      .getObject();

    props.onUpdateCursor(self._cursor);
    props.onEdit({
      updatedData,
      editType,
      editContext: { featureIndexes: props.selectedIndexes },
    });

    if (editType === 'scaling' && 'cancelPan' in event) {
      event.cancelPan();
    }

    return true;
  }
}
