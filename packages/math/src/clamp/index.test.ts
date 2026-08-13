/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { clamp } from './';

describe('clamp', () => {
  it.each`
    min  | max  | value | expected | scenario
    ${1} | ${2} | ${0}  | ${1}     | ${'returns min when value is below minimum'}
    ${1} | ${2} | ${3}  | ${2}     | ${'returns max when value is above maximum'}
    ${1} | ${3} | ${2}  | ${2}     | ${'returns value when within range'}
  `('should $scenario', ({ min, max, value, expected }) => {
    const result = clamp(min, max, value);

    expect(result).toBe(expected);
  });

  it('should throw RangeError when min exceeds max', () => {
    expect(() => clamp(1, 0, 1)).toThrow('min exceeded max');
  });
});
