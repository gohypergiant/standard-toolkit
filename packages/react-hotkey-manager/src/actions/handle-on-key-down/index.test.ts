import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FORCE_BOUND,
  HOTKEY_EXTRA_DEFAULTS,
  KEY_COMBINATION_DEFAULTS,
} from '@/constants';
import { Keycode } from '@/enums/keycode';
import { keyToId } from '@/lib/key-to-id';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';
import { handleOnKeyDown } from '.';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { KeyCombination } from '@/types/key-combination';

describe('handleOnKeyDown', () => {
  let hotkeyConfig: HotkeyConfig;
  let keyCombination: KeyCombination;

  beforeEach(() => {
    // Reset stores before each test
    eventStore.setState(eventStore.getInitialState());

    hotkeyStore.setState(hotkeyStore.getInitialState());

    keyCombination = {
      id: '',
      code: Keycode.KeyA,
      ...KEY_COMBINATION_DEFAULTS,
    };

    keyCombination.id = keyToId(keyCombination);

    hotkeyConfig = {
      ...HOTKEY_EXTRA_DEFAULTS,
      id: 'test-hotkey',
      key: [keyCombination],
      onKeyDown: vi.fn(),
    };

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('onKeyDown', () => {
    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, FORCE_BOUND);
    });

    it('should do nothing if no hotkeys are configured for the key combination', () => {
      hotkeyStore.setState(hotkeyStore.getInitialState());
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });
      handleOnKeyDown(event);
      // No assertions needed as the function should simply return
    });

    it('should call the onKeyDown callback if a hotkey is configured for the key combination', () => {
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      handleOnKeyDown(event);

      expect(hotkeyConfig.onKeyDown).toHaveBeenCalledWith(
        event,
        keyCombination,
        hotkeyConfig,
      );
    });

    it('should skip onKeyDown if the hotkey is on an input field', () => {
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(hotkeyConfig.onKeyDown).not.toHaveBeenCalled();
    });

    it('should call onKeyDown if the hotkey is on an input field and allowInputFields is true', () => {
      hotkeyConfig.allowInputFields = true;

      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(hotkeyConfig.onKeyDown).toHaveBeenCalledWith(
        eventWithTarget,
        keyCombination,
        hotkeyConfig,
      );
    });
  });

  describe('onKeyHeld', () => {
    beforeEach(() => {
      hotkeyConfig.onKeyDown = undefined;
      hotkeyConfig.onKeyHeld = vi.fn();

      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, FORCE_BOUND);

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should do nothing if no hotkeys are configured for the key combination', () => {
      hotkeyStore.setState(hotkeyStore.getInitialState());
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });
      handleOnKeyDown(event);
      // No assertions needed as the function should simply return
    });

    it('should call onKeyHeld if the hotkey is activated', () => {
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      handleOnKeyDown(event);

      expect(hotkeyConfig.onKeyHeld).not.toHaveBeenCalled();
      expect(eventStore.getState().heldTimeouts.size).toBe(1);
      expect(eventStore.getState().heldTriggered.size).toBe(0);

      vi.advanceTimersToNextTimer();

      expect(hotkeyConfig.onKeyHeld).toHaveBeenCalledWith(
        event,
        keyCombination,
        hotkeyConfig,
      );

      expect(eventStore.getState().heldTriggered.size).toBe(1);
    });

    it('should skip onKeyHeld if the hotkey is on an input field', () => {
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

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
      hotkeyConfig.allowInputFields = true;

      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyDown(eventWithTarget);

      expect(hotkeyConfig.onKeyHeld).not.toHaveBeenCalled();
      expect(eventStore.getState().heldTimeouts.size).toBe(1);
      expect(eventStore.getState().heldTriggered.size).toBe(0);

      vi.advanceTimersToNextTimer();

      expect(hotkeyConfig.onKeyHeld).toHaveBeenCalledWith(
        eventWithTarget,
        keyCombination,
        hotkeyConfig,
      );

      expect(eventStore.getState().heldTriggered.size).toBe(1);
    });

    it('should not add a new timeout if one already exists for the id', () => {
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

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
