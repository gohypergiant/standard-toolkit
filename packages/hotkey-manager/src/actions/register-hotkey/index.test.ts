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
    const hotkey = registerHotkey(options);

    expect(hotkey.id).toBeDefined();
    expect(hotkey.isBound).toBe(false);
  });

  it('should get config', () => {
    const hotkey = registerHotkey(options);

    expect(hotkey.config.id).toContain(options.id);
  });

  describe('bind', () => {
    it('should bind and unbind hotkey', () => {
      const hotkey = registerHotkey(options);
      const cleanup = hotkey.bind();

      expect(hotkey.isBound).toBe(true);

      cleanup();
      expect(hotkey.isBound).toBe(false);
    });

    it('should handle multiple binds with ref-counting', () => {
      const hotkey = registerHotkey(options);
      const cleanup1 = hotkey.bind();
      const cleanup2 = hotkey.bind();

      expect(hotkey.isBound).toBe(true);

      cleanup1();
      // Still bound because cleanup2 is still active
      expect(hotkey.isBound).toBe(true);

      cleanup2();
      expect(hotkey.isBound).toBe(false);
    });
  });

  describe('forceBind', () => {
    it('should forceBind and unbind hotkey', () => {
      const hotkey = registerHotkey(options);
      const cleanup = hotkey.forceBind();

      expect(hotkey.isBound).toBe(true);

      cleanup();
      expect(hotkey.isBound).toBe(false);
    });

    it('should handle multiple forceBinds when unbinding', () => {
      const hotkey = registerHotkey({
        key: { code: Keycode.KeyA },
        onKeyUp: noop,
      });
      const cleanup1 = hotkey.forceBind();
      const cleanup2 = hotkey.forceBind();

      expect(hotkey.isBound).toBe(true);

      cleanup1();
      expect(hotkey.isBound).toBe(false);

      cleanup2();
      expect(hotkey.isBound).toBe(false);
    });

    it('should unbind all when using forceUnbind', () => {
      const hotkey = registerHotkey(options);
      hotkey.forceBind();

      expect(hotkey.isBound).toBe(true);

      hotkey.forceUnbind();
      expect(hotkey.isBound).toBe(false);
    });

    it('should forceUnbind even when using normal binds', () => {
      const hotkey = registerHotkey(options);
      hotkey.bind();
      hotkey.bind();

      expect(hotkey.isBound).toBe(true);

      hotkey.forceUnbind();
      expect(hotkey.isBound).toBe(false);
    });
  });
});
