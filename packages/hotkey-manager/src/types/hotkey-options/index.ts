import type { RequireAtLeastOne } from 'type-fest';
import type { HotkeyEvents } from '@/types/hotkey-events';
import type { HotkeyExtra } from '@/types/hotkey-extra';
import type { KeyOption } from '@/types/key-option';
import type { NonEmptyArray } from '@/types/non-empty-array';

/**
 * A partial hotkey configuration object.
 */
export type HotkeyOptions = {
  key: KeyOption | NonEmptyArray<KeyOption>;
} & RequireAtLeastOne<HotkeyEvents> &
  Partial<HotkeyExtra>;
