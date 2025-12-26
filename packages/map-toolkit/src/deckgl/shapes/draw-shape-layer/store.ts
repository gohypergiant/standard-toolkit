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
import { MapCursorEvents } from '../../../map-cursor/events';
import { getOrCreateClearCursor } from '../../../map-cursor/store';
import { MapModeEvents } from '../../../map-mode/events';
import { MapEvents } from '../../base-map/events';
import {
  DRAW_CURSOR_MAP,
  DRAW_SHAPE_LAYER_ID,
  DRAW_SHAPE_MODE,
} from './constants';
import { DrawShapeEvents } from './events';
import { convertFeatureToDisplayShape } from './utils/feature-conversion';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapCursorEventType } from '../../../map-cursor/types';
import type { MapModeEventType } from '../../../map-mode/types';
import type {
  MapDisablePanEvent,
  MapEnablePanEvent,
} from '../../base-map/types';
import type { DisplayShape, ShapeFeatureType } from '../shared/types';
import type { DrawShapeEvent } from './events';
import type {
  DrawFunction,
  DrawingState,
  DrawShapeOptions,
  Subscription,
} from './types';

/**
 * Typed event bus instances
 */
const drawShapeBus = Broadcast.getInstance<DrawShapeEvent>();
const mapModeBus = Broadcast.getInstance<MapModeEventType>();
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();
const mapControlBus = Broadcast.getInstance<
  MapEnablePanEvent | MapDisablePanEvent
>();

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
 * Store for drawing state keyed by mapId
 */
const drawingStore = new Map<UniqueId, DrawingState>();

/**
 * Track React component subscribers per mapId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per mapId).
 * This ensures we only have one bus listener per map instance, regardless of
 * how many React components subscribe to it.
 */
const busUnsubscribers = new Map<UniqueId, () => void>();

/**
 * Cache of subscription functions per mapId to avoid recreating on every render
 */
const subscriptionCache = new Map<UniqueId, Subscription>();

/**
 * Cache of snapshot functions per mapId to maintain referential stability
 */
const snapshotCache = new Map<UniqueId, () => DrawingState | null>();

/**
 * Cache of server snapshot functions per mapId to maintain referential stability.
 * Server snapshots always return null since drawing state is client-only.
 */
const serverSnapshotCache = new Map<UniqueId, () => DrawingState | null>();

/**
 * Cache of draw functions per mapId to maintain referential stability
 */
const drawCache = new Map<UniqueId, DrawFunction>();

/**
 * Cache of cancel functions per mapId to maintain referential stability
 */
const cancelCache = new Map<UniqueId, () => void>();

/**
 * Get or create drawing state for a given mapId
 */
function getOrCreateState(mapId: UniqueId): DrawingState {
  if (!drawingStore.has(mapId)) {
    drawingStore.set(mapId, { ...DEFAULT_DRAWING_STATE });
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return drawingStore.get(mapId)!;
}

/**
 * Update state with a new object reference for useSyncExternalStore
 * This ensures React detects changes via Object.is comparison
 */
function updateState(mapId: UniqueId, updates: Partial<DrawingState>): void {
  const currentState = getOrCreateState(mapId);
  const newState: DrawingState = {
    ...currentState,
    ...updates,
  };
  drawingStore.set(mapId, newState);
}

/**
 * Notify all React subscribers for a given mapId
 */
function notifySubscribers(mapId: UniqueId): void {
  const subscribers = componentSubscribers.get(mapId);
  if (subscribers) {
    for (const onStoreChange of subscribers) {
      onStoreChange();
    }
  }
}

/**
 * Start drawing a shape
 */
function startDrawing(
  mapId: UniqueId,
  shapeType: ShapeFeatureType,
  options?: DrawShapeOptions,
): void {
  const state = getOrCreateState(mapId);

  // Already drawing - cancel first
  if (state.activeShapeType) {
    cancelDrawing(mapId);
  }

  // Update state with new object reference
  updateState(mapId, {
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

  // Disable panning during drawing to prevent interference with double-click
  mapControlBus.emit(MapEvents.disablePan, { id: mapId });

  // Emit drawing started event
  drawShapeBus.emit(DrawShapeEvents.drawing, {
    shapeType,
    mapId,
  });

  notifySubscribers(mapId);
}

/**
 * Complete drawing and create a shape
 */
function completeDrawing(mapId: UniqueId, feature: Feature): DisplayShape {
  const state = getOrCreateState(mapId);

  if (!state.activeShapeType) {
    throw new Error('Cannot complete drawing - not currently drawing');
  }

  const shapeType = state.activeShapeType;
  const styleDefaults = state.styleDefaults;

  // Convert feature to DisplayShape
  const shape = convertFeatureToDisplayShape(feature, shapeType, styleDefaults);

  // Reset state with new object reference
  updateState(mapId, {
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

  // Re-enable panning after drawing completes
  mapControlBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit shape drawn event
  // Type assertion needed because DisplayShape contains GeoJSON Feature
  // which is structurally cloneable but lacks TS index signature
  // biome-ignore lint/suspicious/noExplicitAny: Bus type constraint workaround for GeoJSON Feature
  (drawShapeBus as any).emit(DrawShapeEvents.drawn, { shape, mapId });

  notifySubscribers(mapId);

  return shape;
}

/**
 * Cancel the current drawing operation
 */
function cancelDrawing(mapId: UniqueId): void {
  const state = getOrCreateState(mapId);

  if (!state.activeShapeType) {
    return; // Nothing to cancel
  }

  const shapeType = state.activeShapeType;

  // Reset state with new object reference
  updateState(mapId, {
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

  // Re-enable panning after drawing is cancelled
  mapControlBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit cancelled event
  drawShapeBus.emit(DrawShapeEvents.cancelled, {
    shapeType,
    mapId,
  });

  notifySubscribers(mapId);
}

/**
 * Update the tentative feature during drawing
 */
function updateTentativeFeature(
  mapId: UniqueId,
  feature: Feature | null,
): void {
  updateState(mapId, { tentativeFeature: feature });
  notifySubscribers(mapId);
}

/**
 * Ensures a single bus listener exists for the given mapId.
 * All React subscribers will be notified via fan-out when the bus events fire.
 * This prevents creating N bus listeners for N React components.
 */
function ensureBusListener(mapId: UniqueId): void {
  if (busUnsubscribers.has(mapId)) {
    return; // Already listening
  }

  // Listen for mode authorization requests - REJECT when drawing (protected mode)
  const unsubAuth = mapModeBus.on(
    MapModeEvents.changeAuthorization,
    (event) => {
      const { authId, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== mapId) {
        return;
      }

      // Get current state at event time (not registration time)
      const currentState = drawingStore.get(mapId);

      // If we're actively drawing, reject the mode change request
      if (currentState?.activeShapeType) {
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

  // Store composite cleanup function
  busUnsubscribers.set(mapId, () => {
    unsubAuth();
  });
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 */
function cleanupBusListenerIfNeeded(mapId: UniqueId): void {
  const subscribers = componentSubscribers.get(mapId);

  if (!subscribers || subscribers.size === 0) {
    // No more React subscribers - clean up bus listener
    const unsub = busUnsubscribers.get(mapId);
    if (unsub) {
      unsub();
      busUnsubscribers.delete(mapId);
    }

    // Clean up all state
    drawingStore.delete(mapId);
    componentSubscribers.delete(mapId);
    subscriptionCache.delete(mapId);
    snapshotCache.delete(mapId);
    serverSnapshotCache.delete(mapId);
    drawCache.delete(mapId);
    cancelCache.delete(mapId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up drawing state when the last subscriber unsubscribes.
 */
export function getOrCreateSubscription(mapId: UniqueId): Subscription {
  // Ensure state exists BEFORE creating subscription.
  // This is critical for useSyncExternalStore consistency - the snapshot
  // must return the same value before and after subscription is registered.
  getOrCreateState(mapId);

  const subscription =
    subscriptionCache.get(mapId) ??
    ((onStoreChange: () => void) => {
      // Ensure single bus listener exists for this mapId
      ensureBusListener(mapId);

      // Get or create the subscriber set for this map instance, then add this component's callback
      let subscriberSet = componentSubscribers.get(mapId);
      if (!subscriberSet) {
        subscriberSet = new Set();
        componentSubscribers.set(mapId, subscriberSet);
      }
      subscriberSet.add(onStoreChange);

      // Return cleanup function to remove this component's subscription
      return () => {
        const currentSubscriberSet = componentSubscribers.get(mapId);
        if (currentSubscriberSet) {
          currentSubscriberSet.delete(onStoreChange);
        }

        // Clean up bus listener if this was the last React subscriber
        cleanupBusListenerIfNeeded(mapId);
      };
    });

  subscriptionCache.set(mapId, subscription);

  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given mapId.
 * Returns the current drawing state or null if no state exists.
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => DrawingState | null {
  const snapshot =
    snapshotCache.get(mapId) ??
    (() => {
      const state = drawingStore.get(mapId);
      if (!state) {
        return null;
      }
      return state;
    });

  snapshotCache.set(mapId, snapshot);

  return snapshot;
}

/**
 * Creates or retrieves a cached server snapshot function for a given mapId.
 * Server snapshots always return null since drawing state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => DrawingState | null {
  const serverSnapshot = serverSnapshotCache.get(mapId) ?? (() => null);

  serverSnapshotCache.set(mapId, serverSnapshot);

  return serverSnapshot;
}

/**
 * Creates or retrieves a cached draw function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateDraw(mapId: UniqueId): DrawFunction {
  const draw =
    drawCache.get(mapId) ??
    ((shapeType: ShapeFeatureType, options?: DrawShapeOptions) => {
      startDrawing(mapId, shapeType, options);
    });

  drawCache.set(mapId, draw);

  return draw;
}

/**
 * Creates or retrieves a cached cancel function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateCancel(mapId: UniqueId): () => void {
  const cancel = cancelCache.get(mapId) ?? (() => cancelDrawing(mapId));

  cancelCache.set(mapId, cancel);

  return cancel;
}

/**
 * Complete drawing with a feature (called by the layer component)
 */
export function completeDrawingFromLayer(
  mapId: UniqueId,
  feature: Feature,
): DisplayShape {
  return completeDrawing(mapId, feature);
}

/**
 * Cancel drawing (called by the layer component)
 */
export function cancelDrawingFromLayer(mapId: UniqueId): void {
  cancelDrawing(mapId);
}

/**
 * Update tentative feature (called by the layer component)
 */
export function updateTentativeFeatureFromLayer(
  mapId: UniqueId,
  feature: Feature | null,
): void {
  updateTentativeFeature(mapId, feature);
}

/**
 * Get the current drawing state for a mapId
 */
export function getDrawingState(mapId: UniqueId): DrawingState | null {
  return drawingStore.get(mapId) ?? null;
}

/**
 * Manually clear drawing state for a specific mapId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 */
export function clearDrawingState(mapId: UniqueId): void {
  // Cancel any active drawing first
  const state = drawingStore.get(mapId);
  if (state?.activeShapeType) {
    cancelDrawing(mapId);
  }

  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(mapId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(mapId);
  }

  // Clear all state
  drawingStore.delete(mapId);
  componentSubscribers.delete(mapId);
  subscriptionCache.delete(mapId);
  snapshotCache.delete(mapId);
  serverSnapshotCache.delete(mapId);
  drawCache.delete(mapId);
  cancelCache.delete(mapId);
}
