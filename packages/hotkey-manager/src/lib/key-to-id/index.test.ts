import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Keycode } from '@/enums/keycode';
import { keyToId } from '@/lib/key-to-id';
import type { KeyCombination } from '@/types/key-combination';

let isMacValue = false;

vi.mock('@/lib/is-mac', () => ({
  get isMac() {
    return isMacValue;
  },
}));

describe('keyToId', () => {
  beforeEach(() => {
    isMacValue = false;
  });

  it.each`
    code                 | alt      | ctrl     | shift    | meta     | autoMacStyle | isMac    | id
    ${Keycode.KeyA}      | ${false} | ${false} | ${false} | ${false} | ${false}     | ${false} | ${'KeyA|no-alt|no-ctrl|no-meta|no-shift'}
    ${Keycode.Numpad1}   | ${true}  | ${false} | ${false} | ${false} | ${false}     | ${false} | ${'Numpad1|alt|no-ctrl|no-meta|no-shift'}
    ${Keycode.ArrowDown} | ${true}  | ${true}  | ${true}  | ${true}  | ${false}     | ${false} | ${'ArrowDown|alt|ctrl|meta|shift'}
    ${Keycode.KeyS}      | ${false} | ${true}  | ${false} | ${false} | ${true}      | ${false} | ${'KeyS|no-alt|ctrl|no-meta|no-shift'}
    ${Keycode.KeyS}      | ${false} | ${true}  | ${false} | ${false} | ${true}      | ${true}  | ${'KeyS|no-alt|no-ctrl|meta|no-shift'}
    ${Keycode.KeyD}      | ${false} | ${false} | ${false} | ${true}  | ${true}      | ${false} | ${'KeyD|no-alt|no-ctrl|meta|no-shift'}
    ${Keycode.KeyD}      | ${false} | ${false} | ${false} | ${true}  | ${true}      | ${true}  | ${'KeyD|no-alt|ctrl|no-meta|no-shift'}
  `(
    'check string id for key $code (alt: $alt, ctrl: $ctrl, shift: $shift, meta: $meta, aMS: $autoMacStyle, iM: $isMac)',
    ({ code, alt, ctrl, shift, meta, autoMacStyle, isMac, id }) => {
      isMacValue = isMac;

      const keyCombination = {
        id: 'test',
        code,
        alt,
        ctrl,
        shift,
        meta,
        autoMacStyle,
      } satisfies KeyCombination;

      expect(keyToId(keyCombination)).toEqual(id);
    },
  );
});
