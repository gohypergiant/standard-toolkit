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
import { coffinCornerStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { EntityId } from './types';

/**
 * Return type for useCoffinCorner hook
 */
export interface UseCoffinCornerReturn {
  /** Currently selected entity ID, or undefined if nothing selected */
  selectedId: EntityId | undefined;
  /** Currently hovered entity ID, or undefined if nothing hovered */
  hoveredId: EntityId | undefined;
  /** Set the selected entity ID */
  setSelectedId: (id: EntityId | undefined) => void;
  /** Clear the current selection */
  clearSelection: () => void;
}

/**
 * Hook to manage coffin corner entity selection state.
 *
 * Automatically subscribes to map bus events for the given map and layer,
 * so you don't need onClick/onHover callbacks on the layer.
 *
 * @param mapId - The BaseMap instance ID
 * @param layerId - The deck.gl layer ID to listen for interactions on
 *
 * @example
 * ```tsx
 * import { useCoffinCorner } from '@accelint/map-toolkit/deckgl/extensions/coffin-corner';
 *
 * function MapWithIcons({ mapId }) {
 *   const { selectedId } = useCoffinCorner(mapId, 'base-icons');
 *
 *   return (
 *     <iconLayer
 *       id="base-icons"
 *       pickable
 *       autoHighlight
 *       extensions={[coffinCornersExtension]}
 *       coffinCornersSelectedId={selectedId}
 *     />
 *   );
 * }
 * ```
 */
export function useCoffinCorner(
  mapId: UniqueId,
  layerId: string,
): UseCoffinCornerReturn {
  const { state, setSelectedId, clearSelection, setLayerId } =
    coffinCornerStore.use(mapId);

  // Unlike a CompositeLayer, CoffinCornersExtension is a shader-only plugin
  // with no picking handlers. The store must filter raw map bus events by
  // layerId to know which clicks/hovers belong to this extension's layer.
  useEffect(() => {
    setLayerId(layerId);
  }, [setLayerId, layerId]);

  return {
    selectedId: state.selectedId,
    hoveredId: state.hoveredId,
    setSelectedId,
    clearSelection,
  };
}
