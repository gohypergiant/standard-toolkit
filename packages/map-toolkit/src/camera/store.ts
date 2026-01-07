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
 * Camera Store
 *
 * Manages camera state (position, zoom, pitch, rotation, projection, view) per map instance.
 * State is updated via bus events or direct actions.
 *
 * @example
 * ```tsx
 * import { cameraStore } from '@accelint/map-toolkit/camera';
 *
 * function MapInfo({ mapId }) {
 *   const { state } = cameraStore.use(mapId);
 *   return (
 *     <div>
 *       Lat: {state.latitude.toFixed(2)}, Lon: {state.longitude.toFixed(2)}
 *     </div>
 *   );
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { fitBounds } from '@math.gl/web-mercator';
import { createMapStore } from '../shared/create-map-store';
import { CameraEventTypes } from './events';
import type { UniqueId } from '@accelint/core';
import type { CameraEvent, ProjectionType, ViewType } from './types';

const cameraBus = Broadcast.getInstance<CameraEvent>();

/**
 * Camera state for 2D view
 */
type CameraState2D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: 0;
  rotation: number;
  projection: 'mercator';
  view: '2D';
};

/**
 * Camera state for 3D view
 */
type CameraState3D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: 0;
  rotation: number;
  projection: 'globe';
  view: '3D';
};

/**
 * Camera state for 2.5D view
 */
type CameraState2Point5D = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  rotation: number;
  projection: 'mercator';
  view: '2.5D';
};

/**
 * Union type for all camera states
 */
export type CameraState = CameraState2D | CameraState3D | CameraState2Point5D;

/**
 * Actions for camera management
 */
type CameraActions = {
  /** Update camera state directly */
  setCameraState: (state: Partial<CameraState>) => void;
};

/**
 * Storage for initial camera state per instance.
 * Used for reset operations to restore to initial values.
 */
const initialStateCache = new Map<UniqueId, CameraStateInput>();

/**
 * Track which instances have been initialized
 */
const initializedInstances = new Set<UniqueId>();

/**
 * Input type for building camera state - simpler than union type
 */
type CameraStateInput = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  pitch?: number;
  rotation?: number;
  projection?: ProjectionType;
  view?: ViewType;
};

/**
 * Build a complete camera state from partial input
 */
function buildCameraState(partial?: CameraStateInput): CameraState {
  if (!partial) {
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

  const is2Point5D = partial.view === '2.5D';
  const is3D = partial.view === '3D' || partial.projection === 'globe';

  let projection: ProjectionType;
  let view: ViewType;

  if (is3D) {
    projection = 'globe';
    view = '3D';
  } else if (is2Point5D) {
    projection = 'mercator';
    view = '2.5D';
  } else {
    projection = partial.projection ?? 'mercator';
    view = partial.view ?? '2D';
  }

  return {
    latitude: partial.latitude ?? 0,
    longitude: partial.longitude ?? 0,
    zoom: partial.zoom ?? 0,
    pitch: is2Point5D ? (partial.pitch ?? 45) : 0,
    rotation: is3D ? 0 : (partial.rotation ?? 0),
    projection,
    view,
  } as CameraState;
}

/**
 * Default camera state
 */
const DEFAULT_CAMERA_STATE: CameraState = {
  latitude: 0,
  longitude: 0,
  zoom: 0,
  pitch: 0,
  rotation: 0,
  projection: 'mercator',
  view: '2D',
};

/**
 * Camera store instance
 */
export const cameraStore = createMapStore<CameraState, CameraActions>({
  defaultState: DEFAULT_CAMERA_STATE,

  actions: (mapId, { get, set }) => ({
    setCameraState: (updates: Partial<CameraState>) => {
      const currentState = get();
      set({ ...currentState, ...updates } as CameraState);
    },
  }),

  bus: (mapId, { get, set, replace }) => {
    const unsubReset = cameraBus.on(CameraEventTypes.reset, ({ payload }) => {
      if (payload.id !== mapId) return;

      const state = get();
      const initialState = initialStateCache.get(mapId);
      const newState = buildCameraState({
        latitude: state.latitude,
        longitude: state.longitude,
        projection: state.projection,
        view: state.view,
        zoom: payload.zoom === false ? state.zoom : (initialState?.zoom ?? 0),
        pitch:
          payload.pitch === false ? state.pitch : (initialState?.pitch ?? 0),
        rotation:
          payload.rotation === false
            ? state.rotation
            : (initialState?.rotation ?? 0),
      });

      replace(newState);
    });

    const unsubSetCenter = cameraBus.on(
      CameraEventTypes.setCenter,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        replace({
          ...state,
          latitude: payload.latitude,
          longitude: payload.longitude,
          zoom: payload.zoom ?? state.zoom,
          rotation: payload.heading ?? state.rotation,
          pitch: payload.pitch ?? state.pitch,
        } as CameraState);
      },
    );

    const unsubFitBounds = cameraBus.on(
      CameraEventTypes.fitBounds,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        const { longitude, latitude, zoom } = fitBounds({
          width: payload.width,
          height: payload.height,
          bounds: [
            [payload.bounds[0], payload.bounds[1]],
            [payload.bounds[2], payload.bounds[3]],
          ],
          padding: payload.padding,
        });

        replace({
          ...state,
          latitude,
          longitude,
          zoom,
          rotation: payload.heading ?? state.rotation,
          pitch: payload.pitch ?? state.pitch,
        } as CameraState);
      },
    );

    const unsubSetProjection = cameraBus.on(
      CameraEventTypes.setProjection,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        const newState = { ...state };
        newState.projection = payload.projection;
        if (payload.projection === 'globe') {
          newState.view = '3D';
        } else {
          newState.view = '2D';
          newState.pitch = 0;
        }
        replace(newState);
      },
    );

    const unsubSetView = cameraBus.on(
      CameraEventTypes.setView,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
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
        replace(newState);
      },
    );

    const unsubSetZoom = cameraBus.on(
      CameraEventTypes.setZoom,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        replace({ ...state, zoom: payload.zoom });
      },
    );

    const unsubSetRotation = cameraBus.on(
      CameraEventTypes.setRotation,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        if (state.view !== '3D') {
          replace({ ...state, rotation: payload.rotation });
        }
      },
    );

    const unsubSetPitch = cameraBus.on(
      CameraEventTypes.setPitch,
      ({ payload }) => {
        if (payload.id !== mapId) return;

        const state = get();
        if (state.view === '2.5D') {
          replace({ ...state, pitch: payload.pitch });
        }
      },
    );

    return () => {
      unsubReset();
      unsubSetCenter();
      unsubFitBounds();
      unsubSetProjection();
      unsubSetView();
      unsubSetZoom();
      unsubSetRotation();
      unsubSetPitch();
    };
  },

  onCleanup: (mapId) => {
    initializedInstances.delete(mapId);
    initialStateCache.delete(mapId);
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Initialize camera state for a map instance with optional initial values.
 * Should be called before using the camera store for a given mapId.
 *
 * @param mapId - Unique identifier for the map instance
 * @param initialState - Optional initial camera state
 */
export function initializeCameraState(
  mapId: UniqueId,
  initialState?: CameraStateInput,
): void {
  if (initializedInstances.has(mapId)) {
    return; // Already initialized
  }

  initializedInstances.add(mapId);
  if (initialState) {
    initialStateCache.set(mapId, initialState);
  }
  const builtState = buildCameraState(initialState);
  cameraStore.set(mapId, builtState);
}

/**
 * Hook to subscribe to camera state changes for a specific map.
 *
 * @param mapId - Unique identifier for the map instance
 * @param initialCameraState - Optional initial camera state (only used on first call)
 * @returns Camera state and setCameraState action
 *
 * @example
 * ```tsx
 * function MapInfo({ mapId }) {
 *   const { cameraState, setCameraState } = useCameraState(mapId);
 *   return (
 *     <div>
 *       Lat: {cameraState.latitude.toFixed(2)}, Lon: {cameraState.longitude.toFixed(2)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCameraState(
  mapId: UniqueId,
  initialCameraState?: CameraStateInput,
): {
  cameraState: CameraState;
  setCameraState: (state: Partial<CameraState>) => void;
} {
  // Initialize on first use if initial state provided
  if (initialCameraState && !initializedInstances.has(mapId)) {
    initializeCameraState(mapId, initialCameraState);
  }

  const { state, setCameraState } = cameraStore.use(mapId);

  return { cameraState: state, setCameraState };
}

/**
 * Manually clear camera state for a specific map instance.
 *
 * @param mapId - The unique identifier for the map instance to clear
 */
export function clearCameraState(mapId: UniqueId): void {
  initializedInstances.delete(mapId);
  initialStateCache.delete(mapId);
  cameraStore.clear(mapId);
}
