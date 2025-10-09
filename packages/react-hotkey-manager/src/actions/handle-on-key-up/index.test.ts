import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FORCE_BOUND,
  HOTKEY_EXTRA_DEFAULTS,
  KEY_COMBINATION_DEFAULTS,
} from '@/constants';
import { Keycode } from '@/enums/keycode';
import { heldId } from '@/lib/held-id';
import { keyToId } from '@/lib/key-to-id';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';
import { handleOnKeyUp } from '.';
import type { HotkeyConfig } from '@/types/hotkey-config';

const keyCombination = {
  id: '',
  code: Keycode.KeyA,
  ...KEY_COMBINATION_DEFAULTS,
};

keyCombination.id = keyToId(keyCombination);

const DEFAULT_HOTKEY_CONFIG: HotkeyConfig = {
  ...HOTKEY_EXTRA_DEFAULTS,
  id: 'test-hotkey',
  key: [keyCombination],
  onKeyUp: vi.fn(),
};

describe('handleOnKeyUp', () => {
  const initStore = () => {
    eventStore.setState(eventStore.getInitialState());
    hotkeyStore.setState(hotkeyStore.getInitialState());
  };

  const addHotkey = (hotkeyConfig: HotkeyConfig) => {
    hotkeyStore.getState().registerHotkey(hotkeyConfig);
    hotkeyStore.getState().activateHotkey(hotkeyConfig.id, FORCE_BOUND);
  };

  beforeEach(() => {
    // Reset stores before each test
    initStore();

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('onKeyUp', () => {
    afterEach(() => {
      initStore();
    });

    it('should do nothing if no hotkeys are configured for the key combination', () => {
      const event = new KeyboardEvent('keyup', { code: Keycode.KeyA });
      handleOnKeyUp(event);
      // No assertions needed as the function should simply return
    });

    it('should call the onKeyDown callback if a hotkey is configured for the key combination', () => {
      addHotkey(DEFAULT_HOTKEY_CONFIG);
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      handleOnKeyUp(event);

      expect(DEFAULT_HOTKEY_CONFIG.onKeyUp).toHaveBeenCalledWith(
        event,
        keyCombination,
        DEFAULT_HOTKEY_CONFIG,
      );
    });

    it('should skip onKeyDown if the hotkey is on an input field', () => {
      addHotkey(DEFAULT_HOTKEY_CONFIG);
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyUp(eventWithTarget);

      expect(DEFAULT_HOTKEY_CONFIG.onKeyUp).not.toHaveBeenCalled();
    });

    it('should call onKeyDown if the hotkey is on an input field and allowInputFields is true', () => {
      const hotkeyConfig: HotkeyConfig = {
        ...DEFAULT_HOTKEY_CONFIG,
        allowInputFields: true,
      };

      addHotkey(hotkeyConfig);
      const event = new KeyboardEvent('keydown', { code: Keycode.KeyA });

      const eventWithTarget = {
        ...event,
        target: document.createElement('input'),
      };

      handleOnKeyUp(eventWithTarget);
      expect(hotkeyConfig.onKeyUp).toHaveBeenCalledWith(
        eventWithTarget,
        keyCombination,
        hotkeyConfig,
      );
    });

    describe('when held', () => {
      beforeEach(() => {
        DEFAULT_HOTKEY_CONFIG.onKeyHeld = vi.fn();
        addHotkey(DEFAULT_HOTKEY_CONFIG);
      });

      it('should not call onKeyUp if the hotkey is held', () => {
        eventStore
          .getState()
          .addHeldTriggered(
            heldId(keyCombination.id, DEFAULT_HOTKEY_CONFIG.id),
          );

        const event = new KeyboardEvent('keyup', { code: Keycode.KeyA });

        handleOnKeyUp(event);

        expect(DEFAULT_HOTKEY_CONFIG.onKeyUp).not.toHaveBeenCalled();
      });
      it('should call onKeyUp if the hotkey is not held', () => {
        const event = new KeyboardEvent('keyup', { code: Keycode.KeyA });

        handleOnKeyUp(event);

        expect(DEFAULT_HOTKEY_CONFIG.onKeyUp).toHaveBeenCalledWith(
          event,
          keyCombination,
          DEFAULT_HOTKEY_CONFIG,
        );
      });

      it('should call onKeyUp if the hotkey is not held and alwaysTriggerKeyUp is true', () => {
        eventStore
          .getState()
          .addHeldTriggered(
            heldId(keyCombination.id, DEFAULT_HOTKEY_CONFIG.id),
          );
        DEFAULT_HOTKEY_CONFIG.alwaysTriggerKeyUp = true;

        const event = new KeyboardEvent('keyup', { code: Keycode.KeyA });

        handleOnKeyUp(event);

        expect(DEFAULT_HOTKEY_CONFIG.onKeyUp).toHaveBeenCalledWith(
          event,
          keyCombination,
          DEFAULT_HOTKEY_CONFIG,
        );
      });
    });
  });
});
