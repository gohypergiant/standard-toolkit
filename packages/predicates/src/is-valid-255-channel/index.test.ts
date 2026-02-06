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
import { isValid255Channel } from './';

describe('isValid255Channel', () => {
  it.each([
    [0, true],
    [128, true],
    [255, true],
    [1, true],
    [254, true],
    [0.5, true], // Decimals are valid
    [127.5, true],
  ] as const)('should return %s for valid channel value %d', (value, expected) => {
    expect(isValid255Channel(value)).toBe(expected);
  });

  it.each([
    -1, // Below minimum
    -0.1,
    256, // Above maximum
    300,
    1000,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])('should return false for invalid value: %d', (value) => {
    expect(isValid255Channel(value)).toBe(false);
  });

  it('should handle boundary cases', () => {
    expect(isValid255Channel(0)).toBe(true);
    expect(isValid255Channel(255)).toBe(true);
    expect(isValid255Channel(-0)).toBe(true); // -0 equals 0
  });
});
