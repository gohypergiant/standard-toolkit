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

'use client';

/**
 * Draw Shape Store
 *
 * Manages drawing state for shape creation.
 *
 * @example
 * ```tsx
 * import { drawStore } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * function DrawControls({ mapId }) {
 *   const { state, draw, cancel } = drawStore.use(mapId);
 *
 *   return (
 *     <div>
 *       <p>Drawing: {state.activeShapeType ?? 'none'}</p>
 *       <button onClick={() => draw('Polygon')}>Draw Polygon</button>
 *       <button onClick={cancel}>Cancel</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { MapModeEvents } from '@/map-mode/events';
import { createMapStore } from '@/shared/create-map-store';
import {
  releaseModeAndCursor,
  requestModeAndCursor,
} from '../shared/utils/mode-utils';
import {
  DRAW_CURSOR_MAP,
  DRAW_SHAPE_LAYER_ID,
  DRAW_SHAPE_MODE,
} from './constants';
import { DrawShapeEvents } from './events';
import { convertFeatureToShape } from './utils/feature-conversion';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapModeEventType } from '@/map-mode/types';
import type { Shape, ShapeFeatureType } from '../shared/types';
import type { DrawShapeEvent, ShapeDrawnEvent } from './events';
import type { DrawFunction, DrawingState, DrawShapeOptions } from './types';

/**
 * Typed event bus instances
 */
const drawShapeBus = Broadcast.getInstance<DrawShapeEvent>();
const mapModeBus = Broadcast.getInstance<MapModeEventType>();

/**
 * Default drawing state
 */
const DEFAULT_DRAWING_STATE: DrawingState = {
  activeShapeType: null,
  tentativeFeature: null,
  styleDefaults: null,
  circleDefaults: null,
};

/**
 * Actions for draw shape store
 */
type DrawShapeActions = {
  /** Start drawing a shape of the specified type */
  draw: DrawFunction;
  /** Cancel the current drawing operation */
  cancel: () => void;
};

/**
 * Start drawing a shape
 */
function startDrawing(
  mapId: UniqueId,
  state: DrawingState,
  shapeType: ShapeFeatureType,
  options: DrawShapeOptions | undefined,
  notify: () => void,
  setState: (updates: Partial<DrawingState>) => void,
): void {
  // Already drawing - cancel first
  if (state.activeShapeType) {
    cancelDrawingInternal(mapId, state, notify, setState);
  }

  // Update state with new object reference
  setState({
    activeShapeType: shapeType,
    tentativeFeature: null,
    styleDefaults: options?.styleDefaults ?? null,
    circleDefaults: options?.circleDefaults ?? null,
  });

  // Request map mode and cursor using shared utilities
  const cursor = DRAW_CURSOR_MAP[shapeType];
  requestModeAndCursor(mapId, DRAW_SHAPE_MODE, cursor, DRAW_SHAPE_LAYER_ID);

  // Emit drawing started event
  drawShapeBus.emit(DrawShapeEvents.drawing, {
    shapeType,
    mapId,
  });

  notify();
}

/**
 * Complete drawing and create a shape
 */
function completeDrawingInternal(
  mapId: UniqueId,
  state: DrawingState,
  feature: Feature,
  notify: () => void,
  setState: (updates: Partial<DrawingState>) => void,
): Shape {
  if (!state.activeShapeType) {
    throw new Error('Cannot complete drawing - not currently drawing');
  }

  const shapeType = state.activeShapeType;
  const styleDefaults = state.styleDefaults;

  // Convert feature to Shape
  const shape = convertFeatureToShape(feature, shapeType, styleDefaults);

  // Reset state with new object reference
  setState({
    activeShapeType: null,
    tentativeFeature: null,
    styleDefaults: null,
    circleDefaults: null,
  });

  // Release mode and cursor using shared utilities
  releaseModeAndCursor(mapId, DRAW_SHAPE_LAYER_ID);

  // Emit shape drawn event
  drawShapeBus.emit(DrawShapeEvents.drawn, {
    shape,
    mapId,
  } as unknown as ShapeDrawnEvent['payload']);

  notify();

  return shape;
}

/**
 * Cancel the current drawing operation
 */
function cancelDrawingInternal(
  mapId: UniqueId,
  state: DrawingState,
  notify: () => void,
  setState: (updates: Partial<DrawingState>) => void,
): void {
  if (!state.activeShapeType) {
    return; // Nothing to cancel
  }

  const shapeType = state.activeShapeType;

  // Reset state with new object reference
  setState({
    activeShapeType: null,
    tentativeFeature: null,
    styleDefaults: null,
    circleDefaults: null,
  });

  // Release mode and cursor using shared utilities
  releaseModeAndCursor(mapId, DRAW_SHAPE_LAYER_ID);

  // Emit canceled event
  drawShapeBus.emit(DrawShapeEvents.canceled, {
    shapeType,
    mapId,
  });

  notify();
}

/**
 * Draw shape store
 */
export const drawStore = createMapStore<DrawingState, DrawShapeActions>({
  defaultState: { ...DEFAULT_DRAWING_STATE },

  actions: (mapId, { get, set, notify }) => ({
    draw: (shapeType: ShapeFeatureType, options?: DrawShapeOptions) => {
      startDrawing(mapId, get(), shapeType, options, notify, set);
    },

    cancel: () => {
      cancelDrawingInternal(mapId, get(), notify, set);
    },
  }),

  bus: (mapId, { get }) => {
    // Listen for mode authorization requests - REJECT when drawing (protected mode)
    const unsubAuth = mapModeBus.on(
      MapModeEvents.changeAuthorization,
      (event) => {
        const { authId, id } = event.payload;

        // Filter: only handle if targeted at this map
        if (id !== mapId) {
          return;
        }

        // If we're actively drawing, reject the mode change request
        if (get().activeShapeType) {
          mapModeBus.emit(MapModeEvents.changeDecision, {
            authId,
            approved: false,
            owner: DRAW_SHAPE_LAYER_ID,
            reason: 'Drawing in progress - cancel drawing first',
            id: mapId,
          });
        }
      },
    );

    return () => {
      unsubAuth();
    };
  },

  onCleanup: (mapId, state) => {
    // Cancel any active drawing before cleanup
    if (state.activeShapeType) {
      // Release mode and cursor using shared utilities
      releaseModeAndCursor(mapId, DRAW_SHAPE_LAYER_ID);

      // Emit canceled event
      drawShapeBus.emit(DrawShapeEvents.canceled, {
        shapeType: state.activeShapeType,
        mapId,
      });
    }
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Get the current drawing state for a map instance.
 *
 * Returns the drawing state (active shape type, style defaults, etc.) for the
 * specified map ID. Returns null if no drawing store instance exists for that map.
 *
 * ## Use Cases
 * - Check if a map is currently in drawing mode
 * - Access drawing state outside of React components
 * - Inspect state for debugging purposes
 *
 * @param mapId - Unique identifier for the map instance
 * @returns The drawing state, or null if no store instance exists
 *
 * @example
 * ```typescript
 * import { getDrawingState } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * const state = getDrawingState('map-1');
 * if (state?.activeShapeType) {
 *   console.log(`Currently drawing: ${state.activeShapeType}`);
 * }
 * ```
 */
export function getDrawingState(mapId: UniqueId): DrawingState | null {
  if (!drawStore.exists(mapId)) {
    return null;
  }
  return drawStore.get(mapId);
}

/**
 * React hook for accessing drawing state and actions.
 *
 * Provides access to the drawing store for a specific map instance, including
 * the current state and draw/cancel actions. Uses `useSyncExternalStore` for
 * concurrent-safe React subscriptions.
 *
 * ## Comparison with useDrawShape
 * - `useDrawingState`: Low-level store access without event callbacks
 * - `useDrawShape`: High-level API with onCreate/onCancel callbacks
 *
 * Use `useDrawingState` when you need direct store access without event handling.
 * Use `useDrawShape` (recommended) for most drawing interactions.
 *
 * @param mapId - Unique identifier for the map instance
 * @returns Object containing drawing state and actions (draw, cancel)
 *
 * @example
 * ```tsx
 * import { useDrawingState } from '@accelint/map-toolkit/deckgl/shapes';
 * import { ShapeFeatureType } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * function DrawingStatus({ mapId }: { mapId: UniqueId }) {
 *   const { state, draw, cancel } = useDrawingState(mapId);
 *
 *   return (
 *     <div>
 *       <p>Status: {state.activeShapeType ?? 'Not drawing'}</p>
 *       <button onClick={() => draw(ShapeFeatureType.Polygon)}>
 *         Start Drawing
 *       </button>
 *       {state.activeShapeType && (
 *         <button onClick={cancel}>Cancel</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDrawingState(
  mapId: UniqueId,
): { state: DrawingState } & DrawShapeActions {
  return drawStore.use(mapId);
}

/**
 * Manually clear the drawing state for a specific map instance.
 *
 * Removes the drawing store instance for the given map ID, canceling any
 * active drawing operation and releasing mode/cursor ownership. This is
 * typically called automatically during cleanup, but can be used manually
 * when needed.
 *
 * ## When to Use
 * - Cleanup after programmatically managing drawing state
 * - Force-reset drawing state in error conditions
 * - Testing and debugging
 *
 * ## Side Effects
 * - Cancels active drawing (if any)
 * - Releases map mode and cursor
 * - Emits 'shapes:draw-canceled' event
 * - Removes store instance from memory
 *
 * @param mapId - Unique identifier for the map instance
 *
 * @example
 * ```typescript
 * import { clearDrawingState } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * // Clear drawing state when unmounting a map
 * function cleanup(mapId: UniqueId) {
 *   clearDrawingState(mapId);
 * }
 * ```
 */
export function clearDrawingState(mapId: UniqueId): void {
  drawStore.clear(mapId);
}

/**
 * Complete the drawing operation with a GeoJSON feature.
 *
 * Called internally by the DrawShapeLayer component when the user finishes
 * drawing a shape. Converts the raw EditableGeoJsonLayer feature to a Shape
 * object, resets drawing state, releases mode/cursor, and emits the drawn event.
 *
 * ## Internal API
 * This function is exported for use by the DrawShapeLayer component and should
 * not be called directly from application code. Use the `draw` action from
 * `useDrawShape` or `useDrawingState` instead.
 *
 * @param mapId - Unique identifier for the map instance
 * @param feature - The completed GeoJSON feature from EditableGeoJsonLayer
 * @returns The newly created Shape object
 * @throws Error if not currently drawing
 *
 * @example
 * ```typescript
 * // Internal usage in DrawShapeLayer
 * const handleEdit = ({ updatedData, editType }: EditAction) => {
 *   if (editType === 'addFeature') {
 *     const feature = updatedData.features[updatedData.features.length - 1];
 *     if (feature) {
 *       completeDrawingFromLayer(mapId, feature);
 *     }
 *   }
 * };
 * ```
 */
export function completeDrawingFromLayer(
  mapId: UniqueId,
  feature: Feature,
): Shape {
  const state = drawStore.get(mapId);
  return completeDrawingInternal(
    mapId,
    state,
    feature,
    () => {
      /* notify handled by set */
    },
    (updates) => drawStore.set(mapId, updates),
  );
}

/**
 * Cancel the current drawing operation from the layer.
 *
 * Called internally by the DrawShapeLayer component when the user presses ESC
 * or the drawing is otherwise canceled. Resets drawing state, releases mode/cursor,
 * and emits the canceled event.
 *
 * ## Internal API
 * This function is exported for use by the DrawShapeLayer component and should
 * not be called directly from application code. Use the `cancel` action from
 * `useDrawShape` or `useDrawingState` instead.
 *
 * @param mapId - Unique identifier for the map instance
 *
 * @example
 * ```typescript
 * // Internal usage in DrawShapeLayer
 * const handleEdit = ({ editType }: EditAction) => {
 *   if (editType === 'cancelFeature') {
 *     cancelDrawingFromLayer(mapId);
 *   }
 * };
 * ```
 */
export function cancelDrawingFromLayer(mapId: UniqueId): void {
  drawStore.actions(mapId).cancel();
}
