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
  type FeatureCollection,
  type GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  ModifyMode,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';

/**
 * Transform mode for shapes that support vertex editing (polygons and lines).
 *
 * Use this mode for shapes where individual vertices can be dragged to reshape
 * the geometry. This provides the most flexibility for freeform shape editing.
 *
 * This composite mode provides:
 * - **Vertex editing** (ModifyMode): Drag vertices to reshape the geometry
 * - **Translation** (TranslateMode): Drag the shape to move it
 * - **Scaling** (ScaleModeWithFreeTransform): Drag corner handles to resize
 *   - Default: Non-uniform scaling (can stretch/squish)
 *   - With Shift: Uniform scaling (maintains aspect ratio)
 * - **Rotation** (RotateModeWithSnap): Drag top handle to rotate
 *   - Default: Free rotation
 *   - With Shift: Snap to 45° intervals
 *
 * Priority logic:
 * - If hovering over a scale handle, scaling takes priority
 * - If hovering over the rotate handle, rotation takes priority
 * - If hovering over a vertex (edit handle from ModifyMode), vertex editing takes priority
 * - Otherwise, dragging the shape translates it
 *
 * The guides from all modes are combined, showing both vertex handles and transform handles.
 *
 * Note: For shapes like rectangles where vertex editing is filtered out (to preserve
 * rotation), consider using BoundingTransformMode instead.
 *
 * Note: This mode does not show tooltips during editing because arbitrary polygons
 * don't have meaningful dimensions to display. Use BoundingTransformMode for shapes
 * like rectangles and ellipses where dimension tooltips are useful.
 */
export class VertexTransformMode extends BaseTransformMode {
  private modifyMode: ModifyMode;
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithFreeTransform;
  private rotateMode: RotateModeWithSnap;

  constructor() {
    const modifyMode = new ModifyMode();
    const translateMode = new TranslateMode();
    const scaleMode = new ScaleModeWithFreeTransform();
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
    return this.translateMode;
  }

  /**
   * Override getGuides to filter duplicate envelope guides and handle rectangles.
   *
   * Both ScaleMode and RotateMode render the same bounding box envelope.
   * We keep scale's envelope and filter rotate's duplicate.
   * We also hide scale handles while rotating to avoid visual clutter.
   *
   * For rectangles, we hide vertex handles because vertex editing would distort
   * the shape or force axis-alignment. Rectangles should use scale handles only.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    // Get guides from all modes (base class handles pick filtering)
    const allGuides = super.getGuides(props);

    // Check if we're editing a rectangle - rectangles have shape: 'Rectangle' property
    const isRectangle =
      props.data.features[0]?.properties?.shape === 'Rectangle';

    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, safely accessing with optional chaining
    const filteredGuides = allGuides.features.filter((guide: any) => {
      const properties = guide.properties || {};
      const editHandleType = properties.editHandleType;
      const guideType = properties.guideType;
      const mode = properties.mode;

      // Both scale and rotate modes have the same enveloping box as a guide - only need one
      const guidesToFilterOut: string[] = [mode as string];

      // Do not render scaling edit handles if rotating
      if (this.rotateMode.getIsRotating()) {
        guidesToFilterOut.push(editHandleType as string);
      }

      // For rectangles, hide ModifyMode vertex handles (editHandleType: 'existing')
      // Rectangles should only use scale handles for resizing to preserve rotation
      // Vertex editing would either distort the shape or force axis-alignment
      if (
        isRectangle &&
        guideType === 'editHandle' &&
        editHandleType === 'existing'
      ) {
        return false;
      }

      return !guidesToFilterOut.includes('scale');
    });

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
    return featureCollection(filteredGuides as any) as any;
  }
}
