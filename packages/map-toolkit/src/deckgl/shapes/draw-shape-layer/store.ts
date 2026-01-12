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
 * Get the current drawing state for a mapId
 * Returns null if no store instance exists
 */
export function getDrawingState(mapId: UniqueId): DrawingState | null {
  if (!drawStore.exists(mapId)) {
    return null;
  }
  return drawStore.get(mapId);
}

/**
 * Hook for drawing state
 */
export function useDrawingState(
  mapId: UniqueId,
): { state: DrawingState } & DrawShapeActions {
  return drawStore.use(mapId);
}

/**
 * Manually clear drawing state for a specific mapId.
 */
export function clearDrawingState(mapId: UniqueId): void {
  drawStore.clear(mapId);
}

/**
 * Complete drawing with a feature (called by the layer component)
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
 * Cancel drawing (called by the layer component)
 */
export function cancelDrawingFromLayer(mapId: UniqueId): void {
  drawStore.actions(mapId).cancel();
}
