import { noop } from 'radashi';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HOTKEY_EXTRA_DEFAULTS, KEY_COMBINATION_DEFAULTS } from '@/constants';
import { Keycode } from '@/enums/keycode';
import { hotkeyStore } from '@/stores/hotkey-store';
import { unregisterHotkey } from '.';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyHook } from '@/types/hotkey-hook';
import type { HotkeyId } from '@/types/hotkey-id';

describe('unregisterHotkey', () => {
  let mockHotkeyId: HotkeyId;
  let mockHotkeyConfig: HotkeyConfig;
  let mockHotkeyHook: HotkeyHook;

  beforeEach(() => {
    mockHotkeyId = 'test-hotkey' as HotkeyId;

    mockHotkeyConfig = {
      id: mockHotkeyId,
      key: [
        {
          id: 'key-a',
          code: Keycode.KeyA,
          ...KEY_COMBINATION_DEFAULTS,
        },
      ],
      onKeyDown: noop,
      ...HOTKEY_EXTRA_DEFAULTS,
    };

    mockHotkeyHook = {
      id: mockHotkeyId,
      config: mockHotkeyConfig,
      isBound: false,
      forceBind: vi.fn(),
      forceUnbind: vi.fn(),
    } as unknown as HotkeyHook;

    hotkeyStore.getState().registerHotkey(mockHotkeyConfig);
  });

  afterEach(() => {
    // Reset the store state before each test
    hotkeyStore.setState(hotkeyStore.getInitialState());
  });

  it('should unregister a hotkey by id', () => {
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(true);

    // Unregister by id
    unregisterHotkey(mockHotkeyId);
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(false);
  });

  it('should unregister a hotkey by config', () => {
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(true);

    // Unregister by config
    unregisterHotkey(mockHotkeyConfig);
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(false);
  });

  it('should unregister a hotkey by hook', () => {
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(true);

    // Unregister by hook
    unregisterHotkey(mockHotkeyHook);
    expect(hotkeyStore.getState().allHotkeys.has(mockHotkeyId)).toBe(false);
  });

  it('should handle unregistering a non-existent hotkey gracefully', () => {
    // Try to unregister a non-existent hotkey
    expect(() => unregisterHotkey(mockHotkeyId)).not.toThrow();
  });
});
