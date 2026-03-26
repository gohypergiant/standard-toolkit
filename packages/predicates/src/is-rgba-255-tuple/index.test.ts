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
import { isRgba255Tuple } from './';

describe('isRgba255Tuple', () => {
  it.each([
    [[255, 128, 64, 255], true],
    [[0, 0, 0, 0], true],
    [[255, 255, 255, 255], true],
  ] as const)('should return %s for %o', (value, expected) => {
    expect(isRgba255Tuple(value)).toBe(expected);
  });

  it.each([
    [255, 128, 64],
    [255, 128, 64, 255, 0],
    [256, 0, 0, 0],
    [-1, 0, 0, 0],
    'rgba(255, 128, 64, 1)',
    { r: 255, g: 128, b: 64, a: 255 },
    null,
    undefined,
    [Number.NaN, 0, 0, 0],
    [Number.POSITIVE_INFINITY, 0, 0, 0],
  ])('should return false for invalid value: %o', (value) => {
    expect(isRgba255Tuple(value)).toBe(false);
  });
});
