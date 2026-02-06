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
import { isCssRgbaObject } from './';

describe('isCssRgbaObject', () => {
  it.each([
    [{ r: 255, g: 128, b: 64, a: 1 }, true],
    [{ r: 255, g: 128, b: 64, a: 0.5 }, true],
    [{ r: 0, g: 0, b: 0, a: 0 }, true],
    [{ r: 255, g: 255, b: 255, a: 1 }, true],
  ] as const)('should return %s for %o', (value, expected) => {
    expect(isCssRgbaObject(value)).toBe(expected);
  });

  it.each([
    { r: 255, g: 128, b: 64 },
    { r: 256, g: 0, b: 0, a: 1 },
    { r: -1, g: 0, b: 0, a: 1 },
    { r: 0, g: 0, b: 0, a: 2 },
    { r: 0, g: 0, b: 0, a: -0.5 },
    [255, 128, 64, 255],
    'rgba(255, 128, 64, 1)',
    null,
    undefined,
    {},
    { r: Number.NaN, g: 0, b: 0, a: 1 },
    { r: 0, g: 0, b: 0, a: Number.NaN },
  ])('should return false for invalid value: %o', (value) => {
    expect(isCssRgbaObject(value)).toBe(false);
  });
});
