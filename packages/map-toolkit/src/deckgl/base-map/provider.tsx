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

'use client';

import 'client-only';
import { createContext, type ReactNode, useEffect } from 'react';
import { destroyStore, getOrCreateStore } from '../../map-mode/store';
import type { UniqueId } from '@accelint/core';

/**
 * React context for map ID.
 * Use the `useMapMode` hook to access the map mode state.
 */
export const MapContext = createContext<UniqueId | null>(null);

/**
 * Props for the MapProvider component.
 */
export type MapProviderProps = {
  /** Child components that will have access to map mode context */
  children: ReactNode;
  /**
   * Unique identifier for this map instance.
   *
   * Used to isolate mode changes between different map instances (e.g., main map vs minimap).
   * This is required and should be provided by the parent component (typically BaseMap).
   *
   * @example
   * ```tsx
   * // Multiple independent map instances
   * const mainMapId = uuid();
   * const minimapId = uuid();
   *
   * <MapProvider id={mainMapId}>
   *  // Map layers and components
   * </MapProvider>
   *
   * <MapProvider id={minimapId}>
   *  // Minimap layers and components
   * </MapProvider>
   * ```
   */
  id: UniqueId;
};

/**
 * Provider component for managing map modes with ownership and authorization.
 *
 * **Note**: This provider is used internally by `BaseMap` and should not be used directly.
 * Consumers should pass the `id` prop to `BaseMap`, which will create this provider automatically.
 *
 * This component uses a hybrid architecture combining React Context (for map instance identity)
 * with an external observable store (for state management). The provider:
 * - Provides a unique `id` via Context
 * - Creates an isolated MapModeStore instance for this map
 * - Allows components to subscribe to mode changes via `useMapMode` hook (which uses `useSyncExternalStore`)
 *
 * The external store manages a state machine for map modes where components can request
 * mode changes with ownership. When a mode is owned by a component, other components
 * must request authorization to change to a different mode. The store handles:
 *
 * - Automatic mode changes when no ownership conflicts exist
 * - Authorization flow when switching between owned modes
 * - Per-mode ownership tracking that persists throughout the session
 * - Pending request management (one pending request per requester)
 * - Auto-acceptance of first pending request when mode owner returns to default
 * - Auto-rejection of other pending requests when one is approved
 * - Event emission through a centralized event bus
 * - Instance isolation for multiple map scenarios (main map + minimap)
 * - Always initializes in 'default' mode
 *
 * ## Instance Isolation
 *
 * Each MapProvider instance operates independently. Mode changes in one instance
 * do not affect other instances, even when multiple maps are rendered on the same page.
 * This enables scenarios like:
 * - Main map in "drawing" mode while minimap stays in "view" mode
 * - Multiple independent map views with different interaction modes
 *
 * Events are scoped to specific instances using the `id` prop. The event bus
 * filters events to ensure each provider only responds to events for its own instance.
 *
 * ## Pending Request Behavior
 *
 * - Pending requests are stored by requester ID (not mode owner)
 * - Each requester can have only one pending request at a time
 * - New requests from the same requester auto-replace previous requests
 * - Pending requests persist when mode owner switches between their own modes
 * - When any request is approved, all other pending requests are auto-rejected
 * - When mode owner returns to default mode:
 *   - If first pending request is for default mode, all pending requests are rejected (already in requested mode)
 *   - If first pending request is for a different mode, that request is auto-approved and others are rejected
 *
 * ## Instance ID Stability and Lifecycle
 *
 * The provider uses React's `key` prop to force a complete remount when the `id` changes.
 * This ensures:
 * - Clean cleanup of the old store (no memory leaks)
 * - Fresh initialization for the new ID
 * - All child components remount with the new context
 *
 * While the `id` prop should typically remain stable (created as a module-level constant
 * or with `useState`), changing it will work correctly due to the remount behavior.
 *
 * @param props - Provider props including children and required id
 * @returns Provider component that wraps children with map instance identity context
 *
 * @example
 * Internal usage within BaseMap:
 * ```tsx
 * // BaseMap automatically creates the provider
 * function BaseMap({ id, children, ...props }: BaseMapProps) {
 *   return (
 *     <div>
 *       <MapProvider id={id}>
 *         <Deckgl {...props}>
 *           {children}
 *         </Deckgl>
 *       </MapProvider>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With authorization handling - use id in event payloads:
 * ```tsx
 * useOn(MapModeEvents.changeAuthorization, (event) => {
 *   const { authId, id } = event.payload;
 *   emitDecision({ authId, approved: true, owner: 'tool', id });
 * });
 * ```
 */
/**
 * Public wrapper that forces remount when id changes.
 * This ensures clean lifecycle management and prevents memory leaks.
 */
export function MapProvider({ children, id }: MapProviderProps) {
  // Force remount when id changes - each id gets a fresh component instance
  return (
    <MapProviderInternal key={id} id={id}>
      {children}
    </MapProviderInternal>
  );
}

/**
 * Internal implementation with guaranteed stable id.
 * The id cannot change without a remount due to the key prop above.
 */
function MapProviderInternal({ children, id }: MapProviderProps) {
  // Create store synchronously before children render
  // This is required for useSyncExternalStore pattern
  getOrCreateStore(id);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      destroyStore(id);
    };
  }, [id]); // id is stable within this component's lifetime due to key prop

  return <MapContext.Provider value={id}>{children}</MapContext.Provider>;
}
