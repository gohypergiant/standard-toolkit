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

import { castArray, uid } from 'radashi';
import { useEffect } from 'react';
import {
  FORCE_BOUND,
  HOTKEY_EXTRA_DEFAULTS,
  KEY_COMBINATION_DEFAULTS,
} from '@/constants';
import { keyToId } from '@/lib/key-to-id';
import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyHook } from '@/types/hotkey-hook';
import type { HotkeyOptions } from '@/types/hotkey-options';
import type { KeyCombination } from '@/types/key-combination';
import type { NonEmptyArray } from '@/types/non-empty-array';

/**
 * Registers a hotkey and returns a hook to activate and deactivate it.
 *
 * @param options The hotkey options.
 * @returns The hotkey hook.
 */
export function registerHotkey(options: HotkeyOptions) {
  const config = {
    ...HOTKEY_EXTRA_DEFAULTS,
    ...options,
    id: options.id ?? uid(7),
    key: castArray(options.key).map((key) => {
      const baseKey = {
        id: '',
        ...KEY_COMBINATION_DEFAULTS,
        ...key,
      };

      baseKey.id = keyToId(baseKey);

      return baseKey;
    }) as NonEmptyArray<KeyCombination>,
  } satisfies HotkeyConfig;

  hotkeyStore.getState().registerHotkey(config);

  const activate = (force = false) => {
    const activationSymbol = force ? FORCE_BOUND : Symbol();

    hotkeyStore.getState().activateHotkey(config.id, activationSymbol);

    return () => deactivate(activationSymbol);
  };

  const deactivate = (activationSymbol: symbol) => {
    if (activationSymbol === FORCE_BOUND) {
      hotkeyStore.getState().forceDeactivateHotkey(config.id);
      return;
    }

    hotkeyStore.getState().deactivateHotkey(config.id, activationSymbol);
  };

  const isActive = () =>
    !!hotkeyStore.getState().hotkeyActivations.get(config.id);

  const useHotkey = () => useEffect(() => activate(), []);

  Object.defineProperties(useHotkey, {
    id: {
      get: () => config.id,
      enumerable: true,
    },
    config: {
      get: () => config,
      enumerable: true,
    },
    forceBind: {
      value: () => activate(true),
    },
    forceUnbind: {
      value: () => deactivate(FORCE_BOUND),
    },
    isBound: {
      get: isActive,
      enumerable: true,
    },
  });

  return useHotkey as HotkeyHook;
}
