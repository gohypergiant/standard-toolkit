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

'use client';

import { Broadcast } from '@accelint/bus';
import { createMapStore } from '../../../shared/create-map-store';
import { MapCursorEvents } from '../../../map-cursor/events';
import { getOrCreateClearCursor } from '../../../map-cursor/store';
import { MapModeEvents } from '../../../map-mode/events';
import {
  DRAW_CURSOR_MAP,
  DRAW_SHAPE_LAYER_ID,
  DRAW_SHAPE_MODE,
} from './constants';
import { DrawShapeEvents } from './events';
import { convertFeatureToShape } from './utils/feature-conversion';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapCursorEventType } from '../../../map-cursor/types';
import type { MapModeEventType } from '../../../map-mode/types';
import type { Shape, ShapeFeatureType } from '../shared/types';
import type { DrawShapeEvent, ShapeDrawnEvent } from './events';
import type { DrawFunction, DrawingState, DrawShapeOptions } from './types';

/**
 * Typed event bus instances
 */
const drawShapeBus = Broadcast.getInstance<DrawShapeEvent>();
const mapModeBus = Broadcast.getInstance<MapModeEventType>();
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

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
  draw: DrawFunction;
  cancel: () => void;
  // Internal cached functions
  snapshot: () => DrawingState | null;
  serverSnapshot: () => DrawingState | null;
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

  // Request map mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: DRAW_SHAPE_MODE,
    owner: DRAW_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Request cursor
  const cursor = DRAW_CURSOR_MAP[shapeType];
  mapCursorBus.emit(MapCursorEvents.changeRequest, {
    cursor,
    owner: DRAW_SHAPE_LAYER_ID,
    id: mapId,
  });

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

  // Return to default mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: 'default',
    owner: DRAW_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Clear cursor using the store function directly
  getOrCreateClearCursor(mapId)(DRAW_SHAPE_LAYER_ID);

  // Emit shape drawn event
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  // Cast payload to ShapeDrawnPayload to maintain type safety for the structure,
  // then use unknown to satisfy the bus constraint.
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

  // Return to default mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: 'default',
    owner: DRAW_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Clear cursor using the store function directly
  getOrCreateClearCursor(mapId)(DRAW_SHAPE_LAYER_ID);

  // Emit canceled event
  drawShapeBus.emit(DrawShapeEvents.canceled, {
    shapeType,
    mapId,
  });

  notify();
}

/**
 * Local cache for snapshot functions (to avoid creating instance on snapshot call)
 */
const snapshotFnCache = new Map<UniqueId, () => DrawingState | null>();
const serverSnapshotFnCache = new Map<UniqueId, () => DrawingState | null>();

/**
 * Draw shape store using the map store factory
 */
const store = createMapStore<DrawingState, DrawShapeActions>({
  createDefaultState: () => ({ ...DEFAULT_DRAWING_STATE }),
  serverDefault: { ...DEFAULT_DRAWING_STATE },

  setupBusListeners: (mapId, instance, _notify) => {
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
        if (instance.state.activeShapeType) {
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
      // Return to default mode
      mapModeBus.emit(MapModeEvents.changeRequest, {
        desiredMode: 'default',
        owner: DRAW_SHAPE_LAYER_ID,
        id: mapId,
      });

      // Clear cursor
      getOrCreateClearCursor(mapId)(DRAW_SHAPE_LAYER_ID);

      // Emit canceled event
      drawShapeBus.emit(DrawShapeEvents.canceled, {
        shapeType: state.activeShapeType,
        mapId,
      });
    }

    // Clear local caches
    snapshotFnCache.delete(mapId);
    serverSnapshotFnCache.delete(mapId);
  },
});

// =============================================================================
// Public API (maintains backward compatibility with existing hook)
// =============================================================================

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up drawing state when the last subscriber unsubscribes.
 */
export function getOrCreateSubscription(
  mapId: UniqueId,
): (onStoreChange: () => void) => () => void {
  return store.getSubscription(mapId);
}

/**
 * Creates or retrieves a cached snapshot function for a given mapId.
 * Returns the current drawing state or null if no state exists.
 * Uses local cache to avoid creating instance on snapshot access.
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => DrawingState | null {
  let snapshotFn = snapshotFnCache.get(mapId);
  if (!snapshotFn) {
    snapshotFn = () => {
      if (!store.exists(mapId)) {
        return null;
      }
      return store.getState(mapId);
    };
    snapshotFnCache.set(mapId, snapshotFn);
  }
  return snapshotFn;
}

/**
 * Creates or retrieves a cached server snapshot function for a given mapId.
 * Server snapshots always return null since drawing state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => DrawingState | null {
  let serverSnapshotFn = serverSnapshotFnCache.get(mapId);
  if (!serverSnapshotFn) {
    serverSnapshotFn = () => null;
    serverSnapshotFnCache.set(mapId, serverSnapshotFn);
  }
  return serverSnapshotFn;
}

/**
 * Creates or retrieves a cached draw function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateDraw(mapId: UniqueId): DrawFunction {
  return store.getAction(mapId, 'draw', () => {
    return (shapeType: ShapeFeatureType, options?: DrawShapeOptions) => {
      const state = store.getState(mapId);
      startDrawing(
        mapId,
        state,
        shapeType,
        options,
        () => store.notify(mapId),
        (updates) => store.setState(mapId, updates),
      );
    };
  });
}

/**
 * Creates or retrieves a cached cancel function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateCancel(mapId: UniqueId): () => void {
  return store.getAction(mapId, 'cancel', () => {
    return () => {
      const state = store.getState(mapId);
      cancelDrawingInternal(
        mapId,
        state,
        () => store.notify(mapId),
        (updates) => store.setState(mapId, updates),
      );
    };
  });
}

/**
 * Complete drawing with a feature (called by the layer component)
 */
export function completeDrawingFromLayer(
  mapId: UniqueId,
  feature: Feature,
): Shape {
  const state = store.getState(mapId);
  return completeDrawingInternal(
    mapId,
    state,
    feature,
    () => store.notify(mapId),
    (updates) => store.setState(mapId, updates),
  );
}

/**
 * Cancel drawing (called by the layer component)
 */
export function cancelDrawingFromLayer(mapId: UniqueId): void {
  const state = store.getState(mapId);
  cancelDrawingInternal(
    mapId,
    state,
    () => store.notify(mapId),
    (updates) => store.setState(mapId, updates),
  );
}

/**
 * Get the current drawing state for a mapId
 */
export function getDrawingState(mapId: UniqueId): DrawingState | null {
  if (!store.exists(mapId)) {
    return null;
  }
  return store.getState(mapId);
}

/**
 * Manually clear drawing state for a specific mapId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 */
export function clearDrawingState(mapId: UniqueId): void {
  store.clear(mapId);
}
