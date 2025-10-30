import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyHook } from '@/types/hotkey-hook';
import type { HotkeyId } from '@/types/hotkey-id';

/**
 * Unregisters a hotkey.
 *
 * @param id The hotkey id.
 */
export function unregisterHotkey(id: HotkeyId): void;

/**
 * Unregisters a hotkey.
 *
 * @param config The hotkey config.
 */
export function unregisterHotkey(config: HotkeyConfig): void;

/**
 * Unregisters a hotkey.
 *
 * @param hook The hotkey hook.
 */
export function unregisterHotkey(hook: HotkeyHook): void;
export function unregisterHotkey(
  idOrConfigOrHook: HotkeyId | HotkeyConfig | HotkeyHook,
): void {
  let id: HotkeyId;

  if (
    (typeof idOrConfigOrHook === 'object' ||
      idOrConfigOrHook instanceof Function) &&
    'id' in idOrConfigOrHook
  ) {
    id = idOrConfigOrHook.id;
  } else {
    id = idOrConfigOrHook;
  }

  hotkeyStore.getState().unregisterHotkey(id);
}
