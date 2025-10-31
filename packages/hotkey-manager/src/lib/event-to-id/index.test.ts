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
