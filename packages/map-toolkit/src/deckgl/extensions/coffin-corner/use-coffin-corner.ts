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

import { useEffect } from 'react';
import { coffinCornerStore, defaultGetEntityId } from './store';
import type { UniqueId } from '@accelint/core';
import type { EntityId } from './types';

/**
 * Return type for useCoffinCorner hook
 */
export type UseCoffinCornerReturn = {
  /** Currently selected entity ID, or undefined if nothing selected */
  selectedId: EntityId | undefined;
  /** Currently hovered entity ID, or undefined if nothing hovered */
  hoveredId: EntityId | undefined;
  /** Set the selected entity ID */
  setSelectedId: (id: EntityId | undefined) => void;
  /** Clear the current selection */
  deselect: () => void;
};

/**
 * Options for the useCoffinCorner hook.
 */
export type UseCoffinCornerOptions = {
  /**
   * Accessor to extract an entity ID from a picked data item.
   * Must match the `getEntityId` prop passed to the CoffinCornerExtension.
   * Should be a stable reference (module-level or `useCallback`) to avoid unnecessary store updates on every render.
   * @default (item) => item.id
   */
  // biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at hook level.
  getEntityId?: (item: any) => EntityId;
};

/**
 * Hook to manage coffin corner entity selection state.
 *
 * Automatically subscribes to map bus events for the given map and layer,
 * so you don't need onClick/onHover callbacks on the layer.
 *
 * @param mapId - The BaseMap instance ID
 * @param layerId - The deck.gl layer ID to listen for interactions on
 * @param options - Optional configuration for entity ID extraction
 *
 * @example
 * ```tsx
 * import { useCoffinCorner } from '@accelint/map-toolkit/deckgl/extensions/coffin-corner';
 *
 * function MapWithIcons({ mapId }) {
 *   const { selectedId, hoveredId } = useCoffinCorner(mapId, 'base-icons');
 *
 *   return (
 *     <iconLayer
 *       id="base-icons"
 *       pickable
 *       extensions={[coffinCornerExtension]}
 *       selectedEntityId={selectedId}
 *       hoveredEntityId={hoveredId}
 *     />
 *   );
 * }
 * ```
 *
 * @example Custom entity ID accessor
 * ```tsx
 * const { selectedId, hoveredId } = useCoffinCorner(mapId, 'geojson-icons', {
 *   getEntityId: (d) => d.properties?.shapeId,
 * });
 * ```
 */
export function useCoffinCorner(
  mapId: UniqueId,
  layerId: string,
  options?: UseCoffinCornerOptions,
): UseCoffinCornerReturn {
  const getEntityId = options?.getEntityId;

  // Seed layerId and getEntityId into the store BEFORE use() subscribes and
  // sets up the bus. setInitialState writes directly without calling notify(),
  // so no rerender is triggered. This makes the useEffects below no-ops on
  // first mount, preventing the startup rerender that broke deck.gl/maplibre sync.
  if (!coffinCornerStore.exists(mapId)) {
    coffinCornerStore.setInitialState(mapId, {
      selectedId: undefined,
      hoveredId: undefined,
      layerId,
      getEntityId: getEntityId ?? defaultGetEntityId,
    });
  }

  const { state, setSelectedId, deselect, setLayerId, setGetEntityId } =
    coffinCornerStore.use(mapId);

  // Still needed to handle layerId/getEntityId changes after initial mount.
  // Guarded by equality checks in the store actions, so no-ops when values are unchanged.
  useEffect(() => {
    setLayerId(layerId);
  }, [setLayerId, layerId]);

  useEffect(() => {
    if (getEntityId) {
      setGetEntityId(getEntityId);
    }
  }, [setGetEntityId, getEntityId]);

  return {
    selectedId: state.selectedId,
    hoveredId: state.hoveredId,
    setSelectedId,
    deselect,
  };
}
