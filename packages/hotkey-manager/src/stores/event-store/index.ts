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

import { enableMapSet } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';
import type { HeldId } from '@/types/held-id';

enableMapSet();

type EventState = {
  bound: boolean;

  heldTimeouts: Map<HeldId, number>;
  heldTriggered: Set<HeldId>;
};

type EventActions = {
  setBound: (bound: boolean) => void;

  addHeldTimeout: (id: HeldId, timeout: number) => void;
  removeHeldTimeout: (id: HeldId) => void;

  addHeldTriggered: (id: HeldId) => void;
  removeHeldTriggered: (id: HeldId) => void;
  hasHeldTimeout: (id: HeldId) => boolean;
};

/**
 * Zustand store for managing global hotkey event state.
 *
 * Tracks binding status, held key timeouts, and triggered held keys.
 *
 * @internal
 *
 * @example
 * ```typescript
 * import { eventStore } from '@/stores/event-store';
 *
 * // Get current state
 * const state = eventStore.getState();
 *
 * // Set bound status
 * state.setBound(true);
 *
 * // Add held timeout
 * const timeout = window.setTimeout(() => {}, 1000);
 * state.addHeldTimeout('KeyA_meta_my-hotkey', timeout);
 *
 * // Check if timeout exists
 * if (state.hasHeldTimeout('KeyA_meta_my-hotkey')) {
 *   state.removeHeldTimeout('KeyA_meta_my-hotkey');
 * }
 * ```
 */
export const eventStore = createStore<EventState & EventActions>()(
  immer((set, get) => ({
    bound: false,
    setBound: (bound) => set({ bound }),

    heldTimeouts: new Map(),
    heldTriggered: new Set(),

    addHeldTimeout: (id, timeout) =>
      set((state) => {
        state.heldTimeouts.set(id, timeout);
      }),
    removeHeldTimeout: (id) =>
      set((state) => {
        const timeout = state.heldTimeouts.get(id);

        if (timeout) {
          clearTimeout(timeout);
        }

        state.heldTimeouts.delete(id);
      }),
    hasHeldTimeout: (id: HeldId) => {
      return get().heldTimeouts.has(id);
    },

    addHeldTriggered: (id) =>
      set((state) => {
        state.heldTriggered.add(id);
      }),
    removeHeldTriggered: (id) =>
      set((state) => {
        state.heldTriggered.delete(id);
      }),
  })),
);
