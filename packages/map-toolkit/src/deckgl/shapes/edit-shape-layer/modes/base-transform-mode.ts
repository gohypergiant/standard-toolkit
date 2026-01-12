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
  CompositeMode,
  type DraggingEvent,
  type FeatureCollection,
  type GeoJsonEditMode,
  type GuideFeatureCollection,
  type ModeProps,
  type PointerMoveEvent,
  type StartDraggingEvent,
  type StopDraggingEvent,
  type Tooltip,
} from '@deck.gl-community/editable-layers';
import { filterGeometryAwarePicks } from '../../shared/utils/pick-filtering';

/**
 * Configuration for how a mode handles the Shift key modifier.
 */
export type ShiftKeyConfig = {
  /** The modeConfig property name to set (e.g., 'lockScaling', 'snapRotation') */
  configKey: string;
  /** The value to set when Shift is held (defaults to true) */
  value?: boolean;
};

/**
 * Definition for how to detect and handle a specific edit handle type.
 */
export type HandleMatcher = {
  /** Function to determine if a pick matches this handle type */
  match: (pick: {
    isGuide?: boolean;
    object?: {
      properties?: {
        guideType?: string;
        editHandleType?: string;
        mode?: string;
      };
    };
  }) => boolean;
  /** The mode instance to delegate to when this handle is matched */
  mode: GeoJsonEditMode;
  /** Optional Shift key configuration for this mode */
  shiftConfig?: ShiftKeyConfig;
};

/**
 * Abstract base class for composite transform modes.
 *
 * This class extracts the common patterns shared by CircleTransformMode,
 * BoundingTransformMode, and VertexTransformMode:
 *
 * - Active mode tracking during drag operations
 * - Cursor aggregation from child modes
 * - Pick-based mode selection at drag start
 * - Shift key modifier handling for scale/rotate operations
 * - Clean state reset on drag stop
 * - Pick filtering to prevent TypeError from sublayer elements
 *
 * Subclasses define their specific modes and handle matchers, while this
 * base class handles the delegation logic.
 */
export abstract class BaseTransformMode extends CompositeMode {
  /** Track which mode is currently handling the drag operation */
  protected activeDragMode: GeoJsonEditMode | null = null;

  /** Track current Shift state for dynamic modifier behavior */
  protected isShiftHeld = false;

  /** Tooltip for operations that show live measurements */
  protected tooltip: Tooltip | null = null;

  /**
   * Get the handle matchers that define how picks map to modes.
   * Matchers are evaluated in order; first match wins.
   * The last matcher should typically be a catch-all for the default mode.
   */
  protected abstract getHandleMatchers(): HandleMatcher[];

  /**
   * Get the default mode to use when no handle matchers match.
   * This is typically TranslateMode for dragging the shape body.
   */
  protected abstract getDefaultMode(): GeoJsonEditMode;

  /**
   * Optional hook called during drag when the active mode is set.
   * Subclasses can override to update tooltips or perform other side effects.
   */
  protected onDragging?(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void;

  /**
   * Aggregates cursor updates from all child modes.
   * The first non-null cursor from any mode is used.
   */
  override handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    let updatedCursor: string | null | undefined = null;

    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor: string | null | undefined) => {
        updatedCursor = cursor || updatedCursor;
      },
    });

    props.onUpdateCursor(updatedCursor);
  }

  /**
   * Determines which mode should handle the drag based on picked handles.
   * Cancels map panning and delegates to the matched mode.
   */
  override handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (event.picks.length) {
      event.cancelPan();
    }

    const picks = event.picks ?? [];
    const matchers = this.getHandleMatchers();

    // Find the first matcher that matches any pick
    for (const matcher of matchers) {
      if (picks.some(matcher.match)) {
        this.activeDragMode = matcher.mode;
        break;
      }
    }

    // Fall back to default mode if no matcher matched
    if (!this.activeDragMode) {
      this.activeDragMode = this.getDefaultMode();
    }

    this.activeDragMode.handleStartDragging(event, props);
  }

  /**
   * Delegates dragging to the active mode with Shift key handling.
   * Reads Shift state from the source event and applies configured modifiers.
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

    // Find the matcher for the active mode to get shift config
    const matchers = this.getHandleMatchers();
    const activeMatcher = matchers.find((m) => m.mode === this.activeDragMode);
    const shiftConfig = activeMatcher?.shiftConfig;

    // Apply shift key modifier if configured
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

    // Call subclass hook for tooltips or other side effects
    this.onDragging?.(event, props);
  }

  /**
   * Delegates stop dragging to the active mode with final Shift state.
   * Resets all drag-related state.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (!this.activeDragMode) {
      return;
    }

    // Find the matcher for the active mode to get shift config
    const matchers = this.getHandleMatchers();
    const activeMatcher = matchers.find((m) => m.mode === this.activeDragMode);
    const shiftConfig = activeMatcher?.shiftConfig;

    // Apply shift key modifier if configured (use last known state)
    if (shiftConfig && this.isShiftHeld) {
      const propsWithConfig: ModeProps<FeatureCollection> = {
        ...props,
        modeConfig: {
          ...props.modeConfig,
          [shiftConfig.configKey]: shiftConfig.value ?? true,
        },
      };
      this.activeDragMode.handleStopDragging(event, propsWithConfig);
    } else {
      this.activeDragMode.handleStopDragging(event, props);
    }

    this.resetDragState();
  }

  /**
   * Returns tooltips for display during drag operations.
   * Subclasses update `this.tooltip` in their `onDragging` hook.
   */
  override getTooltips(): Tooltip[] {
    return this.tooltip ? [this.tooltip] : [];
  }

  /**
   * Filters picks to prevent TypeError from sublayer elements without geometry.
   *
   * Some child modes (like ModifyMode, ResizeCircleMode) access
   * `pick.object.geometry.type` which throws if the pick doesn't have
   * a geometry property. This happens when picks include sublayer elements
   * like tooltip text that aren't GeoJSON features.
   */
  override getGuides(
    props: ModeProps<FeatureCollection>,
  ): GuideFeatureCollection {
    const picks = props.lastPointerMoveEvent?.picks;

    if (picks && picks.length > 0) {
      const { filteredPicks, didFilter } = filterGeometryAwarePicks(picks);

      if (didFilter) {
        const filteredProps: ModeProps<FeatureCollection> = {
          ...props,
          lastPointerMoveEvent: {
            ...props.lastPointerMoveEvent,
            picks: filteredPicks,
          },
        };
        return super.getGuides(filteredProps);
      }
    }

    return super.getGuides(props);
  }

  /**
   * Resets drag-related state. Called after drag stops.
   * Subclasses can override to reset additional state but should call super.
   */
  protected resetDragState(): void {
    this.activeDragMode = null;
    this.isShiftHeld = false;
    this.tooltip = null;
  }
}
