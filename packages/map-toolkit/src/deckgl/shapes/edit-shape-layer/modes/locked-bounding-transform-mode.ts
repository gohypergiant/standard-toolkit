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
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';
import {
  isRotateChromeFeature,
  replaceRotateChromeWithBoundingBox,
} from './utils/vertex-bbox-chrome';
import { computeOrientedBoundingBox } from './utils/vertex-bbox-math';
import type { Feature } from 'geojson';

/**
 * Transform mode with locked (uniform) scaling — no vertex editing.
 *
 * Identical to BoundingTransformMode except scaling always maintains
 * aspect ratio. Shift key has no effect on scaling behavior.
 *
 * Use this for shapes like wagon wheels where non-uniform scaling
 * would break the circular geometry.
 *
 * ## Capabilities
 * - **Translation**: Drag the shape body to move it
 * - **Scaling**: Drag corner handles to resize (always uniform / locked aspect ratio)
 * - **Rotation**: Drag top handle to rotate
 *   - Default: Free rotation
 *   - With Shift: Snap to 45° intervals
 *
 * @example
 * ```typescript
 * import { LockedBoundingTransformMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/locked-bounding-transform-mode';
 * import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
 *
 * const mode = new LockedBoundingTransformMode();
 *
 * const layer = new EditableGeoJsonLayer({
 *   mode,
 *   data: wagonWheelFeatureCollection,
 *   selectedFeatureIndexes: [0],
 *   onEdit: handleEdit,
 * });
 * ```
 */
export class LockedBoundingTransformMode extends BaseTransformMode {
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithFreeTransform;
  private rotateMode: RotateModeWithSnap;

  constructor() {
    const translateMode = new TranslateMode();
    const scaleMode = new ScaleModeWithFreeTransform();
    const rotateMode = new RotateModeWithSnap();

    super([scaleMode, rotateMode, translateMode]);

    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        match: (pick) =>
          Boolean(
            pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
          ),
        mode: this.scaleMode,
        // No shiftConfig — lockScaling is always applied via handleDragging override
      },
      {
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
   * Override getGuides to render the same muted, grey-dashed bounding-box
   * chrome that `VertexTransformMode` (lines/polygons) uses, instead of the
   * raw scale/rotate-mode envelope drawn in the shape's own line color.
   *
   * The default `BaseTransformMode` guides emit an axis-aligned envelope and a
   * rotate connector with no `mode: 'vertex-bbox'` tag, so the edit layer's
   * color routing falls back to the shape's `lineColor`. We swap that chrome
   * for the tagged oriented bounding box (computed at angle 0, since locked
   * scaling keeps the shape upright) so the box and rotate stem render as edit
   * chrome with a buffer between the box and the shape.
   *
   * During a rotation drag the bbox chrome is dropped entirely (only the
   * rotating shape and centroid pivot remain); it reappears when the gesture
   * ends. Mirrors `VertexTransformMode.getGuides`, minus the orientation-lock
   * and non-uniform corner-cache bookkeeping that uniform/locked scaling
   * doesn't need.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const allGuides = super.getGuides(props);
    const feature = props.data.features[0] as Feature | undefined;

    if (this.rotateMode.getIsRotating()) {
      const stripped = (allGuides.features as Feature[]).filter(
        (guide) => !isRotateChromeFeature(guide),
      );

      // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
      return featureCollection(stripped as any) as any;
    }

    // angle 0 — locked scaling keeps the shape axis-aligned, so the buffered
    // bounding box is simply the shape's lat/lon extent.
    const boundingBox = feature ? computeOrientedBoundingBox(feature, 0) : null;

    if (!boundingBox) {
      return allGuides;
    }

    const { features: replaced } = replaceRotateChromeWithBoundingBox(
      allGuides.features as Feature[],
      boundingBox,
    );

    // biome-ignore lint/suspicious/noExplicitAny: turf/editable-layers GeoJSON types mismatch
    return featureCollection(replaced as any) as any;
  }

  /** Inject lockScaling into props.modeConfig. */
  private withLockScaling(
    props: ModeProps<FeatureCollection>,
  ): ModeProps<FeatureCollection> {
    return {
      ...props,
      modeConfig: { ...props.modeConfig, lockScaling: true },
    };
  }

  /**
   * Override to always apply lockScaling when scaling, regardless of Shift key.
   * For non-scale modes (rotate, translate), delegates to parent which handles
   * shift config resolution and onDragging hook.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode === this.scaleMode) {
      const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
      this.isShiftHeld = sourceEvent?.shiftKey ?? false;

      this.activeDragMode.handleDragging(event, this.withLockScaling(props));
      this.onDragging?.(event, props);
    } else {
      super.handleDragging(event, props);
    }
  }

  /**
   * Override to always apply lockScaling on stop-drag when scaling.
   * Without this, the parent's handleStopDragging emits the final
   * geometry without lockScaling, undoing the uniform constraint.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode === this.scaleMode) {
      this.activeDragMode.handleStopDragging(
        event,
        this.withLockScaling(props),
      );
      this.resetDragState();
    } else {
      super.handleStopDragging(event, props);
    }
  }
}
