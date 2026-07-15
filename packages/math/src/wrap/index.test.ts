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
import { wrap } from './';

describe('wrap', () => {
  it.each`
    min     | max    | value   | expected | scenario
    ${0}    | ${360} | ${10}   | ${10}    | ${'returns value already within an angle range'}
    ${0}    | ${360} | ${370}  | ${10}    | ${'wraps a value past max back to min'}
    ${0}    | ${360} | ${-90}  | ${270}   | ${'wraps a negative value up into range'}
    ${0}    | ${360} | ${720}  | ${0}     | ${'wraps a multi-revolution value to min'}
    ${0}    | ${360} | ${0}    | ${0}     | ${'returns min unchanged (inclusive lower bound)'}
    ${0}    | ${360} | ${360}  | ${0}     | ${'wraps max to min (exclusive upper bound)'}
    ${-180} | ${180} | ${45}   | ${45}    | ${'returns a longitude already within range'}
    ${-180} | ${180} | ${190}  | ${-170}  | ${'wraps a longitude past the antimeridian'}
    ${-180} | ${180} | ${-180} | ${-180}  | ${'returns the inclusive min longitude unchanged'}
    ${-180} | ${180} | ${180}  | ${-180}  | ${'wraps the exclusive max longitude to min'}
    ${-180} | ${180} | ${540}  | ${-180}  | ${'wraps a multi-revolution longitude'}
    ${-180} | ${180} | ${-541} | ${179}   | ${'wraps a large negative longitude'}
  `('should $scenario', ({ min, max, value, expected }) => {
    const result = wrap(min, max, value);

    expect(result).toBe(expected);
  });

  it('should throw RangeError when min equals max', () => {
    expect(() => wrap(0, 0, 5)).toThrow('min exceeded max');
  });

  it('should throw RangeError when min exceeds max', () => {
    expect(() => wrap(360, 0, 10)).toThrow('min exceeded max');
  });
});
