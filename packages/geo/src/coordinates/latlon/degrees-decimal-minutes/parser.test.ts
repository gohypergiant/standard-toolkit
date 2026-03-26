// __private-exports
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
import { _identifyErrors, _identifyPieces } from './parser';

describe('DDM identifyPieces', () => {
  it('returns undefined for empty array', () => {
    expect(_identifyPieces([])).toBeUndefined();
  });

  it('returns undefined for array exceeding max length', () => {
    expect(_identifyPieces(['45', '30.5', 'N', 'extra'])).toBeUndefined();
  });

  it('propagates undefined accumulator from prior iteration', () => {
    // Force acc to become undefined: fill deg and min, then add a non-matching
    // token that exhausts available keys
    const result = _identifyPieces(['45', '30.5', '99']);
    // All three slots (deg, min) are filled by first two; third has no key -> undefined
    expect(result).toBeUndefined();
  });

  it('assigns deg, min, and bear correctly', () => {
    expect(_identifyPieces(['45', '30.5', 'N'])).toEqual({
      bear: 'N',
      deg: '45',
      min: '30.5',
    });
  });

  it('assigns single token as deg', () => {
    expect(_identifyPieces(['45'])).toEqual({ bear: '', deg: '45', min: '' });
  });

  it('assigns two tokens as deg and min', () => {
    expect(_identifyPieces(['45', '30.5'])).toEqual({
      bear: '',
      deg: '45',
      min: '30.5',
    });
  });
});

describe('DDM identifyErrors', () => {
  const latlon = _identifyErrors('LATLON');

  it('returns error for undefined arg', () => {
    const [tokens, errors] = latlon(undefined, 0);
    expect(tokens).toEqual([]);
    expect(errors).toEqual(['Invalid coordinate value.']);
  });

  it('assigns bearing from negative sign when no explicit bearing', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '-45', min: '30.5' }, 0);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['45', '30.5', 'S']);
  });

  it('assigns positive bearing when no explicit bearing and positive value', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '45', min: '30.5' }, 0);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['45', '30.5', 'N']);
  });

  it('assigns negative bearing for longitude with negative sign', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '-75', min: '20.3' }, 1);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['75', '20.3', 'W']);
  });

  it('defaults deg and min to 0 when nullish', () => {
    const [tokens, errors] = latlon(
      // biome-ignore lint/suspicious/noExplicitAny: testing nullish values
      { bear: 'N', deg: undefined as any, min: undefined as any },
      0,
    );
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['0', '0', 'N']);
  });
});
