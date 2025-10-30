import { noop } from 'radashi';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HOTKEY_EXTRA_DEFAULTS, KEY_COMBINATION_DEFAULTS } from '@/constants';
import { Keycode } from '@/enums/keycode';
import { keyToId } from '@/lib/key-to-id';
import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { KeyCombination } from '@/types/key-combination';

describe('hotkeyStore', () => {
  let hotkeyConfig: HotkeyConfig;
  let keyA: KeyCombination;
  let keyB: KeyCombination;

  beforeEach(() => {
    keyA = {
      id: 'key-a',
      code: Keycode.KeyA,
      ...KEY_COMBINATION_DEFAULTS,
    };

    keyA.id = keyToId(keyA);

    keyB = {
      ...keyA,
      code: Keycode.KeyB,
    };

    keyB.id = keyToId(keyB);

    hotkeyConfig = {
      id: 'test-hotkey',
      key: [keyA],
      onKeyUp: vi.fn(),
      ...HOTKEY_EXTRA_DEFAULTS,
    };
  });

  afterEach(() => {
    hotkeyStore.setState(hotkeyStore.getInitialState());
  });

  describe('registerHotkey', () => {
    it('should register a hotkey', () => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);

      expect(hotkeyStore.getState().allHotkeys.get(hotkeyConfig.id)).toEqual(
        hotkeyConfig,
      );
    });

    it('should register a hotkey with multiple keys', () => {
      hotkeyStore.getState().registerHotkey({
        ...hotkeyConfig,
        key: [keyA, keyB],
      });

      expect(hotkeyStore.getState().registeredKeyCombinations.size).toBe(2);

      expect(
        hotkeyStore.getState().registeredKeyCombinations.get(keyA.id),
      ).toEqual([hotkeyConfig.id]);

      expect(
        hotkeyStore.getState().registeredKeyCombinations.get(keyB.id),
      ).toEqual([hotkeyConfig.id]);
    });

    it('should throw an error if the hotkey is already registered', () => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);

      expect(() => hotkeyStore.getState().registerHotkey(hotkeyConfig)).toThrow(
        `Hotkey with id ${hotkeyConfig.id} has already been registered.`,
      );
    });

    it('should throw a warning if the key combination is already registered', () => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);

      const sameKeyCombination = {
        ...hotkeyConfig,
        id: 'same-key-combination',
      };

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(noop);
      try {
        hotkeyStore.getState().registerHotkey(sameKeyCombination);

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Hotkey with the combination'),
        );
      } finally {
        consoleWarnSpy.mockRestore();
      }
    });
  });

  describe('activateHotkey', () => {
    let activationSymbol: symbol;

    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      activationSymbol = Symbol('activation');
    });

    it('should activate a hotkey', () => {
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);

      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toEqual([activationSymbol]);
    });

    it('should activate a hotkey with multiple activations', () => {
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);
      const secondActivationSymbol = Symbol('second-activation');
      hotkeyStore
        .getState()
        .activateHotkey(hotkeyConfig.id, secondActivationSymbol);

      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toEqual([activationSymbol, secondActivationSymbol]);
    });

    it('should not double activate for the same activationSymbol', () => {
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);

      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toEqual([activationSymbol]);
    });

    it('should no activate a hotkey if it is not registered', () => {
      hotkeyStore
        .getState()
        .activateHotkey('non-existent-hotkey', activationSymbol);

      expect(
        hotkeyStore.getState().hotkeyActivations.get('non-existent-hotkey'),
      ).toBeUndefined();
    });
  });

  describe('unregisterHotkey', () => {
    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
    });

    it('should unregister a hotkey', () => {
      hotkeyStore.getState().unregisterHotkey(hotkeyConfig.id);

      expect(
        hotkeyStore.getState().allHotkeys.get(hotkeyConfig.id),
      ).toBeUndefined();
    });

    it('should handle unregistering a hotkey that is not registered', () => {
      hotkeyStore.getState().unregisterHotkey('non-existent-hotkey');

      expect(hotkeyStore.getState().allHotkeys.size).toBe(1);
    });

    it('should remove the hotkey from the registeredKeyCombinations', () => {
      const keyId = keyToId(hotkeyConfig.key[0]);

      expect(
        hotkeyStore.getState().registeredKeyCombinations.get(keyId),
      ).toBeDefined();

      hotkeyStore.getState().unregisterHotkey(hotkeyConfig.id);

      expect(
        hotkeyStore.getState().registeredKeyCombinations.get(keyId),
      ).toBeUndefined();
    });

    it('should only remove the specific hotkey from the registeredKeyCombinations', () => {
      const keyId = keyToId(hotkeyConfig.key[0]);

      const secondHotkeyConfig = {
        ...hotkeyConfig,
        id: 'second-hotkey',
      };

      hotkeyStore.getState().registerHotkey(secondHotkeyConfig);

      hotkeyStore.getState().unregisterHotkey(hotkeyConfig.id);

      expect(
        hotkeyStore.getState().registeredKeyCombinations.get(keyId),
      ).toEqual([secondHotkeyConfig.id]);
    });

    it('should remove the hotkey from the activeKeyCombinations', () => {
      const activationSymbol = Symbol('activation');
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);

      const keyId = keyToId(hotkeyConfig.key[0]);

      expect(
        hotkeyStore.getState().activeKeyCombinations.get(keyId),
      ).toBeDefined();

      hotkeyStore.getState().unregisterHotkey(hotkeyConfig.id);

      expect(
        hotkeyStore.getState().activeKeyCombinations.get(keyId),
      ).toBeUndefined();
    });

    it('should only remove the specific hotkey from the activeKeyCombinations', () => {
      const activationSymbol = Symbol('activation');
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);

      const keyId = keyToId(hotkeyConfig.key[0]);

      const secondHotkeyConfig = {
        ...hotkeyConfig,
        id: 'second-hotkey',
      };

      hotkeyStore.getState().registerHotkey(secondHotkeyConfig);

      const secondActivationSymbol = Symbol('second-activation');
      hotkeyStore
        .getState()
        .activateHotkey(secondHotkeyConfig.id, secondActivationSymbol);

      hotkeyStore.getState().unregisterHotkey(hotkeyConfig.id);

      expect(hotkeyStore.getState().activeKeyCombinations.get(keyId)).toEqual([
        secondHotkeyConfig.id,
      ]);
    });
  });

  describe('deactivateHotkey', () => {
    let activationSymbol: symbol;

    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      activationSymbol = Symbol('activation');
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);
    });

    it('should deactivate a hotkey for a specific activation symbol', () => {
      hotkeyStore
        .getState()
        .deactivateHotkey(hotkeyConfig.id, activationSymbol);
      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toBeUndefined();
    });

    it('should not deactivate if the activation symbol does not match', () => {
      const differentSymbol = Symbol('different');
      hotkeyStore.getState().deactivateHotkey(hotkeyConfig.id, differentSymbol);
      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toEqual([activationSymbol]);
    });

    it('should handle multiple activations correctly', () => {
      const secondActivationSymbol = Symbol('second-activation');
      hotkeyStore
        .getState()
        .activateHotkey(hotkeyConfig.id, secondActivationSymbol);

      hotkeyStore
        .getState()
        .deactivateHotkey(hotkeyConfig.id, activationSymbol);
      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toEqual([secondActivationSymbol]);
    });
  });

  describe('forceDeactivateHotkey', () => {
    let activationSymbol: symbol;

    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      activationSymbol = Symbol('activation');
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);
    });

    it('should force deactivate a hotkey regardless of activation symbols', () => {
      hotkeyStore.getState().forceDeactivateHotkey(hotkeyConfig.id);
      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toBeUndefined();
    });

    it('should handle multiple activations correctly', () => {
      const secondActivationSymbol = Symbol('second-activation');
      hotkeyStore
        .getState()
        .activateHotkey(hotkeyConfig.id, secondActivationSymbol);

      hotkeyStore.getState().forceDeactivateHotkey(hotkeyConfig.id);
      expect(
        hotkeyStore.getState().hotkeyActivations.get(hotkeyConfig.id),
      ).toBeUndefined();
    });

    it('should handle non-existent hotkey gracefully', () => {
      hotkeyStore.getState().forceDeactivateHotkey('non-existent-hotkey');
      // No error should be thrown
    });
  });

  describe('getHotkeysForKeyCombination', () => {
    let activationSymbol: symbol;

    beforeEach(() => {
      hotkeyStore.getState().registerHotkey(hotkeyConfig);
      activationSymbol = Symbol('activation');
      hotkeyStore.getState().activateHotkey(hotkeyConfig.id, activationSymbol);
    });

    it('should return null for non-existent key combination', () => {
      const result = hotkeyStore
        .getState()
        .getHotkeysForKeyCombination('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return hotkeys for a registered key combination', () => {
      const keyId = keyToId(hotkeyConfig.key[0]);
      const result = hotkeyStore.getState().getHotkeysForKeyCombination(keyId);
      expect(result).toEqual([hotkeyConfig]);
    });

    it('should return multiple hotkeys for the same key combination', () => {
      const secondHotkeyConfig = {
        ...hotkeyConfig,
        id: 'second-hotkey',
      };
      hotkeyStore.getState().registerHotkey(secondHotkeyConfig);
      const secondActivationSymbol = Symbol('second-activation');
      hotkeyStore
        .getState()
        .activateHotkey(secondHotkeyConfig.id, secondActivationSymbol);

      const keyId = keyToId(hotkeyConfig.key[0]);
      const result = hotkeyStore.getState().getHotkeysForKeyCombination(keyId);
      expect(result).toEqual([hotkeyConfig, secondHotkeyConfig]);
    });
  });
});
