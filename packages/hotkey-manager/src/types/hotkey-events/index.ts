import type { HotkeyAction } from '@/types/hotkey-action';

/**
 * Hotkey events
 */
export type HotkeyEvents = {
  /**
   * Called when a matching key combination is pressed.
   */
  onKeyDown: HotkeyAction;
  /**
   * Called after a matching key combination has been held pass the threshold.
   */
  onKeyHeld: HotkeyAction;
  /**
   * Called when a matching key combination is released. Will not trigger if a `onKeyHeld` was triggered.
   */
  onKeyUp: HotkeyAction;
};
