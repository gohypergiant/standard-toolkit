import type { CleanupFunction } from '@/types/cleanup-function';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyId } from '@/types/hotkey-id';

export type HotkeyHook = {
  /**
   * A React hook that manages a hotkey. When mounted, it will activate the hotkey. When all instances are unmounted, it
   * will deactivate the hotkey.
   */
  (): void;
  /**
   * The id of the hotkey
   */
  id: HotkeyId;
  /**
   * The full hotkey config
   */
  config: HotkeyConfig;
  /**
   * Force bind the hotkey. Ignores the hooks mounted state.
   */
  forceBind(): CleanupFunction;
  /**
   * Force unbind the hotkey. Ignores the hooks mounted state.
   */
  forceUnbind(): void;
  /**
   * Whether the hotkey is currently bound
   */
  isBound: boolean;
};
