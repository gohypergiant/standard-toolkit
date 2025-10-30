// __private-exports

import type { HotkeyExtra } from '@/types/hotkey-extra';

/**
 * Special symbol marking a force bound hotkey.
 *
 * @internal
 */
export const FORCE_BOUND = Symbol('FORCE_BOUND');

/**
 * Defaults for the hotkey extras.
 *
 * @internal
 */
export const HOTKEY_EXTRA_DEFAULTS = {
  heldThresholdMs: 1_000,
  alwaysTriggerKeyUp: false,
  ignoreConflicts: false,
  allowInputFields: false,
} satisfies Omit<HotkeyExtra, 'id'>;

import type { KeyCombination } from '@/types/key-combination';

/**
 * Default values for key combinations.
 *
 * @internal
 */
export const KEY_COMBINATION_DEFAULTS = {
  alt: false,
  ctrl: false,
  meta: false,
  shift: false,
  autoMacStyle: false,
} satisfies Omit<KeyCombination, 'code' | 'id'>;
