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
// Import toUTM for round-trip test
import { toUTMFromMGRS } from '../mgrs/to-utm-from-mgrs.js';
import { toMGRSFromUTM } from './to-mgrs-from-utm.js';

describe('toMGRS', () => {
  it('converts UTM to MGRS in northern hemisphere (zone 31, Paris)', () => {
    const utm = {
      easting: 448252,
      northing: 5411932,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 5);

    expect(mgrs.easting).toBe(48252);
    expect(mgrs.northing).toBe(11932);
    expect(mgrs.zoneNumber).toBe(31);
    expect(mgrs.zoneLetter).toBe('U');
    expect(mgrs.gridCol).toBe('E');
    expect(mgrs.gridRow).toBe('Q');
    expect(mgrs.precision).toBe(5);
  });

  it('converts UTM to MGRS in southern hemisphere (zone 56, Sydney)', () => {
    const utm = {
      easting: 334180,
      northing: 6251920,
      zoneNumber: 56,
      zoneLetter: 'H',
      hemisphere: 'S' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 5);

    expect(mgrs.easting).toBe(34180);
    expect(mgrs.northing).toBe(51920);
    expect(mgrs.zoneNumber).toBe(56);
    expect(mgrs.zoneLetter).toBe('H');
    expect(mgrs.gridCol).toBe('M');
    expect(mgrs.gridRow).toBe('C');
    expect(mgrs.precision).toBe(5);
  });

  it('truncates to 1-digit precision', () => {
    const utm = {
      easting: 451234,
      northing: 5442678,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 1);

    // 51234m → 5xxxx → 5
    // 42678m → 4xxxx → 4
    expect(mgrs.easting).toBe(5);
    expect(mgrs.northing).toBe(4);
    expect(mgrs.precision).toBe(1);
  });

  it('truncates to 3-digit precision', () => {
    const utm = {
      easting: 451234,
      northing: 5442678,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 3);

    // 51234m → 512xx → 512
    // 42678m → 426xx → 426
    expect(mgrs.easting).toBe(512);
    expect(mgrs.northing).toBe(426);
    expect(mgrs.precision).toBe(3);
  });

  it('defaults to 5-digit precision when not specified', () => {
    const utm = {
      easting: 451234,
      northing: 5442678,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm);

    expect(mgrs.easting).toBe(51234);
    expect(mgrs.northing).toBe(42678);
    expect(mgrs.precision).toBe(5);
  });

  it('handles grid square boundaries (SW corner)', () => {
    const utm = {
      easting: 400000,
      northing: 5400000,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 5);

    expect(mgrs.easting).toBe(0);
    expect(mgrs.northing).toBe(0);
    expect(mgrs.gridCol).toBe('E');
    expect(mgrs.gridRow).toBe('Q');
  });

  it('handles grid square boundaries (NE corner)', () => {
    const utm = {
      easting: 499999,
      northing: 5499999,
      zoneNumber: 31,
      zoneLetter: 'U',
      hemisphere: 'N' as const,
      precision: { easting: 6, northing: 7 },
    };

    const mgrs = toMGRSFromUTM(utm, 5);

    expect(mgrs.easting).toBe(99999);
    expect(mgrs.northing).toBe(99999);
    expect(mgrs.gridCol).toBe('E');
    expect(mgrs.gridRow).toBe('Q');
  });

  it('correctly determines grid letters across different zones', () => {
    // Zone 1 (odd, northern)
    const zone1 = toMGRSFromUTM(
      {
        easting: 500000,
        northing: 5000000,
        zoneNumber: 1,
        zoneLetter: 'N',
        hemisphere: 'N',
        precision: { easting: 6, northing: 7 },
      },
      1,
    );

    expect(zone1.gridCol).toBeDefined();
    expect(zone1.gridRow).toBeDefined();

    // Zone 2 (even, northern)
    const zone2 = toMGRSFromUTM(
      {
        easting: 500000,
        northing: 5000000,
        zoneNumber: 2,
        zoneLetter: 'N',
        hemisphere: 'N',
        precision: { easting: 6, northing: 7 },
      },
      1,
    );

    // Different zones should have different grid letters
    expect(zone2.gridCol).not.toBe(zone1.gridCol);
  });

  it('is inverse of toUTM for full precision', () => {
    const originalMGRS = {
      easting: 48252,
      northing: 11932,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const utm = toUTMFromMGRS(originalMGRS);
    const mgrs = toMGRSFromUTM(utm, 5);

    expect(mgrs.easting).toBe(originalMGRS.easting);
    expect(mgrs.northing).toBe(originalMGRS.northing);
    expect(mgrs.zoneNumber).toBe(originalMGRS.zoneNumber);
    expect(mgrs.zoneLetter).toBe(originalMGRS.zoneLetter);
    expect(mgrs.gridCol).toBe(originalMGRS.gridCol);
    expect(mgrs.gridRow).toBe(originalMGRS.gridRow);
  });
});
