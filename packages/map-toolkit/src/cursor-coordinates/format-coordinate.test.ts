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
    // Multi-revolution wraparound, both directions.
    { input: 540, expected: -180 },
    { input: -540, expected: -180 },
    { input: 380, expected: 20 },
    { input: -380, expected: -20 },
  ])('normalizes $input to $expected', ({ input, expected }) => {
    expect(normalizeLongitude(input)).toBe(expected);
  });
});

describe('formatCoordinate', () => {
  // [longitude, latitude] — San Francisco
  const sanFrancisco: [number, number] = [-122.4194, 37.7749];

  // Exact expected strings per format, so a wrong-but-non-empty conversion fails.
  it.each([
    { format: 'dd' as const, expected: '37.774900° N / 122.419400° W' },
    { format: 'ddm' as const, expected: "37° 46.4940' N / 122° 25.1640' W" },
    { format: 'dms' as const, expected: "37° 46' 29.64″ N / 122° 25' 9.84″ W" },
    { format: 'mgrs' as const, expected: '10S EG 51130 80998' },
    { format: 'utm' as const, expected: '10N 551131 4180999' },
  ])('formats San Francisco as $format', ({ format, expected }) => {
    expect(formatCoordinate(sanFrancisco, format)).toBe(expected);
  });

  it('normalizes wrapped longitude before formatting', () => {
    // 237.5806°E wraps to -122.4194°E, so this should match San Francisco.
    const wrapped = formatCoordinate([237.5806, 37.7749], 'mgrs');

    expect(wrapped).toBe(formatCoordinate(sanFrancisco, 'mgrs'));
  });

  // MGRS/UTM are valid across 80°S–84°N inclusive; the inclusive edges convert
  // to real references. `-80` is now valid — the old map-toolkit guard rejected
  // `lat < -80` strictly; the geo grid parts own the inclusive boundary.
  it.each([
    {
      label: '84°N',
      coord: [0, 84] as [number, number],
      mgrs: '31X DP 65005 29005',
      utm: '31N 465005 9329005',
    },
    {
      label: '80°S',
      coord: [0, -80] as [number, number],
      mgrs: '31C DM 41867 16915',
      utm: '31S 441868 1116915',
    },
  ])('converts the $label latitude boundary', ({ coord, mgrs, utm }) => {
    expect(formatCoordinate(coord, 'mgrs')).toBe(mgrs);
    expect(formatCoordinate(coord, 'utm')).toBe(utm);
  });

  it.each([
    { label: 'just north of 84°N', coord: [0, 84.001] as [number, number] },
    { label: 'just south of 80°S', coord: [0, -80.001] as [number, number] },
  ])('returns the placeholder $label', ({ coord }) => {
    expect(formatCoordinate(coord, 'mgrs')).toBe(DEFAULT_MGRS_UTM_COORDS);
    expect(formatCoordinate(coord, 'utm')).toBe(DEFAULT_MGRS_UTM_COORDS);
  });

  it('returns the placeholder when the coordinate fails to convert', () => {
    // A NaN longitude is inside the latitude band but is non-finite, so the geo
    // grid parts reject it as `{ ok: false }` — mapped to the placeholder.
    expect(formatCoordinate([Number.NaN, 40], 'mgrs')).toBe(
      DEFAULT_MGRS_UTM_COORDS,
    );
  });
});
