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

describe('DD identifyPieces', () => {
  it('returns undefined for empty array', () => {
    expect(_identifyPieces([])).toBeUndefined();
  });

  it('returns undefined for array exceeding max length', () => {
    expect(_identifyPieces(['45.5', 'N', 'extra'])).toBeUndefined();
  });

  it('returns undefined when deg is already set and a non-bearing token appears', () => {
    expect(_identifyPieces(['45.5', '30.2'])).toBeUndefined();
  });

  it('returns undefined when acc becomes undefined from prior iteration', () => {
    // Two numeric tokens: first sets deg, second hits acc.deg truthy -> returns undefined
    // The undefined then propagates if there were more iterations (tested via >2 case above)
    const result = _identifyPieces(['45.5', '30.2']);
    expect(result).toBeUndefined();
  });

  it('assigns bearing and degree correctly', () => {
    expect(_identifyPieces(['45.5', 'N'])).toEqual({
      bear: 'N',
      deg: '45.5',
    });
  });

  it('assigns bearing first then degree', () => {
    expect(_identifyPieces(['N', '45.5'])).toEqual({
      bear: 'N',
      deg: '45.5',
    });
  });

  it('assigns single numeric token as deg', () => {
    expect(_identifyPieces(['45.5'])).toEqual({ bear: '', deg: '45.5' });
  });
});

describe('DD identifyErrors', () => {
  const latlon = _identifyErrors('LATLON');

  it('returns error for undefined arg', () => {
    const [tokens, errors] = latlon(undefined, 0);
    expect(tokens).toEqual([]);
    expect(errors).toEqual(['Invalid coordinate value.']);
  });

  it('assigns bearing from negative sign when no explicit bearing', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '-45.5' }, 0);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['45.5', 'S']);
  });

  it('assigns positive bearing when no explicit bearing and positive value', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '45.5' }, 0);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['45.5', 'N']);
  });

  it('assigns negative bearing for longitude with negative sign', () => {
    const [tokens, errors] = latlon({ bear: '', deg: '-75.3' }, 1);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['75.3', 'W']);
  });

  it('defaults deg to 0 when nullish', () => {
    // biome-ignore lint/suspicious/noExplicitAny: testing nullish deg
    const [tokens, errors] = latlon({ bear: 'N', deg: undefined as any }, 0);
    expect(errors).toEqual([]);
    expect(tokens).toEqual(['0', 'N']);
  });
});
