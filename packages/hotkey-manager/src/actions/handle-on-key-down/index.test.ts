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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HOTKEY_EXTRA_DEFAULTS, KEY_COMBINATION_DEFAULTS } from '@/constants';
import { Keycode } from '@/enums/keycode';
import { keyToId } from '@/lib/key-to-id';
import { eventStore } from '@/stores/event-store';
import { addHotkey, initStore } from '@/test/setup';
import { handleOnKeyDown } from '.';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { KeyCombination } from '@/types/key-combination';

const keyCode = Keycode.KeyA;

const DEFAULT_KEY_COMBINATION: KeyCombination = {
  id: '',
  code: keyCode,
  ...KEY_COMBINATION_DEFAULTS,
};

const DEFAULT_HOTKEY_CONFIG: HotkeyConfig = {
  ...HOTKEY_EXTRA_DEFAULTS,
  id: 'test-hotkey',
  key: [DEFAULT_KEY_COMBINATION],
  onKeyDown: vi.fn(),
};

DEFAULT_KEY_COMBINATION.id = keyToId(DEFAULT_KEY_COMBINATION);

describe('handleOnKeyDown', () => {
  beforeEach(() => {
    // Reset stores before each test
    initStore();

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('onKeyDown', () => {
    beforeEach(() => {
      addHotkey(DEFAULT_HOTKEY_CONFIG);
    });

    it('should do nothing if no hotkeys are configured for the key combination', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });
      initStore();
      handleOnKeyDown(event);

      expect(DEFAULT_HOTKEY_CONFIG.onKeyDown).not.toHaveBeenCalled();
    });

    it('should call the onKeyDown callback if a hotkey is configured for the key combination', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });

      handleOnKeyDown(event);

      expect(DEFAULT_HOTKEY_CONFIG.onKeyDown).toHaveBeenCalledWith(
        event,
        DEFAULT_KEY_COMBINATION,
        DEFAULT_HOTKEY_CONFIG,
      );
    });

    it('should skip onKeyDown if the hotkey is on an input field', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(DEFAULT_HOTKEY_CONFIG.onKeyDown).not.toHaveBeenCalled();
    });

    it('should call onKeyDown if the hotkey is on an input field and allowInputFields is true', () => {
      const hotkeyConfig = {
        ...DEFAULT_HOTKEY_CONFIG,
        allowInputFields: true,
      };

      initStore();
      addHotkey(hotkeyConfig);

      const event = new KeyboardEvent('keydown', { code: keyCode });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(hotkeyConfig.onKeyDown).toHaveBeenCalledWith(
        eventWithTarget,
        DEFAULT_KEY_COMBINATION,
        hotkeyConfig,
      );
    });
  });

  describe('onKeyHeld', () => {
    const hotkeyConfig = {
      ...DEFAULT_HOTKEY_CONFIG,
      onKeyDown: vi.fn(),
      onKeyHeld: vi.fn(),
    };
    beforeEach(() => {
      addHotkey(hotkeyConfig);

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should do nothing if no hotkeys are configured for the key combination', () => {
      initStore();
      const event = new KeyboardEvent('keydown', { code: keyCode });
      handleOnKeyDown(event);

      expect(hotkeyConfig.onKeyDown).not.toHaveBeenCalled();
    });

    it('should call onKeyHeld if the hotkey is activated', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });

      handleOnKeyDown(event);

      expect(hotkeyConfig.onKeyHeld).not.toHaveBeenCalled();
      expect(eventStore.getState().heldTimeouts.size).toBe(1);
      expect(eventStore.getState().heldTriggered.size).toBe(0);

      vi.advanceTimersToNextTimer();

      expect(hotkeyConfig.onKeyHeld).toHaveBeenCalledWith(
        event,
        DEFAULT_KEY_COMBINATION,
        hotkeyConfig,
      );

      expect(eventStore.getState().heldTriggered.size).toBe(1);
    });

    it('should skip onKeyHeld if the hotkey is on an input field', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(hotkeyConfig.onKeyHeld).not.toHaveBeenCalled();
      expect(eventStore.getState().heldTimeouts.size).toBe(0);
      expect(eventStore.getState().heldTriggered.size).toBe(0);
    });

    it('should call onKeyHeld if the hotkey is on an input field and allowInputFields is true', () => {
      const allowInputFieldsConfig = {
        ...hotkeyConfig,
        allowInputFields: true,
      };

      initStore();
      addHotkey(allowInputFieldsConfig);

      const event = new KeyboardEvent('keydown', { code: keyCode });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(allowInputFieldsConfig.onKeyHeld).not.toHaveBeenCalled();
      expect(eventStore.getState().heldTimeouts.size).toBe(1);
      expect(eventStore.getState().heldTriggered.size).toBe(0);

      vi.advanceTimersToNextTimer();

      expect(allowInputFieldsConfig.onKeyHeld).toHaveBeenCalledWith(
        eventWithTarget,
        DEFAULT_KEY_COMBINATION,
        allowInputFieldsConfig,
      );

      expect(eventStore.getState().heldTriggered.size).toBe(1);
    });

    it('should not add a new timeout if one already exists for the id', () => {
      const event = new KeyboardEvent('keydown', { code: keyCode });

      handleOnKeyDown(event);
      expect(eventStore.getState().heldTimeouts.size).toBe(1);

      handleOnKeyDown(event);
      expect(eventStore.getState().heldTimeouts.size).toBe(1);
      expect(hotkeyConfig.onKeyHeld).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();
      expect(hotkeyConfig.onKeyHeld).toHaveBeenCalled();
    });
  });
});
