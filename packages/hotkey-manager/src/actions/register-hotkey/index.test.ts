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
import { Keycode } from '@/enums/keycode';
import { hotkeyStore } from '@/stores/hotkey-store';
import { registerHotkey } from '.';
import type { HotkeyOptions } from '@/types/hotkey-options';

describe('registerHotkey', () => {
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

  it('should create a hotkey with default values', () => {
    const useHotkey = registerHotkey(options);

    expect(useHotkey.id).toBeDefined();
    expect(useHotkey.isBound).toBe(false);
  });

  it('should get config', () => {
    const useHotkey = registerHotkey(options);

    expect(useHotkey.config.id).toContain(options.id);
  });

  describe('forceBind', () => {
    it('should activate and deactivate hotkey', () => {
      const useHotkey = registerHotkey(options);
      const cleanup = useHotkey.forceBind();

      expect(useHotkey.isBound).toBe(true);

      cleanup();
      expect(useHotkey.isBound).toBe(false);
    });

    it('should handle multiple force bindings when unbinding', () => {
      const options = {
        key: { code: Keycode.KeyA },
        onKeyUp: noop,
      };

      const useHotkey = registerHotkey(options);
      const cleanup1 = useHotkey.forceBind();
      const cleanup2 = useHotkey.forceBind();

      expect(useHotkey.isBound).toBe(true);

      cleanup1();
      expect(useHotkey.isBound).toBe(false);

      cleanup2();
      expect(useHotkey.isBound).toBe(false);
    });

    it('should unbind all when using forceUnbind', () => {
      const useHotkey = registerHotkey(options);
      useHotkey.forceBind();

      expect(useHotkey.isBound).toBe(true);

      useHotkey.forceUnbind();
      expect(useHotkey.isBound).toBe(false);
    });
  });

  describe('hook', () => {
    it('should activate and deactivate hotkey', () => {
      const useHotkey = registerHotkey(options);

      // Initial state
      expect(useHotkey.isBound).toBe(false);

      // Mount the hook
      const { unmount } = renderHook(() => useHotkey());

      // Hook should be bound after mounting
      expect(useHotkey.isBound).toBe(true);

      // // Unmount the hook
      unmount();

      // Hook should be unbound after unmounting
      expect(useHotkey.isBound).toBe(false);
    });

    it('should deactivate after all hooks are unmounted', () => {
      const useHotkey = registerHotkey(options);
      const { unmount } = renderHook(() => useHotkey());

      expect(useHotkey.isBound).toBe(true);

      const { unmount: unmount2 } = renderHook(() => useHotkey());

      expect(useHotkey.isBound).toBe(true);

      unmount();
      expect(useHotkey.isBound).toBe(true);

      unmount2();
      expect(useHotkey.isBound).toBe(false);
    });

    it('should still unbind when using forceUnbind', () => {
      const useHotkey = registerHotkey(options);
      renderHook(() => useHotkey());

      expect(useHotkey.isBound).toBe(true);

      useHotkey.forceUnbind();
      expect(useHotkey.isBound).toBe(false);
    });
  });
});
