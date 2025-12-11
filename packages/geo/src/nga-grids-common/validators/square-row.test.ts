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
  invalidSquareRow,
  missingSquareRow,
  validateRowForZone,
} from './square-row.js';
import type { LexerTokens } from './lexer-tokens.js';

const createTokens = (partial: Partial<LexerTokens>): LexerTokens => ({
  easting: '',
  northing: '',
  zoneLetter: 'N',
  zoneNumber: 33,
  ...partial,
});

describe('square-row validators', () => {
  describe('invalidSquareRow', () => {
    it('should accept valid square row letters', () => {
      expect(invalidSquareRow(createTokens({ gridRow: 'A' }))).toBe('');
      expect(invalidSquareRow(createTokens({ gridRow: 'V' }))).toBe('');
    });

    it('should reject invalid square row letters', () => {
      expect(invalidSquareRow(createTokens({ gridRow: 'I' }))).toContain(
        'Invalid',
      );
      expect(invalidSquareRow(createTokens({ gridRow: 'O' }))).toContain(
        'Invalid',
      );
      expect(invalidSquareRow(createTokens({ gridRow: 'W' }))).toContain(
        'Invalid',
      );
    });
  });

  describe('missingSquareRow', () => {
    it('should accept present square row', () => {
      expect(missingSquareRow(createTokens({ gridRow: 'A' }))).toBe('');
    });

    it('should reject missing square row', () => {
      expect(missingSquareRow(createTokens({ gridRow: '' }))).toContain(
        'No grid square row',
      );
    });
  });

  describe('validateRowForZone', () => {
    it('should validate rows within zone bounds', () => {
      // Zone 33N - should accept valid rows
      expect(
        validateRowForZone(
          createTokens({ gridRow: 'G', zoneLetter: 'N', zoneNumber: 33 }),
        ),
      ).toBe('');
    });

    it('should reject rows outside zone bounds', () => {
      // Test a row that's out of bounds for a specific zone
      const result = validateRowForZone(
        createTokens({ gridRow: 'A', zoneLetter: 'C', zoneNumber: 33 }),
      );
      expect(result).toContain('Invalid grid square row');
    });

    it('should handle invalid zone numbers', () => {
      expect(
        validateRowForZone(
          createTokens({ gridRow: 'G', zoneNumber: Number.NaN }),
        ),
      ).toBe('');
    });

    it('should handle row cycling across 2M boundaries', () => {
      // Test a row that needs to cycle through the 2M cycle
      expect(
        validateRowForZone(createTokens({ gridRow: 'H', zoneNumber: 1 })),
      ).toBe('');
    });

    it('should validate rows in even zones', () => {
      expect(
        validateRowForZone(createTokens({ gridRow: 'F', zoneNumber: 2 })),
      ).toBe('');
    });
  });
});
