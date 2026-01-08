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

/**
 * Shape Selection Store
 *
 * This module provides a store pattern for managing shape selection state,
 * designed to work with React's `useSyncExternalStore` hook.
 *
 * ## Architecture
 *
 * The store uses a fan-out pattern similar to `map-cursor/store.ts` and `map-mode/store.ts`:
 * - **1 bus listener per mapId** - Regardless of how many React components subscribe
 * - **N React subscribers** - Each component gets notified via `useSyncExternalStore`
 * - **Automatic cleanup** - Bus listeners are removed when the last subscriber unmounts
 *
 * ## Why This Pattern?
 *
 * Without this pattern, using `useOn` directly in each React component would
 * create N bus listeners for N components subscribing to the same events.
 * The fan-out pattern ensures exactly 1 bus listener per mapId, regardless
 * of how many React components need the state. This also provides proper
 * cleanup semantics that prevent listener accumulation during HMR.
 *
 * ## Usage
 *
 * This module is internal to `useShapeSelection`. Use the hook instead:
 *
 * ```tsx
 * import { useShapeSelection } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * const { selectedId, setSelectedId, clearSelection } = useShapeSelection(mapId);
 * ```
 *
 * @module
 */

import { Broadcast } from '@accelint/bus';
import { MapEvents } from '../../base-map/events';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import type { UniqueId } from '@accelint/core';
import type { MapClickEvent, MapEventType } from '../../base-map/types';
import type { ShapeId, Subscription } from '../shared/types';

/**
 * Typed event bus instances for shape and map events
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();
const mapBus = Broadcast.getInstance<MapEventType>();

/**
 * Type representing the state for a single shape selection instance
 */
type ShapeSelectionState = {
  /** Currently selected shape ID, or undefined if nothing selected */
  selectedId: ShapeId | undefined;
};

/**
 * Store for shape selection state keyed by mapId
 */
const selectionStore = new Map<UniqueId, ShapeSelectionState>();

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
const snapshotCache = new Map<UniqueId, () => ShapeId | undefined>();

/**
 * Cache of server snapshot functions per mapId to maintain referential stability.
 * Server snapshots always return undefined since selection state is client-only.
 */
const serverSnapshotCache = new Map<UniqueId, () => ShapeId | undefined>();

/**
 * Cache of setSelectedId functions per mapId to maintain referential stability
 */
const setSelectedIdCache = new Map<
  UniqueId,
  (id: ShapeId | undefined) => void
>();

/**
 * Cache of clearSelection functions per mapId to maintain referential stability
 */
const clearSelectionCache = new Map<UniqueId, () => void>();

/**
 * All state caches that need cleanup when an instance is removed
 */
const stateCaches = [
  selectionStore,
  componentSubscribers,
  subscriptionCache,
  snapshotCache,
  serverSnapshotCache,
  setSelectedIdCache,
  clearSelectionCache,
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
 * Get or create selection state for a given mapId
 */
function getOrCreateState(mapId: UniqueId): ShapeSelectionState {
  if (!selectionStore.has(mapId)) {
    selectionStore.set(mapId, {
      selectedId: undefined,
    });
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return selectionStore.get(mapId)!;
}

/**
 * Get current selection snapshot for a given map instance (for useSyncExternalStore)
 */
function getSnapshot(mapId: UniqueId): ShapeId | undefined {
  const state = selectionStore.get(mapId);
  return state?.selectedId;
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
 * Ensures a single bus listener exists for the given mapId.
 * All React subscribers will be notified via fan-out when the bus events fire.
 * This prevents creating N bus listeners for N React components.
 *
 * @param mapId - The unique identifier for the map instance
 */
function ensureBusListener(mapId: UniqueId): void {
  if (busUnsubscribers.has(mapId)) {
    return; // Already listening
  }

  const state = getOrCreateState(mapId);

  // Listen for shape selection events
  const unsubSelected = shapeBus.on(ShapeEvents.selected, (event) => {
    if (event.payload.mapId !== mapId) {
      return;
    }
    const previousId = state.selectedId;
    state.selectedId = event.payload.shapeId;
    if (previousId !== state.selectedId) {
      notifySubscribers(mapId);
    }
  });

  // Listen for shape deselection events
  const unsubDeselected = shapeBus.on(ShapeEvents.deselected, (event) => {
    if (event.payload.mapId !== mapId) {
      return;
    }
    const previousId = state.selectedId;
    state.selectedId = undefined;
    if (previousId !== state.selectedId) {
      notifySubscribers(mapId);
    }
  });

  // Listen for map clicks to detect clicks on empty space
  const unsubClick = mapBus.on(MapEvents.click, (event: MapClickEvent) => {
    // Only emit deselect if we have a selection and clicked on empty space
    // index is -1 when nothing is picked
    if (
      state.selectedId &&
      event.payload.id === mapId &&
      event.payload.info.index === -1
    ) {
      // Emit deselection event - this will be caught by our deselected listener above
      shapeBus.emit(ShapeEvents.deselected, { mapId });
    }
  });

  // Store composite cleanup function
  busUnsubscribers.set(mapId, () => {
    unsubSelected();
    unsubDeselected();
    unsubClick();
  });
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 *
 * @param mapId - The unique identifier for the map instance
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
    clearAllCaches(mapId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up selection state when the last subscriber unsubscribes.
 *
 * @param mapId - The unique identifier for the map instance
 * @returns A subscription function for useSyncExternalStore
 */
export function getOrCreateSubscription(
  mapId: UniqueId,
): (onStoreChange: () => void) => () => void {
  let subscription = subscriptionCache.get(mapId);
  if (!subscription) {
    subscription = (onStoreChange: () => void) => {
      // Ensure state exists
      getOrCreateState(mapId);

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
    };

    subscriptionCache.set(mapId, subscription);
  }

  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given mapId.
 * The selection ID returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param mapId - The unique identifier for the map instance
 * @returns A snapshot function for useSyncExternalStore
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => ShapeId | undefined {
  let snapshot = snapshotCache.get(mapId);
  if (!snapshot) {
    snapshot = () => getSnapshot(mapId);
    snapshotCache.set(mapId, snapshot);
  }

  return snapshot;
}

/**
 * Creates or retrieves a cached server snapshot function for a given mapId.
 * Server snapshots always return undefined since selection state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 *
 * @param mapId - The unique identifier for the map instance
 * @returns A server snapshot function for useSyncExternalStore
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => ShapeId | undefined {
  let serverSnapshot = serverSnapshotCache.get(mapId);
  if (!serverSnapshot) {
    serverSnapshot = () => undefined;
    serverSnapshotCache.set(mapId, serverSnapshot);
  }

  return serverSnapshot;
}

/**
 * Creates or retrieves a cached setSelectedId function for a given mapId.
 * This maintains referential stability for the function reference.
 *
 * @param mapId - The unique identifier for the map instance
 * @returns A setSelectedId function for this instance
 */
export function getOrCreateSetSelectedId(
  mapId: UniqueId,
): (id: ShapeId | undefined) => void {
  let setSelectedId = setSelectedIdCache.get(mapId);
  if (!setSelectedId) {
    setSelectedId = (id: ShapeId | undefined) => {
      const state = getOrCreateState(mapId);
      const previousId = state.selectedId;

      if (id === undefined && previousId !== undefined) {
        // Emit deselection event
        shapeBus.emit(ShapeEvents.deselected, { mapId });
      } else if (id !== undefined && previousId !== id) {
        // Emit selection event
        shapeBus.emit(ShapeEvents.selected, { shapeId: id, mapId });
      }
    };

    setSelectedIdCache.set(mapId, setSelectedId);
  }

  return setSelectedId;
}

/**
 * Creates or retrieves a cached clearSelection function for a given mapId.
 * This maintains referential stability for the function reference.
 *
 * Note: This always emits a deselected event, even if nothing is currently selected.
 * This matches the original behavior and allows consumers to use clearSelection
 * as a "force deselect" without needing to check selection state first.
 *
 * @param mapId - The unique identifier for the map instance
 * @returns A clearSelection function for this instance
 */
export function getOrCreateClearSelection(mapId: UniqueId): () => void {
  let clearSelection = clearSelectionCache.get(mapId);
  if (!clearSelection) {
    clearSelection = () => {
      shapeBus.emit(ShapeEvents.deselected, { mapId });
    };

    clearSelectionCache.set(mapId, clearSelection);
  }

  return clearSelection;
}

/**
 * Get the current selected shape ID for a given map instance (direct access, not reactive).
 * @internal - For internal map-toolkit use only
 *
 * @param mapId - The unique identifier for the map instance
 * @returns The currently selected shape ID, or undefined
 */
export function getSelectedShapeId(mapId: UniqueId): ShapeId | undefined {
  return getSnapshot(mapId);
}

/**
 * Manually clear all selection state for a specific mapId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param mapId - The unique identifier for the map instance to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearSelectionState('my-map-instance');
 * ```
 */
export function clearSelectionState(mapId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(mapId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(mapId);
  }

  // Clear all state
  clearAllCaches(mapId);
}
