/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { toUTMFromMGRS } from './to-utm-from-mgrs.js';

describe('mgrsToUTM', () => {
  it('converts MGRS to UTM in northern hemisphere (zone 31, Paris)', () => {
    const mgrs = {
      easting: 48252,
      northing: 11932,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs);

    expect(utm.easting).toBeCloseTo(448252, 0);
    expect(utm.northing).toBeCloseTo(5411932, 0);
    expect(utm.zoneNumber).toBe(31);
    expect(utm.zoneLetter).toBe('U');
    expect(utm.hemisphere).toBe('N');
  });

  it('converts MGRS to UTM in southern hemisphere (zone 56, Sydney)', () => {
    const mgrs = {
      easting: 34180,
      northing: 51920,
      zoneNumber: 56,
      zoneLetter: 'H',
      gridCol: 'M',
      gridRow: 'C',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs);

    expect(utm.easting).toBeCloseTo(334180, 0);
    expect(utm.northing).toBeCloseTo(6251920, 0);
    expect(utm.zoneNumber).toBe(56);
    expect(utm.zoneLetter).toBe('H');
    expect(utm.hemisphere).toBe('S');
  });

  it('handles low precision MGRS coordinates (1-digit)', () => {
    const mgrs = {
      easting: 4,
      northing: 1,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 1,
    };

    const utm = toUTMFromMGRS(mgrs);

    // 1-digit precision: 4 = 40000m, 1 = 10000m
    expect(utm.easting).toBeCloseTo(440000, 0);
    expect(utm.northing).toBeCloseTo(5410000, 0);
  });

  it('handles medium precision MGRS coordinates (3-digit)', () => {
    const mgrs = {
      easting: 482,
      northing: 119,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 3,
    };

    const utm = toUTMFromMGRS(mgrs);

    // 3-digit precision: 482 = 48200m, 119 = 11900m
    expect(utm.easting).toBeCloseTo(448200, 0);
    expect(utm.northing).toBeCloseTo(5411900, 0);
  });

  it('handles grid square boundaries (SW corner)', () => {
    const mgrs = {
      easting: 0,
      northing: 0,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs);

    expect(utm.easting).toBeCloseTo(400000, 0);
    expect(utm.northing).toBeCloseTo(5400000, 0);
  });

  it('handles grid square boundaries (NE corner)', () => {
    const mgrs = {
      easting: 99999,
      northing: 99999,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs);

    // Maximum values within 100km grid square
    expect(utm.easting).toBeCloseTo(499999, 0);
    expect(utm.northing).toBeCloseTo(5499999, 0);
  });

  it('correctly determines hemisphere from zone letter', () => {
    const northern = toUTMFromMGRS({
      easting: 50000,
      northing: 50000,
      zoneNumber: 31,
      zoneLetter: 'N', // N-Z is northern hemisphere
      gridCol: 'E',
      gridRow: 'A',
      precision: 5,
    });

    expect(northern.hemisphere).toBe('N');

    const southern = toUTMFromMGRS({
      easting: 50000,
      northing: 50000,
      zoneNumber: 31,
      zoneLetter: 'M', // C-M is southern hemisphere
      gridCol: 'E',
      gridRow: 'A',
      precision: 5,
    });

    expect(southern.hemisphere).toBe('S');
  });

  it('should allow precision override', () => {
    const mgrs = {
      easting: 48252,
      northing: 11932,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs, { easting: 3, northing: 4 });

    expect(utm.precision.easting).toBe(3);
    expect(utm.precision.northing).toBe(4);
  });

  it('should compute precision when override not provided', () => {
    const mgrs = {
      easting: 48252,
      northing: 11932,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(mgrs);

    // 448252 has 6 digits, 5411932 has 7 digits
    expect(utm.precision.easting).toBe(6);
    expect(utm.precision.northing).toBe(7);
  });
});
