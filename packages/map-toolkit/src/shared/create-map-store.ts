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

import type { UniqueId } from '@accelint/core';

/**
 * Subscription function type for useSyncExternalStore
 */
export type Subscription = (onStoreChange: () => void) => () => void;

/**
 * Instance data for a single map instance within a store.
 * Contains state, subscribers, and cached functions - all in one object.
 */
export type MapStoreInstance<
  TState,
  TActions extends Record<string, unknown>,
> = {
  /** The actual state for this instance */
  state: TState;
  /** React component subscribers (onStoreChange callbacks) */
  subscribers: Set<() => void>;
  /** Bus unsubscribe function (if applicable) */
  busUnsubscribe?: () => void;
  /** Cached subscription function for useSyncExternalStore */
  subscription?: Subscription;
  /** Cached snapshot function for useSyncExternalStore */
  snapshot?: () => TState;
  /** Cached server snapshot function for useSyncExternalStore */
  serverSnapshot?: () => TState;
  /** Cached action functions (keyed by action name) */
  actions: Partial<TActions>;
};

/**
 * Configuration for creating a map store
 */
export type MapStoreConfig<TState, TActions extends Record<string, unknown>> = {
  /** Function to create the default state for a new instance */
  createDefaultState: () => TState;
  /** Default state to return for server snapshots (SSR) */
  serverDefault: TState;
  /**
   * Optional function to set up bus listeners for an instance.
   * Called when the first subscriber subscribes.
   * Should return a cleanup function.
   */
  setupBusListeners?: (
    mapId: UniqueId,
    instance: MapStoreInstance<TState, TActions>,
    notify: () => void,
  ) => () => void;
  /**
   * Optional function called when an instance is cleaned up.
   * Use this to perform additional cleanup (e.g., cancel active operations).
   */
  onCleanup?: (mapId: UniqueId, state: TState) => void;
};

/**
 * A map store manages state for multiple map instances.
 * Each map instance is identified by a UniqueId (mapId/instanceId).
 */
export type MapStore<TState, TActions extends Record<string, unknown>> = {
  /**
   * Get or create an instance for the given mapId.
   * This is the primary way to access instance data.
   */
  getInstance: (mapId: UniqueId) => MapStoreInstance<TState, TActions>;

  /**
   * Get a subscription function for useSyncExternalStore.
   * Cached per mapId for referential stability.
   */
  getSubscription: (mapId: UniqueId) => Subscription;

  /**
   * Get a snapshot function for useSyncExternalStore.
   * Cached per mapId for referential stability.
   */
  getSnapshot: (mapId: UniqueId) => () => TState;

  /**
   * Get a server snapshot function for useSyncExternalStore.
   * Cached per mapId for referential stability.
   */
  getServerSnapshot: (mapId: UniqueId) => () => TState;

  /**
   * Notify all subscribers for a mapId that state has changed.
   */
  notify: (mapId: UniqueId) => void;

  /**
   * Update state for a mapId and notify subscribers.
   * Creates a new state object to trigger React re-renders.
   */
  setState: (mapId: UniqueId, updates: Partial<TState>) => void;

  /**
   * Get current state for a mapId (non-reactive, for imperative code).
   */
  getState: (mapId: UniqueId) => TState;

  /**
   * Clear all state for a mapId.
   * Typically only needed for manual cleanup in tests.
   */
  clear: (mapId: UniqueId) => void;

  /**
   * Check if an instance exists for a mapId.
   * Useful for checking if state has been initialized.
   */
  exists: (mapId: UniqueId) => boolean;

  /**
   * Get or create a cached action function for referential stability.
   */
  getAction: <K extends keyof TActions>(
    mapId: UniqueId,
    actionName: K,
    createAction: () => TActions[K],
  ) => TActions[K];
};

/**
 * Creates a new map store for managing state across multiple map instances.
 *
 * This factory provides:
 * - Unified storage (one Map instead of many)
 * - Automatic subscriber management
 * - Referential stability for hooks
 * - Automatic cleanup when last subscriber unmounts
 *
 * @example
 * ```ts
 * type CursorState = { cursor: string };
 * type CursorActions = {
 *   setCursor: (cursor: string) => void;
 *   clearCursor: () => void;
 * };
 *
 * const cursorStore = createMapStore<CursorState, CursorActions>({
 *   name: 'cursor',
 *   createDefaultState: () => ({ cursor: 'default' }),
 *   serverDefault: { cursor: 'default' },
 * });
 *
 * // In a hook:
 * function useCursor(mapId: UniqueId) {
 *   const cursor = useSyncExternalStore(
 *     cursorStore.getSubscription(mapId),
 *     cursorStore.getSnapshot(mapId),
 *     cursorStore.getServerSnapshot(mapId),
 *   );
 *
 *   const setCursor = cursorStore.getAction(mapId, 'setCursor', () => (cursor: string) => {
 *     cursorStore.setState(mapId, { cursor });
 *   });
 *
 *   return { cursor, setCursor };
 * }
 * ```
 */
export function createMapStore<
  TState,
  TActions extends Record<string, unknown> = Record<string, never>,
>(config: MapStoreConfig<TState, TActions>): MapStore<TState, TActions> {
  const { createDefaultState, serverDefault, setupBusListeners, onCleanup } =
    config;

  /**
   * Single Map storing all instance data.
   * This replaces the pattern of having 6+ separate Maps.
   */
  const instances = new Map<UniqueId, MapStoreInstance<TState, TActions>>();

  /**
   * Get or create an instance for the given mapId
   */
  function getInstance(mapId: UniqueId): MapStoreInstance<TState, TActions> {
    let instance = instances.get(mapId);
    if (!instance) {
      instance = {
        state: createDefaultState(),
        subscribers: new Set(),
        actions: {},
      };
      instances.set(mapId, instance);
    }
    return instance;
  }

  /**
   * Notify all subscribers for a mapId
   */
  function notify(mapId: UniqueId): void {
    const instance = instances.get(mapId);
    if (instance) {
      for (const callback of instance.subscribers) {
        callback();
      }
    }
  }

  /**
   * Update state and notify subscribers
   */
  function setState(mapId: UniqueId, updates: Partial<TState>): void {
    const instance = getInstance(mapId);
    instance.state = { ...instance.state, ...updates };
    notify(mapId);
  }

  /**
   * Get current state (non-reactive)
   */
  function getState(mapId: UniqueId): TState {
    const instance = instances.get(mapId);
    return instance?.state ?? createDefaultState();
  }

  /**
   * Clean up an instance when no subscribers remain
   */
  function cleanupIfEmpty(mapId: UniqueId): void {
    const instance = instances.get(mapId);
    if (!instance || instance.subscribers.size > 0) {
      return;
    }

    // Call custom cleanup if provided
    if (onCleanup) {
      onCleanup(mapId, instance.state);
    }

    // Unsubscribe from bus
    if (instance.busUnsubscribe) {
      instance.busUnsubscribe();
    }

    // Remove instance entirely
    instances.delete(mapId);
  }

  /**
   * Get subscription function for useSyncExternalStore
   */
  function getSubscription(mapId: UniqueId): Subscription {
    const instance = getInstance(mapId);

    if (!instance.subscription) {
      instance.subscription = (onStoreChange: () => void) => {
        // Set up bus listeners on first subscription
        if (instance.subscribers.size === 0 && setupBusListeners) {
          instance.busUnsubscribe = setupBusListeners(mapId, instance, () =>
            notify(mapId),
          );
        }

        // Add subscriber
        instance.subscribers.add(onStoreChange);

        // Return cleanup function
        return () => {
          instance.subscribers.delete(onStoreChange);
          cleanupIfEmpty(mapId);
        };
      };
    }

    return instance.subscription;
  }

  /**
   * Get snapshot function for useSyncExternalStore
   */
  function getSnapshot(mapId: UniqueId): () => TState {
    const instance = getInstance(mapId);

    if (!instance.snapshot) {
      instance.snapshot = () => {
        const current = instances.get(mapId);
        return current?.state ?? createDefaultState();
      };
    }

    return instance.snapshot;
  }

  /**
   * Get server snapshot function for useSyncExternalStore
   */
  function getServerSnapshot(mapId: UniqueId): () => TState {
    const instance = getInstance(mapId);

    if (!instance.serverSnapshot) {
      instance.serverSnapshot = () => serverDefault;
    }

    return instance.serverSnapshot;
  }

  /**
   * Get or create a cached action
   */
  function getAction<K extends keyof TActions>(
    mapId: UniqueId,
    actionName: K,
    createAction: () => TActions[K],
  ): TActions[K] {
    const instance = getInstance(mapId);

    if (!(actionName in instance.actions)) {
      instance.actions[actionName] = createAction();
    }

    return instance.actions[actionName] as TActions[K];
  }

  /**
   * Clear all state for a mapId (manual cleanup)
   */
  function clear(mapId: UniqueId): void {
    const instance = instances.get(mapId);
    if (instance) {
      if (onCleanup) {
        onCleanup(mapId, instance.state);
      }
      if (instance.busUnsubscribe) {
        instance.busUnsubscribe();
      }
    }
    instances.delete(mapId);
  }

  /**
   * Check if an instance exists for a mapId
   */
  function exists(mapId: UniqueId): boolean {
    return instances.has(mapId);
  }

  return {
    getInstance,
    getSubscription,
    getSnapshot,
    getServerSnapshot,
    notify,
    setState,
    getState,
    clear,
    exists,
    getAction,
  };
}
