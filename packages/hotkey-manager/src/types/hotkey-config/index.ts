import type { RequireAtLeastOne } from 'type-fest';
import type { HotkeyEvents } from '@/types/hotkey-events';
import type { HotkeyExtra } from '@/types/hotkey-extra';
import type { KeyCombination } from '@/types/key-combination';
import type { NonEmptyArray } from '@/types/non-empty-array';

/**
 * A hotkey configuration object.
 */
export type HotkeyConfig = {
  key: NonEmptyArray<KeyCombination>;
} & RequireAtLeastOne<HotkeyEvents> &
  HotkeyExtra;
