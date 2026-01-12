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

import { useRef, useSyncExternalStore } from 'react';
import type { UniqueId } from '@accelint/core';

// =============================================================================
// Immutable Map Helpers
// =============================================================================

/**
 * Create a new Map with an entry added or updated (immutable).
 *
 * @example
 * ```ts
 * const newMap = mapSet(state.cursorOwners, 'draw-layer', 'crosshair');
 * set({ cursorOwners: newMap });
 * ```
 */
export function mapSet<K, V>(map: Map<K, V>, key: K, value: V): Map<K, V> {
  const newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
}

/**
 * Create a new Map with an entry removed (immutable).
 *
 * @example
 * ```ts
 * const newMap = mapDelete(state.cursorOwners, 'draw-layer');
 * set({ cursorOwners: newMap });
 * ```
 */
export function mapDelete<K, V>(map: Map<K, V>, key: K): Map<K, V> {
  const newMap = new Map(map);
  newMap.delete(key);
  return newMap;
}

/**
 * Create a new empty Map (immutable replacement for Map.clear()).
 *
 * @example
 * ```ts
 * set({ pendingRequests: mapClear<string, PendingRequest>() });
 * ```
 */
export function mapClear<K, V>(): Map<K, V> {
  return new Map<K, V>();
}

/**
 * Helper methods passed to action creators and bus setup functions.
 *
 * This type is exported for consumers building custom store extensions or
 * helper functions that need to interact with store state.
 *
 * @example
 * ```ts
 * import type { StoreHelpers } from '@accelint/map-toolkit/shared';
 *
 * function createCustomAction<T>(helpers: StoreHelpers<T>) {
 *   return () => {
 *     const current = helpers.get();
 *     helpers.set({ ...current, modified: true });
 *   };
 * }
 * ```
 */
export type StoreHelpers<TState> = {
  /** Get current state */
  get: () => TState;
  /** Update state (partial merge) and notify subscribers */
  set: (updates: Partial<TState>) => void;
  /** Replace entire state and notify subscribers */
  replace: (state: TState) => void;
  /** Notify subscribers without changing state */
  notify: () => void;
};

/**
 * Configuration for creating a map store
 */
export type MapStoreConfig<TState, TActions> = {
  /** Default state for new instances and SSR */
  defaultState: TState;

  /**
   * Action creators - receives mapId and helpers, returns action methods.
   * Actions are cached per mapId for referential stability.
   */
  actions: (mapId: UniqueId, helpers: StoreHelpers<TState>) => TActions;

  /**
   * Optional bus listener setup. Called when first subscriber mounts.
   * Return cleanup function to unsubscribe.
   */
  bus?: (mapId: UniqueId, helpers: StoreHelpers<TState>) => () => void;

  /**
   * Optional cleanup when instance is destroyed (last subscriber unmounts).
   */
  onCleanup?: (mapId: UniqueId, state: TState) => void;
};

/**
 * Instance data for a single map
 */
type Instance<TState, TActions> = {
  state: TState;
  actions?: TActions;
  subscribers: Set<() => void>;
  busCleanup?: () => void;
};

/**
 * The store object returned by createMapStore
 */
export type MapStore<TState, TActions> = {
  /**
   * React hook - the primary way to use the store.
   * Returns state and actions with proper memoization.
   */
  use: (mapId: UniqueId) => { state: TState } & TActions;

  /**
   * React hook with selector for derived state.
   * Only re-renders when the underlying state changes.
   *
   * The selector result is memoized - it only recomputes when the **state reference**
   * changes, not on every render or when the selector function changes. This means:
   *
   * - Selectors that create new objects/arrays are safe without additional memoization
   * - Changing the selector function does NOT trigger recomputation (by design)
   * - This prevents infinite re-render loops when using inline arrow functions
   *
   * **Important**: The selector function is intentionally NOT tracked as a dependency.
   * If you need the selector to change dynamically, extract the changing value as a
   * separate dependency and use it within a stable selector, or use the `use()` hook
   * with your own `useMemo` for derived state.
   *
   * @example
   * ```ts
   * // Returns primitive - recomputes when state.count changes
   * const count = store.useSelector(mapId, (s) => s.count);
   *
   * // Returns existing reference - recomputes when state.items ref changes
   * const items = store.useSelector(mapId, (s) => s.items);
   *
   * // Safe: derived object is memoized internally, no infinite loops
   * const derived = store.useSelector(mapId, (s) => ({ doubled: s.count * 2 }));
   *
   * // If you need dynamic selector behavior, use the base hook instead:
   * const { state } = store.use(mapId);
   * const filtered = useMemo(() => filterFn(state.items), [state.items, filterFn]);
   * ```
   */
  useSelector: <TSelected>(
    mapId: UniqueId,
    selector: (state: TState) => TSelected,
  ) => TSelected;

  /**
   * Get actions without subscribing to state changes.
   * Useful for event handlers or effects.
   */
  actions: (mapId: UniqueId) => TActions;

  /**
   * Get current state (non-reactive, for imperative code).
   */
  get: (mapId: UniqueId) => TState;

  /**
   * Update state directly (usually prefer actions).
   */
  set: (mapId: UniqueId, updates: Partial<TState>) => void;

  /**
   * Check if instance exists (has been initialized).
   */
  exists: (mapId: UniqueId) => boolean;

  /**
   * Clear instance state (for tests or manual cleanup).
   */
  clear: (mapId: UniqueId) => void;

  /**
   * Low-level access for custom hooks or useSyncExternalStore.
   */
  subscribe: (mapId: UniqueId) => (callback: () => void) => () => void;
  snapshot: (mapId: UniqueId) => () => TState;
  serverSnapshot: () => TState;
};

/**
 * Creates a store for managing state across multiple map instances.
 *
 * @example
 * ```ts
 * const cursorStore = createMapStore({
 *   defaultState: { cursor: 'default', owner: null },
 *
 *   actions: (mapId, { get, set }) => ({
 *     setCursor: (cursor: string, owner: string) => {
 *       set({ cursor, owner });
 *     },
 *     clearCursor: () => {
 *       set({ cursor: 'default', owner: null });
 *     },
 *   }),
 *
 *   bus: (mapId, { set }) => {
 *     return cursorBus.on(CursorEvents.change, (e) => {
 *       if (e.payload.id === mapId) {
 *         set({ cursor: e.payload.cursor });
 *       }
 *     });
 *   },
 * });
 *
 * // In component:
 * function CursorDisplay({ mapId }) {
 *   const { state, setCursor } = cursorStore.use(mapId);
 *   return <div style={{ cursor: state.cursor }} />;
 * }
 * ```
 */
export function createMapStore<TState, TActions>(
  config: MapStoreConfig<TState, TActions>,
): MapStore<TState, TActions> {
  const { defaultState, actions: createActions, bus, onCleanup } = config;

  const instances = new Map<UniqueId, Instance<TState, TActions>>();

  // Cached functions for referential stability
  const subscriptionCache = new Map<
    UniqueId,
    (callback: () => void) => () => void
  >();
  const snapshotCache = new Map<UniqueId, () => TState>();

  function getInstance(mapId: UniqueId): Instance<TState, TActions> {
    let instance = instances.get(mapId);
    if (!instance) {
      instance = {
        state: { ...defaultState },
        subscribers: new Set(),
      };
      instances.set(mapId, instance);
    }
    return instance;
  }

  function notify(mapId: UniqueId): void {
    const instance = instances.get(mapId);
    if (instance) {
      for (const callback of instance.subscribers) {
        callback();
      }
    }
  }

  function getHelpers(mapId: UniqueId): StoreHelpers<TState> {
    return {
      get: () => getInstance(mapId).state,
      set: (updates) => {
        const instance = getInstance(mapId);
        instance.state = { ...instance.state, ...updates };
        notify(mapId);
      },
      replace: (state) => {
        const instance = getInstance(mapId);
        instance.state = state;
        notify(mapId);
      },
      notify: () => notify(mapId),
    };
  }

  function getActions(mapId: UniqueId): TActions {
    const instance = getInstance(mapId);
    if (!instance.actions) {
      instance.actions = createActions(mapId, getHelpers(mapId));
    }
    return instance.actions;
  }

  /**
   * Clean up instance when last subscriber unmounts
   */
  function cleanupInstance(
    mapId: UniqueId,
    instance: Instance<TState, TActions>,
  ): void {
    if (onCleanup) {
      onCleanup(mapId, instance.state);
    }
    if (instance.busCleanup) {
      instance.busCleanup();
    }
    instances.delete(mapId);
    subscriptionCache.delete(mapId);
    snapshotCache.delete(mapId);
  }

  function subscribe(mapId: UniqueId): (callback: () => void) => () => void {
    let cached = subscriptionCache.get(mapId);
    if (!cached) {
      cached = (callback: () => void) => {
        const instance = getInstance(mapId);

        // Setup bus on first subscriber
        if (instance.subscribers.size === 0 && bus) {
          instance.busCleanup = bus(mapId, getHelpers(mapId));
        }

        instance.subscribers.add(callback);

        return () => {
          instance.subscribers.delete(callback);

          // Cleanup when last subscriber unmounts
          if (instance.subscribers.size === 0) {
            cleanupInstance(mapId, instance);
          }
        };
      };
      subscriptionCache.set(mapId, cached);
    }
    return cached;
  }

  function snapshot(mapId: UniqueId): () => TState {
    let cached = snapshotCache.get(mapId);
    if (!cached) {
      cached = () => {
        // State is already a new object reference when updated via set()
        // which creates { ...instance.state, ...updates }
        return getInstance(mapId).state;
      };
      snapshotCache.set(mapId, cached);
    }
    return cached;
  }

  function serverSnapshot(): TState {
    return defaultState;
  }

  /**
   * Main hook - returns state and actions
   */
  function use(mapId: UniqueId): { state: TState } & TActions {
    const state = useSyncExternalStore(
      subscribe(mapId),
      snapshot(mapId),
      serverSnapshot,
    );

    const actions = getActions(mapId);

    // Return merged object with state wrapper for clarity
    return { state, ...actions };
  }

  /**
   * Selector hook - only re-renders when selected value changes.
   *
   * Note: The selector function is intentionally NOT tracked as a dependency.
   * This prevents infinite re-render loops when using inline arrow functions.
   * If you need dynamic selector behavior, use the `use()` hook with `useMemo`.
   */
  function useSelector<TSelected>(
    mapId: UniqueId,
    selector: (state: TState) => TSelected,
  ): TSelected {
    // Cache the previous state and selected value to avoid unnecessary re-computation.
    // We intentionally do NOT track selector changes - only state changes trigger
    // recomputation. This prevents infinite loops with inline selectors.
    const cache = useRef<{ state: TState; selected: TSelected } | null>(null);

    const state = useSyncExternalStore(
      subscribe(mapId),
      snapshot(mapId),
      serverSnapshot,
    );

    // Only recompute if state reference changed (selector changes are ignored)
    if (cache.current === null || cache.current.state !== state) {
      cache.current = {
        state,
        selected: selector(state),
      };
    }

    return cache.current.selected;
  }

  return {
    use,
    useSelector,
    actions: getActions,
    get: (mapId) => getInstance(mapId).state,
    set: (mapId, updates) => {
      const instance = getInstance(mapId);
      instance.state = { ...instance.state, ...updates };
      notify(mapId);
    },
    exists: (mapId) => instances.has(mapId),
    clear: (mapId) => {
      const instance = instances.get(mapId);
      if (instance) {
        cleanupInstance(mapId, instance);
      }
    },
    subscribe,
    snapshot,
    serverSnapshot,
  };
}
