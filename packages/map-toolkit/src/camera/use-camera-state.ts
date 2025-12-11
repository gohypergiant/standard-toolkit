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
import { fitBounds } from '@math.gl/web-mercator';
import { useMemo, useSyncExternalStore } from 'react';
import { CameraEventTypes } from './events';
import type { UniqueId } from '@accelint/core';
import type { CameraEvent, ProjectionType, ViewType } from './types';

/**
 * Typed event bus instance for camera events.
 * Provides type-safe event emission and listening for all camera state changes.
 */
const cameraBus = Broadcast.getInstance<CameraEvent>();

type CameraState2D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: 0;
  rotation: number;
  projection: 'mercator';
  view: '2D';
};

type CameraState3D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  rotation: number;
  projection: 'globe';
  view: '3D';
};

type CameraState2Point5D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  rotation: number;
  projection: 'mercator';
  view: '2.5D';
};

export type CameraState = CameraState2D | CameraState3D | CameraState2Point5D;

export type UseCameraStateProps = {
  instanceId: UniqueId;
  initialCameraState?: Partial<CameraState>;
  subscribe?: Parameters<typeof useSyncExternalStore<CameraState>>[0];
  getSnapshot?: Parameters<typeof useSyncExternalStore<CameraState>>[1];
  getServerSnapshot?: Parameters<typeof useSyncExternalStore<CameraState>>[2];
};

/**
 * Store for camera state keyed by instanceId
 */
const cameraStore = new Map<UniqueId, CameraState>();

/**
 * Track React component subscribers per instanceId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per instanceId).
 * This ensures we only have one bus listener per camera, regardless of
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
const snapshotCache = new Map<UniqueId, () => CameraState>();

/**
 * Cache of fallback snapshots per instanceId to maintain referential stability.
 * This prevents unnecessary re-renders when no camera data exists yet.
 */
const fallbackCache = new Map<UniqueId, CameraState>();

/*
 * Helper to build initial camera state from partial input
 */
function buildInitialCameraState(
  initialCameraState?: Partial<CameraState>,
): CameraState {
  if (!initialCameraState) {
    return {
      latitude: 0,
      longitude: 0,
      zoom: 0,
      pitch: 0,
      rotation: 0,
      projection: 'mercator',
      view: '2D',
    };
  }

  const is2Point5D = initialCameraState.view === '2.5D';
  const is3D =
    initialCameraState.view === '3D' ||
    initialCameraState.projection === 'globe';

  let projection: ProjectionType;
  let view: ViewType;

  if (is3D) {
    projection = 'globe';
    view = '3D';
  } else if (is2Point5D) {
    projection = 'mercator';
    view = '2.5D';
  } else {
    projection = initialCameraState.projection ?? 'mercator';
    view = initialCameraState.view ?? '2D';
  }

  return {
    latitude: initialCameraState.latitude ?? 0,
    longitude: initialCameraState.longitude ?? 0,
    zoom: initialCameraState.zoom ?? 0,
    pitch: is2Point5D ? (initialCameraState.pitch ?? 45) : 0,
    rotation: is3D ? 0 : (initialCameraState.rotation ?? 0),
    projection,
    view,
  } as CameraState;
}

/*
 * Get or create camera state for a given instanceId
 */
function getOrCreateState(
  instanceId: UniqueId,
  initialCameraState?: Partial<CameraState>,
): CameraState {
  if (!cameraStore.has(instanceId)) {
    cameraStore.set(instanceId, buildInitialCameraState(initialCameraState));
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return cameraStore.get(instanceId)!;
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
 * Ensures a single bus listener exists for the given instanceId.
 * All React subscribers will be notified via fan-out when the bus event fires.
 * This prevents creating N bus listeners for N React components.
 *
 * @param instanceId - The unique identifier for the camera
 * @param initialCameraState - Optional initial camera state to set when creating the listener
 */
function ensureBusListener(
  instanceId: UniqueId,
  initialCameraState?: Partial<CameraState>,
): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const unsubResetCamera = cameraBus.on(
    CameraEventTypes.reset,
    ({ payload }) => {
      if (instanceId === payload.id) {
        const state = getOrCreateState(instanceId, initialCameraState);
        const newState = {
          ...buildInitialCameraState({
            ...state,
            zoom:
              payload.zoom === false ? state.zoom : initialCameraState?.zoom,
            pitch:
              payload.pitch === false ? state.pitch : initialCameraState?.pitch,
            rotation:
              payload.rotation === false
                ? state.rotation
                : initialCameraState?.rotation,
          } as Partial<CameraState>),
        };

        cameraStore.set(instanceId, newState);

        notifySubscribers(instanceId);
      }
    },
  );

  const unsubSetCenter = cameraBus.on(
    CameraEventTypes.setCenter,
    ({ payload }) => {
      if (instanceId === payload.id) {
        const state = getOrCreateState(instanceId, initialCameraState);
        const newState = {
          ...state,
          latitude: payload.latitude,
          longitude: payload.longitude,
          zoom: payload.zoom ?? state.zoom,
          rotation: payload.heading ?? state.rotation,
          pitch: payload.pitch ?? state.pitch,
        } as CameraState;
        cameraStore.set(instanceId, newState);
        notifySubscribers(instanceId);
      }
    },
  );

  const unsubFitBounds = cameraBus.on(
    CameraEventTypes.fitBounds,
    ({ payload }) => {
      if (instanceId === payload.id) {
        const state = getOrCreateState(instanceId, initialCameraState);
        const { longitude, latitude, zoom } = fitBounds({
          width: payload.width,
          height: payload.height,
          bounds: [
            [payload.bounds[0], payload.bounds[1]],
            [payload.bounds[2], payload.bounds[3]],
          ],
          padding: payload.padding,
        });
        const newState = {
          ...state,
          latitude: latitude,
          longitude: longitude,
          zoom: zoom,
          rotation: payload.heading ?? state.rotation,
          pitch: payload.pitch ?? state.pitch,
        } as CameraState;
        cameraStore.set(instanceId, newState);
        notifySubscribers(instanceId);
      }
    },
  );

  const unsubSetProjection = cameraBus.on(
    CameraEventTypes.setProjection,
    ({ payload }) => {
      if (instanceId === payload.id) {
        const state = getOrCreateState(instanceId, initialCameraState);
        const newState = { ...state };
        newState.projection = payload.projection;
        if (payload.projection === 'globe') {
          newState.view = '3D';
        } else {
          newState.view = '2D';
          newState.pitch = 0;
        }
        cameraStore.set(instanceId, newState);
        notifySubscribers(instanceId);
      }
    },
  );

  const unsubSetView = cameraBus.on(CameraEventTypes.setView, ({ payload }) => {
    if (instanceId === payload.id) {
      const state = getOrCreateState(instanceId, initialCameraState);
      const newState = { ...state };
      newState.view = payload.view;
      if (payload.view === '3D') {
        newState.projection = 'globe';
        newState.pitch = 0;
      } else {
        newState.projection = 'mercator';
      }

      if (payload.view === '2.5D') {
        newState.pitch = 45;
      }
      cameraStore.set(instanceId, newState);
      notifySubscribers(instanceId);
    }
  });

  const unsubSetZoom = cameraBus.on(CameraEventTypes.setZoom, ({ payload }) => {
    if (instanceId === payload.id) {
      const state = getOrCreateState(instanceId, initialCameraState);
      const newState = { ...state };
      newState.zoom = payload.zoom;
      cameraStore.set(instanceId, newState);
      notifySubscribers(instanceId);
    }
  });

  const unsubSetRotation = cameraBus.on(
    CameraEventTypes.setRotation,
    ({ payload }) => {
      if (instanceId === payload.id) {
        const state = getOrCreateState(instanceId, initialCameraState);
        const newState = { ...state };
        newState.rotation = payload.rotation;
        cameraStore.set(instanceId, newState);
        notifySubscribers(instanceId);
      }
    },
  );

  const unsubSetPitch = cameraBus.on(
    CameraEventTypes.setPitch,
    ({ payload }) => {
      const state = getOrCreateState(instanceId, initialCameraState);
      if (instanceId === payload.id && state.view === '2.5D') {
        const newState = { ...state };
        newState.pitch = payload.pitch;
        cameraStore.set(instanceId, newState);
        notifySubscribers(instanceId);
      }
    },
  );

  busUnsubscribers.set(instanceId, () => {
    unsubResetCamera();
    unsubSetCenter();
    unsubFitBounds();
    unsubSetProjection();
    unsubSetView();
    unsubSetZoom();
    unsubSetRotation();
    unsubSetPitch();
  });
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 *
 * @param instanceId - The unique identifier for the camera
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
    cameraStore.delete(instanceId);
    componentSubscribers.delete(instanceId);
    subscriptionCache.delete(instanceId);
    snapshotCache.delete(instanceId);
    fallbackCache.delete(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up camera state when the last subscriber unsubscribes.
 *
 * @param instanceId - The unique identifier for the camera
 * @returns A subscription function for useSyncExternalStore
 */
function getOrCreateSubscription(
  instanceId: UniqueId,
  initialCameraState?: Partial<CameraState>,
): (onStoreChange: () => void) => () => void {
  const subscription =
    subscriptionCache.get(instanceId) ??
    ((onStoreChange: () => void) => {
      // Ensure single bus listener exists for this instanceId
      ensureBusListener(instanceId, initialCameraState);

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
 * The object returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param instanceId - The unique identifier for the camera
 * @returns A snapshot function for useSyncExternalStore
 */
function getOrCreateSnapshot(instanceId: UniqueId): () => CameraState {
  // Get or create stable fallback reference for this instanceId
  const fallback =
    fallbackCache.get(instanceId) ??
    (() => {
      const newFallback: CameraState = {
        latitude: 0,
        longitude: 0,
        zoom: 0,
        pitch: 0,
        rotation: 0,
        projection: 'mercator',
        view: '2D',
      };
      fallbackCache.set(instanceId, newFallback);
      return newFallback;
    })();

  const snapshot =
    snapshotCache.get(instanceId) ??
    (() => cameraStore.get(instanceId) ?? fallback);

  snapshotCache.set(instanceId, snapshot);

  return snapshot;
}

/**
 * Updates the camera state for a given map instance and notifies subscribers.
 *
 * @param instanceId - The unique identifier for the map
 * @param state - The new state to set, will be merged with existing state
 *
 * @example
 * ```tsx
 * // Update camera state manually
 * setCameraState('my-map-instance', {
 *   latitude: 37.7749,
 *   longitude: -122.4194,
 *   zoom: 10,
 *   pitch: 30,
 *   rotation: 0,
 *   projection: 'mercator',
 * });
 * ```
 */
function setCameraState(
  instanceId: UniqueId,
  state: Partial<CameraState>,
): void {
  const currentState = getOrCreateState(instanceId);
  cameraStore.set(instanceId, { ...currentState, ...state } as CameraState);
  notifySubscribers(instanceId);
}

/**
 * Hook to access camera state actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to camera state changes,
 * providing concurrent-safe mode state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * A thin wrapper around [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).
 *
 * @param instanceId - Unique identifier for the camera to track
 * @param subscribe - Optional custom subscription function
 * @param getSnapshot - Optional custom snapshot getter
 * @param getServerSnapshot - Optional server-side snapshot getter
 * @returns Current camera state including latitude, longitude, zoom, pitch, rotation, projection
 *
 * @example
 * ```tsx
 * function MapInfo({ instanceId }) {
 *   const { latitude, longitude, zoom } = useCameraState({
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
 *   const viewState = useCameraState({
 *     instanceId: 'some-uuid',
 *     subscribe: customSubscribe,
 *     getSnapshot: customGetSnapshot,
 *   });
 *
 *   return <div>Custom camera state</div>;
 * }
 * ```
 */
export function useCameraState({
  instanceId,
  initialCameraState,
  subscribe,
  getSnapshot,
  getServerSnapshot,
}: UseCameraStateProps) {
  const cameraState = useSyncExternalStore<CameraState>(
    subscribe ?? getOrCreateSubscription(instanceId, initialCameraState),
    getSnapshot ?? getOrCreateSnapshot(instanceId),
    getServerSnapshot,
  );

  return useMemo(
    () => ({
      cameraState,
      setCameraState,
    }),
    [cameraState],
  );
}

/**
 * Manually clear camera state for a specific instanceId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param instanceId - The unique identifier for the camera to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearCameraState('my-map-instance');
 * ```
 */
export function clearCameraState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(instanceId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  cameraStore.delete(instanceId);
  componentSubscribers.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
  fallbackCache.delete(instanceId);
}
