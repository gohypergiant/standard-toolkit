/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { formatBearing, formatDistance } from './index';

describe('formatBearing', () => {
  it('formats a positive bearing with zero-padding', () => {
    const result = formatBearing(45);

    expect(result).toBe('045°');
  });

  it('formats zero as "000°"', () => {
    const result = formatBearing(0);

    expect(result).toBe('000°');
  });

  it('normalizes a negative bearing to its positive equivalent', () => {
    const result = formatBearing(-10);

    expect(result).toBe('350°');
  });

  it('normalizes a bearing greater than 360', () => {
    const result = formatBearing(370);

    expect(result).toBe('010°');
  });

  it('normalizes exactly 360 to "000°"', () => {
    const result = formatBearing(360);

    expect(result).toBe('000°');
  });

  it('formats a 3-digit bearing without extra padding', () => {
    const result = formatBearing(180);

    expect(result).toBe('180°');
  });

  it('normalizes a large negative bearing', () => {
    const result = formatBearing(-360);

    expect(result).toBe('000°');
  });
});

describe('formatDistance', () => {
  describe('single unit', () => {
    it('formats meters in kilometers', () => {
      const result = formatDistance(42300, 'kilometers');

      expect(result).toBe('42.3 km');
    });

    it('formats meters in nautical miles', () => {
      const result = formatDistance(42336, 'nauticalmiles');

      expect(result).toBe('22.9 NM');
    });

    it('formats zero distance in kilometers', () => {
      const result = formatDistance(0, 'kilometers');

      expect(result).toBe('0.0 km');
    });

    it('formats zero distance in nautical miles', () => {
      const result = formatDistance(0, 'nauticalmiles');

      expect(result).toBe('0.0 NM');
    });

    it('formats meters in meters', () => {
      const result = formatDistance(500, 'meters');

      expect(result).toBe('500.0 m');
    });
  });

  describe('dual units', () => {
    it('formats meters as kilometers and nautical miles', () => {
      const result = formatDistance(42300, ['kilometers', 'nauticalmiles']);

      expect(result).toBe('42.3 km / 22.8 NM');
    });

    it('formats zero distance in dual units', () => {
      const result = formatDistance(0, ['kilometers', 'nauticalmiles']);

      expect(result).toBe('0.0 km / 0.0 NM');
    });
  });
});
