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
import { createMapStore } from '@/shared/create-map-store';
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
const defaultGetEntityId: GetEntityId = (item: any) => item.id as EntityId;

/**
 * State for coffin corner selection and hover
 */
type CoffinCornerState = {
  selectedId: EntityId | undefined;
  hoveredId: EntityId | undefined;
  layerId: string | undefined;
  getEntityId: GetEntityId;
};

/**
 * Actions for coffin corner interactions
 */
type CoffinCornerActions = {
  setSelectedId: (id: EntityId | undefined) => void;
  clearSelection: () => void;
  setLayerId: (layerId: string) => void;
  setGetEntityId: (fn: GetEntityId) => void;
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
 * const { state, setSelectedId, clearSelection } = coffinCornerStore.use(mapId);
 * ```
 */
export const coffinCornerStore = createMapStore<
  CoffinCornerState,
  CoffinCornerActions
>({
  defaultState: {
    selectedId: undefined,
    hoveredId: undefined,
    layerId: undefined,
    getEntityId: defaultGetEntityId,
  },

  actions: (mapId, { get, set }) => ({
    setSelectedId: (id: EntityId | undefined) => {
      const currentId = get().selectedId;

      if (id == null && currentId != null) {
        coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
          mapId,
          selectedId: undefined,
        });

        return;
      }

      if (id != null && currentId !== id) {
        coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
          selectedId: id,
          mapId,
        });

        return;
      }
    },

    clearSelection: () => {
      coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
        mapId,
        selectedId: undefined,
      });
    },

    setLayerId: (layerId: string) => {
      if (get().layerId !== layerId) {
        set({ layerId });
      }
    },

    setGetEntityId: (fn: GetEntityId) => {
      if (get().getEntityId !== fn) {
        set({ getEntityId: fn });
      }
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

        if (get().selectedId !== event.payload.selectedId) {
          set({ selectedId: event.payload.selectedId });
        }
      },
    );

    const onDeselected = coffinCornerEventBus.on(
      CoffinCornerEvents.DESELECTED,
      (event) => {
        if (event.payload.mapId !== mapId) {
          return;
        }

        if (get().selectedId !== undefined) {
          set({ selectedId: undefined });
        }
      },
    );

    const onHovered = coffinCornerEventBus.on(
      CoffinCornerEvents.HOVERED,
      (event) => {
        if (event.payload.mapId !== mapId) {
          return;
        }
        if (get().hoveredId !== event.payload.hoveredId) {
          set({ hoveredId: event.payload.hoveredId });
        }
      },
    );

    // Map clicks → domain events
    const onClick = mapEventBus.on(MapEvents.click, (event: MapClickEvent) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const { info } = event.payload;
      const { layerId, selectedId } = get();

      if (info.layerId === layerId && info.object) {
        const entityId = get().getEntityId(info.object);

        if (selectedId === entityId) {
          coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
            mapId,
            selectedId: undefined,
          });
        } else {
          coffinCornerEventBus.emit(CoffinCornerEvents.SELECTED, {
            selectedId: entityId,
            mapId,
          });
        }

        return;
      }

      if (info.index === -1 && selectedId !== undefined) {
        coffinCornerEventBus.emit(CoffinCornerEvents.DESELECTED, {
          mapId,
          selectedId: undefined,
        });
      }
    });

    // Map hovers → domain events
    const onHover = mapEventBus.on(MapEvents.hover, (event: MapHoverEvent) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const { info } = event.payload;
      const { layerId } = get();

      const hoveredId =
        info.layerId === layerId && info.object
          ? get().getEntityId(info.object)
          : undefined;

      if (get().hoveredId !== hoveredId) {
        coffinCornerEventBus.emit(CoffinCornerEvents.HOVERED, {
          hoveredId,
          mapId,
        });
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
 * @returns The selected entity ID, or undefined if nothing is selected.
 *
 * @example
 * ```typescript
 * const selectedId = getSelectedEntityId(mapId);
 * ```
 */
export function getSelectedEntityId(mapId: UniqueId): EntityId | undefined {
  return coffinCornerStore.get(mapId).selectedId;
}

/**
 * Get hovered entity ID imperatively (non-reactive).
 *
 * @param mapId - The map instance to query.
 * @returns The hovered entity ID, or undefined if nothing is hovered.
 *
 * @example
 * ```typescript
 * const hoveredId = getHoveredEntityId(mapId);
 * ```
 */
export function getHoveredEntityId(mapId: UniqueId): EntityId | undefined {
  return coffinCornerStore.get(mapId).hoveredId;
}

/**
 * Clear selection state (for tests/cleanup).
 *
 * @param mapId - The map instance to clear selection for.
 *
 * @example
 * ```typescript
 * clearSelection(mapId);
 * ```
 */
export function clearSelection(mapId: UniqueId): void {
  coffinCornerStore.clear(mapId);
}
