/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Viewport Store
 *
 * Manages viewport state (bounds, lat/lon, zoom, dimensions) per map instance.
 * State is updated automatically from MapEvents.viewport bus events.
 *
 * @example
 * ```tsx
 * import { viewportStore } from '@accelint/map-toolkit/viewport';
 *
 * function MapInfo({ mapId }) {
 *   const { state } = viewportStore.use(mapId);
 *   return (
 *     <div>
 *       Lat: {state.latitude.toFixed(2)}, Lon: {state.longitude.toFixed(2)}
 *     </div>
 *   );
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { MapEvents } from '../deckgl/base-map/events';
import { createMapStore } from '../shared/create-map-store';
import type { UniqueId } from '@accelint/core';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';

const bus = Broadcast.getInstance<MapEventType>();

/**
 * State shape for viewport - mirrors MapViewportPayload but with
 * a placeholder id that gets replaced per-instance
 */
type ViewportState = MapViewportPayload;

/**
 * No actions needed - viewport state is read-only from bus events
 */
type ViewportActions = Record<string, never>;

/**
 * Create default state for a given mapId.
 * Returns uninitialized values that indicate no viewport data yet.
 */
function createDefaultState(mapId: UniqueId): ViewportState {
  return {
    id: mapId,
    bounds: undefined,
    latitude: Number.NaN,
    longitude: Number.NaN,
    zoom: Number.NaN,
    width: 0,
    height: 0,
  };
}

/**
 * Viewport store instance.
 *
 * Note: The defaultState uses a placeholder id that gets replaced
 * when instances are created. The actual id comes from the bus event payload.
 */
export const viewportStore = createMapStore<ViewportState, ViewportActions>({
  // Placeholder default state - actual instances get proper id from bus events
  defaultState: {
    id: '' as UniqueId,
    bounds: undefined,
    latitude: Number.NaN,
    longitude: Number.NaN,
    zoom: Number.NaN,
    width: 0,
    height: 0,
  },

  // No actions - state is read-only from bus events
  actions: () => ({}) as ViewportActions,

  bus: (mapId, { replace }) => {
    const unsub = bus.on(MapEvents.viewport, ({ payload }) => {
      if (payload.id === mapId) {
        // Replace entire state with the new payload
        replace(payload);
      }
    });

    return unsub;
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Hook to subscribe to viewport state changes for a specific map.
 *
 * @param mapId - Unique identifier for the map instance
 * @returns Current viewport state including bounds, latitude, longitude, zoom, width, height
 *
 * @example
 * ```tsx
 * function MapInfo({ mapId }) {
 *   const viewport = useMapViewport(mapId);
 *   return (
 *     <div>
 *       Lat: {viewport.latitude?.toFixed(2)}, Lon: {viewport.longitude?.toFixed(2)}, Zoom: {viewport.zoom}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMapViewport(mapId: UniqueId): ViewportState {
  return viewportStore.useSelector(mapId, (state) => {
    // Return proper default state with correct mapId if uninitialized
    if (state.id === '') {
      return createDefaultState(mapId);
    }
    return state;
  });
}

/**
 * Get current viewport state (non-reactive, for imperative code).
 *
 * @param mapId - Unique identifier for the map instance
 * @returns Current viewport state
 */
export function getViewport(mapId: UniqueId): ViewportState {
  const state = viewportStore.get(mapId);
  // Return proper default state with correct mapId if uninitialized
  if (state.id === '') {
    return createDefaultState(mapId);
  }
  return state;
}

/**
 * Manually clear viewport state for a specific map instance.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 *
 * @param mapId - The unique identifier for the map instance to clear
 */
export function clearViewportState(mapId: UniqueId): void {
  viewportStore.clear(mapId);
}
