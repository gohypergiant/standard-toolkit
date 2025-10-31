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
