import { describe, expect, it } from 'vitest';
import { Keycode } from '@/enums/keycode';
import { eventToId } from '@/lib/event-to-id';
import type { KeyboardEvent } from 'react';

type KeyboardEventLike = Pick<
  KeyboardEvent,
  'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey' | 'code'
>;

describe('eventToId', () => {
  it.each`
    code                 | alt      | ctrl     | shift    | meta     | id
    ${Keycode.KeyA}      | ${false} | ${false} | ${false} | ${false} | ${'KeyA|no-alt|no-ctrl|no-meta|no-shift'}
    ${Keycode.Numpad1}   | ${true}  | ${false} | ${false} | ${false} | ${'Numpad1|alt|no-ctrl|no-meta|no-shift'}
    ${Keycode.ArrowDown} | ${true}  | ${true}  | ${true}  | ${true}  | ${'ArrowDown|alt|ctrl|meta|shift'}
  `(
    'check string id for key $code (alt: $alt, ctrl: $ctrl, shift: $shift, meta: $meta)',
    ({ code, alt, ctrl, shift, meta, id }) => {
      const keyboardEventLike = {
        code,
        altKey: alt,
        ctrlKey: ctrl,
        shiftKey: shift,
        metaKey: meta,
      } satisfies KeyboardEventLike;

      expect(eventToId(keyboardEventLike as any)).toEqual(id);
    },
  );
});
