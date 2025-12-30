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
  CompositeMode,
  type DraggingEvent,
  type FeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  RotateMode,
  type StartDraggingEvent,
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { featureCollection } from '@turf/helpers';
import { ModifyModeWithTooltip } from './modify-mode-with-tooltip';
import { ScaleModeWithTooltip } from './scale-mode-with-tooltip';

type ActiveMode =
  | ModifyModeWithTooltip
  | ScaleModeWithTooltip
  | RotateMode
  | TranslateMode
  | null;

/**
 * Transform mode for shapes that support vertex editing (polygons and lines).
 *
 * Use this mode for shapes where individual vertices can be dragged to reshape
 * the geometry. This provides the most flexibility for freeform shape editing.
 *
 * This composite mode provides:
 * - **Vertex editing** (ModifyMode): Drag vertices to reshape the geometry
 * - **Translation** (TranslateMode): Drag the shape to move it
 * - **Scaling** (ScaleMode): Drag corner handles to resize
 * - **Rotation** (RotateMode): Drag top handle to rotate
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
 */
export class VertexTransformMode extends CompositeMode {
  private modifyMode: ModifyModeWithTooltip;
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithTooltip;
  private rotateMode: RotateMode;

  /** Track which mode is currently handling the drag operation */
  private activeDragMode: ActiveMode = null;

  /** Track current Shift state for dynamic uniform/free scaling toggle */
  private isShiftHeld = false;

  constructor() {
    const modifyMode = new ModifyModeWithTooltip();
    const translateMode = new TranslateMode();
    const scaleMode = new ScaleModeWithTooltip();
    const rotateMode = new RotateMode();

    // Order matters: first mode to handle the event wins
    // We put modify first so vertex handles take priority over translate
    super([modifyMode, scaleMode, rotateMode, translateMode]);

    this.modifyMode = modifyMode;
    this.translateMode = translateMode;
    this.scaleMode = scaleMode;
    this.rotateMode = rotateMode;
  }

  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    let updatedCursor: string | null | undefined = null;

    // Call parent which will iterate through modes
    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor: string | null | undefined) => {
        updatedCursor = cursor || updatedCursor;
      },
    });

    props.onUpdateCursor(updatedCursor);
  }

  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (event.picks.length) {
      event.cancelPan();
    }

    // Check what kind of handle is being picked
    const picks = event.picks ?? [];

    // Check if we're picking a ModifyMode edit handle (vertex)
    const isModifyHandle = picks.some(
      (pick) =>
        pick.isGuide &&
        pick.object?.properties?.guideType === 'editHandle' &&
        pick.object?.properties?.editHandleType === 'existing',
    );

    // Check if we're picking a ScaleMode handle
    const isScaleHandle = picks.some(
      (pick) =>
        pick.isGuide && pick.object?.properties?.editHandleType === 'scale',
    );

    // Check if we're picking a RotateMode handle
    const isRotateHandle = picks.some(
      (pick) =>
        pick.isGuide && pick.object?.properties?.editHandleType === 'rotate',
    );

    // Determine which mode should handle this drag and track it
    if (isModifyHandle) {
      // Only call ModifyMode for vertex editing
      this.activeDragMode = this.modifyMode;
    } else if (isScaleHandle) {
      // Only call ScaleMode
      this.activeDragMode = this.scaleMode;
    } else if (isRotateHandle) {
      // Only call RotateMode
      this.activeDragMode = this.rotateMode;
    } else {
      // Default to translate for dragging the shape body
      this.activeDragMode = this.translateMode;
    }

    // Only call the active mode's handleStartDragging
    this.activeDragMode.handleStartDragging(event, props);
  }

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // Only call the active mode's handleDragging to prevent errors
    // from modes that weren't initialized for this drag operation
    if (this.activeDragMode) {
      // For ScaleMode, read current Shift state to allow dynamic toggling
      // Shift held = uniform scaling (lock aspect ratio)
      // No shift = free scaling (can squish/stretch)
      if (this.activeDragMode === this.scaleMode) {
        const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
        this.isShiftHeld = sourceEvent?.shiftKey ?? false;

        const propsWithScaleConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            lockScaling: this.isShiftHeld,
          },
        };

        this.activeDragMode.handleDragging(event, propsWithScaleConfig);
      } else {
        this.activeDragMode.handleDragging(event, props);
      }
    }
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    // Only call the active mode's handleStopDragging
    if (this.activeDragMode) {
      // For ScaleMode, use the last known Shift state from handleDragging
      // to ensure the final geometry uses the same scale calculation
      if (this.activeDragMode === this.scaleMode) {
        const propsWithScaleConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            lockScaling: this.isShiftHeld,
          },
        };
        this.activeDragMode.handleStopDragging(event, propsWithScaleConfig);
      } else {
        this.activeDragMode.handleStopDragging(event, props);
      }
      this.activeDragMode = null;
      this.isShiftHeld = false;
    }
  }

  override getGuides(props: ModeProps<FeatureCollection>) {
    // Get guides from all modes
    const allGuides = super.getGuides(props);

    // Check if we're editing a rectangle - rectangles have shape: 'Rectangle' property
    const isRectangle =
      props.data.features[0]?.properties?.shape === 'Rectangle';

    // Filter out duplicate envelope guides (scale and rotate both have them)
    // Keep scale envelope, filter rotate's duplicate
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

  override getTooltips() {
    // Get tooltips from ScaleMode (for rectangle/polygon scaling)
    // or ModifyMode (for polygon vertex editing)
    const scaleTooltips = this.scaleMode.getTooltips();
    if (scaleTooltips.length > 0) {
      return scaleTooltips;
    }
    return this.modifyMode.getTooltips();
  }
}
