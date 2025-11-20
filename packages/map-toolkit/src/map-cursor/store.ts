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
import { MapEvents, type MapEventType } from '@/deckgl';
import { MapModeEvents } from '../map-mode/events';
import { getStore as getModeStore } from '../map-mode/store';
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { ModeChangedEvent } from '../map-mode/types';
import type {
  CSSCursorType,
  CursorDefaults,
  CursorState,
  MapCursorEventType,
} from './types';

/**
 * Default cursor values based on map interaction state
 */
const DEFAULT_CURSORS: CursorDefaults = {
  /** Default cursor when not interacting */
  default: 'default' as CSSCursorType,
  /** Cursor when hovering over interactive elements */
  hover: 'pointer' as CSSCursorType,
  /** Cursor when dragging the map */
  drag: 'grabbing' as CSSCursorType,
} as const;

/**
 * Typed event bus instance for map cursor events.
 * Provides type-safe event emission and listening for all map cursor state changes.
 */
const bus = Broadcast.getInstance<MapCursorEventType | MapEventType>();

/**
 * Module-level state storage
 */

/** Map of owner-to-cursor mappings per instance */
const cursorOwners = new Map<UniqueId, Map<string, CSSCursorType>>();

/** Current cursor per instance */
const currentCursors = new Map<UniqueId, CSSCursorType | null>();

/** Current owner per instance */
const currentOwners = new Map<UniqueId, string | null>();

/** Cursor state (default/hover/drag) per instance */
const cursorStates = new Map<UniqueId, CursorState>();

/** React component subscribers per instance (for fan-out notifications) */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/** Cache of bus unsubscribe functions (1 per instance) */
const busUnsubscribers = new Map<UniqueId, Array<() => void>>();

/** Cache of subscription functions per instance */
const subscriptionCache = new Map<
  UniqueId,
  (onStoreChange: () => void) => () => void
>();

/** Cache of snapshot functions per instance */
const snapshotCache = new Map<UniqueId, () => CSSCursorType>();

/**
 * Get current cursor snapshot for a given instance (for useSyncExternalStore)
 *
 * Priority order:
 * 1. Mode owner's cursor (if exists and mode is owned)
 * 2. Most recent cursor (only if currentOwner still has an entry in storage)
 * 3. Default cursor based on state
 */
function getSnapshot(instanceId: UniqueId): CSSCursorType {
  // Priority 1: Mode owner's cursor
  const modeStore = getModeStore(instanceId);
  if (modeStore) {
    const modeOwner = modeStore.getCurrentModeOwner();
    if (modeOwner) {
      const owners = cursorOwners.get(instanceId);
      const modeOwnerCursor = owners?.get(modeOwner);
      if (modeOwnerCursor) {
        return modeOwnerCursor;
      }
    }
  }

  // Priority 2: Most recent cursor (only if owner entry still exists)
  const currentCursor = currentCursors.get(instanceId);
  const currentOwner = currentOwners.get(instanceId);
  if (currentCursor && currentOwner) {
    const owners = cursorOwners.get(instanceId);
    if (owners?.has(currentOwner)) {
      return currentCursor;
    }
  }

  // Priority 3: Default cursor based on state
  const state = cursorStates.get(instanceId) ?? 'default';
  return DEFAULT_CURSORS[state];
}

/**
 * Notify all subscribers for a given instance
 */
function notify(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);
  if (subscribers) {
    for (const listener of subscribers) {
      listener();
    }
  }
}

/**
 * Handle cursor change request for a given instance
 */
function handleCursorChangeRequest(
  instanceId: UniqueId,
  cursor: CSSCursorType,
  requestOwner: string,
): void {
  // Store the cursor for this owner
  let owners = cursorOwners.get(instanceId);
  if (!owners) {
    owners = new Map();
    cursorOwners.set(instanceId, owners);
  }

  const previousCursor = getSnapshot(instanceId);

  // Skip if same cursor is already stored for this owner
  if (owners.get(requestOwner) === cursor) {
    return;
  }

  // Store cursor for this owner
  owners.set(requestOwner, cursor);

  // Check if requester is the mode owner or if mode is ownerless
  const modeStore = getModeStore(instanceId);
  const modeOwner = modeStore?.getCurrentModeOwner();
  const currentMode = modeStore?.getSnapshot();
  const isOwnerlessMode = !modeOwner || currentMode === 'default';
  const isRequestOwnerModeOwner = requestOwner === modeOwner;

  // Grant or reject based on ownership
  if (isOwnerlessMode || isRequestOwnerModeOwner) {
    // Accept: store and apply cursor
    currentCursors.set(instanceId, cursor);
    currentOwners.set(instanceId, requestOwner);

    const newCursor = getSnapshot(instanceId);

    // Emit changed event only if cursor actually changed
    if (previousCursor !== newCursor) {
      bus.emit(MapCursorEvents.changed, {
        previousCursor,
        currentCursor: newCursor,
        owner: requestOwner,
        id: instanceId,
      });
      notify(instanceId);
    }
  } else {
    // Reject: stored for future auto-apply, but emit rejection event
    const currentOwner = currentOwners.get(instanceId);
    bus.emit(MapCursorEvents.rejected, {
      rejectedCursor: cursor,
      rejectedOwner: requestOwner,
      currentOwner: currentOwner || modeOwner || 'unknown',
      reason: 'not-owner',
      id: instanceId,
    });
  }
}

/**
 * Handle cursor state change (default/hover/drag)
 */
function handleCursorStateChange(
  instanceId: UniqueId,
  state: CursorState,
): void {
  const currentState = cursorStates.get(instanceId) ?? 'default';
  if (currentState !== state) {
    const previousCursor = getSnapshot(instanceId);
    cursorStates.set(instanceId, state);
    const newCursor = getSnapshot(instanceId);

    if (previousCursor !== newCursor) {
      bus.emit(MapCursorEvents.changeState, {
        state,
        id: instanceId,
      });
      notify(instanceId);
    }
  }
}

/**
 * Ensures a single set of bus listeners exists for the given instance.
 * All React subscribers will be notified via fan-out when bus events fire.
 * This prevents creating N bus listeners for N React components.
 */
function ensureBusListeners(instanceId: UniqueId): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const unsubs: Array<() => void> = [];

  // Listen for cursor change requests
  const unsubRequest = bus.on(MapCursorEvents.changeRequest, (event) => {
    const { cursor, owner: requestOwner, id } = event.payload;
    if (id !== instanceId) {
      return;
    }
    handleCursorChangeRequest(instanceId, cursor, requestOwner);
  });
  unsubs.push(unsubRequest);

  // Listen for mode changes
  const modeBus = Broadcast.getInstance<ModeChangedEvent>();
  const unsubModeChange = modeBus.on(MapModeEvents.changed, (event) => {
    if (event.payload.id !== instanceId) {
      return;
    }

    const previousCursor = getSnapshot(instanceId);

    // When returning to default mode, clear the previous mode owner's cursor
    if (event.payload.currentMode === 'default') {
      const currentOwner = currentOwners.get(instanceId);
      if (currentOwner) {
        const owners = cursorOwners.get(instanceId);
        owners?.delete(currentOwner);
      }
      currentCursors.set(instanceId, null);
      currentOwners.set(instanceId, null);
      notify(instanceId);
    }

    // Defer cursor change check until after new mode owner is registered
    queueMicrotask(() => {
      const newCursor = getSnapshot(instanceId);
      if (previousCursor !== newCursor) {
        const modeStore = getModeStore(instanceId);
        const newModeOwner = modeStore?.getCurrentModeOwner() || 'system';
        bus.emit(MapCursorEvents.changed, {
          previousCursor,
          currentCursor: newCursor,
          owner: newModeOwner,
          id: instanceId,
        });
        notify(instanceId);
      }
    });
  });
  unsubs.push(unsubModeChange);

  // Listen for map hover events
  const unsubHover = bus.on(MapEvents.hover, (event) => {
    const {
      id,
      info: { picked },
    } = event.payload;
    if (id !== instanceId) {
      return;
    }
    handleCursorStateChange(instanceId, picked ? 'hover' : 'default');
  });
  unsubs.push(unsubHover);

  // Listen for map click events
  const unsubClick = bus.on(MapEvents.click, (event) => {
    const { id } = event.payload;
    if (id !== instanceId) {
      return;
    }
    handleCursorStateChange(instanceId, 'default');
  });
  unsubs.push(unsubClick);

  // Listen for map drag events
  const unsubDrag = bus.on(MapEvents.drag, (event) => {
    const { id } = event.payload;
    if (id !== instanceId) {
      return;
    }
    handleCursorStateChange(instanceId, 'drag');
  });
  unsubs.push(unsubDrag);

  busUnsubscribers.set(instanceId, unsubs);
}

/**
 * Cleans up the bus listeners if no React subscribers remain.
 */
function cleanupBusListenersIfNeeded(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);

  if (!subscribers || subscribers.size === 0) {
    // No more React subscribers - clean up bus listeners
    const unsubs = busUnsubscribers.get(instanceId);
    if (unsubs) {
      for (const unsub of unsubs) {
        unsub();
      }
      busUnsubscribers.delete(instanceId);
    }

    // Clean up all state
    cursorOwners.delete(instanceId);
    currentCursors.delete(instanceId);
    currentOwners.delete(instanceId);
    cursorStates.delete(instanceId);
    componentSubscribers.delete(instanceId);
    subscriptionCache.delete(instanceId);
    snapshotCache.delete(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instance.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up cursor state when the last subscriber unsubscribes.
 */
function getOrCreateSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  const subscription =
    subscriptionCache.get(instanceId) ??
    ((onStoreChange: () => void) => {
      // Ensure single bus listeners exist for this instance
      ensureBusListeners(instanceId);

      // Get or create the subscriber set for this map instance
      let subscriberSet = componentSubscribers.get(instanceId);
      if (!subscriberSet) {
        subscriberSet = new Set();
        componentSubscribers.set(instanceId, subscriberSet);
      }
      subscriberSet.add(onStoreChange);

      // Return cleanup function
      return () => {
        const currentSubscriberSet = componentSubscribers.get(instanceId);
        if (currentSubscriberSet) {
          currentSubscriberSet.delete(onStoreChange);
        }
        cleanupBusListenersIfNeeded(instanceId);
      };
    });

  subscriptionCache.set(instanceId, subscription);
  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given instance.
 */
function getOrCreateSnapshotGetter(instanceId: UniqueId): () => CSSCursorType {
  const snapshot =
    snapshotCache.get(instanceId) ?? (() => getSnapshot(instanceId));

  snapshotCache.set(instanceId, snapshot);
  return snapshot;
}

/**
 * Request a cursor change for a given map instance.
 *
 * @param instanceId - The unique identifier for the map instance
 * @param cursor - The desired CSS cursor type
 * @param owner - Unique identifier of the component requesting the change
 */
export function requestCursorChange(
  instanceId: UniqueId,
  cursor: CSSCursorType,
  owner: string,
): void {
  const trimmedCursor = cursor.trim();
  const trimmedOwner = owner.trim();

  if (!trimmedCursor) {
    throw new Error('requestCursorChange requires non-empty cursor');
  }
  if (!trimmedOwner) {
    throw new Error('requestCursorChange requires non-empty owner');
  }

  bus.emit(MapCursorEvents.changeRequest, {
    cursor: trimmedCursor as CSSCursorType,
    owner: trimmedOwner,
    id: instanceId,
  });
}

/**
 * Clear cursor for a specific owner in a given map instance.
 *
 * @param instanceId - The unique identifier for the map instance
 * @param owner - The owner whose cursor should be cleared
 */
export function clearCursor(instanceId: UniqueId, owner: string): void {
  const owners = cursorOwners.get(instanceId);
  if (!owners) {
    return;
  }

  const hadCursor = owners.has(owner);
  owners.delete(owner);

  // If this was the current owner, clear current tracking
  const currentOwner = currentOwners.get(instanceId);
  if (currentOwner === owner) {
    currentCursors.set(instanceId, null);
    currentOwners.set(instanceId, null);
  }

  // Only notify if cursor changed
  if (hadCursor) {
    notify(instanceId);
  }
}

/**
 * Get the subscription function for useSyncExternalStore.
 *
 * @param instanceId - The unique identifier for the map instance
 * @returns A subscription function
 */
export function getSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  return getOrCreateSubscription(instanceId);
}

/**
 * Get the snapshot getter function for useSyncExternalStore.
 *
 * @param instanceId - The unique identifier for the map instance
 * @returns A function that returns the current cursor
 */
export function getSnapshotGetter(instanceId: UniqueId): () => CSSCursorType {
  return getOrCreateSnapshotGetter(instanceId);
}

/**
 * Get the current cursor for a given instance (direct access, not reactive).
 *
 * @param instanceId - The unique identifier for the map instance
 * @returns The current cursor
 */
export function getCursor(instanceId: UniqueId): CSSCursorType {
  return getSnapshot(instanceId);
}

/**
 * Manually clear all cursor state for a specific instance.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 *
 * @param instanceId - The unique identifier for the map instance
 */
export function clearCursorState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsubs = busUnsubscribers.get(instanceId);
  if (unsubs) {
    for (const unsub of unsubs) {
      unsub();
    }
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  cursorOwners.delete(instanceId);
  currentCursors.delete(instanceId);
  currentOwners.delete(instanceId);
  cursorStates.delete(instanceId);
  componentSubscribers.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
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
