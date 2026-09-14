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
import { toDmsParts } from './formatter';

describe('toDmsParts', () => {
  it('returns degrees/minutes/seconds and N for a positive latitude', () => {
    expect(toDmsParts(37.7749, 'lat')).toEqual({
      degrees: 37,
      minutes: 46,
      seconds: 29.64,
      hemisphere: 'N',
    });
  });

  it('returns non-negative parts and W for a negative longitude', () => {
    expect(toDmsParts(-77.0369, 'lon')).toEqual({
      degrees: 77,
      minutes: 2,
      seconds: 12.84,
      hemisphere: 'W',
    });
  });

  it('maps 0 to N on the lat axis and E on the lon axis', () => {
    expect(toDmsParts(0, 'lat')).toEqual({
      degrees: 0,
      minutes: 0,
      seconds: 0,
      hemisphere: 'N',
    });
    expect(toDmsParts(0, 'lon')).toEqual({
      degrees: 0,
      minutes: 0,
      seconds: 0,
      hemisphere: 'E',
    });
  });

  it('carries seconds into minutes when seconds round to 60', () => {
    // 40 + (30 * 60 + 59.999) / 3600 -> seconds 59.999 -> rounds to 60.00
    const value = 40 + (30 * 60 + 59.999) / 3600;
    const parts = toDmsParts(value, 'lat');

    expect(parts).toEqual({
      degrees: 40,
      minutes: 31,
      seconds: 0,
      hemisphere: 'N',
    });
    expect(parts.seconds).toBeLessThan(60);
  });

  it('carries through minutes into degrees when both roll over', () => {
    // 40.99999999 -> 40° 59' 60.00″ without carry -> must become 41° 0' 0.00″
    const parts = toDmsParts(40.99999999, 'lat');

    expect(parts).toEqual({
      degrees: 41,
      minutes: 0,
      seconds: 0,
      hemisphere: 'N',
    });
    expect(parts.minutes).toBeLessThan(60);
    expect(parts.seconds).toBeLessThan(60);
  });

  it('keeps seconds and minutes below 60 at an explicit precision override', () => {
    const parts = toDmsParts(40.99999999, 'lat', 4);

    expect(parts).toEqual({
      degrees: 41,
      minutes: 0,
      seconds: 0,
      hemisphere: 'N',
    });
    expect(parts.seconds).toBeLessThan(60);
    expect(parts.minutes).toBeLessThan(60);
  });
});
