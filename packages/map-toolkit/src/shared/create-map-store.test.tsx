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

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMapStore } from './create-map-store';
import type { UniqueId } from '@accelint/core';

// Simple counter store for testing
type CounterState = {
  count: number;
};

type CounterActions = {
  increment: () => void;
  decrement: () => void;
  set: (value: number) => void;
};

function createTestStore() {
  return createMapStore<CounterState, CounterActions>({
    defaultState: { count: 0 },

    actions: (_mapId, { get, set }) => ({
      increment: () => set({ count: get().count + 1 }),
      decrement: () => set({ count: get().count - 1 }),
      set: (value: number) => set({ count: value }),
    }),
  });
}

describe('createMapStore v2', () => {
  const mapId = 'test-map' as UniqueId;

  describe('use hook', () => {
    it('returns state and actions', () => {
      const store = createTestStore();
      const { result } = renderHook(() => store.use(mapId));

      expect(result.current.state.count).toBe(0);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
      expect(typeof result.current.set).toBe('function');

      store.clear(mapId);
    });

    it('updates state when action is called', () => {
      const store = createTestStore();
      const { result } = renderHook(() => store.use(mapId));

      expect(result.current.state.count).toBe(0);

      act(() => {
        result.current.increment();
      });

      expect(result.current.state.count).toBe(1);

      act(() => {
        result.current.increment();
      });

      expect(result.current.state.count).toBe(2);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.state.count).toBe(1);

      store.clear(mapId);
    });

    it('maintains referential stability for actions', () => {
      const store = createTestStore();
      const { result, rerender } = renderHook(() => store.use(mapId));

      const firstIncrement = result.current.increment;
      const firstDecrement = result.current.decrement;

      rerender();

      expect(result.current.increment).toBe(firstIncrement);
      expect(result.current.decrement).toBe(firstDecrement);

      store.clear(mapId);
    });
  });

  describe('useSelector hook', () => {
    it('returns selected value', () => {
      const store = createTestStore();
      const { result } = renderHook(() =>
        store.useSelector(mapId, (s) => s.count),
      );

      expect(result.current).toBe(0);

      store.clear(mapId);
    });

    it('updates when selected value changes', () => {
      const store = createTestStore();

      // First, set up the store with a subscriber
      const { result: useResult } = renderHook(() => store.use(mapId));

      const { result: selectorResult } = renderHook(() =>
        store.useSelector(mapId, (s) => s.count * 2),
      );

      expect(selectorResult.current).toBe(0);

      act(() => {
        useResult.current.set(5);
      });

      expect(selectorResult.current).toBe(10);

      store.clear(mapId);
    });
  });

  describe('imperative API', () => {
    it('get returns current state', () => {
      const store = createTestStore();
      expect(store.get(mapId).count).toBe(0);

      store.set(mapId, { count: 42 });
      expect(store.get(mapId).count).toBe(42);

      store.clear(mapId);
    });

    it('set updates state', () => {
      const store = createTestStore();

      store.set(mapId, { count: 100 });
      expect(store.get(mapId).count).toBe(100);

      store.clear(mapId);
    });

    it('exists returns true when instance exists', () => {
      const store = createTestStore();

      expect(store.exists(mapId)).toBe(false);

      store.get(mapId); // Creates instance
      expect(store.exists(mapId)).toBe(true);

      store.clear(mapId);
      expect(store.exists(mapId)).toBe(false);
    });

    it('actions can be called without hook', () => {
      const store = createTestStore();

      const actions = store.actions(mapId);
      actions.set(50);

      expect(store.get(mapId).count).toBe(50);

      store.clear(mapId);
    });
  });

  describe('bus integration', () => {
    it('calls bus setup on first subscriber', () => {
      const busSetup = vi.fn(() => vi.fn());

      const store = createMapStore<CounterState, CounterActions>({
        defaultState: { count: 0 },
        actions: (_mapId, { get, set }) => ({
          increment: () => set({ count: get().count + 1 }),
          decrement: () => set({ count: get().count - 1 }),
          set: (value: number) => set({ count: value }),
        }),
        bus: busSetup,
      });

      expect(busSetup).not.toHaveBeenCalled();

      const { unmount } = renderHook(() => store.use(mapId));
      expect(busSetup).toHaveBeenCalledTimes(1);

      // Additional subscribers don't call bus setup again
      const { unmount: unmount2 } = renderHook(() => store.use(mapId));
      expect(busSetup).toHaveBeenCalledTimes(1);

      unmount2();
      unmount();
    });

    it('calls bus cleanup when last subscriber unmounts', () => {
      const busCleanup = vi.fn();
      const busSetup = vi.fn(() => busCleanup);

      const store = createMapStore<CounterState, CounterActions>({
        defaultState: { count: 0 },
        actions: (_mapId, { get, set }) => ({
          increment: () => set({ count: get().count + 1 }),
          decrement: () => set({ count: get().count - 1 }),
          set: (value: number) => set({ count: value }),
        }),
        bus: busSetup,
      });

      const { unmount: unmount1 } = renderHook(() => store.use(mapId));
      const { unmount: unmount2 } = renderHook(() => store.use(mapId));

      expect(busCleanup).not.toHaveBeenCalled();

      unmount1();
      expect(busCleanup).not.toHaveBeenCalled(); // Still has one subscriber

      unmount2();
      expect(busCleanup).toHaveBeenCalledTimes(1); // Last subscriber unmounted
    });
  });

  describe('cleanup', () => {
    it('calls onCleanup when instance is cleared', () => {
      const onCleanup = vi.fn();

      const store = createMapStore<CounterState, CounterActions>({
        defaultState: { count: 0 },
        actions: (_mapId, { get, set }) => ({
          increment: () => set({ count: get().count + 1 }),
          decrement: () => set({ count: get().count - 1 }),
          set: (value: number) => set({ count: value }),
        }),
        onCleanup,
      });

      store.set(mapId, { count: 42 });
      store.clear(mapId);

      expect(onCleanup).toHaveBeenCalledWith(mapId, { count: 42 });
    });

    it('calls onCleanup when last subscriber unmounts', () => {
      const onCleanup = vi.fn();

      const store = createMapStore<CounterState, CounterActions>({
        defaultState: { count: 0 },
        actions: (_mapId, { get, set }) => ({
          increment: () => set({ count: get().count + 1 }),
          decrement: () => set({ count: get().count - 1 }),
          set: (value: number) => set({ count: value }),
        }),
        onCleanup,
      });

      const { result, unmount } = renderHook(() => store.use(mapId));

      act(() => {
        result.current.set(99);
      });

      expect(onCleanup).not.toHaveBeenCalled();

      unmount();

      expect(onCleanup).toHaveBeenCalledWith(mapId, { count: 99 });
    });
  });

  describe('multiple instances', () => {
    it('maintains separate state per mapId', () => {
      const store = createTestStore();
      const mapId1 = 'map-1' as UniqueId;
      const mapId2 = 'map-2' as UniqueId;

      const { result: result1 } = renderHook(() => store.use(mapId1));
      const { result: result2 } = renderHook(() => store.use(mapId2));

      act(() => {
        result1.current.set(10);
      });

      act(() => {
        result2.current.set(20);
      });

      expect(result1.current.state.count).toBe(10);
      expect(result2.current.state.count).toBe(20);

      store.clear(mapId1);
      store.clear(mapId2);
    });
  });
});
