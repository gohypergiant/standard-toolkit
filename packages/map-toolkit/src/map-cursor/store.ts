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
 * Provides type-safe event emission and listening for all map cursor state changes.
 */
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

/**
 * Type representing the state for a single map cursor instance
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
 * Store for map cursor state keyed by instanceId
 */
const cursorStore = new Map<UniqueId, MapCursorState>();

/**
 * Track React component subscribers per instanceId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per instanceId).
 * This ensures we only have one bus listener per map cursor instance, regardless of
 * how many React components subscribe to it.
 */
const busUnsubscribers = new Map<UniqueId, () => void>();

type Subscription = (onStoreChange: () => void) => () => void;
/**
 * Cache of subscription functions per instanceId to avoid recreating on every render
 */
const subscriptionCache = new Map<UniqueId, Subscription>();

/**
 * Cache of snapshot functions per instanceId to maintain referential stability
 */
const snapshotCache = new Map<UniqueId, () => CSSCursorType>();

/**
 * Cache of server snapshot functions per instanceId to maintain referential stability.
 * Server snapshots always return default cursor since cursor state is client-only.
 */
const serverSnapshotCache = new Map<UniqueId, () => CSSCursorType>();

/**
 * Cache of requestCursorChange functions per instanceId to maintain referential stability
 */
const requestCursorChangeCache = new Map<
  UniqueId,
  (cursor: CSSCursorType, owner: string) => void
>();

/**
 * Cache of clearCursor functions per instanceId to maintain referential stability
 */
const clearCursorCache = new Map<UniqueId, (owner: string) => void>();

/**
 * All state caches that need cleanup when an instance is removed
 */
const stateCaches = [
  cursorStore,
  componentSubscribers,
  subscriptionCache,
  snapshotCache,
  serverSnapshotCache,
  requestCursorChangeCache,
  clearCursorCache,
] as const;

/**
 * Clear all cached state for a given instanceId
 */
function clearAllCaches(instanceId: UniqueId): void {
  stateCaches.map((cache) => cache.delete(instanceId));
}

/**
 * Get or create cursor state for a given instanceId
 */
function getOrCreateState(instanceId: UniqueId): MapCursorState {
  if (!cursorStore.has(instanceId)) {
    cursorStore.set(instanceId, {
      cursorOwners: new Map(),
      currentCursor: null,
      currentOwner: null,
    });
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return cursorStore.get(instanceId)!;
}

/**
 * Get current cursor snapshot for a given instance (for useSyncExternalStore)
 *
 * Priority order:
 * 1. Mode owner's cursor (if exists and mode is owned)
 * 2. Most recent cursor (only if currentOwner still has an entry in storage)
 * 3. Default cursor
 */
function getSnapshot(instanceId: UniqueId): CSSCursorType {
  const state = cursorStore.get(instanceId);
  if (!state) {
    return DEFAULT_CURSOR;
  }

  // Priority 1: Mode owner's cursor
  const modeOwner = getCurrentModeOwner(instanceId);
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
 * Notify all React subscribers for a given instanceId
 */
function notifySubscribers(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);
  if (subscribers) {
    for (const onStoreChange of subscribers) {
      onStoreChange();
    }
  }
}

/**
 * Handle cursor change request for a given instance
 */
function handleCursorChangeRequest(
  instanceId: UniqueId,
  state: MapCursorState,
  cursor: CSSCursorType,
  requestOwner: string,
): void {
  const previousCursor = getSnapshot(instanceId);

  // Skip if same cursor is already stored for this owner
  if (state.cursorOwners.get(requestOwner) === cursor) {
    return;
  }

  // Store cursor for this owner
  state.cursorOwners.set(requestOwner, cursor);

  // Check if requester is the mode owner or if mode is ownerless
  const modeOwner = getCurrentModeOwner(instanceId);
  const isOwnerlessMode = !modeOwner;
  const isRequestOwnerModeOwner = requestOwner === modeOwner;

  // Grant or reject based on ownership
  if (isOwnerlessMode || isRequestOwnerModeOwner) {
    // Accept: store and apply cursor
    state.currentCursor = cursor;
    state.currentOwner = requestOwner;

    const newCursor = getSnapshot(instanceId);

    // Emit changed event only if cursor actually changed
    if (previousCursor !== newCursor) {
      mapCursorBus.emit(MapCursorEvents.changed, {
        previousCursor,
        currentCursor: newCursor,
        owner: requestOwner,
        id: instanceId,
      });
      notifySubscribers(instanceId);
    }
  } else {
    // Reject: stored for future auto-apply, but emit rejection event
    mapCursorBus.emit(MapCursorEvents.rejected, {
      rejectedCursor: cursor,
      rejectedOwner: requestOwner,
      currentOwner: state.currentOwner || modeOwner || 'unknown',
      reason: 'not-owner',
      id: instanceId,
    });
  }
}

/**
 * Ensures a single bus listener exists for the given instanceId.
 * All React subscribers will be notified via fan-out when the bus events fire.
 * This prevents creating N bus listeners for N React components.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 */
function ensureBusListener(instanceId: UniqueId): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const state = getOrCreateState(instanceId);

  // Listen for cursor change requests
  const unsubRequest = mapCursorBus.on(
    MapCursorEvents.changeRequest,
    (event) => {
      const { cursor, owner: requestOwner, id } = event.payload;
      if (id !== instanceId) {
        return;
      }
      handleCursorChangeRequest(instanceId, state, cursor, requestOwner);
    },
  );

  // Listen for mode changes
  const modeBus = Broadcast.getInstance<ModeChangedEvent>();
  const unsubModeChange = modeBus.on(MapModeEvents.changed, (event) => {
    if (event.payload.id !== instanceId) {
      return;
    }

    const previousCursor = getSnapshot(instanceId);

    // When mode changes, clear current cursor tracking (but keep owner's cursor in storage)
    // This allows the cursor to fall back to state-based default until a new owner sets it
    if (
      event.payload.currentMode === 'default' ||
      event.payload.previousMode !== event.payload.currentMode
    ) {
      state.currentCursor = null;
      state.currentOwner = null;
      notifySubscribers(instanceId);
    }

    // Defer cursor change check until after new mode owner is registered
    queueMicrotask(() => {
      const newCursor = getSnapshot(instanceId);
      if (previousCursor !== newCursor) {
        const newModeOwner = getCurrentModeOwner(instanceId) || 'system';
        mapCursorBus.emit(MapCursorEvents.changed, {
          previousCursor,
          currentCursor: newCursor,
          owner: newModeOwner,
          id: instanceId,
        });
        notifySubscribers(instanceId);
      }
    });
  });

  // Store composite cleanup function
  busUnsubscribers.set(instanceId, () => {
    unsubRequest();
    unsubModeChange();
  });
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 */
function cleanupBusListenerIfNeeded(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);

  if (!subscribers || subscribers.size === 0) {
    // No more React subscribers - clean up bus listener
    const unsub = busUnsubscribers.get(instanceId);
    if (unsub) {
      unsub();
      busUnsubscribers.delete(instanceId);
    }

    // Clean up all state
    clearAllCaches(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up cursor state when the last subscriber unsubscribes.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 * @returns A subscription function for useSyncExternalStore
 */
export function getOrCreateSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  const subscription =
    subscriptionCache.get(instanceId) ??
    ((onStoreChange: () => void) => {
      // Ensure state exists
      getOrCreateState(instanceId);

      // Ensure single bus listener exists for this instanceId
      ensureBusListener(instanceId);

      // Get or create the subscriber set for this map instance, then add this component's callback
      let subscriberSet = componentSubscribers.get(instanceId);
      if (!subscriberSet) {
        subscriberSet = new Set();
        componentSubscribers.set(instanceId, subscriberSet);
      }
      subscriberSet.add(onStoreChange);

      // Return cleanup function to remove this component's subscription
      return () => {
        const currentSubscriberSet = componentSubscribers.get(instanceId);
        if (currentSubscriberSet) {
          currentSubscriberSet.delete(onStoreChange);
        }

        // Clean up bus listener if this was the last React subscriber
        cleanupBusListenerIfNeeded(instanceId);
      };
    });

  subscriptionCache.set(instanceId, subscription);

  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given instanceId.
 * The cursor returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 * @returns A snapshot function for useSyncExternalStore
 */
export function getOrCreateSnapshot(instanceId: UniqueId): () => CSSCursorType {
  const snapshot =
    snapshotCache.get(instanceId) ?? (() => getSnapshot(instanceId));

  snapshotCache.set(instanceId, snapshot);

  return snapshot;
}

/**
 * Creates or retrieves a cached server snapshot function for a given instanceId.
 * Server snapshots always return the default cursor since cursor state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 * @returns A server snapshot function for useSyncExternalStore
 */
export function getOrCreateServerSnapshot(
  instanceId: UniqueId,
): () => CSSCursorType {
  const serverSnapshot =
    serverSnapshotCache.get(instanceId) ?? (() => DEFAULT_CURSOR);

  serverSnapshotCache.set(instanceId, serverSnapshot);

  return serverSnapshot;
}

/**
 * Creates or retrieves a cached requestCursorChange function for a given instanceId.
 * This maintains referential stability for the function reference.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 * @returns A requestCursorChange function for this instance
 */
export function getOrCreateRequestCursorChange(
  instanceId: UniqueId,
): (cursor: CSSCursorType, owner: string) => void {
  const requestCursorChange =
    requestCursorChangeCache.get(instanceId) ??
    ((cursor: CSSCursorType, owner: string) => {
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
    });

  requestCursorChangeCache.set(instanceId, requestCursorChange);

  return requestCursorChange;
}

/**
 * Creates or retrieves a cached clearCursor function for a given instanceId.
 * This maintains referential stability for the function reference.
 *
 * @param instanceId - The unique identifier for the map cursor instance
 * @returns A clearCursor function for this instance
 */
export function getOrCreateClearCursor(
  instanceId: UniqueId,
): (owner: string) => void {
  const clearCursor =
    clearCursorCache.get(instanceId) ??
    ((owner: string) => {
      const state = cursorStore.get(instanceId);
      if (!state) {
        return;
      }

      const hadCursor = state.cursorOwners.has(owner);
      state.cursorOwners.delete(owner);

      // If this was the current owner, clear current tracking
      if (state.currentOwner === owner) {
        state.currentCursor = null;
        state.currentOwner = null;
      }

      // Only notify if cursor changed
      if (hadCursor) {
        notifySubscribers(instanceId);
      }
    });

  clearCursorCache.set(instanceId, clearCursor);

  return clearCursor;
}

/**
 * Get the current cursor for a given instance (direct access, not reactive).
 * @internal - For internal map-toolkit use only
 *
 * @param instanceId - The unique identifier for the map instance
 * @returns The current cursor
 */
export function getCursor(instanceId: UniqueId): CSSCursorType {
  return getSnapshot(instanceId);
}

/**
 * Manually clear all cursor state for a specific instanceId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param instanceId - The unique identifier for the map cursor instance to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearCursorState('my-map-instance');
 * ```
 */
export function clearCursorState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(instanceId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  clearAllCaches(instanceId);
}

// Legacy API compatibility (for tests and existing code)
/** @deprecated Use module functions directly */
export function getOrCreateStore(id: UniqueId): {
  getSnapshot: () => CSSCursorType;
} {
  return {
    getSnapshot: () => getSnapshot(id),
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
  // Always return a store object since we don't track "existence" anymore
  return {
    getSnapshot: () => getSnapshot(id),
  };
}
