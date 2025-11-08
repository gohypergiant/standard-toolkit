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
import { validatePrecisionMGRS, validatePrecisionUTM } from './precision.js';
import type { LexerTokens } from './lexer-tokens.js';

const createTokens = (partial: Partial<LexerTokens>): LexerTokens => ({
  easting: '',
  northing: '',
  zoneLetter: 'N',
  zoneNumber: 33,
  ...partial,
});

describe('precision validators', () => {
  describe('validatePrecisionMGRS', () => {
    it('should accept valid even-length numeric precision', () => {
      expect(
        validatePrecisionMGRS(createTokens({ easting: '12', northing: '34' })),
      ).toBe('');
      expect(
        validatePrecisionMGRS(
          createTokens({ easting: '1234', northing: '5678' }),
        ),
      ).toBe('');
      expect(
        validatePrecisionMGRS(
          createTokens({ easting: '12345', northing: '67890' }),
        ),
      ).toBe('');
    });

    it('should accept empty precision', () => {
      expect(
        validatePrecisionMGRS(createTokens({ easting: '', northing: '' })),
      ).toBe('');
    });

    it('should reject non-numeric characters', () => {
      expect(
        validatePrecisionMGRS(
          createTokens({ easting: 'ABC', northing: '123' }),
        ),
      ).toContain('Invalid (non-numeric) characters');
    });

    it('should reject odd-length precision', () => {
      expect(
        validatePrecisionMGRS(createTokens({ easting: '1', northing: '23' })),
      ).toContain('must be even number of digits');
    });

    it('should reject precision greater than 5 digits each', () => {
      expect(
        validatePrecisionMGRS(
          createTokens({ easting: '123456', northing: '789012' }),
        ),
      ).toContain('greater than 5 digits');
    });
  });

  describe('validatePrecisionUTM', () => {
    it('should accept valid numeric precision within range', () => {
      expect(
        validatePrecisionUTM(
          createTokens({
            easting: '500000',
            northing: '500000',
            zoneLetter: 'N',
          }),
        ),
      ).toBe('');
    });

    it('should reject non-numeric easting', () => {
      expect(
        validatePrecisionUTM(
          createTokens({ easting: 'ABC', northing: '500000', zoneLetter: 'N' }),
        ),
      ).toContain('Invalid (non-numeric) characters in easting');
    });

    it('should reject non-numeric northing', () => {
      expect(
        validatePrecisionUTM(
          createTokens({ easting: '500000', northing: 'XYZ', zoneLetter: 'N' }),
        ),
      ).toContain('Invalid (non-numeric) characters in northing');
    });

    it('should reject easting with more than 6 digits', () => {
      expect(
        validatePrecisionUTM(
          createTokens({
            easting: '1234567',
            northing: '500000',
            zoneLetter: 'N',
          }),
        ),
      ).toContain('Invalid easting precision - greater than 6 digits');
    });

    it('should reject northing with more than 7 digits', () => {
      expect(
        validatePrecisionUTM(
          createTokens({
            easting: '500000',
            northing: '12345678',
            zoneLetter: 'N',
          }),
        ),
      ).toContain('Invalid northing precision - greater than 7 digits');
    });
  });
});
