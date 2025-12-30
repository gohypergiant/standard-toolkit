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
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';

type ActiveMode =
  | ScaleModeWithFreeTransform
  | RotateMode
  | TranslateMode
  | null;

/**
 * Transform mode for ellipses with non-uniform scaling support.
 *
 * This composite mode provides:
 * - **Translation** (TranslateMode): Drag the ellipse body to move it
 * - **Scaling** (ScaleModeWithFreeTransform): Drag corner handles to resize
 *   - Default: Non-uniform scaling (can stretch/squish)
 *   - With Shift: Uniform scaling (maintains aspect ratio)
 * - **Rotation** (RotateMode): Drag top handle to rotate
 *
 * Unlike ModifyTransformMode, this mode does NOT include vertex editing,
 * which is appropriate for ellipses that don't have meaningful vertices.
 *
 * Priority logic:
 * - If hovering over a scale handle, scaling takes priority
 * - If hovering over the rotate handle, rotation takes priority
 * - Otherwise, dragging the ellipse body translates it
 */
export class EllipseTransformMode extends CompositeMode {
  private translateMode: TranslateMode;
  private scaleMode: ScaleModeWithFreeTransform;
  private rotateMode: RotateMode;

  /** Track which mode is currently handling the drag operation */
  private activeDragMode: ActiveMode = null;

  /** Track current Shift state for dynamic uniform/free scaling toggle */
  private isShiftHeld = false;

  constructor() {
    const translateMode = new TranslateMode();
    const scaleMode = new ScaleModeWithFreeTransform();
    const rotateMode = new RotateMode();

    // Order: scale and rotate first so their handles take priority over translate
    super([scaleMode, rotateMode, translateMode]);

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

    const picks = event.picks ?? [];

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

    // Determine which mode should handle this drag
    if (isScaleHandle) {
      this.activeDragMode = this.scaleMode;
    } else if (isRotateHandle) {
      this.activeDragMode = this.rotateMode;
    } else {
      // Default to translate for dragging the ellipse body
      this.activeDragMode = this.translateMode;
    }

    // Only call the active mode's handleStartDragging
    this.activeDragMode.handleStartDragging(event, props);
  }

  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
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

    // Filter out duplicate envelope guides (scale and rotate both have them)
    // Keep scale envelope, filter rotate's duplicate
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, safely accessing with optional chaining
    const nonEnvelopeGuides = allGuides.features.filter((guide: any) => {
      const properties = guide.properties || {};
      const editHandleType = properties.editHandleType;
      const mode = properties.mode;

      // Both scale and rotate modes have the same enveloping box as a guide - only need one
      const guidesToFilterOut: string[] = [mode as string];

      // Do not render scaling edit handles if rotating
      if (this.rotateMode.getIsRotating()) {
        guidesToFilterOut.push(editHandleType as string);
      }

      return !guidesToFilterOut.includes('scale');
    });

    // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
    return featureCollection(nonEnvelopeGuides as any) as any;
  }
}
