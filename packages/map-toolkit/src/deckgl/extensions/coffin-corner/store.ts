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

'use client';

import { Broadcast } from '@accelint/bus';
import { createMapStore, mapDelete, mapSet } from '@/shared/create-map-store';
import { MapEvents } from '../../base-map/events';
import { CoffinCornerEvents } from './types';
import type { UniqueId } from '@accelint/core';
import type {
  MapClickEvent,
  MapEventType,
  MapHoverEvent,
} from '../../base-map/types';
import type { CoffinCornerEvent, EntityId } from './types';

/** Extracts an entity ID from a picked data item. */
// biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at store level.
type GetEntityId = (item: any) => EntityId;

/** Default accessor — assumes the data item has an `id` property. */
// biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at store level.
export const defaultGetEntityId: GetEntityId = (item: any) =>
  item.id as EntityId;

// =============================================================================
// Non-reactive layer registry
// =============================================================================
// Layer registration (getEntityId accessor + "is this layer tracked?") is held
// OUTSIDE the reactive store. Writing to reactive state during mount — even
// silently via setInitialState — causes useSyncExternalStore's post-commit
// snapshot-consistency check to schedule a re-render, which desyncs deck.gl
// from maplibre's viewport transforms. Plain Map writes are invisible to React.

const layerRegistry = new Map<UniqueId, Map<string, GetEntityId>>();

/** Register (or update) a layer's entity-id accessor. Non-reactive. */
export function registerCoffinCornerLayer(
  mapId: UniqueId,
  layerId: string,
  getEntityId: GetEntityId,
): void {
  let byLayer = layerRegistry.get(mapId);
  if (!byLayer) {
    byLayer = new Map();
    layerRegistry.set(mapId, byLayer);
  }
  byLayer.set(layerId, getEntityId);
}

/** Remove a layer's registration. Non-reactive. */
export function unregisterCoffinCornerLayer(
  mapId: UniqueId,
  layerId: string,
): void {
  const byLayer = layerRegistry.get(mapId);
  if (!byLayer) return;
  byLayer.delete(layerId);
  if (byLayer.size === 0) layerRegistry.delete(mapId);
}

function getRegisteredAccessor(
  mapId: UniqueId,
  layerId: string,
): GetEntityId | undefined {
  return layerRegistry.get(mapId)?.get(layerId);
}

function getRegisteredLayerIds(mapId: UniqueId): Iterable<string> {
  return layerRegistry.get(mapId)?.keys() ?? [];
}

/**
 * State for a single layer's coffin corner selection and hover.
 * Accessor lives in the non-reactive layerRegistry above.
 */
type LayerState = {
  /** Currently selected entity ID, or undefined if nothing is selected. */
  selectedId: EntityId | undefined;
  /** Currently hovered entity ID, or undefined if nothing is hovered. */
  hoveredId: EntityId | undefined;
};

/**
 * State for coffin corner - manages multiple layers per map.
 */
type CoffinCornerState = {
  /** Map of layerId -> layer state */
  layers: Map<string, LayerState>;
  /** Map ID for filtering map bus events */
  mapId: UniqueId;
};

/**
 * Actions for coffin corner interactions.
 */
type CoffinCornerActions = {
  /** Select an entity by ID (emits domain event). Pass undefined to deselect. */
  setSelectedId: (layerId: string, id: EntityId | undefined) => void;
  /** Clear the current selection (emits deselect domain event). */
  deselect: (layerId: string) => void;
};

const coffinCornerEventBus = Broadcast.getInstance<CoffinCornerEvent>();
const mapEventBus = Broadcast.getInstance<MapEventType>();

/**
 * Coffin corner store - manages selection and hover state per map instance.
 *
 * Subscribes to map bus events for click/hover interactions and translates
 * them into coffin corner domain events. The hook only needs to pass the
 * layer ID — all subscription management lives here.
 *
 * @example
 * ```tsx
 * const { state, setSelectedId, deselect } = coffinCornerStore.use(mapId);
 * ```
 */
/**
 * Get or synthesize an ephemeral layer state entry. Does NOT write to state.
 */
function readLayer(state: CoffinCornerState, layerId: string): LayerState {
  return (
    state.layers.get(layerId) ?? {
      selectedId: undefined,
      hoveredId: undefined,
    }
  );
}

export const coffinCornerStore = createMapStore<
  CoffinCornerState,
  CoffinCornerActions
>({
  defaultState: {
    layers: new Map(),
    mapId: '' as UniqueId,
  },

  // Actions emit domain events rather than calling set() directly.
  // The bus subscriptions below translate events → state, ensuring
  // all state changes are observable by external subscribers.
  actions: (_mapId, { get }) => ({
    setSelectedId: (layerId: string, id: EntityId | undefined) => {
      const state = get();
      const currentId = readLayer(state, layerId).selectedId;

      if (id == null && currentId != null) {
        coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
          mapId: state.mapId,
          layerId,
          selectedId: undefined,
        });

        return;
      }

      if (id != null && currentId !== id) {
        coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
          selectedId: id,
          layerId,
          mapId: state.mapId,
        });

        return;
      }
    },

    deselect: (layerId: string) => {
      coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
        mapId: get().mapId,
        layerId,
        selectedId: undefined,
      });
    },
  }),

  bus: (_mapId, { get, set }) => {
    // Domain events → state
    const onSelected = coffinCornerEventBus.on(
      CoffinCornerEvents.SELECTED,
      (event) => {
        const state = get();
        if (event.payload.mapId !== state.mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const layer = readLayer(state, layerId);
        if (layer.selectedId !== event.payload.selectedId) {
          const newLayer = { ...layer, selectedId: event.payload.selectedId };
          set({ layers: mapSet(state.layers, layerId, newLayer) });
        }
      },
    );

    const onDeselected = coffinCornerEventBus.on(
      CoffinCornerEvents.DESELECTED,
      (event) => {
        const state = get();
        if (event.payload.mapId !== state.mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const layer = state.layers.get(layerId);
        if (layer && layer.selectedId !== undefined) {
          const newLayer = { ...layer, selectedId: undefined };
          set({ layers: mapSet(state.layers, layerId, newLayer) });
        }
      },
    );

    const onHovered = coffinCornerEventBus.on(
      CoffinCornerEvents.HOVERED,
      (event) => {
        const state = get();
        if (event.payload.mapId !== state.mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const layer = readLayer(state, layerId);
        if (layer.hoveredId !== event.payload.hoveredId) {
          const newLayer = { ...layer, hoveredId: event.payload.hoveredId };
          set({ layers: mapSet(state.layers, layerId, newLayer) });
        }
      },
    );

    // Map clicks → domain events
    const onClick = mapEventBus.on(MapEvents.click, (event: MapClickEvent) => {
      const state = get();
      if (event.payload.id !== state.mapId) {
        return;
      }

      const { info } = event.payload;
      const clickedLayerId = info.layerId;

      // If clicking empty space, deselect all currently-selected layers
      if (info.index === -1) {
        for (const [layerId, layerState] of state.layers.entries()) {
          if (layerState.selectedId !== undefined) {
            coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
              mapId: state.mapId,
              layerId,
              selectedId: undefined,
            });
          }
        }
        return;
      }

      // Check if the clicked layer is registered (via useCoffinCorner)
      if (!clickedLayerId) {
        return;
      }

      const getEntityId = getRegisteredAccessor(state.mapId, clickedLayerId);
      if (!getEntityId) {
        return;
      }

      if (info.object) {
        const entityId = getEntityId(info.object);
        const currentSelected = readLayer(state, clickedLayerId).selectedId;

        if (currentSelected === entityId) {
          coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
            mapId: state.mapId,
            layerId: clickedLayerId,
            selectedId: undefined,
          });
        } else {
          coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
            selectedId: entityId,
            layerId: clickedLayerId,
            mapId: state.mapId,
          });
        }
      }
    });

    // Map hovers → domain events
    const onHover = mapEventBus.on(MapEvents.hover, (event: MapHoverEvent) => {
      const state = get();
      if (event.payload.id !== state.mapId) {
        return;
      }

      const { info } = event.payload;
      const hoveredLayerId = info.layerId;

      // Walk every registered layer so we can emit an "unhover" event
      // for a layer when the pointer moves off of it.
      for (const layerId of getRegisteredLayerIds(state.mapId)) {
        const accessor = getRegisteredAccessor(state.mapId, layerId);
        const hoveredId =
          accessor && hoveredLayerId === layerId && info.object
            ? accessor(info.object)
            : undefined;

        const currentHovered = readLayer(state, layerId).hoveredId;
        if (currentHovered !== hoveredId) {
          coffinCornerEventBus.emit(CoffinCornerEvents.HOVERED, {
            hoveredId,
            layerId,
            mapId: state.mapId,
          });
        }
      }
    });

    return () => {
      onSelected();
      onDeselected();
      onHovered();
      onClick();
      onHover();
    };
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Get selected entity ID imperatively (non-reactive).
 *
 * @param mapId - The map instance to query.
 * @param layerId - The deck.gl layer ID.
 * @returns The selected entity ID, or undefined if nothing is selected.
 *
 * @example
 * ```typescript
 * const selectedId = getSelectedEntityId(mapId, 'klv-tracks');
 * ```
 */
export function getSelectedEntityId(
  mapId: UniqueId,
  layerId: string,
): EntityId | undefined {
  const state = coffinCornerStore.get(mapId);
  const layer = state.layers.get(layerId);
  return layer?.selectedId;
}

/**
 * Get hovered entity ID imperatively (non-reactive).
 *
 * @param mapId - The map instance to query.
 * @param layerId - The deck.gl layer ID.
 * @returns The hovered entity ID, or undefined if nothing is hovered.
 *
 * @example
 * ```typescript
 * const hoveredId = getHoveredEntityId(mapId, 'klv-tracks');
 * ```
 */
export function getHoveredEntityId(
  mapId: UniqueId,
  layerId: string,
): EntityId | undefined {
  const state = coffinCornerStore.get(mapId);
  const layer = state.layers.get(layerId);
  return layer?.hoveredId;
}

/**
 * Clear selection state (for tests/cleanup).
 * If layerId is provided, clears only that layer's state.
 * If layerId is omitted, clears all layers for the map.
 *
 * @param mapId - The map instance to clear selection for.
 * @param layerId - Optional deck.gl layer ID. If omitted, clears entire map state.
 *
 * @example
 * ```typescript
 * // Clear all layers for a map
 * clearSelection(mapId);
 *
 * // Clear specific layer
 * clearSelection(mapId, 'klv-tracks');
 * ```
 */
export function clearSelection(mapId: UniqueId, layerId?: string): void {
  if (layerId) {
    const state = coffinCornerStore.get(mapId);
    const newLayers = mapDelete(state.layers, layerId);
    coffinCornerStore.set(mapId, { layers: newLayers });
  } else {
    coffinCornerStore.clear(mapId);
  }
}
