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
import { toMGRSFromWGS } from './to-mgrs-from-wgs.js';

describe('wgsToMGRS', () => {
  it('converts WGS84 to MGRS coordinates with default precision', () => {
    const wgs = {
      lat: 48.8566,
      lon: 2.3522,
    };

    const mgrs = toMGRSFromWGS(wgs);

    expect(mgrs).toHaveProperty('zoneNumber');
    expect(mgrs).toHaveProperty('zoneLetter');
    expect(mgrs).toHaveProperty('gridCol');
    expect(mgrs).toHaveProperty('gridRow');
    expect(mgrs).toHaveProperty('easting');
    expect(mgrs).toHaveProperty('northing');
    expect(mgrs).toHaveProperty('precision');
    expect(mgrs.precision).toBe(5);
  });

  it('converts WGS84 to MGRS coordinates with custom precision', () => {
    const wgs = {
      lat: 48.8566,
      lon: 2.3522,
    };

    const mgrs = toMGRSFromWGS(wgs, 3);

    expect(mgrs).toHaveProperty('precision');
    expect(mgrs.precision).toBe(3);
  });
});
