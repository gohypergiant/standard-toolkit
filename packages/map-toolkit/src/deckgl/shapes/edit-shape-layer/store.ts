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
import { ShapeFeatureType } from '../shared/types';
import {
  EDIT_CURSOR_MAP,
  EDIT_SHAPE_LAYER_ID,
  EDIT_SHAPE_MODE,
} from './constants';
import { EditShapeEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapCursorEventType } from '../../../map-cursor/types';
import type { MapModeEventType } from '../../../map-mode/types';
import type { MapEventType } from '../../base-map/types';
import type { DisplayShape } from '../shared/types';
import type { EditShapeEvent } from './events';
import type {
  EditFunction,
  EditingState,
  EditMode,
  EditShapeOptions,
  Subscription,
} from './types';

/**
 * Typed event bus instances
 */
const editShapeBus = Broadcast.getInstance<EditShapeEvent>();
const mapModeBus = Broadcast.getInstance<MapModeEventType>();
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();
const mapEventBus = Broadcast.getInstance<MapEventType>();

/**
 * Default editing state
 */
const DEFAULT_EDITING_STATE: EditingState = {
  editingShape: null,
  editMode: 'view',
  featureBeingEdited: null,
};

/**
 * Store for editing state keyed by mapId
 */
const editingStore = new Map<UniqueId, EditingState>();

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
const snapshotCache = new Map<UniqueId, () => EditingState | null>();

/**
 * Cache of server snapshot functions per mapId to maintain referential stability.
 * Server snapshots always return null since editing state is client-only.
 */
const serverSnapshotCache = new Map<UniqueId, () => EditingState | null>();

/**
 * Cache of edit functions per mapId to maintain referential stability
 */
const editCache = new Map<UniqueId, EditFunction>();

/**
 * Cache of save functions per mapId to maintain referential stability
 */
const saveCache = new Map<UniqueId, () => void>();

/**
 * Cache of cancel functions per mapId to maintain referential stability
 */
const cancelCache = new Map<UniqueId, () => void>();

/**
 * Get or create editing state for a given mapId
 */
function getOrCreateState(mapId: UniqueId): EditingState {
  if (!editingStore.has(mapId)) {
    editingStore.set(mapId, { ...DEFAULT_EDITING_STATE });
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return editingStore.get(mapId)!;
}

/**
 * Update state with a new object reference for useSyncExternalStore
 * This ensures React detects changes via Object.is comparison
 */
function updateState(mapId: UniqueId, updates: Partial<EditingState>): void {
  const currentState = getOrCreateState(mapId);
  const newState: EditingState = {
    ...currentState,
    ...updates,
  };
  editingStore.set(mapId, newState);
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
 * Determine the appropriate edit mode for a shape type
 */
function getEditModeForShape(shape: DisplayShape): EditMode {
  if (shape.shapeType === ShapeFeatureType.Circle) {
    return 'resize-circle';
  }
  return 'modify';
}

/**
 * Start editing a shape
 */
function startEditing(
  mapId: UniqueId,
  shape: DisplayShape,
  options?: EditShapeOptions,
): void {
  const state = getOrCreateState(mapId);

  // Already editing - cancel first
  if (state.editingShape) {
    cancelEditing(mapId);
  }

  // Determine edit mode (can be overridden via options)
  const editMode = options?.mode ?? getEditModeForShape(shape);

  // Update state with new object reference
  updateState(mapId, {
    editingShape: shape,
    editMode,
    featureBeingEdited: shape.feature,
  });

  // Request map mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: EDIT_SHAPE_MODE,
    owner: EDIT_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Request cursor
  const cursor = EDIT_CURSOR_MAP[editMode];
  mapCursorBus.emit(MapCursorEvents.changeRequest, {
    cursor,
    owner: EDIT_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Disable map panning during editing to prevent accidental map movement
  mapEventBus.emit(MapEvents.disablePan, { id: mapId });

  // Emit editing started event
  // biome-ignore lint/suspicious/noExplicitAny: Bus type constraint workaround for GeoJSON Feature
  (editShapeBus as any).emit(EditShapeEvents.editing, {
    shape,
    mapId,
  });

  notifySubscribers(mapId);
}

/**
 * Update the feature being edited (called during drag operations)
 */
function updateFeature(mapId: UniqueId, feature: Feature): void {
  updateState(mapId, { featureBeingEdited: feature });
  notifySubscribers(mapId);
}

/**
 * Save editing and create updated shape
 */
function saveEditing(mapId: UniqueId): DisplayShape | null {
  const state = getOrCreateState(mapId);

  if (!(state.editingShape && state.featureBeingEdited)) {
    return null;
  }

  const originalShape = state.editingShape;
  const updatedFeature = state.featureBeingEdited;

  // Create updated shape with new geometry
  const updatedShape: DisplayShape = {
    ...originalShape,
    feature: {
      ...updatedFeature,
      properties: {
        ...originalShape.feature.properties,
        ...updatedFeature.properties,
      },
    },
    lastUpdated: Date.now(),
  };

  // Reset state with new object reference
  updateState(mapId, {
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: 'default',
    owner: EDIT_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Clear cursor using the store function directly
  getOrCreateClearCursor(mapId)(EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is complete
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit shape updated event
  // biome-ignore lint/suspicious/noExplicitAny: Bus type constraint workaround for GeoJSON Feature
  (editShapeBus as any).emit(EditShapeEvents.updated, {
    shape: updatedShape,
    mapId,
  });

  notifySubscribers(mapId);

  return updatedShape;
}

/**
 * Cancel the current editing operation
 */
function cancelEditing(mapId: UniqueId): void {
  const state = getOrCreateState(mapId);

  if (!state.editingShape) {
    return; // Nothing to cancel
  }

  const originalShape = state.editingShape;

  // Reset state with new object reference
  updateState(mapId, {
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode: 'default',
    owner: EDIT_SHAPE_LAYER_ID,
    id: mapId,
  });

  // Clear cursor using the store function directly
  getOrCreateClearCursor(mapId)(EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is canceled
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit canceled event with original shape
  // biome-ignore lint/suspicious/noExplicitAny: Bus type constraint workaround for GeoJSON Feature
  (editShapeBus as any).emit(EditShapeEvents.canceled, {
    shape: originalShape,
    mapId,
  });

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

  // Listen for mode authorization requests - REJECT when editing (protected mode)
  const unsubAuth = mapModeBus.on(
    MapModeEvents.changeAuthorization,
    (event) => {
      const { authId, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== mapId) {
        return;
      }

      // Get current state at event time (not registration time)
      const currentState = editingStore.get(mapId);

      // If we're actively editing, reject the mode change request
      if (currentState?.editingShape) {
        mapModeBus.emit(MapModeEvents.changeDecision, {
          authId,
          approved: false,
          owner: EDIT_SHAPE_LAYER_ID,
          reason: 'Editing in progress - save or cancel editing first',
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
    editingStore.delete(mapId);
    componentSubscribers.delete(mapId);
    subscriptionCache.delete(mapId);
    snapshotCache.delete(mapId);
    serverSnapshotCache.delete(mapId);
    editCache.delete(mapId);
    saveCache.delete(mapId);
    cancelCache.delete(mapId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up editing state when the last subscriber unsubscribes.
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
 * Returns the current editing state or null if no state exists.
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => EditingState | null {
  const snapshot =
    snapshotCache.get(mapId) ??
    (() => {
      const state = editingStore.get(mapId);
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
 * Server snapshots always return null since editing state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => EditingState | null {
  const serverSnapshot = serverSnapshotCache.get(mapId) ?? (() => null);

  serverSnapshotCache.set(mapId, serverSnapshot);

  return serverSnapshot;
}

/**
 * Creates or retrieves a cached edit function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateEdit(mapId: UniqueId): EditFunction {
  const edit =
    editCache.get(mapId) ??
    ((shape: DisplayShape, options?: EditShapeOptions) => {
      startEditing(mapId, shape, options);
    });

  editCache.set(mapId, edit);

  return edit;
}

/**
 * Creates or retrieves a cached save function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateSave(mapId: UniqueId): () => void {
  const save = saveCache.get(mapId) ?? (() => saveEditing(mapId));

  saveCache.set(mapId, save);

  return save;
}

/**
 * Creates or retrieves a cached cancel function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateCancel(mapId: UniqueId): () => void {
  const cancel = cancelCache.get(mapId) ?? (() => cancelEditing(mapId));

  cancelCache.set(mapId, cancel);

  return cancel;
}

/**
 * Update feature from the layer component (called during edit operations)
 */
export function updateFeatureFromLayer(
  mapId: UniqueId,
  feature: Feature,
): void {
  updateFeature(mapId, feature);
}

/**
 * Cancel editing (called by the layer component on ESC)
 */
export function cancelEditingFromLayer(mapId: UniqueId): void {
  cancelEditing(mapId);
}

/**
 * Get the current editing state for a mapId
 */
export function getEditingState(mapId: UniqueId): EditingState | null {
  return editingStore.get(mapId) ?? null;
}

/**
 * Manually clear editing state for a specific mapId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 */
export function clearEditingState(mapId: UniqueId): void {
  // Cancel any active editing first
  const state = editingStore.get(mapId);
  if (state?.editingShape) {
    cancelEditing(mapId);
  }

  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(mapId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(mapId);
  }

  // Clear all state
  editingStore.delete(mapId);
  componentSubscribers.delete(mapId);
  subscriptionCache.delete(mapId);
  snapshotCache.delete(mapId);
  serverSnapshotCache.delete(mapId);
  editCache.delete(mapId);
  saveCache.delete(mapId);
  cancelCache.delete(mapId);
}
