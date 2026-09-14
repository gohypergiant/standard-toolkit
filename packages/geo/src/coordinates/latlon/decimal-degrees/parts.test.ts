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
import { toDecimalDegreesParts } from './formatter';

describe('toDecimalDegreesParts', () => {
  it('returns non-negative degrees and N for a positive latitude', () => {
    expect(toDecimalDegreesParts(12.345678, 'lat')).toEqual({
      degrees: 12.345678,
      hemisphere: 'N',
    });
  });

  it('returns non-negative degrees and W for a negative longitude', () => {
    expect(toDecimalDegreesParts(-77.0369, 'lon')).toEqual({
      degrees: 77.0369,
      hemisphere: 'W',
    });
  });

  it('maps 0 to N on the lat axis and E on the lon axis', () => {
    expect(toDecimalDegreesParts(0, 'lat')).toEqual({
      degrees: 0,
      hemisphere: 'N',
    });
    expect(toDecimalDegreesParts(0, 'lon')).toEqual({
      degrees: 0,
      hemisphere: 'E',
    });
  });

  it('rounds the magnitude to the requested precision', () => {
    expect(toDecimalDegreesParts(-12.3456789, 'lat', 2)).toEqual({
      degrees: 12.35,
      hemisphere: 'S',
    });
  });
});
