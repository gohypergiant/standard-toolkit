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
import { featureCollection } from '@turf/helpers';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { OrientedScaleMode } from './oriented-scale-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { OrientationLock } from './utils/orientation-lock';
import { scaleModePrivate } from './utils/scale-mode-internals';
import {
  boundingBoxToScaleHandles,
  filterVertexGuides,
  isRotateChromeFeature,
  replaceRotateChromeWithBoundingBox,
  syncScaleModeCornerCache,
} from './utils/vertex-bbox-chrome';
import {
  computeOrientedBoundingBox,
  type OrientedBoundingBox,
} from './utils/vertex-bbox-math';
import type { Feature, Point as GeoPoint } from 'geojson';

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
 * polygons don't have well-defined dimensions. The dedicated
 * `RectangleTransformMode` and `EllipseTransformMode` show dimension
 * tooltips during scale drags.
 *
 * ## Rectangle Special Handling
 * If a rectangle ever reaches this mode (legacy fallback — rectangles
 * normally use `RectangleTransformMode`), vertex handles are hidden to
 * preserve rotation and right angles. Only scale/rotate/translate
 * handles are shown.
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
   * Tracks the cumulative session rotation angle (polygons and lines
   * have no persisted rotation, so deltas observed via deck.gl's
   * transient `properties.rotationAngle` are accumulated here) and the
   * scale-drag oriented-bounding-box snapshot (frozen on the first scale
   * frame so the corner-origin cache stays stable as the polygon
   * scales).
   */
  private orientationLock = new OrientationLock<OrientedBoundingBox>();

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
    super.handleDragging(event, this.orientationLock.decorateProps(props));
  }

  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    super.handleStartDragging(event, this.orientationLock.decorateProps(props));
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    super.handleStopDragging(event, this.orientationLock.decorateProps(props));
  }

  /**
   * Clear the orientation lock. The edit layer calls this when the
   * editing shape ID changes (a new edit session begins) so the bbox
   * starts axis-aligned (`angleDeg = 0`) for the freshly-opened shape.
   */
  resetLockedAnchor(): void {
    this.orientationLock.reset();
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
    const isScaling = scaleModePrivate(this.scaleMode)._isScaling;

    const { angleDeg, lockedBoundingBox } = this.orientationLock.observe({
      feature,
      isScaling,
      computeBoundingBox: (deg) =>
        !isRectangle && feature
          ? computeOrientedBoundingBox(feature, deg)
          : null,
    });

    const filteredGuides = filterVertexGuides(
      allGuides.features as Feature[],
      isRectangle,
      isRotating,
    );

    return this.buildGuideOutput({
      filteredGuides,
      feature,
      isRectangle,
      isRotating,
      angleDeg,
      lockedBoundingBox,
    });
  }

  /**
   * Decide which guide collection to render given the current gesture
   * state, and (as a side effect on the scale path) sync ScaleMode's
   * private corner cache so its drag math anchors at the oriented bounding box corner the
   * user actually sees. Three top-level branches:
   *
   * - **Rotating** — drop the bbox chrome entirely so only the live
   *   shape and centroid pivot remain visible.
   * - **No oriented bounding box available** — rectangle fallback, missing feature, or
   *   degenerate vertices. Return the un-modified filtered guides.
   * - **Default** — emit the oriented-bounding-box-based chrome and patch
   *   `_cornerGuidePoints` (locked to drag-start corners during scale,
   *   live corners otherwise).
   */
  private buildGuideOutput(args: {
    filteredGuides: Feature[];
    feature: Feature | undefined;
    isRectangle: boolean;
    isRotating: boolean;
    angleDeg: number;
    lockedBoundingBox: OrientedBoundingBox | null;
  }): GuideFeatureCollection {
    const {
      filteredGuides,
      feature,
      isRectangle,
      isRotating,
      angleDeg,
      lockedBoundingBox,
    } = args;

    if (isRotating) {
      const stripped = filteredGuides.filter(
        (guide) => !isRotateChromeFeature(guide),
      );
      // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
      return featureCollection(stripped as any) as any;
    }

    // Rectangle fallback / no feature / degenerate vertices all
    // produce no oriented bounding box; we return the un-modified filtered guides.
    const boundingBox =
      !isRectangle && feature
        ? computeOrientedBoundingBox(feature, angleDeg)
        : null;

    if (!boundingBox) {
      // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
      return featureCollection(filteredGuides as any) as any;
    }

    const { features: replaced, scaleHandles } =
      replaceRotateChromeWithBoundingBox(filteredGuides, boundingBox);
    this.syncCornerCacheForScale(scaleHandles, lockedBoundingBox);

    // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
    return featureCollection(replaced as any) as any;
  }

  /**
   * Keep `ScaleMode._cornerGuidePoints` pointing at the oriented bounding
   * box corners the user actually sees so its diagonal-opposite lookup
   * returns a coherent scale origin:
   *
   * - During a scale drag (`lockedBoundingBox` non-null), use the
   *   drag-start oriented bounding box so the origin stays fixed even
   *   as the polygon's centroid drifts under non-uniform world-axis
   *   scaling — without locking, the origin shifts each frame and the
   *   scale formula explodes.
   * - Otherwise, sync to the *live* oriented bounding box so the cache
   *   reflects what the user sees (handles match positions on the
   *   visible bbox).
   */
  private syncCornerCacheForScale(
    scaleHandles: Feature<GeoPoint>[],
    lockedBoundingBox: OrientedBoundingBox | null,
  ): void {
    if (lockedBoundingBox) {
      scaleModePrivate(this.scaleMode)._cornerGuidePoints =
        boundingBoxToScaleHandles(lockedBoundingBox);

      return;
    }

    syncScaleModeCornerCache(this.scaleMode, scaleHandles);
  }
}
