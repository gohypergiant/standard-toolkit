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

import { enableMapSet, type WritableDraft } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';
import { keyToString } from '@/lib/key-to-string';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyId } from '@/types/hotkey-id';
import type { KeyCombinationId } from '@/types/key-combination-id';

enableMapSet();

type HotkeyState = {
  /**
   * All the registered hotkeys
   */
  allHotkeys: Map<HotkeyId, HotkeyConfig>;
  /**
   * The registered key combinations
   */
  registeredKeyCombinations: Map<KeyCombinationId, HotkeyId[]>;
  /**
   * The active key combinations
   */
  activeKeyCombinations: Map<KeyCombinationId, HotkeyId[]>;
  /**
   * Used to track elements that activate a hotkey so that the hotkey can be unbound when all activations are removed.
   */
  hotkeyActivations: Map<HotkeyId, symbol[]>;
};

type HotkeyActions = {
  registerHotkey: (config: HotkeyConfig) => void;
  unregisterHotkey: (id: HotkeyId) => void;
  activateHotkey: (id: HotkeyId, activationSymbol: symbol) => void;
  deactivateHotkey: (id: HotkeyId, registerSymbol: symbol) => void;
  forceDeactivateHotkey: (id: HotkeyId) => void;

  getHotkeysForKeyCombination: (
    keyCombination: KeyCombinationId,
  ) => HotkeyConfig[] | null;
};

/**
 * Zustand store for managing hotkey registration, activation, and key combination mappings.
 *
 * Manages the lifecycle of hotkeys including registration, activation tracking,
 * and lookup of active hotkeys by key combination.
 *
 * @internal
 *
 * @example
 * ```typescript
 * import { hotkeyStore } from '@/stores/hotkey-store';
 *
 * const state = hotkeyStore.getState();
 *
 * // Register a hotkey
 * const config = {
 *   id: 'save-action',
 *   key: [{ id: 'KeyS_meta', code: 'KeyS', meta: true }],
 * };
 * state.registerHotkey(config);
 *
 * // Activate the hotkey
 * const symbol = Symbol();
 * state.activateHotkey('save-action', symbol);
 *
 * // Get active hotkeys for a key combination
 * const hotkeys = state.getHotkeysForKeyCombination('KeyS_meta');
 *
 * // Deactivate and unregister
 * state.deactivateHotkey('save-action', symbol);
 * state.unregisterHotkey('save-action');
 * ```
 */
export const hotkeyStore = createStore<HotkeyState & HotkeyActions>()(
  immer((set, get) => ({
    allHotkeys: new Map(),
    registeredKeyCombinations: new Map(),
    activeKeyCombinations: new Map(),
    hotkeyActivations: new Map(),
    registerHotkey: (config) =>
      set((state) => {
        // Check if the hotkey has already been registered
        if (state.allHotkeys.has(config.id)) {
          throw new TypeError(
            `Hotkey with id ${config.id} has already been registered.`,
          );
        }

        state.allHotkeys.set(config.id, config);

        for (const key of config.key) {
          // Check if the key is already registered or warn (unless conflicts are ignored).
          if (
            !config.ignoreConflicts &&
            state.registeredKeyCombinations.has(key.id)
          ) {
            const ids = state.registeredKeyCombinations.get(key.id) as string[];
            console.warn(
              `Hotkey with the combination ${keyToString(key)} already registered to ${ids.join(', ')}`,
            );
          }

          // Store the key in the register list
          state.registeredKeyCombinations.set(
            key.id,
            (state.registeredKeyCombinations.get(key.id) ?? []).concat(
              config.id,
            ),
          );
        }
      }),
    unregisterHotkey: (id) =>
      set((state) => {
        removeHotkeyFromRegisteredKeyCombinations(state, id);
        removeHotkeyFromActiveKeyCombinations(state, id);

        state.allHotkeys.delete(id);
      }),
    activateHotkey: (id, activationSymbol) =>
      set((state) => {
        const config = state.allHotkeys.get(id);

        if (!config) {
          return;
        }

        for (const key of config.key) {
          const activated = state.activeKeyCombinations.get(key.id) ?? [];

          if (activated.includes(id)) {
            continue;
          }

          state.activeKeyCombinations.set(key.id, [...activated, id]);
        }

        const activations = state.hotkeyActivations.get(id) ?? [];

        if (activations.includes(activationSymbol)) {
          return;
        }

        state.hotkeyActivations.set(id, [...activations, activationSymbol]);
      }),
    deactivateHotkey: (id, registerSymbol) =>
      set((state) => {
        const activations = state.hotkeyActivations.get(id) ?? [];

        if (!activations.includes(registerSymbol)) {
          return;
        }

        const newActivations = activations.filter(
          (activation) => activation !== registerSymbol,
        );

        // If there are still activations, update the activations and return.
        if (newActivations.length > 0) {
          state.hotkeyActivations.set(id, newActivations);
          return;
        }

        state.hotkeyActivations.delete(id);

        removeHotkeyFromActiveKeyCombinations(state, id);
      }),
    forceDeactivateHotkey: (id) =>
      set((state) => {
        state.hotkeyActivations.delete(id);

        removeHotkeyFromActiveKeyCombinations(state, id);
      }),
    getHotkeysForKeyCombination: (keyCombination) => {
      const state = get();

      const ids = state.activeKeyCombinations.get(keyCombination);

      if (!ids) {
        return null;
      }

      return ids
        .map((id) => state.allHotkeys.get(id))
        .filter(Boolean) as HotkeyConfig[];
    },
  })),
);

/**
 * Removes a hotkey from all registered key combinations.
 *
 * @param state - The writable draft state from Immer.
 * @param id - The hotkey ID to remove.
 * @returns void
 *
 * @example
 * ```typescript
 * removeHotkeyFromRegisteredKeyCombinations(state, 'my-hotkey');
 * ```
 */
function removeHotkeyFromRegisteredKeyCombinations(
  state: WritableDraft<HotkeyState>,
  id: HotkeyId,
) {
  const config = state.allHotkeys.get(id);

  if (!config) {
    return;
  }

  for (const key of config.key) {
    const registered =
      state.registeredKeyCombinations.get(key.id) ??
      /* istanbul ignore next -- @preserve */ [];
    const newRegistered = registered.filter((configId) => configId !== id);

    newRegistered.length === 0
      ? state.registeredKeyCombinations.delete(key.id)
      : state.registeredKeyCombinations.set(key.id, newRegistered);
  }
}

/**
 * Removes a hotkey from all active key combinations.
 *
 * @param state - The writable draft state from Immer.
 * @param id - The hotkey ID to remove.
 * @returns void
 *
 * @example
 * ```typescript
 * removeHotkeyFromActiveKeyCombinations(state, 'my-hotkey');
 * ```
 */
function removeHotkeyFromActiveKeyCombinations(
  state: WritableDraft<HotkeyState>,
  id: HotkeyId,
) {
  const config = state.allHotkeys.get(id);

  if (!config) {
    return;
  }

  for (const key of config.key) {
    const active =
      state.activeKeyCombinations.get(key.id) ??
      /* istanbul ignore next -- @preserve */ [];
    const newActive = active.filter((configId) => configId !== id);

    newActive.length === 0
      ? state.activeKeyCombinations.delete(key.id)
      : state.activeKeyCombinations.set(key.id, newActive);
  }
}
