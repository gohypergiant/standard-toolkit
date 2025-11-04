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
import { type ComponentPropsWithRef, useSyncExternalStore } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import { getViewportSize } from './utils';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';
import type { SupportedDistanceUnit } from './types';

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
 * Store for viewport state keyed by viewId
 */
const viewportStore = new Map<UniqueId, MapViewportPayload>();

/**
 * Track the number of active subscribers per viewId for automatic cleanup
 */
const subscriberCounts = new Map<UniqueId, number>();

type Subscription = (onStoreChange: () => void) => () => void;
/**
 * Cache of subscription functions per viewId to avoid recreating on every render
 */
const subscriptionCache = new Map<UniqueId, Subscription>();

/**
 * Cache of snapshot functions per viewId to maintain referential stability
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
 * Creates or retrieves a cached subscription function for a given viewId.
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
      const unsub = bus.on(MapEvents.viewport, ({ payload }) => {
        if (instanceId === payload.id) {
          /**
           * onStoreChange just tells react to run "getSnapshot". We can't pass anything
           * to that function directly from here, so we need to store the value somewhere that it can grab it.
           */
          viewportStore.set(instanceId, payload);

          onStoreChange();
        }
      });
      // Increment subscriber count
      const currentCount = subscriberCounts.get(instanceId) || 0;

      subscriberCounts.set(instanceId, currentCount + 1);

      // Return cleanup function
      return () => {
        // Decrement subscriber count
        const count = (subscriberCounts.get(instanceId) ?? 1) - 1;

        if (count <= 0) {
          unsub();

          // No more subscribers - clean up completely
          viewportStore.delete(instanceId);
          subscriberCounts.delete(instanceId);
          subscriptionCache.delete(instanceId);
          snapshotCache.delete(instanceId);
        } else {
          subscriberCounts.set(instanceId, count);
        }
      };
    });

  subscriptionCache.set(instanceId, subscription);

  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given viewId.
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
 *     viewId: 'custom',
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

export type ViewportSizeProps = ComponentPropsWithRef<'span'> & {
  instanceId: UniqueId;
  unit?: SupportedDistanceUnit;
};

/**
 * A span element displaying the current viewport bounds in the specified unit.
 *
 * Displays the viewport dimensions in a format like `660 x 1,801 NM`.
 * Updates automatically as the viewport changes by subscribing to viewport events.
 *
 * @param props - Extends `<span>` props
 * @param props.viewId - The id of the view to subscribe to
 * @param props.unit - Measure of distance: `km | m | nm | mi | ft`. Defaults to `nm`
 * @param props.className - CSS classes for styling
 *
 * @example
 * ```tsx
 * // Basic usage with default nautical miles
 * <ViewportSize viewId="default" />
 *
 * // With custom unit and styling
 * <ViewportSize
 *   viewId="default"
 *   unit="km"
 *   className="text-sm text-gray-600"
 * />
 * ```
 */
export function ViewportSize({
  instanceId,
  unit = 'nm',
  ...rest
}: ViewportSizeProps) {
  const { bounds } = useViewportState({ instanceId });

  return <span {...rest}>{getViewportSize({ bounds, unit })}</span>;
}

/**
 * Manually clear viewport state for a specific viewId.
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
  viewportStore.delete(instanceId);
  subscriberCounts.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
}
