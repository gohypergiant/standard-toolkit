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
import { type ComponentProps, useSyncExternalStore } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import { getViewportScale } from './utils';
import type {
  MapEventType,
  MapViewportEvent,
  MapViewportPayload,
} from '../deckgl/base-map/types';
import type { AllowedUnit } from './types';

const bus = Broadcast.getInstance<MapEventType>();

export type UseViewportStateProps = {
  viewId: string;
  subscribe?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[0];
  getSnapshot?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[1];
  getServerSnapshot?: Parameters<
    typeof useSyncExternalStore<MapViewportPayload>
  >[2];
};

/**
 * Store for viewport state keyed by viewId
 */
const viewportStore = new Map<string, MapViewportPayload>();

/**
 * Track the number of active subscribers per viewId for automatic cleanup
 */
const subscriberCounts = new Map<string, number>();

/**
 * Cache of subscription functions per viewId to avoid recreating on every render
 */
const subscriptionCache = new Map<
  string,
  (onStoreChange: () => void) => () => void
>();

/**
 * Cache of snapshot functions per viewId to maintain referential stability
 */
const snapshotCache = new Map<string, () => MapViewportPayload>();

/**
 * Default empty snapshot - stable reference to prevent unnecessary re-renders
 */
const defaultSnapshot: MapViewportPayload = {};

/**
 * Creates or retrieves a cached subscription function for a given viewId.
 * Automatically cleans up viewport state when the last subscriber unsubscribes.
 *
 * @param viewId - The unique identifier for the viewport
 * @returns A subscription function for useSyncExternalStore
 */
function getOrCreateSubscription(
  viewId: string,
): (onStoreChange: () => void) => () => void {
  if (!subscriptionCache.has(viewId)) {
    subscriptionCache.set(viewId, (onStoreChange: () => void) => {
      // Increment subscriber count
      const currentCount = subscriberCounts.get(viewId) || 0;
      subscriberCounts.set(viewId, currentCount + 1);

      const handler = (e: MapViewportEvent) => {
        if (viewId === e.payload.id) {
          /**
           * onStoreChange just tells react to run "getSnapshot". We can't pass anything
           * to that function directly from here, so we need to store the value somewhere that it can grab it.
           */
          viewportStore.set(viewId, e.payload);
          onStoreChange();
        }
      };

      const unsub = bus.on(MapEvents.viewport, handler);

      // Return cleanup function
      return () => {
        unsub();

        // Decrement subscriber count
        const count = subscriberCounts.get(viewId) || 1;
        const newCount = count - 1;

        if (newCount <= 0) {
          // No more subscribers - clean up completely
          viewportStore.delete(viewId);
          subscriberCounts.delete(viewId);
          subscriptionCache.delete(viewId);
          snapshotCache.delete(viewId);
        } else {
          subscriberCounts.set(viewId, newCount);
        }
      };
    });
  }

  return subscriptionCache.get(viewId)!;
}

/**
 * Creates or retrieves a cached snapshot function for a given viewId.
 * The object returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param viewId - The unique identifier for the viewport
 * @returns A snapshot function for useSyncExternalStore
 */
function getOrCreateSnapshot(viewId: string): () => MapViewportPayload {
  if (!snapshotCache.has(viewId)) {
    snapshotCache.set(viewId, () => {
      return viewportStore.get(viewId) ?? defaultSnapshot;
    });
  }

  return snapshotCache.get(viewId)!;
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
 * @param viewId - Unique identifier for the viewport to track
 * @param subscribe - Optional custom subscription function
 * @param getSnapshot - Optional custom snapshot getter
 * @param getServerSnapshot - Optional server-side snapshot getter
 * @returns Current viewport state including bounds, latitude, longitude, zoom
 *
 * @example
 * ```tsx
 * function MapInfo() {
 *   const { bounds, latitude, longitude, zoom } = useViewportState({
 *     viewId: 'default'
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
  viewId,
  subscribe,
  getSnapshot,
  getServerSnapshot,
}: UseViewportStateProps) {
  const viewState = useSyncExternalStore<MapViewportPayload>(
    subscribe ?? getOrCreateSubscription(viewId),
    getSnapshot ?? getOrCreateSnapshot(viewId),
    getServerSnapshot,
  );

  return viewState;
}

export type ViewportScaleProps = ComponentProps<'span'> & {
  viewId: string;
  unit?: AllowedUnit;
};

/**
 * A span element displaying the current viewport bounds in the specified unit.
 *
 * Displays the viewport dimensions in a format like `660 x 1,801 NMI`.
 * Updates automatically as the viewport changes by subscribing to viewport events.
 *
 * @param props - Extends `<span>` props
 * @param props.viewId - The id of the view to subscribe to
 * @param props.unit - Measure of distance: `km | m | nmi | mi | ft`. Defaults to `nmi`
 * @param props.className - CSS classes for styling
 *
 * @example
 * ```tsx
 * // Basic usage with default nautical miles
 * <ViewportScale viewId="default" />
 *
 * // With custom unit and styling
 * <ViewportScale
 *   viewId="default"
 *   unit="km"
 *   className="text-sm text-gray-600"
 * />
 * ```
 */
export function ViewportScale({
  viewId,
  unit = 'nmi',
  className,
  ...rest
}: ViewportScaleProps) {
  const { bounds } = useViewportState({ viewId });
  const scale = getViewportScale({ bounds, unit });

  return (
    <span className={className} {...rest}>
      {scale}
    </span>
  );
}

/**
 * Manually clear viewport state for a specific viewId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param viewId - The unique identifier for the viewport to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearViewportState('my-map-instance');
 * ```
 */
export function clearViewportState(viewId: string): void {
  viewportStore.delete(viewId);
  subscriberCounts.delete(viewId);
  subscriptionCache.delete(viewId);
  snapshotCache.delete(viewId);
}
