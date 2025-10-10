import type { HotkeyConfig } from '@/types/hotkey-config';
import type { KeyCombination } from '@/types/key-combination';

/**
 * Hotkey action
 *
 * @param event The keyboard event that triggered the action
 * @param key The key combination that triggered the action
 * @param hotkey The hotkey configuration
 */
export type HotkeyAction = (
  event: KeyboardEvent,
  key: KeyCombination,
  hotkey: HotkeyConfig,
) => void;
