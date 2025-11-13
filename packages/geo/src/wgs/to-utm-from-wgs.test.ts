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
import { toUTMFromWGS } from './to-utm-from-wgs.js';
import type { TokensWGS } from './tokens-wgs.js';

describe('toUTM', () => {
  it('should convert Eiffel Tower coordinates to UTM zone 31N', () => {
    const coordinate: TokensWGS = {
      lat: 48.85819384,
      lon: 2.29448925,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.easting).toBeCloseTo(448251, 0);
    expect(result.northing).toBeCloseTo(5411932, 0);
    expect(result.zoneNumber).toBe(31);
    expect(result.zoneLetter).toBe('U');
    expect(result.hemisphere).toBe('N');
    expect(result.precision.easting).toBe(6);
    expect(result.precision.northing).toBe(7);
  });

  it('should convert Sydney Opera House coordinates to UTM zone 56H', () => {
    const coordinate: TokensWGS = {
      lat: -33.85997613,
      lon: 151.21496834,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.easting).toBeCloseTo(334876, 0);
    expect(result.northing).toBeCloseTo(6251936, 0);
    expect(result.zoneNumber).toBe(56);
    expect(result.zoneLetter).toBe('H');
    expect(result.hemisphere).toBe('S');
    expect(result.precision.easting).toBe(6);
    expect(result.precision.northing).toBe(7);
  });

  it('should allow precision override', () => {
    const coordinate: TokensWGS = {
      lat: 48.85819384,
      lon: 2.29448925,
    };

    const result = toUTMFromWGS(coordinate, { easting: 3, northing: 3 });

    expect(result.precision.easting).toBe(3);
    expect(result.precision.northing).toBe(3);
  });

  it('should handle longitude wrapping around antimeridian', () => {
    const coordinate: TokensWGS = {
      lat: 0,
      lon: 181, // Should normalize to -179
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.zoneNumber).toBe(1);
    expect(result.zoneLetter).toBe('N');
    expect(result.hemisphere).toBe('N');
  });

  it('should handle equator crossing (zone letter M/N boundary)', () => {
    const coordinateNorth: TokensWGS = {
      lat: 0.1,
      lon: 0,
    };

    const coordinateSouth: TokensWGS = {
      lat: -0.1,
      lon: 0,
    };

    const resultNorth = toUTMFromWGS(coordinateNorth);
    const resultSouth = toUTMFromWGS(coordinateSouth);

    expect(resultNorth.zoneLetter).toBe('N');
    expect(resultNorth.hemisphere).toBe('N');
    expect(resultSouth.zoneLetter).toBe('M');
    expect(resultSouth.hemisphere).toBe('S');
  });

  it('should handle high latitude (near band X)', () => {
    const coordinate: TokensWGS = {
      lat: 75, // Mid-band X (72° to 84°)
      lon: 10,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.zoneLetter).toBe('X');
    expect(result.hemisphere).toBe('N');
  });

  it('should handle low latitude (near band C)', () => {
    const coordinate: TokensWGS = {
      lat: -79.5,
      lon: 10,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.zoneLetter).toBe('C');
    expect(result.hemisphere).toBe('S');
  });

  it('should handle exact upper boundary (84°)', () => {
    const coordinate: TokensWGS = {
      lat: 84,
      lon: 10,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.zoneLetter).toBe('X');
    expect(result.hemisphere).toBe('N');
  });

  it('should handle exact lower boundary (-80°)', () => {
    const coordinate: TokensWGS = {
      lat: -80,
      lon: 10,
    };

    const result = toUTMFromWGS(coordinate);

    expect(result.zoneLetter).toBe('C');
    expect(result.hemisphere).toBe('S');
  });
});
