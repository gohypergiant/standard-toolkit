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
 * Shape Selection Store
 *
 * Manages shape selection state per map instance.
 *
 * @example
 * ```tsx
 * import { shapeSelectionStore } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * function ShapePanel({ mapId }) {
 *   const { state, setSelectedId, clearSelection } = shapeSelectionStore.use(mapId);
 *
 *   return (
 *     <div>
 *       <p>Selected: {state.selectedId ?? 'none'}</p>
 *       <button onClick={() => setSelectedId('shape-1')}>Select Shape 1</button>
 *       <button onClick={clearSelection}>Clear</button>
 *     </div>
 *   );
 * }
 *
 * // Or with selector for specific values:
 * function SelectedIndicator({ mapId }) {
 *   const selectedId = shapeSelectionStore.useSelector(
 *     mapId,
 *     (s) => s.selectedId
 *   );
 *   return selectedId ? <Badge>Selected</Badge> : null;
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { createMapStore } from '@/shared/create-map-store';
import { MapEvents } from '../../base-map/events';
import { ShapeEvents } from '../shared/events';
import type { UniqueId } from '@accelint/core';
import type { MapClickEvent, MapEventType } from '../../base-map/types';
import type { ShapeEvent } from '../shared/events';
import type { ShapeId } from '../shared/types';

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
  /** Set the selected shape ID (emits appropriate events) */
  setSelectedId: (id: ShapeId | undefined) => void;
  /** Clear the current selection */
  clearSelection: () => void;
};

const shapeBus = Broadcast.getInstance<ShapeEvent>();
const mapBus = Broadcast.getInstance<MapEventType>();

/**
 * Shape selection store
 */
export const shapeSelectionStore = createMapStore<
  ShapeSelectionState,
  ShapeSelectionActions
>({
  defaultState: { selectedId: undefined },

  actions: (mapId, { get }) => ({
    setSelectedId: (id: ShapeId | undefined) => {
      const currentId = get().selectedId;

      if (id === undefined && currentId !== undefined) {
        // Emit deselection event
        shapeBus.emit(ShapeEvents.deselected, { mapId });
      } else if (id !== undefined && currentId !== id) {
        // Emit selection event
        shapeBus.emit(ShapeEvents.selected, { shapeId: id, mapId });
      }
    },

    clearSelection: () => {
      shapeBus.emit(ShapeEvents.deselected, { mapId });
    },
  }),

  bus: (mapId, { get, set }) => {
    // Listen for shape selection events
    const unsubSelected = shapeBus.on(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== mapId) {
        return;
      }
      if (get().selectedId !== event.payload.shapeId) {
        set({ selectedId: event.payload.shapeId });
      }
    });

    // Listen for shape deselection events
    const unsubDeselected = shapeBus.on(ShapeEvents.deselected, (event) => {
      if (event.payload.mapId !== mapId) {
        return;
      }
      if (get().selectedId !== undefined) {
        set({ selectedId: undefined });
      }
    });

    // Listen for map clicks to detect clicks on empty space
    const unsubClick = mapBus.on(MapEvents.click, (event: MapClickEvent) => {
      // Deselect if clicked on empty space (index === -1)
      if (
        get().selectedId !== undefined &&
        event.payload.id === mapId &&
        event.payload.info.index === -1
      ) {
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
// Convenience exports for common patterns
// =============================================================================

/**
 * Hook for shape selection - primary API
 *
 * @example
 * ```tsx
 * const { state, setSelectedId, clearSelection } = useSelectShape(mapId);
 * ```
 */
export const useSelectShape = shapeSelectionStore.use;

/**
 * Hook to get just the selected ID
 *
 * @example
 * ```tsx
 * const selectedId = useSelectedShapeId(mapId);
 * ```
 */
export function useSelectedShapeId(mapId: UniqueId): ShapeId | undefined {
  return shapeSelectionStore.useSelector(mapId, (s) => s.selectedId);
}

/**
 * Get selected shape ID imperatively (non-reactive)
 */
export function getSelectedShapeId(mapId: UniqueId): ShapeId | undefined {
  return shapeSelectionStore.get(mapId).selectedId;
}

/**
 * Clear selection state (for tests/cleanup)
 */
export function clearSelectionState(mapId: UniqueId): void {
  shapeSelectionStore.clear(mapId);
}
