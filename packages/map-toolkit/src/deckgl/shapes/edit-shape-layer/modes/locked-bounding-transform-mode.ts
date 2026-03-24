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
  type StopDraggingEvent,
  TranslateMode,
  type ModeProps,
} from '@deck.gl-community/editable-layers';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import { RotateModeWithSnap } from './rotate-mode-with-snap';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';

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
   * Override to always apply lockScaling when scaling, regardless of Shift key.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (!this.activeDragMode) {
      return;
    }

    const sourceEvent = event.sourceEvent as KeyboardEvent | undefined;
    this.isShiftHeld = sourceEvent?.shiftKey ?? false;

    if (this.activeDragMode === this.scaleMode) {
      // Always lock scaling for this mode
      const propsWithLock: ModeProps<FeatureCollection> = {
        ...props,
        modeConfig: {
          ...props.modeConfig,
          lockScaling: true,
        },
      };
      this.activeDragMode.handleDragging(event, propsWithLock);
    } else {
      // For rotate: apply shift config (snap rotation) via parent logic
      const matchers = this.getHandleMatchers();
      const activeMatcher = matchers.find(
        (m) => m.mode === this.activeDragMode,
      );
      const shiftConfig = activeMatcher?.shiftConfig;

      if (shiftConfig && this.isShiftHeld) {
        const propsWithConfig: ModeProps<FeatureCollection> = {
          ...props,
          modeConfig: {
            ...props.modeConfig,
            [shiftConfig.configKey]: shiftConfig.value ?? true,
          },
        };
        this.activeDragMode.handleDragging(event, propsWithConfig);
      } else {
        this.activeDragMode.handleDragging(event, props);
      }
    }

    this.onDragging?.(event, props);
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
    if (!this.activeDragMode) {
      return;
    }

    if (this.activeDragMode === this.scaleMode) {
      const propsWithLock: ModeProps<FeatureCollection> = {
        ...props,
        modeConfig: {
          ...props.modeConfig,
          lockScaling: true,
        },
      };
      this.activeDragMode.handleStopDragging(event, propsWithLock);
      this.resetDragState();
    } else {
      // For rotate/translate, use parent logic
      super.handleStopDragging(event, props);
    }
  }
}
