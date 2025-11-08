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
import {
  invalidSquareColumn,
  missingSquareColumn,
  validateColForZone,
} from './square-column.js';
import type { LexerTokens } from './lexer-tokens.js';

const createTokens = (partial: Partial<LexerTokens>): LexerTokens => ({
  easting: '',
  northing: '',
  zoneLetter: 'N',
  zoneNumber: 33,
  ...partial,
});

describe('square-column validators', () => {
  describe('invalidSquareColumn', () => {
    it('should accept valid square column letters', () => {
      expect(invalidSquareColumn(createTokens({ gridCol: 'A' }))).toBe('');
      expect(invalidSquareColumn(createTokens({ gridCol: 'Z' }))).toBe('');
    });

    it('should reject invalid square column letters', () => {
      expect(invalidSquareColumn(createTokens({ gridCol: 'I' }))).toContain(
        'Invalid',
      );
      expect(invalidSquareColumn(createTokens({ gridCol: 'O' }))).toContain(
        'Invalid',
      );
    });
  });

  describe('missingSquareColumn', () => {
    it('should accept present square column', () => {
      expect(missingSquareColumn(createTokens({ gridCol: 'A' }))).toBe('');
    });

    it('should reject missing square column', () => {
      expect(missingSquareColumn(createTokens({ gridCol: '' }))).toContain(
        'No grid square column',
      );
    });
  });

  describe('validateColForZone', () => {
    it('should validate columns for regular zones', () => {
      expect(
        validateColForZone(
          createTokens({ gridCol: 'S', zoneLetter: 'N', zoneNumber: 33 }),
        ),
      ).toBe('');
    });

    it('should validate Norway zone 32V special case', () => {
      // Zone 32V uses JKLMN columns
      expect(
        validateColForZone(
          createTokens({ gridCol: 'J', zoneLetter: 'V', zoneNumber: 32 }),
        ),
      ).toBe('');
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneLetter: 'V', zoneNumber: 32 }),
        ),
      ).toContain('Invalid');
    });

    it('should validate Svalbard zone 31X special case', () => {
      // Zone 31X uses QRSTUV columns
      expect(
        validateColForZone(
          createTokens({ gridCol: 'Q', zoneLetter: 'X', zoneNumber: 31 }),
        ),
      ).toBe('');
    });

    it('should validate Svalbard zone 33X special case', () => {
      // Zone 33X uses ABCDEFGH columns
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneLetter: 'X', zoneNumber: 33 }),
        ),
      ).toBe('');
    });

    it('should validate Svalbard zone 35X special case', () => {
      // Zone 35X uses JKLMNPQR columns
      expect(
        validateColForZone(
          createTokens({ gridCol: 'J', zoneLetter: 'X', zoneNumber: 35 }),
        ),
      ).toBe('');
    });

    it('should validate Svalbard zone 37X special case', () => {
      // Zone 37X uses STUVWXYZ columns
      expect(
        validateColForZone(
          createTokens({ gridCol: 'S', zoneLetter: 'X', zoneNumber: 37 }),
        ),
      ).toBe('');
    });

    it('should reject excluded Svalbard zones', () => {
      // Zones 32, 34, 36 are excluded for X band
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneLetter: 'X', zoneNumber: 32 }),
        ),
      ).toContain('Invalid');
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneLetter: 'X', zoneNumber: 34 }),
        ),
      ).toContain('Invalid');
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneLetter: 'X', zoneNumber: 36 }),
        ),
      ).toContain('Invalid');
    });

    it('should handle invalid zone numbers', () => {
      expect(
        validateColForZone(
          createTokens({ gridCol: 'A', zoneNumber: Number.NaN }),
        ),
      ).toBe('');
    });
  });
});
