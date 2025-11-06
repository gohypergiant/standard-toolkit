/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Keycode } from '@/enums/keycode';
import { eventToId } from '@/lib/event-to-id';
import { keyToId } from '@/lib/key-to-id';
import type { KeyCombination } from '@/types/key-combination';

type KeyboardEventLike = Pick<
  KeyboardEvent,
  'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey' | 'code'
>;

let isMacValue = false;

vi.mock('@/lib/is-mac', () => ({
  get isMac() {
    return isMacValue;
  },
}));

describe('eventToId and keyToId', () => {
  beforeEach(() => {
    isMacValue = false;
  });

  it.each`
    code                 | alt      | ctrl     | shift    | meta
    ${Keycode.KeyA}      | ${false} | ${false} | ${false} | ${false}
    ${Keycode.Numpad1}   | ${true}  | ${false} | ${false} | ${false}
    ${Keycode.ArrowDown} | ${true}  | ${true}  | ${true}  | ${true}
  `(
    'check matching ids for key $code (alt: $alt, ctrl: $ctrl, shift: $shift, meta: $meta)',
    ({ code, alt, ctrl, shift, meta }) => {
      const keyboardEventLike = {
        code,
        altKey: alt,
        ctrlKey: ctrl,
        shiftKey: shift,
        metaKey: meta,
      } satisfies KeyboardEventLike;

      const keyCombination = {
        id: 'test',
        code,
        alt,
        ctrl,
        shift,
        meta,
        autoMacStyle: false,
      } satisfies KeyCombination;

      expect(eventToId(keyboardEventLike as any)).toEqual(
        keyToId(keyCombination),
      );
    },
  );

  it.each`
    code                 | alt      | ctrl     | shift    | meta     | ctrlKey  | metaKey
    ${Keycode.KeyA}      | ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
    ${Keycode.Numpad1}   | ${true}  | ${false} | ${false} | ${false} | ${false} | ${false}
    ${Keycode.ArrowDown} | ${false} | ${true}  | ${false} | ${false} | ${false} | ${true}
    ${Keycode.ArrowUp}   | ${false} | ${false} | ${false} | ${true}  | ${true}  | ${false}
  `(
    'check matching ids when macOS for key $code (alt: $alt, ctrl: $ctrl, shift: $shift, meta: $meta, ctrlKey: ctrlKey, metaKey: $metaKey)',
    ({ code, alt, ctrl, shift, meta, ctrlKey, metaKey }) => {
      isMacValue = true;

      const keyboardEventLike = {
        code,
        altKey: alt,
        ctrlKey,
        shiftKey: shift,
        metaKey,
      } satisfies KeyboardEventLike;

      const keyCombination = {
        id: 'test',
        code,
        alt,
        ctrl,
        shift,
        meta,
        autoMacStyle: true,
      } satisfies KeyCombination;

      expect(eventToId(keyboardEventLike as any)).toEqual(
        keyToId(keyCombination),
      );
    },
  );
});
