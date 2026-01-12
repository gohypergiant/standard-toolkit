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

import { shapeSelectionStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { ShapeId } from '../shared/types';

/**
 * Return type for useSelectShape hook
 */
export interface UseSelectShapeReturn {
  /** Currently selected shape ID, or undefined if nothing selected */
  selectedId: ShapeId | undefined;
  /** Manually set the selected shape ID (useful for programmatic selection) */
  setSelectedId: (id: ShapeId | undefined) => void;
  /** Manually clear the selection */
  clearSelection: () => void;
}

/**
 * Hook to manage shape selection state with automatic deselection
 *
 * This hook encapsulates the common pattern of:
 * 1. Listening to `shapes:selected` events and updating state
 * 2. Listening to `shapes:deselected` events and clearing state
 * 3. Listening to map clicks on empty space and emitting `shapes:deselected`
 *
 * Uses a store pattern with `useSyncExternalStore` for proper listener cleanup
 * during HMR (Hot Module Replacement) in development. The store ensures only
 * one bus listener exists per map instance, regardless of how many React
 * components subscribe.
 *
 * @param mapId - The map instance ID for event filtering
 * @returns Selection state and control functions
 *
 * @example Basic usage
 * ```tsx
 * import { useSelectShape } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * function MapWithShapes() {
 *   const { selectedId } = useSelectShape(MAP_ID);
 *
 *   return (
 *     <BaseMap id={MAP_ID}>
 *       <displayShapeLayer
 *         id="shapes"
 *         mapId={MAP_ID}
 *         data={shapes}
 *         selectedShapeId={selectedId}
 *       />
 *     </BaseMap>
 *   );
 * }
 * ```
 *
 * @example With programmatic selection control
 * ```tsx
 * function MapWithShapes() {
 *   const { selectedId, setSelectedId, clearSelection } = useSelectShape(MAP_ID);
 *
 *   return (
 *     <>
 *       <button onClick={() => setSelectedId(shapes[0].id)}>Select First Shape</button>
 *       <button onClick={clearSelection}>Clear Selection</button>
 *       <BaseMap id={MAP_ID}>
 *         <displayShapeLayer
 *           id="shapes"
 *           mapId={MAP_ID}
 *           data={shapes}
 *           selectedShapeId={selectedId}
 *         />
 *       </BaseMap>
 *     </>
 *   );
 * }
 * ```
 */
export function useSelectShape(mapId: UniqueId): UseSelectShapeReturn {
  const { state, setSelectedId, clearSelection } =
    shapeSelectionStore.use(mapId);

  return {
    selectedId: state.selectedId,
    setSelectedId,
    clearSelection,
  };
}
