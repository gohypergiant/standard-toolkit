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
 * Cursor Coordinates Store
 *
 * Manages cursor coordinate state for map instances using the shared store factory.
 * Subscribes to hover events from the map and stores the current cursor position.
 *
 * @example
 * ```tsx
 * import { cursorCoordinateStore } from './store';
 *
 * // Use in a component
 * function CoordinateDisplay({ mapId }) {
 *   const { state, setFormat } = cursorCoordinateStore.use(mapId);
 *   return <div>{state.coordinate ? `${state.coordinate[0]}, ${state.coordinate[1]}` : '--'}</div>;
 * }
 *
 * // Or use the selector for specific values
 * const coord = cursorCoordinateStore.useSelector(mapId, (s) => s.coordinate);
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { MapEvents } from '../deckgl/base-map/events';
import { createMapStore } from '../shared/create-map-store';
import type { UniqueId } from '@accelint/core';
import type { MapEventType, MapHoverEvent } from '../deckgl/base-map/types';
import type { CoordinateFormatTypes, CursorCoordinateState } from './types';

const bus = Broadcast.getInstance<MapEventType>();

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
 * Actions for cursor coordinate management
 */
type CursorCoordinateActions = {
  /** Set the coordinate display format */
  setFormat: (format: CoordinateFormatTypes) => void;
};

/**
 * Cursor coordinates store
 *
 * Stores the current cursor position and display format for each map instance.
 * Automatically subscribes to hover events when first React subscriber mounts.
 */
export const cursorCoordinateStore = createMapStore<
  CursorCoordinateState,
  CursorCoordinateActions
>({
  name: 'cursorCoordinate',
  defaultState: {
    coordinate: null,
    format: 'dd',
  },

  actions: (_mapId, { set }) => ({
    setFormat: (format: CoordinateFormatTypes) => {
      set({ format });
    },
  }),

  bus: (mapId, { set }) => {
    return bus.on(MapEvents.hover, (data: MapHoverEvent) => {
      const eventId = data.payload.id;

      // Ignore hover events from other map instances
      if (mapId !== eventId) {
        return;
      }

      const coords = data.payload.info.coordinate;

      // Update coordinate if valid, or clear if invalid
      if (isValidCoordinate(coords)) {
        set({ coordinate: coords as [number, number] });
      } else {
        set({ coordinate: null });
      }
    });
  },
});

/**
 * Clear cursor coordinate state for a specific map instance.
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
  cursorCoordinateStore.clear(instanceId);
}
