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

import { clearCameraState } from '../camera/store';
import { clearCursorCoordinateState } from '../cursor-coordinates/store';
import { clearSelectionState } from '../deckgl/shapes/display-shape-layer/store';
import { clearDrawingState } from '../deckgl/shapes/draw-shape-layer/store';
import { clearEditingState } from '../deckgl/shapes/edit-shape-layer/store';
import { clearCursorState } from '../map-cursor/store';
import { clearMapModeState } from '../map-mode/store';
import { clearViewportState } from '../viewport/store';
import type { UniqueId } from '@accelint/core';

/**
 * Tracks how many times each map instance has been cleaned up.
 *
 * This counter is module-level (not React state), so React 19's Activity component
 * does NOT preserve it across deactivation/reactivation cycles. Each time
 * `clearAllMapStores` runs (during Activity deactivation cleanup), the generation
 * increments. On reactivation, `BaseMap` reads the new generation during render and
 * passes it as `key` to `<MapLibre>`, forcing a clean remount of react-map-gl's Map
 * component — which resets `mapInstance` to `null` and prevents the crash caused by
 * `setProps` being called on a destroyed MapLibre instance (one whose `map.style` was
 * set to `undefined` by `map.remove()`).
 */
const mapGenerations = new Map<UniqueId, number>();

/**
 * Returns the current generation counter for a map instance.
 *
 * Use as a `key` prop on `<MapLibre>` to force a clean remount whenever the map's
 * stores are cleared (e.g., on Activity deactivation).
 *
 * @param mapId - The map instance ID
 * @returns The current generation (0 on first render, increments with each cleanup)
 */
export function getMapGeneration(mapId: UniqueId): number {
  return mapGenerations.get(mapId) ?? 0;
}

/**
 * Clears ALL map store state for a given map instance.
 *
 * This function calls cleanup for every store in the map-toolkit. It's called
 * automatically by MapProvider when a map instance unmounts.
 *
 * **⚠️ IMPORTANT: When creating a new store with createMapStore():**
 * 1. Export a `clear*State(mapId)` function from your store
 * 2. Import and add it to this `clearAllMapStores()` function
 * 3. The cleanup function should call your store's internal cleanup mechanism
 *
 * @param mapId - The map instance ID to clean up
 *
 * @example
 * ```typescript
 * // In your store file (e.g., my-feature/store.ts)
 * export function clearMyFeatureState(mapId: UniqueId): void {
 *   myFeatureStore.cleanup(mapId);
 * }
 *
 * // Then add to this file:
 * import { clearMyFeatureState } from '../my-feature/store';
 *
 * export function clearAllMapStores(mapId: UniqueId): void {
 *   // ... existing cleanups
 *   clearMyFeatureState(mapId);
 * }
 * ```
 */
export function clearAllMapStores(mapId: UniqueId): void {
  // Increment generation so BaseMap's next render passes a new key to <MapLibre>,
  // forcing a clean remount and resetting react-map-gl's internal mapInstance state.
  const nextGen = (mapGenerations.get(mapId) ?? 0) + 1;
  mapGenerations.set(mapId, nextGen);

  // Core stores
  clearMapModeState(mapId);
  clearCursorState(mapId);
  clearCameraState(mapId);
  clearViewportState(mapId);
  clearCursorCoordinateState(mapId);

  // Shape layer stores
  clearDrawingState(mapId);
  clearEditingState(mapId);
  clearSelectionState(mapId);
}
