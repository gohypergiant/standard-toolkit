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
