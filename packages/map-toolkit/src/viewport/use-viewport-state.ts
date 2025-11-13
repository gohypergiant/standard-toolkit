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
import { type UniqueId, uuid } from '@accelint/core';
import { useSyncExternalStore } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';

const bus = Broadcast.getInstance<MapEventType>();

export type UseViewportStateProps = {
  instanceId: UniqueId;
  subscribe?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[0];
  getSnapshot?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[1];
  getServerSnapshot?: Parameters<
    typeof useSyncExternalStore<MapViewportPayload>
  >[2];
};

/**
 * Store for viewport state keyed by instanceId
 */
const viewportStore = new Map<UniqueId, MapViewportPayload>();

/**
 * Track React component subscribers per instanceId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per instanceId).
 * This ensures we only have one bus listener per viewport, regardless of
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
const snapshotCache = new Map<UniqueId, () => MapViewportPayload>();

/**
 * Default empty snapshot - stable reference to prevent unnecessary re-renders
 */
const defaultSnapshot: MapViewportPayload = {
  id: uuid(),
  bounds: [Number.NaN, Number.NaN, Number.NaN, Number.NaN],
  latitude: Number.NaN,
  longitude: Number.NaN,
  zoom: Number.NaN,
};

/**
 * Ensures a single bus listener exists for the given instanceId.
 * All React subscribers will be notified via fan-out when the bus event fires.
 * This prevents creating N bus listeners for N React components.
 *
 * @param instanceId - The unique identifier for the viewport
 */
function ensureBusListener(instanceId: UniqueId): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const unsub = bus.on(MapEvents.viewport, ({ payload }) => {
    if (instanceId === payload.id) {
      // Write to store once
      viewportStore.set(instanceId, payload);

      // Fan-out: notify all React subscribers
      const subscribers = componentSubscribers.get(instanceId);
      if (subscribers) {
        for (const onStoreChange of subscribers) {
          onStoreChange();
        }
      }
    }
  });

  busUnsubscribers.set(instanceId, unsub);
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 *
 * @param instanceId - The unique identifier for the viewport
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
    viewportStore.delete(instanceId);
    componentSubscribers.delete(instanceId);
    subscriptionCache.delete(instanceId);
    snapshotCache.delete(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up viewport state when the last subscriber unsubscribes.
 *
 * @param instanceId - The unique identifier for the viewport
 * @returns A subscription function for useSyncExternalStore
 */
function getOrCreateSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  const subscription =
    subscriptionCache.get(instanceId) ??
    ((onStoreChange: () => void) => {
      // Ensure single bus listener exists for this instanceId
      ensureBusListener(instanceId);

      // Add this React subscriber to the fan-out set
      let subscribers = componentSubscribers.get(instanceId);
      if (!subscribers) {
        subscribers = new Set();
        componentSubscribers.set(instanceId, subscribers);
      }
      subscribers.add(onStoreChange);

      // Return cleanup function for THIS React subscriber
      return () => {
        const subscribers = componentSubscribers.get(instanceId);
        if (subscribers) {
          subscribers.delete(onStoreChange);
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
 * The object returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param instanceId - The unique identifier for the viewport
 * @returns A snapshot function for useSyncExternalStore
 */
function getOrCreateSnapshot(instanceId: UniqueId): () => MapViewportPayload {
  const fallback = { ...defaultSnapshot, id: instanceId };
  const snapshot =
    snapshotCache.get(instanceId) ??
    (() => viewportStore.get(instanceId) ?? fallback);

  snapshotCache.set(instanceId, snapshot);

  return snapshot;
}

/**
 * Hook to subscribe to viewport state changes for a specific view.
 *
 * By default, subscribes to MapEvents.viewport events from the event bus and
 * automatically cleans up when all subscribers unmount. For advanced use cases,
 * custom subscribe/getSnapshot functions can be provided.
 *
 * A thin wrapper around [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).
 *
 * @param instanceId - Unique identifier for the viewport to track
 * @param subscribe - Optional custom subscription function
 * @param getSnapshot - Optional custom snapshot getter
 * @param getServerSnapshot - Optional server-side snapshot getter
 * @returns Current viewport state including bounds, latitude, longitude, zoom
 *
 * @example
 * ```tsx
 * function MapInfo({ instanceId }) {
 *   const { bounds, latitude, longitude, zoom } = useViewportState({
 *     instanceId
 *   });
 *
 *   return (
 *     <div>
 *       Lat: {latitude?.toFixed(2)}, Lon: {longitude?.toFixed(2)}, Zoom: {zoom}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom subscribe/getSnapshot for advanced use cases
 * function CustomMapInfo() {
 *   const customSubscribe = (onStoreChange) => {
 *     // Custom subscription logic
 *     return () => { // cleanup }
 *   }
 *
 *   const customGetSnapshot = () => {
 *     // Custom snapshot logic
 *     return { latitude: 0, longitude: 0, zoom: 1 };
 *   };
 *
 *   const viewState = useViewportState({
 *     instanceId: 'some-uuid',
 *     subscribe: customSubscribe,
 *     getSnapshot: customGetSnapshot,
 *   });
 *
 *   return <div>Custom viewport state</div>;
 * }
 * ```
 */
export function useViewportState({
  instanceId,
  subscribe,
  getSnapshot,
  getServerSnapshot,
}: UseViewportStateProps) {
  return useSyncExternalStore<MapViewportPayload>(
    subscribe ?? getOrCreateSubscription(instanceId),
    getSnapshot ?? getOrCreateSnapshot(instanceId),
    getServerSnapshot,
  );
}

/**
 * Manually clear viewport state for a specific instanceId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param instanceId - The unique identifier for the viewport to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearViewportState('my-map-instance');
 * ```
 */
export function clearViewportState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(instanceId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  viewportStore.delete(instanceId);
  componentSubscribers.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
}
