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

import { Broadcast } from '@accelint/bus';
import { createMapStore } from '../shared/create-map-store';
import { MapModeEvents } from '../map-mode/events';
import { getCurrentModeOwner } from '../map-mode/store';
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { ModeChangedEvent } from '../map-mode/types';
import type { CSSCursorType, MapCursorEventType } from './types';

/**
 * Default cursor value
 */
const DEFAULT_CURSOR: CSSCursorType = 'default';

/**
 * Typed event bus instance for map cursor events.
 */
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

/**
 * State shape for map cursor
 */
type MapCursorState = {
  /** Map of owner-to-cursor mappings */
  cursorOwners: Map<string, CSSCursorType>;
  /** Current active cursor */
  currentCursor: CSSCursorType | null;
  /** Current cursor owner */
  currentOwner: string | null;
};

/**
 * Actions for map cursor
 */
type MapCursorActions = {
  requestCursorChange: (cursor: CSSCursorType, owner: string) => void;
  clearCursor: (owner: string) => void;
  // Internal cached functions
  snapshot: () => CSSCursorType;
  serverSnapshot: () => CSSCursorType;
};

/**
 * Get current cursor snapshot for a given instance
 *
 * Priority order:
 * 1. Mode owner's cursor (if exists and mode is owned)
 * 2. Most recent cursor (only if currentOwner still has an entry in storage)
 * 3. Default cursor
 */
function getSnapshot(mapId: UniqueId, state: MapCursorState): CSSCursorType {
  // Priority 1: Mode owner's cursor
  const modeOwner = getCurrentModeOwner(mapId);
  if (modeOwner) {
    const modeOwnerCursor = state.cursorOwners.get(modeOwner);
    if (modeOwnerCursor) {
      return modeOwnerCursor;
    }
  }

  // Priority 2: Most recent cursor (only if owner entry still exists)
  if (state.currentCursor && state.currentOwner) {
    if (state.cursorOwners.has(state.currentOwner)) {
      return state.currentCursor;
    }
  }

  // Priority 3: Default cursor
  return DEFAULT_CURSOR;
}

/**
 * Handle cursor change request
 */
function handleCursorChangeRequest(
  mapId: UniqueId,
  state: MapCursorState,
  cursor: CSSCursorType,
  requestOwner: string,
  notify: () => void,
): void {
  const previousCursor = getSnapshot(mapId, state);

  // Skip if same cursor is already stored for this owner
  if (state.cursorOwners.get(requestOwner) === cursor) {
    return;
  }

  // Store cursor for this owner
  state.cursorOwners.set(requestOwner, cursor);

  // Check if requester is the mode owner or if mode is ownerless
  const modeOwner = getCurrentModeOwner(mapId);
  const isOwnerlessMode = !modeOwner;
  const isRequestOwnerModeOwner = requestOwner === modeOwner;

  // Grant or reject based on ownership
  if (isOwnerlessMode || isRequestOwnerModeOwner) {
    // Accept: store and apply cursor
    state.currentCursor = cursor;
    state.currentOwner = requestOwner;

    const newCursor = getSnapshot(mapId, state);

    // Emit changed event only if cursor actually changed
    if (previousCursor !== newCursor) {
      mapCursorBus.emit(MapCursorEvents.changed, {
        previousCursor,
        currentCursor: newCursor,
        owner: requestOwner,
        id: mapId,
      });
      notify();
    }
  } else {
    // Reject: stored for future auto-apply, but emit rejection event
    mapCursorBus.emit(MapCursorEvents.rejected, {
      rejectedCursor: cursor,
      rejectedOwner: requestOwner,
      currentOwner: state.currentOwner || modeOwner || 'unknown',
      reason: 'not-owner',
      id: mapId,
    });
  }
}

/**
 * Map cursor store using the map store factory
 */
const store = createMapStore<MapCursorState, MapCursorActions>({
  createDefaultState: () => ({
    cursorOwners: new Map(),
    currentCursor: null,
    currentOwner: null,
  }),
  serverDefault: {
    cursorOwners: new Map(),
    currentCursor: null,
    currentOwner: null,
  },

  setupBusListeners: (mapId, instance, notify) => {
    // Listen for cursor change requests
    const unsubRequest = mapCursorBus.on(
      MapCursorEvents.changeRequest,
      (event) => {
        const { cursor, owner: requestOwner, id } = event.payload;
        if (id !== mapId) {
          return;
        }
        handleCursorChangeRequest(
          mapId,
          instance.state,
          cursor,
          requestOwner,
          notify,
        );
      },
    );

    // Listen for mode changes
    const modeBus = Broadcast.getInstance<ModeChangedEvent>();
    const unsubModeChange = modeBus.on(MapModeEvents.changed, (event) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const previousCursor = getSnapshot(mapId, instance.state);

      // When mode changes, clear current cursor tracking (but keep owner's cursor in storage)
      if (
        event.payload.currentMode === 'default' ||
        event.payload.previousMode !== event.payload.currentMode
      ) {
        instance.state.currentCursor = null;
        instance.state.currentOwner = null;
        notify();
      }

      // Defer cursor change check until after new mode owner is registered
      queueMicrotask(() => {
        const newCursor = getSnapshot(mapId, instance.state);
        if (previousCursor !== newCursor) {
          const newModeOwner = getCurrentModeOwner(mapId) || 'system';
          mapCursorBus.emit(MapCursorEvents.changed, {
            previousCursor,
            currentCursor: newCursor,
            owner: newModeOwner,
            id: mapId,
          });
          notify();
        }
      });
    });

    return () => {
      unsubRequest();
      unsubModeChange();
    };
  },
});

// =============================================================================
// Public API (maintains backward compatibility with existing hook)
// =============================================================================

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 */
export function getOrCreateSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  return store.getSubscription(instanceId);
}

/**
 * Creates or retrieves a cached snapshot function for a given instanceId.
 */
export function getOrCreateSnapshot(instanceId: UniqueId): () => CSSCursorType {
  return store.getAction(instanceId, 'snapshot', () => {
    return () => getSnapshot(instanceId, store.getState(instanceId));
  });
}

/**
 * Creates or retrieves a cached server snapshot function for a given instanceId.
 */
export function getOrCreateServerSnapshot(
  instanceId: UniqueId,
): () => CSSCursorType {
  return store.getAction(instanceId, 'serverSnapshot', () => {
    return () => DEFAULT_CURSOR;
  });
}

/**
 * Creates or retrieves a cached requestCursorChange function for a given instanceId.
 */
export function getOrCreateRequestCursorChange(
  instanceId: UniqueId,
): (cursor: CSSCursorType, owner: string) => void {
  return store.getAction(instanceId, 'requestCursorChange', () => {
    return (cursor: CSSCursorType, owner: string) => {
      const trimmedCursor = cursor.trim();
      const trimmedOwner = owner.trim();

      if (!trimmedCursor) {
        throw new Error('requestCursorChange requires non-empty cursor');
      }
      if (!trimmedOwner) {
        throw new Error('requestCursorChange requires non-empty owner');
      }

      mapCursorBus.emit(MapCursorEvents.changeRequest, {
        cursor: trimmedCursor as CSSCursorType,
        owner: trimmedOwner,
        id: instanceId,
      });
    };
  });
}

/**
 * Creates or retrieves a cached clearCursor function for a given instanceId.
 */
export function getOrCreateClearCursor(
  instanceId: UniqueId,
): (owner: string) => void {
  return store.getAction(instanceId, 'clearCursor', () => {
    return (owner: string) => {
      const state = store.getState(instanceId);
      const hadCursor = state.cursorOwners.has(owner);
      state.cursorOwners.delete(owner);

      // If this was the current owner, clear current tracking
      if (state.currentOwner === owner) {
        state.currentCursor = null;
        state.currentOwner = null;
      }

      // Only notify if cursor changed
      if (hadCursor) {
        store.notify(instanceId);
      }
    };
  });
}

/**
 * Get the current cursor for a given instance (direct access, not reactive).
 * @internal - For internal map-toolkit use only
 */
export function getCursor(instanceId: UniqueId): CSSCursorType {
  return getSnapshot(instanceId, store.getState(instanceId));
}

/**
 * Manually clear all cursor state for a specific instanceId.
 */
export function clearCursorState(instanceId: UniqueId): void {
  store.clear(instanceId);
}

// Legacy API compatibility (for tests and existing code)
/** @deprecated Use module functions directly */
export function getOrCreateStore(id: UniqueId): {
  getSnapshot: () => CSSCursorType;
} {
  return {
    getSnapshot: () => getSnapshot(id, store.getState(id)),
  };
}

/** @deprecated Use clearCursorState instead */
export function destroyStore(id: UniqueId): void {
  clearCursorState(id);
}

/** @deprecated Use direct function calls instead */
export function getStore(
  id: UniqueId,
): { getSnapshot: () => CSSCursorType } | undefined {
  return {
    getSnapshot: () => getSnapshot(id, store.getState(id)),
  };
}
