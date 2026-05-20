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

import 'client-only';
import { useContext, useMemo } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import { modeStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { DefaultMode } from './store';

/**
 * Return value for the useMapMode hook.
 *
 * @typeParam TMode - String union of mode names the caller intends to use. `'default'` is always included.
 * @typeParam TOwner - String union of owner ids the caller intends to use.
 */
export type UseMapModeReturn<TMode = string, TOwner = string> = {
  /** The current active map mode */
  mode: TMode;
  /** Function to request a mode change with ownership */
  requestModeChange: (desiredMode: TMode, requestOwner: TOwner) => void;
};

/**
 * Hook to access the map mode state and actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to map mode state changes,
 * providing concurrent-safe mode state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * @typeParam TMode - String union of mode names the caller intends to use. `'default'`
 *   is always added to the returned `mode` type. The narrowing is advisory — the
 *   underlying store accepts any string, so values arriving from other bus
 *   participants are not validated against this union.
 * @typeParam TOwner - String union of owner ids the caller intends to use when
 *   calling `requestModeChange`. Same advisory caveat as `TMode`.
 * @param id - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @returns The current map mode and requestModeChange function
 * @throws Error if no `id` is provided and hook is used outside of `MapProvider`
 *
 * @example
 * ```tsx
 * // Inside MapProvider (within BaseMap children) - uses context
 * // Only Deck.gl layer components can be children
 * function CustomDeckLayer() {
 *   const { mode, requestModeChange } = useMapMode();
 *
 *   const handleClick = (info: PickingInfo) => {
 *     requestModeChange('editing', 'custom-layer-id');
 *   };
 *
 *   return <ScatterplotLayer onClick={handleClick} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapProvider - pass id directly
 * function ExternalControl({ mapId }: { mapId: UniqueId }) {
 *   const { mode, requestModeChange } = useMapMode(mapId);
 *
 *   return <button onClick={() => requestModeChange('default', 'external')}>
 *     Reset to Default (current: {mode})
 *   </button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Narrow mode and owner types at the call site
 * type Mode = 'drawing' | 'measuring';
 * type Owner = 'drawing-toolbar' | 'details-panel';
 *
 * function DrawingToolbar({ mapId }: { mapId: UniqueId }) {
 *   const { mode, requestModeChange } = useMapMode<Mode, Owner>(mapId);
 *   // mode: 'drawing' | 'measuring' | 'default'
 *   // requestModeChange rejects strings outside the Mode / Owner unions
 *   return <button onClick={() => requestModeChange('drawing', 'drawing-toolbar')}>Draw</button>;
 * }
 * ```
 */
export function useMapMode<
  TMode extends string = string,
  TOwner extends string = string,
>(id?: UniqueId): UseMapModeReturn<TMode | DefaultMode, TOwner> {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapMode requires either an id parameter or to be used within a MapProvider',
    );
  }

  // Use selector to get just the mode string (primitive comparison works with useSyncExternalStore)
  const mode = modeStore.useSelector(actualId, (state) => state.mode);

  // Get actions separately (stable reference)
  const { requestModeChange } = modeStore.actions(actualId);

  // Generics are advisory: the store accepts any string, so these casts narrow
  // the surface for callers but don't validate values arriving from the bus.
  return useMemo(
    () =>
      ({ mode, requestModeChange }) as UseMapModeReturn<
        TMode | DefaultMode,
        TOwner
      >,
    [mode, requestModeChange],
  );
}
