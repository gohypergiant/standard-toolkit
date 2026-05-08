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

import type {
  DraggingEvent,
  ModeProps,
  SimpleFeatureCollection,
  StopDraggingEvent,
} from '@deck.gl-community/editable-layers';
import { ScaleModeWithFreeTransform } from './scale-mode-with-free-transform';

/**
 * Abstract base class for scale modes that handle a specific shape type
 * (rectangle, ellipse) with custom drag math, falling back to the parent
 * `ScaleModeWithFreeTransform` for everything else.
 *
 * Subclasses implement `tryShapeDrag` to either:
 * - Run their shape-specific drag (read parametric properties, compute
 *   the new geometry in Mercator, emit via `props.onEdit`) and return
 *   `true` to indicate the event was handled.
 * - Return `false` to defer to the parent's standard scale path.
 *
 * `handleDragging` and `handleStopDragging` are shared and identical
 * between subclasses — only the `tryShapeDrag` callback differs. On stop
 * we also clear the parent's protected scratch fields so the next pointer
 * gesture starts clean.
 */
export abstract class ShapeAwareScaleMode extends ScaleModeWithFreeTransform {
  /**
   * Run the subclass's shape-specific drag handling. Return `true` when
   * the event was handled (caller skips the parent path) and `false` to
   * defer to the parent's standard scale behavior.
   *
   * @param event - The drag event (frame during drag, or final stop event).
   * @param editType - `'scaling'` for in-progress drag frames, `'scaled'`
   *   for the final emit at drag-stop. Subclasses use this to label the
   *   `onEdit` payload.
   * @param props - The mode props.
   */
  protected abstract tryShapeDrag(
    event: DraggingEvent | StopDraggingEvent,
    editType: 'scaling' | 'scaled',
    props: ModeProps<SimpleFeatureCollection>,
  ): boolean;

  /**
   * Routes the drag through `tryShapeDrag` first; falls back to the
   * parent's standard scale behavior when the subclass declines.
   */
  override handleDragging(
    event: DraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (!this.tryShapeDrag(event, 'scaling', props)) {
      super.handleDragging(event, props);
    }
  }

  /**
   * Finalizes a shape-aware drag by emitting the final geometry and
   * clearing the parent's scratch state and cursor; falls back to the
   * parent's stop-drag for non-handled events.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<SimpleFeatureCollection>,
  ): void {
    if (this.tryShapeDrag(event, 'scaled', props)) {
      // biome-ignore lint/suspicious/noExplicitAny: Accessing the parent's protected scratch fields
      const self = this as any;

      props.onUpdateCursor(null);
      self._geometryBeingScaled = null;
      self._selectedEditHandle = null;
      self._cursor = null;
      self._isScaling = false;

      return;
    }

    super.handleStopDragging(event, props);
  }
}
