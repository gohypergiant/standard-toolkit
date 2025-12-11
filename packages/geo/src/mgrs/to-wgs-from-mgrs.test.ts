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
import { toWGSFromMGRS } from './to-wgs-from-mgrs.js';

describe('mgrsToWGS', () => {
  it('converts MGRS to WGS84 coordinates', () => {
    const mgrs = {
      easting: 48252,
      northing: 11932,
      zoneNumber: 31,
      zoneLetter: 'U',
      gridCol: 'E',
      gridRow: 'Q',
      precision: 5,
    };

    const wgs = toWGSFromMGRS(mgrs);

    expect(wgs).toHaveProperty('lat');
    expect(wgs).toHaveProperty('lon');
    expect(typeof wgs.lat).toBe('number');
    expect(typeof wgs.lon).toBe('number');
    expect(wgs.lat).toBeGreaterThan(-90);
    expect(wgs.lat).toBeLessThan(90);
    expect(wgs.lon).toBeGreaterThan(-180);
    expect(wgs.lon).toBeLessThan(180);
  });
});
