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
import { isCssRgbaString } from './';

describe('isCssRgbaString', () => {
  describe('legacy comma-separated syntax', () => {
    it.each([
      ['rgba(255, 128, 64, 1)', true],
      ['rgba(255, 128, 64, 0.5)', true],
      ['rgba(255,128,64,0.5)', true], // No spaces
      ['rgba( 255 , 128 , 64 , 0.5 )', true], // Extra spaces
      ['rgb(255, 128, 64)', true],
      ['rgb(0, 0, 0)', true],
      ['rgba(0, 0, 0, 0)', true],
      ['RGBA(255, 128, 64, 1)', true], // Case insensitive
      ['RGB(255, 128, 64)', true],
      ['rgba(255, 128, 64)', true], // Alpha is optional
      ['rgb(255, 128, 64, 1)', true], // 4th param allowed
      ['rgb(256, 128, 64)', true], // Regex doesn't validate value ranges
      // Percentage values
      ['rgb(100%, 50%, 25%)', true],
      ['rgba(100%, 50%, 25%, 0.5)', true],
      ['rgba(100%, 50%, 25%, 50%)', true], // Percentage alpha
    ] as const)('should return %s for valid legacy syntax %s', (value, expected) => {
      expect(isCssRgbaString(value)).toBe(expected);
    });
  });

  describe('modern space-separated syntax', () => {
    it.each([
      ['rgb(255 128 64)', true],
      ['rgb(255 128 64 / 0.5)', true],
      ['rgb(255 128 64 / 50%)', true], // Percentage alpha
      ['rgba(255 128 64)', true], // rgba with space syntax
      ['rgba(255 128 64 / 0.5)', true],
      ['rgb(  255   128   64  )', true], // Extra spaces
      ['rgb(255 128 64/0.5)', true], // No spaces around slash
      ['rgb(255 128 64 /0.5)', true],
      ['rgb(255 128 64/ 0.5)', true],
      // Percentage values
      ['rgb(100% 50% 25%)', true],
      ['rgb(100% 50% 25% / 50%)', true],
    ] as const)('should return %s for valid modern syntax %s', (value, expected) => {
      expect(isCssRgbaString(value)).toBe(expected);
    });
  });

  it.each([
    '#FF8040', // Hex color
    '#F84',
    'hsl(180, 50%, 50%)', // HSL color
    'rgba(255 128 64, 1)', // Mixed comma and space
    'rgb(255, 128)', // Missing blue
    'rgb()', // Empty
    'rgba()', // Empty
    [255, 128, 64, 255], // Tuple
    { r: 255, g: 128, b: 64, a: 1 }, // Object
    '', // Empty string
    null,
    undefined,
    123,
    true,
    'rgba(255, 128, 64, 1, 0)', // Too many values
  ])('should return false for invalid value: %o', (value) => {
    expect(isCssRgbaString(value)).toBe(false);
  });

  it('should trim whitespace', () => {
    expect(isCssRgbaString('  rgba(255, 128, 64, 1)  ')).toBe(true);
    expect(isCssRgbaString('  rgb(255 128 64)  ')).toBe(true);
  });
});
