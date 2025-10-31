import { describe, expect, it } from 'vitest';
import { Keycode } from '@/enums/keycode';
import { keyToString } from '@/lib/key-to-string';
import type { KeyCombination } from '@/types/key-combination';

describe('keyToString', () => {
  it.each`
    code                 | alt      | ctrl     | shift    | meta     | message
    ${Keycode.KeyA}      | ${false} | ${false} | ${false} | ${false} | ${'[KeyA]'}
    ${Keycode.Numpad1}   | ${true}  | ${false} | ${false} | ${false} | ${'[ALT] + [Numpad1]'}
    ${Keycode.ArrowDown} | ${true}  | ${true}  | ${true}  | ${true}  | ${'[CTRL] + [Win/⌘] + [ALT] + [SHIFT] + [ArrowDown]'}
  `(
    'for key $code (alt: $alt, ctrl: $ctrl, shift: $shift, meta: $meta)',
    ({ code, alt, ctrl, shift, meta, message }) => {
      const keyCombination = {
        code,
        alt,
        ctrl,
        shift,
        meta,
        autoMacStyle: false,
      } as KeyCombination;

      expect(keyToString(keyCombination)).toBe(message);
    },
  );
});
