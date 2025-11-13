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
import { toWGSFromUTM } from './to-wgs-from-utm.js';
import type { TokensUTM } from './tokens-utm.js';

describe('toWGS', () => {
  it('should convert a northern hemisphere coordinate near Paris', () => {
    const coordinate: TokensUTM = {
      easting: 448_251,
      hemisphere: 'N',
      northing: 5_411_932,
      precision: { easting: 6, northing: 7 },
      zoneLetter: 'U',
      zoneNumber: 31,
    };

    const result = toWGSFromUTM(coordinate);

    expect(result.lat).toBe(48.85819383686667);
    expect(result.lon).toBe(2.29448924524479);
  });

  it('should convert a southern hemisphere coordinate near Sydney', () => {
    const coordinate: TokensUTM = {
      easting: 334_876,
      hemisphere: 'S',
      northing: 6_251_936,
      precision: { easting: 6, northing: 7 },
      zoneLetter: 'H',
      zoneNumber: 56,
    };

    const result = toWGSFromUTM(coordinate);

    expect(result.lat).toBe(-33.859976128784396);
    expect(result.lon).toBe(151.21496833703253);
  });
});
