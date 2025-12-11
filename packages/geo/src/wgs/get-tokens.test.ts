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
import { getTokens } from './get-tokens';

describe('getTokens', () => {
  it.each`
    location      | input                              | dd                                                           | ddm                                                                                | dms
    ${'New York'} | ${{ lat: 40.6892, lon: -74.0445 }} | ${{ lat: { degrees: 40.6892 }, lon: { degrees: -74.0445 } }} | ${{ lat: { degrees: 40, minutes: 41.352 }, lon: { degrees: -74, minutes: 2.67 } }} | ${{ lat: { degrees: 40, minutes: 41, seconds: 21.12 }, lon: { degrees: -74, minutes: 2, seconds: 40.2 } }}
    ${'Paris'}    | ${{ lat: 48.8584, lon: 2.2945 }}   | ${{ lat: { degrees: 48.8584 }, lon: { degrees: 2.2945 } }}   | ${{ lat: { degrees: 48, minutes: 51.504 }, lon: { degrees: 2, minutes: 17.67 } }}  | ${{ lat: { degrees: 48, minutes: 51, seconds: 30.24 }, lon: { degrees: 2, minutes: 17, seconds: 40.2 } }}
  `('$location', ({ dd, ddm, dms, input }) => {
    const resultDD = getTokens(input, { format: 'dd' });
    const resultDDM = getTokens(input, { format: 'ddm' });
    const resultDMS = getTokens(input, { format: 'dms' });

    expect(resultDD).toEqual(dd);
    expect(resultDDM).toEqual(ddm);
    expect(resultDMS).toEqual(dms);
  });

  it('should throw for bad format', () => {
    expect(() => {
      // @ts-expect-error
      getTokens({ lat: 1, lon: 3 }, { format: 'foo' });
    }).toThrow('foo');
  });
});
