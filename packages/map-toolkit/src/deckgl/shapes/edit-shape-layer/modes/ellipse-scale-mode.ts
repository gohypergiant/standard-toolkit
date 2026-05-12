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
import {
  featureCollection,
  point,
  polygonToLine,
  rhumbDestination,
  bearing as turfBearing,
  ellipse as turfEllipse,
} from '@turf/turf';
import { ShapeAwareScaleMode } from './shape-aware-scale-mode';
import {
  type EllipseAxisHandle,
  recomputeEllipseScaleFactors,
} from './utils/ellipse-scale-math';
import type { DistanceUnit } from '@accelint/constants/units';
import type { Feature, Polygon, Position } from 'geojson';
import type { EditHandleFeature } from './utils/transform-mode-guides';

/**
 * Number of vertices used when regenerating the ellipse polygon. Matches
 * turf's default and is high enough for a smooth visual at typical zoom.
 */
const ELLIPSE_STEPS = 64;

/**
 * Order of axis-endpoint handles. Position-index `0` = +xSemi endpoint,
 * `1` = +ySemi, `2` = -xSemi, `3` = -ySemi. Stored in handle properties as
 * `positionIndexes: [N]` so dragger logic can recover which axis was hit.
 */
const HANDLE_ORDER: readonly EllipseAxisHandle[] = [
  'plusX',
  'plusY',
  'minusX',
  'minusY',
];

/**
 * Concrete `ShapeAwareScaleMode` for ellipses. Overrides `getGuides` to
 * emit axis-endpoint scale handles (the four points where the ellipse's
 * local x/y axes intersect the curve) and overrides `tryShapeDrag` to
 * recompute the ellipse parametrically, instead of the grandparent
 * `ScaleModeWithFreeTransform`'s lat/lon-axis-aligned scale which would
 * stretch a rotated ellipse into a non-ellipse polygon.
 *
 * The standard `ScaleModeWithFreeTransform` scales polygon coordinates
 * non-uniformly along latitude and longitude. For an axis-aligned ellipse
 * this happens to align with the major/minor axes; for a rotated ellipse
 * it does not, and the resulting polygon is no longer an ellipse — its
 * vertices end up scaled by the wrong axes.
 *
 * This mode replaces the behavior for ellipse features (those with
 * `properties.shape === 'Ellipse'`):
 *
 * - **Handles** sit on the ellipse curve at the four axis endpoints
 *   (+xSemi, +ySemi, -xSemi, -ySemi rotated by `angle`).
 * - **Drag math** projects the cursor onto the dragged axis in Mercator
 *   space, computes a scale factor relative to the original semi-axis
 *   length, and (with `lockScaling`) applies it to both axes for uniform
 *   scaling.
 * - **Regeneration** rebuilds the polygon via `turfEllipse` from the new
 *   semi-axis values, so vertices stay a true ellipse curve.
 *
 * Non-ellipse features fall through to `ShapeAwareScaleMode`'s parent
 * behavior.
 *
 * @example
 * ```typescript
 * import { EllipseScaleMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/ellipse-scale-mode';
 *
 * const mode = new EllipseScaleMode();
 * ```
 */
export class EllipseScaleMode extends ShapeAwareScaleMode {
  /**
   * Returns scale guides positioned at the ellipse's four axis-endpoint
   * positions (on the curve) plus the ellipse's outline as the envelope,
   * instead of the parent's lat/lon-axis-aligned bbox handles. Falls back
   * to the parent's behavior for non-ellipse features.
   */
  override getGuides(
    props: ModeProps<SimpleFeatureCollection>,
  ): GuideFeatureCollection {
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props);
    const firstFeature = selectedGeometry.features[0];

    const ellipseInfo = readEllipseInfo(firstFeature);

    if (!ellipseInfo) {
      return super.getGuides(props);
    }

    const endpoints = computeAxisEndpoints(ellipseInfo);
    const handles: EditHandleFeature[] = endpoints.map(
      (coord, i) =>
        point(coord, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          positionIndexes: [i],
        }) as EditHandleFeature,
    );

    // biome-ignore lint/suspicious/noExplicitAny: Accessing the parent's protected scratch field
    (this as any)._cornerGuidePoints = handles;

    // Use the ellipse polygon's outline as the envelope so the scale-mode
    // guide visually matches the actual shape (no axis-aligned bbox).
    // biome-ignore lint/suspicious/noExplicitAny: turf's polygonToLine return type doesn't expose a typed `properties` field
    const envelope = polygonToLine(firstFeature as Feature<Polygon>) as any;

    envelope.properties = {
      ...(envelope.properties ?? {}),
      mode: 'scale',
    };

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON guide types
    return featureCollection([envelope, ...handles]) as any;
  }

  /**
   * Run ellipse-aware drag for the active feature. Returns true when the
   * drag was handled (caller skips the standard scale path) and false
   * when the feature isn't an ellipse so the parent path takes over.
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
    const ellipseInfo = readEllipseInfo(feature);

    if (!ellipseInfo) {
      return false;
    }

    const positionIndexes = handle.properties.positionIndexes as
      | number[]
      | undefined;
    const handleIdx = positionIndexes?.[0];

    if (typeof handleIdx !== 'number') {
      return false;
    }

    const draggedHandle = HANDLE_ORDER[handleIdx];

    if (!draggedHandle) {
      return false;
    }

    const endpoints = computeAxisEndpoints(ellipseInfo);
    const plusXEndpoint = endpoints[0] as Position;
    const plusYEndpoint = endpoints[1] as Position;

    const lockAspect = Boolean(props.modeConfig?.lockScaling);

    const result = recomputeEllipseScaleFactors(
      ellipseInfo.center,
      plusXEndpoint,
      plusYEndpoint,
      draggedHandle,
      event.mapCoords,
      lockAspect,
    );

    if (!result) {
      return false;
    }

    const newXSemi = ellipseInfo.xSemiValue * result.xScale;
    const newYSemi = ellipseInfo.ySemiValue * result.yScale;

    const newPolygon = turfEllipse(
      ellipseInfo.center as [number, number],
      newXSemi,
      newYSemi,
      {
        angle: ellipseInfo.angle,
        units: ellipseInfo.units,
        steps: ELLIPSE_STEPS,
      },
    );

    const selectedIndex = props.selectedIndexes[0] as number;
    const updatedData = new ImmutableFeatureCollection(props.data)
      .replaceGeometry(selectedIndex, newPolygon.geometry)
      .getObject();

    // Mutate the cloned feature in place to write fresh ellipseProperties
    // so downstream consumers (our own getGuides on the next frame, the
    // recipe's featureEditing listener, and any persisted save) see a
    // self-consistent feature: the polygon, its center, and the semi-axis
    // lengths all match. Mutation is safe — getObject() returns a fresh
    // clone.
    const targetFeature = updatedData.features[selectedIndex];
    const targetProperties = targetFeature?.properties as
      | { ellipseProperties?: Record<string, unknown> }
      | undefined;
    const existingEllipseProperties = targetProperties?.ellipseProperties as
      | {
          center: Position;
          xSemiAxis: { value: number; units: DistanceUnit };
          ySemiAxis: { value: number; units: DistanceUnit };
          angle: number;
        }
      | undefined;

    if (targetProperties && existingEllipseProperties) {
      targetProperties.ellipseProperties = {
        ...existingEllipseProperties,
        center: ellipseInfo.center,
        xSemiAxis: { ...existingEllipseProperties.xSemiAxis, value: newXSemi },
        ySemiAxis: { ...existingEllipseProperties.ySemiAxis, value: newYSemi },
      };
    }

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

/**
 * Parametric description of an ellipse, with `center` and `angle`
 * derived from polygon vertices (not from stored properties) so the
 * values stay correct after translate and rotate gestures. See
 * `readEllipseInfo` for the derivation rationale.
 */
export type EllipseInfo = {
  center: Position;
  xSemiValue: number;
  ySemiValue: number;
  units: DistanceUnit;
  angle: number;
};

/**
 * Pull the parametric ellipse description from the feature.
 *
 * `xSemiAxis`, `ySemiAxis`, and `units` come from `ellipseProperties` (the
 * stored semi-axis lengths and unit — these don't change with translate
 * or rotate). **`center` and `angle` are derived from the polygon
 * vertices each frame**, not from `ellipseProperties`, because TranslateMode
 * and RotateMode update polygon vertices without updating those stored
 * values. Trusting the stored values would leave handles and regenerated
 * polygons anchored to the pre-edit position/orientation.
 *
 * `angle` is derived from `vertex[0]` of the polygon ring: turf's
 * `ellipse()` places that vertex at compass bearing `angle − 90` from
 * center, so `bearing(center, vertex[0]) + 90` recovers the rotation.
 *
 * @param feature - The feature to inspect. May be undefined.
 * @returns Parametric ellipse data, or `null` when the feature isn't an
 *   ellipse or lacks the required `ellipseProperties`.
 */
export function readEllipseInfo(
  feature: Feature | undefined,
): EllipseInfo | null {
  if (
    !feature ||
    feature.properties?.shape !== 'Ellipse' ||
    feature.geometry.type !== 'Polygon'
  ) {
    return null;
  }

  const ellipseProperties = feature.properties.ellipseProperties as
    | {
        center: Position;
        xSemiAxis: { value: number; units: DistanceUnit };
        ySemiAxis: { value: number; units: DistanceUnit };
        angle: number;
      }
    | undefined;

  if (!ellipseProperties) {
    return null;
  }

  const ring = (feature.geometry as Polygon).coordinates[0];
  const center = derivePolygonCentroid(ring);

  if (!center) {
    return null;
  }

  const angle = deriveAngleFromPolygon(center, ring) ?? ellipseProperties.angle;

  return {
    center,
    xSemiValue: ellipseProperties.xSemiAxis.value,
    ySemiValue: ellipseProperties.ySemiAxis.value,
    units: ellipseProperties.xSemiAxis.units,
    angle,
  };
}

/**
 * Recover the ellipse's rotation angle from the polygon's first vertex.
 * `turfEllipse` places `vertex[0]` at compass bearing `angle − 90` from
 * center (the +xSemi endpoint), so the inverse is
 * `bearing(center, vertex[0]) + 90`.
 *
 * Returns null when the ring is missing or vertex[0] is unusable.
 */
function deriveAngleFromPolygon(
  center: Position,
  ring: Position[] | undefined,
): number | null {
  const firstVertex = ring?.[0];

  if (!firstVertex) {
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: turf bearing accepts Position-like inputs
  const bearingDeg = turfBearing(center as any, firstVertex as any);

  return bearingDeg + 90;
}

/**
 * Compute the centroid of a polygon ring as the mean of its unique
 * vertices (skipping the closing duplicate). For an ellipse polygon
 * generated by turf, this is approximately equal to the geometric center
 * — and crucially, it tracks the polygon's current position so it stays
 * accurate after translate/scale/rotate operations.
 */
function derivePolygonCentroid(ring: Position[] | undefined): Position | null {
  if (!ring || ring.length < 4) {
    return null;
  }

  let lonSum = 0;
  let latSum = 0;
  const lastIdx = ring.length - 1;

  for (let i = 0; i < lastIdx; i++) {
    const vertex = ring[i];

    if (!vertex) {
      continue;
    }

    lonSum += vertex[0] as number;
    latSum += vertex[1] as number;
  }

  return [lonSum / lastIdx, latSum / lastIdx];
}

/**
 * Compute the four axis-endpoint world positions for the ellipse. Order
 * matches `HANDLE_ORDER`: `[+xSemi, +ySemi, -xSemi, -ySemi]`.
 *
 * Bearings follow turf's ellipse convention: the +ySemi endpoint sits at
 * compass bearing `angle` from the center; +xSemi at `angle + 90`; the
 * negative endpoints at the opposite bearings.
 */
function computeAxisEndpoints(info: EllipseInfo): Position[] {
  const { center, xSemiValue, ySemiValue, units, angle } = info;
  const distanceOptions = { units };
  const center2D: [number, number] = [center[0] as number, center[1] as number];

  const plusX = rhumbDestination(
    center2D,
    xSemiValue,
    angle + 90,
    distanceOptions,
  ).geometry.coordinates;
  const plusY = rhumbDestination(center2D, ySemiValue, angle, distanceOptions)
    .geometry.coordinates;
  const minusX = rhumbDestination(
    center2D,
    xSemiValue,
    angle - 90,
    distanceOptions,
  ).geometry.coordinates;
  const minusY = rhumbDestination(
    center2D,
    ySemiValue,
    angle + 180,
    distanceOptions,
  ).geometry.coordinates;

  return [plusX, plusY, minusX, minusY];
}
