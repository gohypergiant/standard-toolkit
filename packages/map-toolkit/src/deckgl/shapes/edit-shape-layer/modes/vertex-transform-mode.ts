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
  type FeatureCollection,
  type GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  ModifyMode,
  type StartDraggingEvent,
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection, lineString, point } from '@turf/helpers';
import { centroid as turfCentroid, distance as turfDistance } from '@turf/turf';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import {
  BBOX_ORIENTATION_CONFIG_KEY,
  OrientedScaleMode,
} from './oriented-scale-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import type {
  Feature,
  FeatureCollection as GeoFeatureCollection,
  Point as GeoPoint,
  LineString,
  Polygon,
  Position,
} from 'geojson';

/**
 * Outward buffer applied to the rotate-mode bounding box for polygon and
 * line edits, as a fraction of the longest bbox dimension. Pushes the
 * scale corner handles away from the polygon's vertices so a shape with
 * a vertex at its bbox corner doesn't visually overlap the scale handle
 * with the vertex handle.
 *
 * Note: this is proportional to shape size, not pixel-true. Strict pixel
 * spacing would require viewport access from inside the mode (which it
 * doesn't have). 3% reads as a clear gap at typical zoom levels without
 * being so large that it disconnects the box from the shape.
 */
const BBOX_BUFFER_RATIO = 0.03;

/**
 * Custom `mode` tag applied to the buffered bounding box LineString so
 * the EditableGeoJsonLayer's line-color and dash-array accessors can
 * recognize it (mute color, render dashed) without affecting other guide
 * lines (rotate-stem connector, shape outlines for other shape types).
 */
export const VERTEX_BBOX_MODE = 'vertex-bbox';

/**
 * Stem-length divisor mirroring deck.gl `RotateMode`'s formula
 * (`longestEdgeKm / 1000`). We treat the local-frame longest side as if
 * it were lat-degrees so an axis-aligned bbox produces a stem visually
 * matching the rectangle/ellipse stems.
 */
const STEM_LENGTH_DIVISOR = 1000;

/**
 * Oriented bounding box for a polygon/line, expressed as four world-frame
 * corners (in shape-local order: bottomLeft, bottomRight, topRight,
 * topLeft) plus the world-frame stem base and tip for placing the rotate
 * handle above the (local) top edge. When `angleDeg === 0` this reduces
 * to a buffered axis-aligned bounding box; for non-zero angles the box
 * rotates with the polygon.
 */
type OrientedBoundingBox = {
  bottomLeft: Position;
  bottomRight: Position;
  topRight: Position;
  topLeft: Position;
  stemBase: Position;
  stemTip: Position;
};

/**
 * Return the vertex array for a feature we'll wrap with an oriented
 * bounding box: the outer ring of a Polygon (still includes the closing
 * duplicate vertex; that's fine for the local axis-aligned bounds and
 * matches turfCentroid's behavior) or the coordinate array of a
 * LineString. Other geometry types fall through to `null` so we leave
 * the rotate-mode chrome unmodified.
 */
function getShapeVertices(feature: Feature): Position[] | null {
  if (feature.geometry.type === 'Polygon') {
    const ring = (feature.geometry as Polygon).coordinates[0];
    return Array.isArray(ring) ? (ring as Position[]) : null;
  }
  if (feature.geometry.type === 'LineString') {
    return (feature.geometry as LineString).coordinates as Position[];
  }
  return null;
}

/**
 * Compute the feature's centroid via turf so it matches the pivot used
 * by `RotateMode` exactly. Mismatched centroids would cause the
 * oriented bounding box to un-rotate around a slightly different point
 * than the shape was rotated around, which over multiple rotations
 * drifts the bounding box off the shape's "natural" edge.
 */
function polygonCentroid(feature: Feature): [number, number] | null {
  const collection = featureCollection([
    feature,
    // biome-ignore lint/suspicious/noExplicitAny: turf and editable-layers GeoJSON types differ
  ] as any) as GeoFeatureCollection;
  // biome-ignore lint/suspicious/noExplicitAny: turf type variance
  const coords = turfCentroid(collection as any).geometry.coordinates;
  if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
    return null;
  }
  return [coords[0], coords[1]];
}

/**
 * Axis-aligned bounding box of a polygon ring in the local frame
 * (vertices un-rotated by compass `-angleDeg` around `centroid`).
 * Compass-positive rotation is CW (north → east) — matching
 * `turfTransformRotate` — so the un-rotation matrix is the inverse:
 * compass-positive `+α` maps
 * `(deltaX, deltaY) → (deltaX·cos α − deltaY·sin α, deltaX·sin α + deltaY·cos α)`.
 * Returns `null` if no finite vertex was seen.
 */
function localAxisAlignedBounds(
  ring: Position[],
  centroid: [number, number],
  cos: number,
  sin: number,
): { minX: number; maxX: number; minY: number; maxY: number } | null {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const vertex of ring) {
    if (!vertex) {
      continue;
    }
    const deltaX = (vertex[0] as number) - centroid[0];
    const deltaY = (vertex[1] as number) - centroid[1];
    // Inverse of compass-positive (CW) rotation by angleDeg.
    const localX = deltaX * cos - deltaY * sin;
    const localY = deltaX * sin + deltaY * cos;
    if (localX < minX) {
      minX = localX;
    }
    if (localX > maxX) {
      maxX = localX;
    }
    if (localY < minY) {
      minY = localY;
    }
    if (localY > maxY) {
      maxY = localY;
    }
  }

  return Number.isFinite(minX) && Number.isFinite(minY)
    ? { minX, maxX, minY, maxY }
    : null;
}

/**
 * Compute the oriented bounding box for a polygon at the given
 * orientation angle. The angle is in **compass degrees** (CW positive:
 * a north-pointing edge rotates to east as `angleDeg` increases).
 * Algorithm:
 *
 * 1. Un-rotate every vertex by `-angleDeg` around the polygon's turf
 *    centroid (matches `RotateMode`'s pivot) to get its footprint in
 *    the shape-local frame.
 * 2. Take the axis-aligned bounding box of the local footprint.
 * 3. Inflate it outward by `BBOX_BUFFER_RATIO` of the longest local
 *    edge so polygon vertices don't collide with bounding-box scale
 *    handles.
 * 4. Rotate the four corners back by `+angleDeg` (compass) to world
 *    coordinates, using the matrix
 *    `(localX, localY) → (localX·cos α + localY·sin α, −localX·sin α + localY·cos α)`
 *    — this is the compass-positive rotation that matches
 *    `turfTransformRotate`, so the oriented bounding box stays
 *    visually aligned with the rotated polygon.
 *
 * Stem length is computed in **kilometers** via `turfDistance` of the
 * world-frame top edge so it matches deck.gl `RotateMode`'s
 * `longestEdgeKm / 1000` formula. Computing the offset in raw
 * lat-degrees produces a tiny stem (~100m for a 100km shape), which
 * collapses the stem visually.
 */
function computeOrientedBoundingBox(
  feature: Feature,
  angleDeg: number,
): OrientedBoundingBox | null {
  const vertices = getShapeVertices(feature);
  if (!vertices || vertices.length < 2) {
    return null;
  }
  const centroid = polygonCentroid(feature);
  if (!centroid) {
    return null;
  }

  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const localBounds = localAxisAlignedBounds(vertices, centroid, cos, sin);
  if (!localBounds) {
    return null;
  }

  const longestSide = Math.max(
    localBounds.maxX - localBounds.minX,
    localBounds.maxY - localBounds.minY,
  );
  const buffer = longestSide * BBOX_BUFFER_RATIO;
  const minX = localBounds.minX - buffer;
  const maxX = localBounds.maxX + buffer;
  const minY = localBounds.minY - buffer;
  const maxY = localBounds.maxY + buffer;

  // Compass-positive (CW) rotation:
  // `(localX, localY) → (localX·cos + localY·sin, −localX·sin + localY·cos)`.
  // For example with α = 90°: local +Y (north) maps to world +X (east),
  // matching turfTransformRotate.
  const localToWorld = (localX: number, localY: number): Position => [
    localX * cos + localY * sin + centroid[0],
    -localX * sin + localY * cos + centroid[1],
  ];

  const topMidX = (minX + maxX) / 2;
  const bottomLeft = localToWorld(minX, minY);
  const bottomRight = localToWorld(maxX, minY);
  const topRight = localToWorld(maxX, maxY);
  const topLeft = localToWorld(minX, maxY);

  // Match deck.gl RotateMode's stem length in lat-degrees: longest
  // bbox edge in km, divided by STEM_LENGTH_DIVISOR (1000), treated as
  // a lat-degree offset. Computing on world-frame corners gives the
  // same km value the axis-aligned bounding box version would.
  const widthKm = turfDistance(bottomLeft as Position, bottomRight as Position);
  const heightKm = turfDistance(bottomLeft as Position, topLeft as Position);
  const stemLengthDeg = Math.max(widthKm, heightKm) / STEM_LENGTH_DIVISOR;

  return {
    bottomLeft,
    bottomRight,
    topRight,
    topLeft,
    stemBase: localToWorld(topMidX, maxY),
    stemTip: localToWorld(topMidX, maxY + stemLengthDeg),
  };
}

/**
 * Build the oriented-bbox chrome (outline + scale corner handles +
 * rotate handle + stem connector) from a precomputed oriented bounding box. Inherits
 * each scale handle's `properties` (which include `positionIndexes`)
 * from the matching `existingScaleHandles` entry so ScaleMode's
 * `_getOppositeScaleHandle` lookup keeps working.
 */
function buildBoundingBoxChrome(
  boundingBox: OrientedBoundingBox,
  existingRotateHandle: Feature<GeoPoint> | undefined,
  existingScaleHandles: Feature<GeoPoint>[],
): Feature[] {
  const result: Feature[] = [];

  result.push(
    lineString(
      [
        boundingBox.bottomLeft,
        boundingBox.bottomRight,
        boundingBox.topRight,
        boundingBox.topLeft,
        boundingBox.bottomLeft,
      ],
      {
        mode: VERTEX_BBOX_MODE,
      },
    ) as Feature<LineString>,
  );

  // Reposition the four scale handles to the oriented bounding box corners. Local-frame
  // bottomLeft/bottomRight/topRight/topLeft maps to positionIndexes
  // 0/1/2/3, matching ScaleMode's
  // ring traversal order.
  const cornersByIndex: Position[] = [
    boundingBox.bottomLeft,
    boundingBox.bottomRight,
    boundingBox.topRight,
    boundingBox.topLeft,
  ];
  for (const handle of existingScaleHandles) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const properties = (handle.properties ?? {}) as any;
    const positionIndex = Array.isArray(properties.positionIndexes)
      ? (properties.positionIndexes[0] as number | undefined)
      : undefined;
    if (
      positionIndex === undefined ||
      positionIndex < 0 ||
      positionIndex >= 4
    ) {
      result.push(handle);
      continue;
    }
    const corner = cornersByIndex[positionIndex];
    if (corner) {
      result.push(point(corner, properties) as Feature<GeoPoint>);
    }
  }

  if (existingRotateHandle) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const rotateProps = (existingRotateHandle.properties ?? {}) as any;
    result.push(point(boundingBox.stemTip, rotateProps) as Feature<GeoPoint>);
    result.push(
      lineString([boundingBox.stemBase, boundingBox.stemTip], {
        mode: 'rotate-stem',
      }) as Feature<LineString>,
    );
  }

  return result;
}

/**
 * Transform mode for shapes that support vertex editing (polygons and lines).
 *
 * Use this mode for shapes where individual vertices can be dragged to reshape
 * the geometry. This provides the most flexibility for freeform shape editing.
 *
 * ## Capabilities
 * This composite mode provides:
 * - **Vertex editing** (ModifyMode): Drag vertices to reshape the geometry
 * - **Translation** (TranslateMode): Drag the shape to move it
 * - **Scaling** (OrientedScaleMode): Drag corner handles to resize
 *   - Default: Non-uniform scaling (can stretch/squish)
 *   - With Shift: Uniform scaling (maintains aspect ratio)
 * - **Rotation** (RotateModeWithSnap): Drag top handle to rotate
 *   - Default: Free rotation
 *   - With Shift: Snap to 45° intervals
 *
 * ## Handle Priority Logic
 * When drag starts, modes are evaluated in this priority order:
 * 1. If hovering over a vertex (edit handle) → vertex editing takes priority
 * 2. If hovering over a scale handle → scaling takes priority
 * 3. If hovering over the rotate handle → rotation takes priority
 * 4. Otherwise → dragging the shape translates it
 *
 * ## Visual Behavior
 * The guides from all modes are combined, showing both vertex handles (white circles
 * on existing points) and transform handles (corner/rotation handles on bounding box).
 *
 * ## Tooltips
 * This mode does not show live measurement tooltips during editing because arbitrary
 * polygons don't have well-defined dimensions. Use BoundingTransformMode for shapes
 * like rectangles and ellipses where dimension tooltips are useful.
 *
 * ## Rectangle Special Handling
 * For rectangles, vertex handles are hidden to preserve rotation and right angles.
 * Only scale/rotate/translate handles are shown. Consider using BoundingTransformMode
 * directly for rectangles if vertex editing should never be available.
 *
 * @example
 * ```typescript
 * import { VertexTransformMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/vertex-transform-mode';
 * import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
 *
 * // Used internally by EditShapeLayer for polygons and lines
 * const mode = new VertexTransformMode();
 *
 * const layer = new EditableGeoJsonLayer({
 *   mode,
 *   data: polygonFeatureCollection,
 *   selectedFeatureIndexes: [0],
 *   onEdit: handleEdit,
 *   // ... other props
 * });
 * ```
 */
export class VertexTransformMode extends BaseTransformMode {
  private modifyMode: ModifyMode;
  private translateMode: TranslateMode;
  private scaleMode: OrientedScaleMode;
  private rotateMode: RotateModeWithSnap;
  /**
   * Cumulative rotation (degrees) applied to the bbox since the current
   * edit session started. Polygons and lines have no persisted rotation
   * angle, so we accumulate the deltas observed via `RotateMode`'s
   * transient `properties.rotationAngle` and use the running total to
   * orient the bbox in the polygon's local frame instead of snapping
   * the bbox back to axis-aligned (north) after each rotation.
   *
   * Reset on edit-session boundary by {@link resetLockedAnchor}.
   */
  private bboxOrientation: { shapeId: string; angleDeg: number } | null = null;
  /**
   * Last `properties.rotationAngle` seen on the editing feature.
   * `RotateMode` sets this during a drag and deletes it on completion;
   * we detect the set→unset transition to know when to accumulate the
   * final delta into {@link bboxOrientation}.
   */
  private lastSeenRotationDelta: number | undefined;
  /**
   * Snapshot of the oriented bounding box at the start of a scale drag, captured the first
   * frame `ScaleMode._isScaling` flips to true and held until the drag
   * ends. Used to keep `ScaleMode._cornerGuidePoints[opposite]` (the
   * scale origin) at a stable world position throughout the drag —
   * without locking, recomputing the oriented bounding box each frame from the live
   * (already-scaled) polygon shifts the centroid and therefore the
   * opposite corner, which feeds back into the scale formula and makes
   * the polygon "fly across the screen" once the scale grows past ~2x.
   */
  private lockedScaleBoundingBox: OrientedBoundingBox | null = null;

  constructor() {
    const modifyMode = new ModifyMode();
    const translateMode = new TranslateMode();
    const scaleMode = new OrientedScaleMode();
    const rotateMode = new RotateModeWithSnap();

    // Order matters: first mode to handle the event wins
    // We put modify first so vertex handles take priority over translate
    super([modifyMode, scaleMode, rotateMode, translateMode]);

    this.modifyMode = modifyMode;
    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Vertex handle: existing point on polygon/line
        match: (pick) =>
          Boolean(
            pick.isGuide &&
              pick.object?.properties?.guideType === 'editHandle' &&
              pick.object?.properties?.editHandleType === 'existing',
          ),
        mode: this.modifyMode,
        // No shift config - vertex editing doesn't have modifiers
      },
      {
        // Scale handle: corner handles on bounding box
        match: (pick) =>
          Boolean(
            pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
          ),
        mode: this.scaleMode,
        shiftConfig: { configKey: 'lockScaling' },
      },
      {
        // Rotate handle: top handle on bounding box
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

  protected override getDefaultMode(): GeoJsonEditMode {
    // biome-ignore lint/suspicious/noExplicitAny: Library type inconsistency — see HandleMatcher JSDoc in base-transform-mode
    return this.translateMode as any;
  }

  /**
   * Forward drag events to the active sub-mode with the cumulative
   * rotation angle injected into `modeConfig`. `OrientedScaleMode` reads
   * this to do non-uniform scaling in the polygon's local frame instead
   * of world axes — without it, dragging a corner of a *rotated* polygon
   * shears the shape (the polygon's local axes are no longer aligned
   * with world X/Y, so a world-axis stretch has a component along both
   * local axes). Other sub-modes ignore the field.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    super.handleDragging(
      event,
      withOrientationConfig(props, this.bboxOrientation),
    );
  }

  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    super.handleStartDragging(
      event,
      withOrientationConfig(props, this.bboxOrientation),
    );
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    super.handleStopDragging(
      event,
      withOrientationConfig(props, this.bboxOrientation),
    );
  }

  /**
   * Clear the cumulative rotation lock. The edit layer calls this when
   * the editing shape ID changes (a new edit session begins) so the
   * bbox starts axis-aligned (`angleDeg = 0`) for the freshly-opened
   * shape.
   */
  resetLockedAnchor(): void {
    this.bboxOrientation = null;
    this.lastSeenRotationDelta = undefined;
    this.lockedScaleBoundingBox = null;
  }

  /**
   * Override getGuides to filter duplicate envelope guides, handle
   * rectangles, and replace the rotate-mode chrome with an oriented
   * bounding box that rotates with the polygon's cumulative
   * rotation since edit-session start.
   *
   * Both ScaleMode and RotateMode render the same bounding box envelope.
   * We keep scale's envelope (for filtering) and filter rotate's duplicate.
   * Scale handles are hidden during rotation to avoid visual clutter.
   *
   * For rectangles, vertex handles are hidden because vertex editing
   * would distort the shape or force axis-alignment. Rectangles should
   * use scale handles only.
   *
   * The bbox is intentionally hidden during a rotation drag — we drop
   * all rotate-mode chrome (including our oriented bounding box replacement) while
   * `getIsRotating()` is true so the user sees only the rotating shape
   * and the centroid pivot. The oriented bounding box chrome reappears at the new
   * orientation when the gesture ends.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const allGuides = super.getGuides(props);

    const feature = props.data.features[0];
    const isRectangle = feature?.properties?.shape === 'Rectangle';
    const isRotating = this.rotateMode.getIsRotating();
    // biome-ignore lint/suspicious/noExplicitAny: ScaleMode._isScaling is private upstream
    const isScaling = Boolean((this.scaleMode as any)._isScaling);

    // Track rotation gesture completion to accumulate cumulative rotation
    // for the bbox orientation. RotateMode sets `rotationAngle` during the
    // drag and deletes it on completion; we accumulate at the set→unset
    // transition.
    this.updateBboxOrientation(feature);
    this.maintainScaleBoundingBoxLock(isScaling, feature);

    const filteredGuides = filterVertexGuides(
      allGuides.features as Feature[],
      isRectangle,
      isRotating,
    );

    // During a rotation drag, drop the bbox chrome entirely so only the
    // live shape and centroid pivot remain visible.
    if (isRotating) {
      const stripped = filteredGuides.filter(
        (guide) => !isRotateChromeFeature(guide),
      );
      // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
      return featureCollection(stripped as any) as any;
    }

    // Three fall-through-to-filtered-guides cases collapsed below:
    //   1. Rectangles — `vertex-transform` is only a fallback for legacy
    //      rectangles; the dedicated rectangle-transform mode handles
    //      them otherwise, and we leave the existing axis-aligned chrome
    //      alone here.
    //   2. No feature — defensive guard.
    //   3. Bounding-box computation failed (degenerate vertices, etc.).
    const angleDeg = this.bboxOrientation?.angleDeg ?? 0;
    const boundingBox =
      !isRectangle && feature
        ? computeOrientedBoundingBox(feature, angleDeg)
        : null;

    if (!boundingBox) {
      // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
      return featureCollection(filteredGuides as any) as any;
    }

    const replaced = replaceRotateChromeWithBoundingBox(
      filteredGuides,
      boundingBox,
    );

    // ScaleMode looks up the diagonally-opposite corner from its private
    // `_cornerGuidePoints` cache to derive the scale origin. Keep that
    // cache pointing at the oriented bounding box corners the user actually sees:
    //   - During a scale drag, lock to the *drag-start* oriented bounding box so origin
    //     stays fixed even as the polygon's centroid drifts under
    //     non-uniform world-axis scaling — without locking, the origin
    //     shifts each frame and the scale formula explodes.
    //   - Otherwise, sync to the *live* oriented bounding box so the cache reflects what
    //     the user sees (handles match positions on the visible bbox).
    if (isScaling && this.lockedScaleBoundingBox) {
      // biome-ignore lint/suspicious/noExplicitAny: ScaleMode._cornerGuidePoints is private upstream
      (this.scaleMode as any)._cornerGuidePoints = boundingBoxToScaleHandles(
        this.lockedScaleBoundingBox,
      );
    } else {
      syncScaleModeCornerCache(this.scaleMode, replaced);
    }

    // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
    return featureCollection(replaced as any) as any;
  }

  /**
   * Capture the oriented bounding box on the first frame of a scale drag, and clear it
   * the moment the drag ends. The captured oriented bounding box is used as the locked
   * source for `ScaleMode._cornerGuidePoints` while the drag is in
   * progress, keeping the diagonal-opposite (= scale origin) at a
   * stable world position even as the polygon's centroid drifts.
   */
  private maintainScaleBoundingBoxLock(
    isScaling: boolean,
    feature: Feature | undefined,
  ): void {
    if (!isScaling) {
      this.lockedScaleBoundingBox = null;
      return;
    }
    if (this.lockedScaleBoundingBox || !feature) {
      return;
    }
    const angleDeg = this.bboxOrientation?.angleDeg ?? 0;
    this.lockedScaleBoundingBox = computeOrientedBoundingBox(feature, angleDeg);
  }

  /**
   * Track `feature.properties.rotationAngle` across frames. Initialize
   * the orientation lock when a new shape enters editing; on each
   * set→unset transition (rotation gesture completion), accumulate the
   * last seen delta so the bbox's stored angle matches the polygon's
   * cumulative rotation since session start.
   */
  private updateBboxOrientation(feature: Feature | undefined): void {
    const shapeId =
      typeof feature?.properties?.shapeId === 'string'
        ? feature.properties.shapeId
        : undefined;
    const liveDelta =
      typeof feature?.properties?.rotationAngle === 'number'
        ? (feature.properties.rotationAngle as number)
        : undefined;

    if (shapeId === undefined) {
      this.lastSeenRotationDelta = liveDelta;
      return;
    }

    if (!this.bboxOrientation || this.bboxOrientation.shapeId !== shapeId) {
      this.bboxOrientation = { shapeId, angleDeg: 0 };
    }

    // Set→unset transition: rotation just ended, accumulate the final
    // delta into our running total.
    if (
      this.lastSeenRotationDelta !== undefined &&
      liveDelta === undefined &&
      this.bboxOrientation
    ) {
      this.bboxOrientation.angleDeg += this.lastSeenRotationDelta;
    }
    this.lastSeenRotationDelta = liveDelta;
  }
}

/**
 * Apply the existing scale-envelope filter and rectangle vertex-handle
 * filter. Returns the filtered guide list; the oriented bounding box replacement happens
 * in a separate step.
 */
function filterVertexGuides(
  features: Feature[],
  isRectangle: boolean,
  isRotating: boolean,
): Feature[] {
  return features.filter((guide) => {
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode
    const properties = (guide.properties ?? {}) as any;
    const editHandleType = properties.editHandleType;
    const guideType = properties.guideType;
    const mode = properties.mode;

    // Three "filter out" rules: rectangles hide their vertex handles to
    // preserve right angles, the scale envelope is always dropped (we
    // emit our own oriented bounding box instead), and scale corner
    // handles are hidden during a rotation drag.
    const drop =
      (isRectangle &&
        guideType === 'editHandle' &&
        editHandleType === 'existing') ||
      mode === 'scale' ||
      (isRotating && editHandleType === 'scale');

    return !drop;
  });
}

/**
 * Wrap `props` so its `modeConfig` carries the cumulative rotation angle
 * for the currently-edited shape. `OrientedScaleMode` reads the value to
 * choose between local-frame and world-frame scaling. Returns the
 * original `props` reference unchanged when there's no rotation lock —
 * keeps the no-op path allocation-free for the common case.
 */
function withOrientationConfig(
  props: ModeProps<FeatureCollection>,
  bboxOrientation: { shapeId: string; angleDeg: number } | null,
): ModeProps<FeatureCollection> {
  if (!bboxOrientation || bboxOrientation.angleDeg === 0) {
    return props;
  }
  return {
    ...props,
    modeConfig: {
      ...props.modeConfig,
      [BBOX_ORIENTATION_CONFIG_KEY]: bboxOrientation.angleDeg,
    },
  };
}

/**
 * `true` if `feature` is any of the rotate-mode-emitted bbox chrome
 * pieces (bbox outline LineString, stem connector LineString, or the
 * rotate-handle Point). Used to strip the chrome during a rotation drag
 * so only the rotating shape and centroid pivot remain visible.
 */
function isRotateChromeFeature(feature: Feature): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
  const editHandleType = (feature.properties as any)?.editHandleType;
  return (
    isRotateModeChromeLine(feature) ||
    (editHandleType === 'rotate' && feature.geometry.type === 'Point')
  );
}

/**
 * `true` if `feature` is a rotate-mode-emitted bbox outline or stem
 * connector LineString that the oriented bounding box chrome will replace. Both come
 * through with no `editHandleType`, no `mode`, and either 5 coords
 * (closed bbox ring) or 2 coords (connector).
 */
function isRotateModeChromeLine(feature: Feature): boolean {
  // The geometry-type guard is kept separate because the rest of the
  // function depends on the LineString narrowing.
  if (feature.geometry.type !== 'LineString') {
    return false;
  }
  // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
  const properties = (feature.properties ?? {}) as any;
  const coords = (feature.geometry as LineString).coordinates;
  return (
    properties.editHandleType === undefined &&
    properties.mode === undefined &&
    (coords.length === 5 || coords.length === 2)
  );
}

/**
 * Replace the rotate-mode emitted bbox + scale handles + rotate handle
 * + stem connector with oriented bounding box-based versions. Other guides (vertex
 * handles, intermediate handles, etc.) pass through unchanged.
 */
function replaceRotateChromeWithBoundingBox(
  features: Feature[],
  boundingBox: OrientedBoundingBox,
): Feature[] {
  const scaleHandles: Feature<GeoPoint>[] = [];
  let rotateHandle: Feature<GeoPoint> | undefined;
  const passthrough: Feature[] = [];

  for (const feature of features) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const editHandleType = (feature.properties as any)?.editHandleType;
    const isPoint = feature.geometry.type === 'Point';

    if (editHandleType === 'scale' && isPoint) {
      scaleHandles.push(feature as Feature<GeoPoint>);
      continue;
    }
    if (editHandleType === 'rotate' && isPoint) {
      rotateHandle = feature as Feature<GeoPoint>;
      continue;
    }
    if (isRotateModeChromeLine(feature)) {
      continue;
    }

    passthrough.push(feature);
  }

  return [
    ...passthrough,
    ...buildBoundingBoxChrome(boundingBox, rotateHandle, scaleHandles),
  ];
}

/**
 * Build a fresh set of scale-corner handle Points (one per oriented bounding box corner,
 * `positionIndexes` 0..3) suitable for assigning to ScaleMode's private
 * `_cornerGuidePoints`. Used to lock the corner cache to the
 * drag-start oriented bounding box during a scale gesture so its drag-origin lookup
 * stays at a fixed world position.
 */
function boundingBoxToScaleHandles(
  boundingBox: OrientedBoundingBox,
): Feature<GeoPoint>[] {
  const corners: Position[] = [
    boundingBox.bottomLeft,
    boundingBox.bottomRight,
    boundingBox.topRight,
    boundingBox.topLeft,
  ];
  return corners.map(
    (corner, index) =>
      point(corner, {
        guideType: 'editHandle',
        editHandleType: 'scale',
        positionIndexes: [index],
      }) as Feature<GeoPoint>,
  );
}

/**
 * Reach into ScaleMode's private `_cornerGuidePoints` and sync it with
 * the oriented bounding box-positioned scale handles so its `_getOppositeScaleHandle`
 * lookup returns the diagonally-opposite oriented bounding box corner (where the user
 * sees the handle) rather than the axis-aligned bounding box corner ScaleMode computed
 * internally. Required because ScaleMode's drag origin comes from
 * those cached points, not from the visible feature collection.
 */
function syncScaleModeCornerCache(
  scaleMode: OrientedScaleMode,
  features: Feature[],
): void {
  const boundingBoxScaleHandles: Feature<GeoPoint>[] = [];
  for (const feature of features) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const properties = (feature.properties ?? {}) as any;
    if (
      properties.editHandleType === 'scale' &&
      feature.geometry.type === 'Point'
    ) {
      boundingBoxScaleHandles.push(feature as Feature<GeoPoint>);
    }
  }
  if (boundingBoxScaleHandles.length !== 4) {
    return;
  }
  // biome-ignore lint/suspicious/noExplicitAny: accessing inherited private from ScaleMode
  (scaleMode as any)._cornerGuidePoints = boundingBoxScaleHandles;
}
