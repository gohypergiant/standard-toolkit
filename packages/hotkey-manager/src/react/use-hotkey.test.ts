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

import { renderHook } from '@testing-library/react';
import { noop } from 'radashi';
import { beforeEach, describe, expect, it } from 'vitest';
import { registerHotkey } from '@/actions/register-hotkey';
import { Keycode } from '@/enums/keycode';
import { hotkeyStore } from '@/stores/hotkey-store';
import { createUseHotkey, useHotkey } from './use-hotkey';
import type { HotkeyOptions } from '@/types/hotkey-options';

describe('useHotkey', () => {
  let options: HotkeyOptions;

  beforeEach(() => {
    // Reset the store before each test
    hotkeyStore.setState(hotkeyStore.getInitialState());

    options = {
      id: 'test',
      key: { code: Keycode.KeyA },
      onKeyUp: noop,
    } satisfies HotkeyOptions;
  });

  it('should activate hotkey on mount and deactivate on unmount', () => {
    const hotkey = registerHotkey(options);

    // Initial state
    expect(hotkey.isBound).toBe(false);

    // Mount the hook
    const { unmount } = renderHook(() => useHotkey(hotkey));

    // Hook should be bound after mounting
    expect(hotkey.isBound).toBe(true);

    // Unmount the hook
    unmount();

    // Hook should be unbound after unmounting
    expect(hotkey.isBound).toBe(false);
  });

  it('should deactivate after all hooks are unmounted', () => {
    const hotkey = registerHotkey(options);
    const { unmount } = renderHook(() => useHotkey(hotkey));

    expect(hotkey.isBound).toBe(true);

    const { unmount: unmount2 } = renderHook(() => useHotkey(hotkey));

    expect(hotkey.isBound).toBe(true);

    unmount();
    expect(hotkey.isBound).toBe(true);

    unmount2();
    expect(hotkey.isBound).toBe(false);
  });

  it('should still unbind when using forceUnbind', () => {
    const hotkey = registerHotkey(options);
    renderHook(() => useHotkey(hotkey));

    expect(hotkey.isBound).toBe(true);

    hotkey.forceUnbind();
    expect(hotkey.isBound).toBe(false);
  });
});

describe('createUseHotkey', () => {
  let options: HotkeyOptions;

  beforeEach(() => {
    // Reset the store before each test
    hotkeyStore.setState(hotkeyStore.getInitialState());

    options = {
      id: 'test',
      key: { code: Keycode.KeyA },
      onKeyUp: noop,
    } satisfies HotkeyOptions;
  });

  it('should create a hook that activates on mount', () => {
    const hotkey = registerHotkey(options);
    const useMyHotkey = createUseHotkey(hotkey);

    // Initial state
    expect(hotkey.isBound).toBe(false);

    // Mount the hook
    const { unmount } = renderHook(() => useMyHotkey());

    // Hook should be bound after mounting
    expect(hotkey.isBound).toBe(true);

    // Unmount the hook
    unmount();

    // Hook should be unbound after unmounting
    expect(hotkey.isBound).toBe(false);
  });

  it('should handle multiple hook instances', () => {
    const hotkey = registerHotkey(options);
    const useMyHotkey = createUseHotkey(hotkey);

    const { unmount: unmount1 } = renderHook(() => useMyHotkey());
    const { unmount: unmount2 } = renderHook(() => useMyHotkey());

    expect(hotkey.isBound).toBe(true);

    unmount1();
    expect(hotkey.isBound).toBe(true);

    unmount2();
    expect(hotkey.isBound).toBe(false);
  });
});
