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
 * The store uses a fan-out pattern:
 * - **1 bus listener per mapId** - Regardless of how many React components subscribe
 * - **N React subscribers** - Each component gets notified via `useSyncExternalStore`
 * - **Automatic cleanup** - Bus listeners are removed when the last subscriber unmounts
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
import { createMapStore } from '../../../shared/create-map-store';
import { MapEvents } from '../../base-map/events';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import type { UniqueId } from '@accelint/core';
import type { MapClickEvent, MapEventType } from '../../base-map/types';
import type { ShapeId } from '../shared/types';

/**
 * Typed event bus instances for shape and map events
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();
const mapBus = Broadcast.getInstance<MapEventType>();

/**
 * State shape for shape selection
 */
type ShapeSelectionState = {
  selectedId: ShapeId | undefined;
};

/**
 * Actions for shape selection
 */
type ShapeSelectionActions = {
  setSelectedId: (id: ShapeId | undefined) => void;
  clearSelection: () => void;
};

/**
 * Shape selection store using the map store factory
 */
const store = createMapStore<ShapeSelectionState, ShapeSelectionActions>({
  createDefaultState: () => ({ selectedId: undefined }),
  serverDefault: { selectedId: undefined },

  setupBusListeners: (mapId, instance, notify) => {
    // Listen for shape selection events
    const unsubSelected = shapeBus.on(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== mapId) {
        return;
      }
      const previousId = instance.state.selectedId;
      instance.state = { selectedId: event.payload.shapeId };
      if (previousId !== instance.state.selectedId) {
        notify();
      }
    });

    // Listen for shape deselection events
    const unsubDeselected = shapeBus.on(ShapeEvents.deselected, (event) => {
      if (event.payload.mapId !== mapId) {
        return;
      }
      const previousId = instance.state.selectedId;
      instance.state = { selectedId: undefined };
      if (previousId !== instance.state.selectedId) {
        notify();
      }
    });

    // Listen for map clicks to detect clicks on empty space
    const unsubClick = mapBus.on(MapEvents.click, (event: MapClickEvent) => {
      // Only emit deselect if we have a selection and clicked on empty space
      // index is -1 when nothing is picked
      if (
        instance.state.selectedId &&
        event.payload.id === mapId &&
        event.payload.info.index === -1
      ) {
        // Emit deselection event - this will be caught by our deselected listener above
        shapeBus.emit(ShapeEvents.deselected, { mapId });
      }
    });

    return () => {
      unsubSelected();
      unsubDeselected();
      unsubClick();
    };
  },
});

// =============================================================================
// Public API (maintains backward compatibility with existing hook)
// =============================================================================

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 */
export function getOrCreateSubscription(
  mapId: UniqueId,
): (onStoreChange: () => void) => () => void {
  return store.getSubscription(mapId);
}

/**
 * Creates or retrieves a cached snapshot function for a given mapId.
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => ShapeId | undefined {
  const snapshotFn = store.getSnapshot(mapId);
  // Return a function that extracts just the selectedId
  return store.getAction(
    mapId,
    'snapshot' as keyof ShapeSelectionActions,
    () =>
      (() =>
        snapshotFn()
          .selectedId) as unknown as ShapeSelectionActions[keyof ShapeSelectionActions],
  ) as unknown as () => ShapeId | undefined;
}

/**
 * Creates or retrieves a cached server snapshot function for a given mapId.
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => ShapeId | undefined {
  return store.getAction(
    mapId,
    'serverSnapshot' as keyof ShapeSelectionActions,
    () =>
      (() =>
        undefined) as unknown as ShapeSelectionActions[keyof ShapeSelectionActions],
  ) as unknown as () => ShapeId | undefined;
}

/**
 * Creates or retrieves a cached setSelectedId function for a given mapId.
 */
export function getOrCreateSetSelectedId(
  mapId: UniqueId,
): (id: ShapeId | undefined) => void {
  return store.getAction(mapId, 'setSelectedId', () => {
    return (id: ShapeId | undefined) => {
      const currentId = store.getState(mapId).selectedId;

      if (id === undefined && currentId !== undefined) {
        // Emit deselection event
        shapeBus.emit(ShapeEvents.deselected, { mapId });
      } else if (id !== undefined && currentId !== id) {
        // Emit selection event
        shapeBus.emit(ShapeEvents.selected, { shapeId: id, mapId });
      }
    };
  });
}

/**
 * Creates or retrieves a cached clearSelection function for a given mapId.
 */
export function getOrCreateClearSelection(mapId: UniqueId): () => void {
  return store.getAction(mapId, 'clearSelection', () => {
    return () => {
      shapeBus.emit(ShapeEvents.deselected, { mapId });
    };
  });
}

/**
 * Get the current selected shape ID for a given map instance (direct access, not reactive).
 * @internal - For internal map-toolkit use only
 */
export function getSelectedShapeId(mapId: UniqueId): ShapeId | undefined {
  return store.getState(mapId).selectedId;
}

/**
 * Manually clear all selection state for a specific mapId.
 */
export function clearSelectionState(mapId: UniqueId): void {
  store.clear(mapId);
}
