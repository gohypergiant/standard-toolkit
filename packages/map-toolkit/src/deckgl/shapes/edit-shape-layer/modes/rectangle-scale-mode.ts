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
import { ShapeAwareScaleMode } from './shape-aware-scale-mode';
import type { EditHandleFeature } from './transform-mode-guides';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Concrete `ShapeAwareScaleMode` for rectangles. Overrides `getGuides`
 * to place handles at the rectangle's actual rotated corners and
 * overrides `tryShapeDrag` with rotation-preserving corner-drag math,
 * instead of the grandparent `ScaleModeWithFreeTransform`'s
 * lat/lon-axis-aligned scale which would distort a rotated rectangle
 * into a parallelogram.
 *
 * The standard `ScaleModeWithFreeTransform` places its scale handles at
 * the lat/lon-axis-aligned bounding box of the polygon and applies
 * axis-aligned scale factors along latitude and longitude. For an
 * axis-aligned rectangle this is correct (the bbox equals the
 * rectangle), but for a rotated rectangle the bbox corners aren't the
 * rectangle's corners and an axis-aligned scale distorts the shape into
 * a parallelogram.
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
 * Non-rectangle features fall through to `ShapeAwareScaleMode`'s parent
 * behavior, which is correct for shapes whose bbox is meaningful (like
 * ellipses, though those now have their own `EllipseScaleMode`).
 *
 * @example
 * ```typescript
 * import { RectangleScaleMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/rectangle-scale-mode';
 *
 * const mode = new RectangleScaleMode();
 * ```
 */
export class RectangleScaleMode extends ShapeAwareScaleMode {
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
   * Run rectangle-aware drag for the active feature; return true when the
   * drag was handled, false when the feature isn't a rectangle (so the
   * caller should defer to the standard scale path).
   */
  protected override tryShapeDrag(
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
