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

/**
 * Default entity-ID accessor. Reads `item.id` directly.
 *
 * Exported so consumers can reference the same fallback that `useCoffinCorner`
 * uses when no custom `getEntityId` option is passed.
 *
 * @example
 * ```typescript
 * // Use when building a custom hook that mirrors useCoffinCorner's fallback.
 * const accessor = options?.getEntityId ?? defaultGetEntityId;
 * ```
 */
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

/**
 * Register (or update) a layer's entity-id accessor so that coffin corner
 * bus handlers can resolve picked entities on click/hover.
 *
 * Writes to a plain module-level Map — intentionally non-reactive. Calling
 * this during a React mount cycle does NOT trigger store subscribers and
 * will NOT cause sibling components to re-render.
 *
 * Most consumers should call `useCoffinCorner`, which invokes this
 * internally. Use the raw function only when building a custom hook or
 * non-React integration.
 *
 * @param mapId - The BaseMap instance owning this layer.
 * @param layerId - The deck.gl layer ID to associate the accessor with.
 * @param getEntityId - Extracts an entity ID from a picked data item.
 *
 * @example
 * ```typescript
 * registerCoffinCornerLayer(mapId, 'klv-tracks', (item) => item.properties.id);
 * // ...later, when tearing down:
 * unregisterCoffinCornerLayer(mapId, 'klv-tracks');
 * ```
 */
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

/**
 * Remove a layer's coffin-corner registration. After this call, bus handlers
 * will ignore clicks and hovers on this layer until it is registered again.
 *
 * Non-reactive — does not notify store subscribers.
 *
 * @param mapId - The BaseMap instance owning this layer.
 * @param layerId - The deck.gl layer ID to unregister.
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   registerCoffinCornerLayer(mapId, layerId, getEntityId);
 *   return () => unregisterCoffinCornerLayer(mapId, layerId);
 * }, [mapId, layerId, getEntityId]);
 * ```
 */
export function unregisterCoffinCornerLayer(
  mapId: UniqueId,
  layerId: string,
): void {
  const byLayer = layerRegistry.get(mapId);
  if (!byLayer) return;
  byLayer.delete(layerId);
  if (byLayer.size === 0) layerRegistry.delete(mapId);
}

function getRegisteredLayers(
  mapId: UniqueId,
): Map<string, GetEntityId> | undefined {
  return layerRegistry.get(mapId);
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
 * The owning mapId is supplied to actions/bus via closure (see createMapStore)
 * rather than carried in state, so it can't be accidentally unset or asserted
 * with a type lie.
 */
type CoffinCornerState = {
  /** Map of layerId -> layer state */
  layers: Map<string, LayerState>;
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

/** Shared sentinel returned by readLayer when a layer has no state entry yet. */
const EMPTY_LAYER: LayerState = Object.freeze({
  selectedId: undefined,
  hoveredId: undefined,
}) as LayerState;

/**
 * Get or synthesize an ephemeral layer state entry. Does NOT write to state.
 */
function readLayer(state: CoffinCornerState, layerId: string): LayerState {
  return state.layers.get(layerId) ?? EMPTY_LAYER;
}

/**
 * Coffin corner store — manages selection and hover state per map instance,
 * keyed by layer ID. One store instance per `BaseMap` via `createMapStore`.
 *
 * Subscribes to map bus events (click/hover) and translates them into coffin
 * corner domain events. Layer registration (tracking which layers exist and
 * their entity-ID accessors) lives in a non-reactive side-table — see
 * `registerCoffinCornerLayer` — so new layers can be added without forcing a
 * re-render in sibling components.
 *
 * Most consumers should use the `useCoffinCorner` hook, which subscribes and
 * registers automatically. Use `coffinCornerStore` directly only for
 * imperative access (tests, non-React integrations).
 *
 * @example
 * ```tsx
 * const { state, setSelectedId, deselect } = coffinCornerStore.use(mapId);
 * const { selectedId, hoveredId } = state.layers.get('klv-tracks') ?? {};
 * ```
 */
export const coffinCornerStore = createMapStore<
  CoffinCornerState,
  CoffinCornerActions
>({
  defaultState: {
    layers: new Map(),
  },

  // Actions emit domain events rather than calling set() directly.
  // The bus subscriptions below translate events → state, ensuring
  // all state changes are observable by external subscribers.
  actions: (mapId, { get }) => ({
    setSelectedId: (layerId: string, id: EntityId | undefined) => {
      const state = get();
      const currentId = readLayer(state, layerId).selectedId;

      if (id == null && currentId != null) {
        coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
          mapId,
          layerId,
          selectedId: undefined,
        });

        return;
      }

      if (id != null && currentId !== id) {
        coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
          selectedId: id,
          layerId,
          mapId,
        });

        return;
      }
    },

    deselect: (layerId: string) => {
      coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
        mapId,
        layerId,
        selectedId: undefined,
      });
    },
  }),

  bus: (mapId, { get, set }) => {
    // Domain events → state
    const onSelected = coffinCornerEventBus.on(
      CoffinCornerEvents.SELECTED,
      (event) => {
        if (event.payload.mapId !== mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const state = get();
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
        if (event.payload.mapId !== mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const state = get();
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
        if (event.payload.mapId !== mapId) {
          return;
        }

        const layerId = event.payload.layerId;
        if (!layerId) {
          return;
        }

        const state = get();
        const layer = readLayer(state, layerId);
        if (layer.hoveredId !== event.payload.hoveredId) {
          const newLayer = { ...layer, hoveredId: event.payload.hoveredId };
          set({ layers: mapSet(state.layers, layerId, newLayer) });
        }
      },
    );

    // Map clicks → domain events
    const onClick = mapEventBus.on(MapEvents.click, (event: MapClickEvent) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const { info } = event.payload;
      const clickedLayerId = info.layerId;
      const state = get();

      // If clicking empty space, deselect all currently-selected layers
      if (info.index === -1) {
        for (const [layerId, layerState] of state.layers.entries()) {
          if (layerState.selectedId !== undefined) {
            coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
              mapId,
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

      const getEntityId = getRegisteredLayers(mapId)?.get(clickedLayerId);
      if (!getEntityId) {
        return;
      }

      if (info.object) {
        const entityId = getEntityId(info.object);
        const currentSelected = readLayer(state, clickedLayerId).selectedId;

        if (currentSelected === entityId) {
          coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
            mapId,
            layerId: clickedLayerId,
            selectedId: undefined,
          });
        } else {
          coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
            selectedId: entityId,
            layerId: clickedLayerId,
            mapId,
          });
        }
      }
    });

    // Map hovers → domain events
    const onHover = mapEventBus.on(MapEvents.hover, (event: MapHoverEvent) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const registeredLayers = getRegisteredLayers(mapId);
      if (!registeredLayers) {
        return;
      }

      const { info } = event.payload;
      const hoveredLayerId = info.layerId;
      const state = get();

      // Walk every registered layer so we can emit an "unhover" event
      // for a layer when the pointer moves off of it. Iterate the registry's
      // entries directly so we pay only one outer Map.get(mapId) per event
      // (hover fires at ~60 fps during mouse movement).
      for (const [layerId, accessor] of registeredLayers) {
        const hoveredId =
          hoveredLayerId === layerId && info.object
            ? accessor(info.object)
            : undefined;

        const currentHovered = readLayer(state, layerId).hoveredId;
        if (currentHovered !== hoveredId) {
          coffinCornerEventBus.emit(CoffinCornerEvents.HOVERED, {
            hoveredId,
            layerId,
            mapId,
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
