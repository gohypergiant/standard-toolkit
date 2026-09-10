/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { toPlainDecimalString } from './plain-decimal';

describe('toPlainDecimalString', () => {
  it.each`
    value                    | expected
    ${0}                     | ${'0'}
    ${45}                    | ${'45'}
    ${-122.4194}             | ${'-122.4194'}
    ${0.000001}              | ${'0.000001'}
    ${0.0000001}             | ${'0.0000001'}
    ${-0.0000005}            | ${'-0.0000005'}
    ${1.234567e-7}           | ${'0.0000001234567'}
    ${1e-20}                 | ${'0.00000000000000000001'}
    ${1e30}                  | ${'1e+30'}
    ${-1e21}                 | ${'-1e+21'}
    ${123456789012345680000} | ${'123456789012345680000'}
    ${46.1247816666}         | ${'46.1247816666'}
  `('renders $value as $expected', ({ value, expected }) => {
    expect(toPlainDecimalString(value)).toBe(expected);
  });
});
