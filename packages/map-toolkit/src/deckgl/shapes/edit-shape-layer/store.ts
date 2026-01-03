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
import { getLogger } from '@accelint/logger';
import { MapEvents } from '../../base-map/events';
import {
  isCircleShape,
  isEllipseShape,
  isPointShape,
  isRectangleShape,
} from '../shared/types';
import {
  releaseModeAndCursor,
  requestCursorChange,
  requestModeChange,
} from '../shared/utils/mode-utils';
import {
  EDIT_CURSOR_MAP,
  EDIT_SHAPE_LAYER_ID,
  EDIT_SHAPE_MODE,
} from './constants';
import { EditShapeEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapEventType } from '../../base-map/types';
import type { Shape } from '../shared/types';
import type {
  EditShapeEvent,
  ShapeEditCanceledEvent,
  ShapeEditingEvent,
  ShapeUpdatedEvent,
} from './events';
import type {
  EditFunction,
  EditingState,
  EditMode,
  EditShapeOptions,
  Subscription,
} from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[EditShapeLayer]',
  pretty: true,
});

/**
 * Typed event bus instances
 */
const editShapeBus = Broadcast.getInstance<EditShapeEvent>();
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
 * All state caches that need cleanup when a mapId is removed.
 * Using a const array enables consistent cleanup across all functions.
 */
const stateCaches = [
  editingStore,
  componentSubscribers,
  subscriptionCache,
  snapshotCache,
  serverSnapshotCache,
  editCache,
  saveCache,
  cancelCache,
] as const;

/**
 * Clear all cached state for a given mapId
 */
function clearAllCaches(mapId: UniqueId): void {
  for (const cache of stateCaches) {
    cache.delete(mapId);
  }
}

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
function getEditModeForShape(shape: Shape): EditMode {
  if (isPointShape(shape)) {
    return 'translate';
  }
  if (isCircleShape(shape)) {
    return 'circle-transform';
  }
  if (isEllipseShape(shape) || isRectangleShape(shape)) {
    // Ellipses and rectangles use bounding-transform (no vertex editing)
    // for scale/rotate/translate via bounding box handles
    return 'bounding-transform';
  }
  // Polygons and LineStrings get vertex-transform for combined
  // vertex editing + scale/rotate/translate
  return 'vertex-transform';
}

/**
 * Start editing a shape
 */
function startEditing(
  mapId: UniqueId,
  shape: Shape,
  options?: EditShapeOptions,
): void {
  // Prevent editing locked shapes
  if (shape.locked) {
    logger.warn(`Cannot edit locked shape: "${shape.name}"`);
    return;
  }

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

  // Request map mode and cursor
  requestModeChange(mapId, EDIT_SHAPE_MODE, EDIT_SHAPE_LAYER_ID);
  const cursor = EDIT_CURSOR_MAP[editMode];
  requestCursorChange(mapId, cursor, EDIT_SHAPE_LAYER_ID);

  // Disable map panning during editing to prevent accidental map movement
  mapEventBus.emit(MapEvents.disablePan, { id: mapId });

  // Emit editing started event
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  editShapeBus.emit(EditShapeEvents.editing, {
    shape,
    mapId,
  } as unknown as ShapeEditingEvent['payload']);

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
function saveEditing(mapId: UniqueId): Shape | null {
  const state = getOrCreateState(mapId);

  if (!(state.editingShape && state.featureBeingEdited)) {
    return null;
  }

  const originalShape = state.editingShape;
  const updatedFeature = state.featureBeingEdited;

  // Create updated shape with new geometry.
  // Type assertion needed because TypeScript can't preserve the discriminated
  // union type through the spread. The shapeType from originalShape is preserved
  // at runtime, maintaining the correct shape variant.
  const updatedShape = {
    ...originalShape,
    feature: {
      ...updatedFeature,
      properties: {
        ...originalShape.feature.properties,
        ...updatedFeature.properties,
      },
    },
    lastUpdated: Date.now(),
  } as Shape;

  // Reset state with new object reference
  updateState(mapId, {
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is complete
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit shape updated event
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  editShapeBus.emit(EditShapeEvents.updated, {
    shape: updatedShape,
    mapId,
  } as unknown as ShapeUpdatedEvent['payload']);

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

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is canceled
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit canceled event with original shape
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  editShapeBus.emit(EditShapeEvents.canceled, {
    shape: originalShape,
    mapId,
  } as unknown as ShapeEditCanceledEvent['payload']);

  notifySubscribers(mapId);
}

/**
 * Cleans up state if no React subscribers remain.
 *
 * Note: EditShapeLayer is "neutral" regarding mode change authorization.
 * It doesn't auto-cancel or reject mode changes - those decisions are
 * left to UI components that can prompt the user (e.g., "You have unsaved
 * changes. Switch to draw mode?"). The edit layer still EMITS mode change
 * requests (when starting/ending edit), but doesn't LISTEN for authorization
 * requests from other components.
 */
function cleanupIfNoSubscribers(mapId: UniqueId): void {
  const subscribers = componentSubscribers.get(mapId);

  if (!subscribers || subscribers.size === 0) {
    // No more React subscribers - clean up all state caches
    clearAllCaches(mapId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given mapId.
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

        // Clean up state if this was the last React subscriber
        cleanupIfNoSubscribers(mapId);
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
    ((shape: Shape, options?: EditShapeOptions) => {
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

  // Clear all state caches
  clearAllCaches(mapId);
}
