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
  type StartDraggingEvent,
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { ResizeCircleModeWithTooltip } from './resize-circle-mode-with-tooltip';

type ActiveMode = ResizeCircleModeWithTooltip | TranslateMode | null;

/**
 * Combines ResizeCircleMode with TranslateMode for circles.
 *
 * This composite mode provides:
 * - **Resize** (ResizeCircleMode): Drag edge to resize from center
 * - **Translation** (TranslateMode): Drag the circle body to move it
 *
 * Priority logic:
 * - If dragging on the edge/handle, resize takes priority
 * - If dragging on the circle body, translate takes priority
 */
export class ResizeCircleTranslateMode extends CompositeMode {
  private resizeMode: ResizeCircleModeWithTooltip;
  private translateMode: TranslateMode;

  /** Track which mode is currently handling the drag operation */
  private activeDragMode: ActiveMode = null;

  constructor() {
    const resizeMode = new ResizeCircleModeWithTooltip();
    const translateMode = new TranslateMode();

    // Order matters: resize first so edge handles take priority
    super([resizeMode, translateMode]);

    this.resizeMode = resizeMode;
    this.translateMode = translateMode;
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

    // Check if we're picking a resize handle (intermediate point on circle edge)
    const isResizeHandle = picks.some(
      (pick) =>
        pick.isGuide &&
        pick.object?.properties?.guideType === 'editHandle' &&
        pick.object?.properties?.editHandleType === 'intermediate',
    );

    // Determine which mode should handle this drag
    if (isResizeHandle) {
      this.activeDragMode = this.resizeMode;
    } else {
      // Default to translate for dragging the circle body
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
      this.activeDragMode.handleDragging(event, props);
    }
  }

  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this.activeDragMode) {
      this.activeDragMode.handleStopDragging(event, props);
      this.activeDragMode = null;
    }
  }

  override getTooltips() {
    return this.resizeMode.getTooltips();
  }
}
