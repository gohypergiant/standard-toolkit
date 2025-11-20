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

import 'client-only';
import { Broadcast } from '@accelint/bus';
import { coordinateSystems, createCoordinate } from '@accelint/geo';
import { useContext, useMemo, useSyncExternalStore } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import { MapContext } from '../deckgl/base-map/provider';
import type { UniqueId } from '@accelint/core';
import type { MapEventType, MapHoverEvent } from '../deckgl/base-map/types';

/**
 * Supported coordinate format types for displaying map coordinates.
 *
 * @typedef {'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm'} CoordinateFormatTypes
 * @property dd - Decimal Degrees (e.g., "45.50000000 E / 30.25000000 N")
 * @property ddm - Degrees Decimal Minutes (e.g., "45° 30' E / 30° 15' N")
 * @property dms - Degrees Minutes Seconds (e.g., "45° 30' 0\" E / 30° 15' 0\" N")
 * @property mgrs - Military Grid Reference System (e.g., "31U DQ 48251 11932")
 * @property utm - Universal Transverse Mercator (e.g., "31N 448251 5411932")
 */
export type CoordinateFormatTypes = keyof typeof coordinateSystems;

const bus = Broadcast.getInstance<MapEventType>();
const create = createCoordinate(coordinateSystems.dd, 'LONLAT');

const MAX_LONGITUDE = 180;
const LONGITUDE_RANGE = 360;
const COORDINATE_PRECISION = 8;
const DEFAULT_COORDINATE = '--, --';

/**
 * Prepares coordinates for display by normalizing longitude and formatting with cardinal directions.
 * Normalizes longitude to -180 to 180 range and formats both longitude and latitude with
 * compass directions (E/W for longitude, N/S for latitude).
 *
 * @param coord - Tuple of [longitude, latitude] coordinates
 * @returns Formatted string in the format "LON.NNNNNNNN E/W / LAT.NNNNNNNN N/S"
 */
const prepareCoord = (coord: [number, number]) => {
  // Normalize longitude to -180 to 180 range (handles wraparound including multi-revolution values)
  let lon = coord[0];
  lon =
    ((((lon + MAX_LONGITUDE) % LONGITUDE_RANGE) + LONGITUDE_RANGE) %
      LONGITUDE_RANGE) -
    MAX_LONGITUDE;

  const lat = coord[1];
  const lonStr = `${Math.abs(lon).toFixed(COORDINATE_PRECISION)} ${lon < 0 ? 'W' : 'E'}`;
  const latStr = `${Math.abs(lat).toFixed(COORDINATE_PRECISION)} ${lat < 0 ? 'S' : 'N'}`;

  return `${lonStr} / ${latStr}`;
};

/**
 * Type guard to validate that a value is a proper coordinate tuple.
 * Checks that the value is an array with exactly two finite numbers.
 *
 * @param value - Value to validate as a coordinate
 * @returns True if value is a valid [longitude, latitude] tuple
 */
function isValidCoordinate(value?: number[]): value is [number, number] {
  return (
    Array.isArray(value) && value.length === 2 && value.every(Number.isFinite)
  );
}

/**
 * State stored for each map instance's cursor coordinates
 */
type CursorCoordinateState = {
  coordinate: [number, number] | null;
  format: CoordinateFormatTypes;
};

/**
 * Store for cursor coordinate state keyed by instanceId
 */
const coordinateStore = new Map<UniqueId, CursorCoordinateState>();

/**
 * Track React component subscribers per instanceId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per instanceId).
 * This ensures we only have one bus listener per map, regardless of
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
const snapshotCache = new Map<UniqueId, () => string>();

/**
 * Ensures a single bus listener exists for the given instanceId.
 * All React subscribers will be notified via fan-out when the bus event fires.
 * This prevents creating N bus listeners for N React components.
 *
 * @param instanceId - The unique identifier for the map
 */
function ensureBusListener(instanceId: UniqueId): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const unsub = bus.on(MapEvents.hover, (data: MapHoverEvent) => {
    const eventId = data.payload.id;

    // Ignore hover events from other possible map instances
    if (instanceId !== eventId) {
      return;
    }

    const coords = data.payload.info.coordinate;
    const state = coordinateStore.get(instanceId);

    // Update coordinate if valid, or clear if invalid
    if (state) {
      if (isValidCoordinate(coords)) {
        state.coordinate = coords as [number, number];
      } else {
        state.coordinate = null;
      }

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
 * @param instanceId - The unique identifier for the map
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
    coordinateStore.delete(instanceId);
    componentSubscribers.delete(instanceId);
    subscriptionCache.delete(instanceId);
    snapshotCache.delete(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up coordinate state when the last subscriber unsubscribes.
 *
 * @param instanceId - The unique identifier for the map
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
 * The function must read from the store on every call to get current state.
 *
 * @param instanceId - The unique identifier for the map
 * @returns A snapshot function for useSyncExternalStore that returns formatted coordinate string
 */
function getOrCreateSnapshot(instanceId: UniqueId): () => string {
  let cached = snapshotCache.get(instanceId);

  if (!cached) {
    // Create a snapshot function that always reads current state from the store
    cached = () => {
      const state = coordinateStore.get(instanceId);

      if (!state) {
        return DEFAULT_COORDINATE;
      }

      if (!state.coordinate) {
        return DEFAULT_COORDINATE;
      }

      const coord = create(prepareCoord(state.coordinate));
      return coord[state.format]();
    };

    snapshotCache.set(instanceId, cached);
  }

  return cached;
}

/**
 * Updates the format for a given map instance and notifies subscribers.
 *
 * @param instanceId - The unique identifier for the map
 * @param format - The new coordinate format to use
 */
function setFormatForInstance(
  instanceId: UniqueId,
  format: CoordinateFormatTypes,
): void {
  const state = coordinateStore.get(instanceId);
  if (state) {
    state.format = format;

    // Notify all subscribers of the format change
    // The coordinate remains unchanged; only the display format changes
    const subscribers = componentSubscribers.get(instanceId);
    if (subscribers) {
      for (const onStoreChange of subscribers) {
        onStoreChange();
      }
    }
  }
}

/**
 * Manually clear cursor coordinate state for a specific instanceId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param instanceId - The unique identifier for the map to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearCursorCoordinateState('my-map-instance');
 * ```
 */
export function clearCursorCoordinateState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(instanceId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  coordinateStore.delete(instanceId);
  componentSubscribers.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
}

/**
 * React hook that tracks and formats the cursor hover position coordinates on a map.
 *
 * Subscribes to map hover events via the event bus and converts coordinates to various
 * geographic formats (Decimal Degrees, DMS, MGRS, UTM, etc.). The hook automatically
 * filters events to only process those from the specified map instance.
 *
 * Uses `useSyncExternalStore` for concurrent-safe updates and efficient fan-out pattern
 * where multiple components can subscribe to the same map's coordinates with a single
 * bus listener.
 *
 * @param id - Optional map instance ID. If not provided, attempts to use the ID from MapProvider context.
 * @returns Object containing the formatted coordinate string and format setter function
 * @property formattedCoord - The formatted coordinate string (defaults to "--, --" when no position)
 * @property setFormat - Function to change the coordinate format system
 * @throws {Error} When no id is provided and hook is used outside MapProvider context
 *
 * @example
 * ```tsx
 * import { uuid } from '@accelint/core';
 * import { useCursorCoordinates } from '@accelint/map-toolkit/cursor-coordinates';
 *
 * const MAP_ID = uuid();
 *
 * function CoordinateDisplay() {
 *   const { formattedCoord, setFormat } = useCursorCoordinates(MAP_ID);
 *
 *   return (
 *     <div>
 *       <select onChange={(e) => setFormat(e.target.value as CoordinateFormatTypes)}>
 *         <option value="dd">Decimal Degrees</option>
 *         <option value="ddm">Degrees Decimal Minutes</option>
 *         <option value="dms">Degrees Minutes Seconds</option>
 *         <option value="mgrs">MGRS</option>
 *         <option value="utm">UTM</option>
 *       </select>
 *       <div>{formattedCoord}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCursorCoordinates(id?: UniqueId) {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useCursorCoordinates requires either an id parameter or to be used within a MapProvider',
    );
  }

  // Initialize state for this map instance BEFORE subscribing
  // This ensures the bus listener has a store to write to
  if (!coordinateStore.has(actualId)) {
    coordinateStore.set(actualId, {
      coordinate: null,
      format: 'dd',
    });
  }

  // Subscribe to coordinate changes using useSyncExternalStore
  // This must happen after store initialization
  const formattedCoord = useSyncExternalStore<string>(
    getOrCreateSubscription(actualId),
    getOrCreateSnapshot(actualId),
  );

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      formattedCoord,
      setFormat: (format: CoordinateFormatTypes) =>
        setFormatForInstance(actualId, format),
    }),
    [formattedCoord, actualId],
  );
}
