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
import { isHexColor } from './';

describe('isHexColor', () => {
  it.each([
    ['#FF8040', true],
    ['#ff8040', true],
    ['#F84', true],
    ['#f84', true],
    ['#FF804080', true],
    ['#F840', true],
    ['#000', true],
    ['#FFF', true],
    ['#000000', true],
    ['#FFFFFF', true],
    ['#00000000', true],
    ['#FFFFFFFF', true],
    ['FF8040', true], // Hash optional
    ['F84', true],
  ] as const)('should return %s for valid hex color %s', (value, expected) => {
    expect(isHexColor(value)).toBe(expected);
  });

  it.each([
    '#FF804', // Invalid length (5 chars)
    '#FF80400', // Invalid length (7 chars)
    '#GG8040', // Invalid hex characters
    '#FF-8040', // Invalid character (dash)
    'rgb(255, 128, 64)', // CSS rgba string
    'rgba(255, 128, 64, 1)', // CSS rgba string
    [255, 128, 64, 255], // Tuple
    { r: 255, g: 128, b: 64, a: 1 }, // Object
    '', // Empty string
    '#', // Just hash
    'FF80400', // Invalid length without hash
    null,
    undefined,
    123,
    true,
  ])('should return false for invalid value: %o', (value) => {
    expect(isHexColor(value)).toBe(false);
  });

  it('should trim whitespace', () => {
    expect(isHexColor('  #FF8040  ')).toBe(true);
    expect(isHexColor('  #F84  ')).toBe(true);
  });
});
