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
import { DEFAULT_MGRS_UTM_COORDS } from './constants';
import { formatCoordinate, normalizeLongitude } from './format-coordinate';

describe('normalizeLongitude', () => {
  it.each([
    { input: 0, expected: 0 },
    // ±180 both wrap to the lower bound (-180); the formula maps the
    // upper edge of each revolution back to the start.
    { input: 180, expected: -180 },
    { input: -180, expected: -180 },
    { input: 200, expected: -160 },
    { input: -200, expected: 160 },
    { input: 540, expected: -180 },
  ])('normalizes $input to $expected', ({ input, expected }) => {
    expect(normalizeLongitude(input)).toBe(expected);
  });
});

describe('formatCoordinate', () => {
  // [longitude, latitude] — San Francisco
  const sanFrancisco: [number, number] = [-122.4194, 37.7749];

  it('formats decimal degrees with ordinals', () => {
    expect(formatCoordinate(sanFrancisco, 'dd')).toContain('N');
    expect(formatCoordinate(sanFrancisco, 'dd')).toContain('W');
  });

  it('returns a non-empty MGRS grid reference inside the valid band', () => {
    const mgrs = formatCoordinate(sanFrancisco, 'mgrs');

    expect(mgrs).not.toBe(DEFAULT_MGRS_UTM_COORDS);
    expect(mgrs.length).toBeGreaterThan(0);
  });

  it('returns a non-empty UTM reference inside the valid band', () => {
    const utm = formatCoordinate(sanFrancisco, 'utm');

    expect(utm).not.toBe(DEFAULT_MGRS_UTM_COORDS);
    expect(utm.length).toBeGreaterThan(0);
  });

  it.each([
    { label: 'north of 84°N', coord: [0, 85] as [number, number] },
    { label: 'south of 80°S', coord: [0, -81] as [number, number] },
  ])('returns the placeholder for MGRS $label', ({ coord }) => {
    expect(formatCoordinate(coord, 'mgrs')).toBe(DEFAULT_MGRS_UTM_COORDS);
  });

  it('normalizes wrapped longitude before formatting', () => {
    // 237.5806°E wraps to -122.4194°E, so this should match San Francisco.
    const wrapped = formatCoordinate([237.5806, 37.7749], 'mgrs');

    expect(wrapped).toBe(formatCoordinate(sanFrancisco, 'mgrs'));
  });
});
