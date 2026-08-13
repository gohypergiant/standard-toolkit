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
import {
  formatCircleTooltip,
  formatDistance,
  formatDistanceTooltip,
  formatEllipseTooltip,
  formatRectangleTooltip,
} from './constants';

describe('formatDistance', () => {
  it.each([
    [Math.PI, '3.14'],
    [0, '0.00'],
    [100, '100.00'],
    [0.1, '0.10'],
    [0.005, '0.01'],
    [-5.678, '-5.68'],
  ])('should format %s as "%s"', (input, expected) => {
    expect(formatDistance(input)).toBe(expected);
  });
});

describe('formatCircleTooltip', () => {
  it('should format radius and area with unit', () => {
    expect(formatCircleTooltip(12.5, 490.87, 'km')).toBe(
      'r: 12.50 km\n490.87 km²',
    );
  });

  it('should handle zero values', () => {
    expect(formatCircleTooltip(0, 0, 'mi')).toBe('r: 0.00 mi\n0.00 mi²');
  });
});

describe('formatRectangleTooltip', () => {
  it('should format width, height, and area with unit', () => {
    expect(formatRectangleTooltip(5.0, 3.2, 16.0, 'km')).toBe(
      '5.00 km x 3.20 km\n16.00 km²',
    );
  });
});

describe('formatEllipseTooltip', () => {
  it('should format major axis, minor axis, and area with unit', () => {
    expect(formatEllipseTooltip(10.0, 6.0, 47.12, 'km')).toBe(
      '10.00 km x 6.00 km\n47.12 km²',
    );
  });
});

describe('formatDistanceTooltip', () => {
  it('should format distance with unit', () => {
    expect(formatDistanceTooltip(42.5, 'km')).toBe('42.50 km');
  });

  it('should handle zero distance', () => {
    expect(formatDistanceTooltip(0, 'mi')).toBe('0.00 mi');
  });
});
