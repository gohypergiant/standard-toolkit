// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
  isFiniteNumber,
  validateNumericCoordinate,
  validateSignedRange,
} from './validate';

describe('isFiniteNumber', () => {
  describe('valid finite numbers', () => {
    it.each`
      value
      ${0}
      ${1}
      ${-1}
      ${1.5}
      ${-1.5}
      ${Number.MAX_VALUE}
      ${Number.MIN_VALUE}
      ${Number.MAX_SAFE_INTEGER}
      ${Number.MIN_SAFE_INTEGER}
    `('returns true for $value', ({ value }) => {
      expect(isFiniteNumber(value)).toBe(true);
    });
  });

  describe('invalid values', () => {
    it.each`
      value                       | description
      ${Number.NaN}               | ${'NaN'}
      ${Number.POSITIVE_INFINITY} | ${'Infinity'}
      ${Number.NEGATIVE_INFINITY} | ${'-Infinity'}
    `('returns false for $description', ({ value }) => {
      expect(isFiniteNumber(value)).toBe(false);
    });

    it.each`
      value        | description
      ${'string'}  | ${'string'}
      ${null}      | ${'null'}
      ${undefined} | ${'undefined'}
      ${{}}        | ${'object'}
      ${[]}        | ${'array'}
    `('returns false for $description', ({ value }) => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid inputs
      expect(isFiniteNumber(value as any)).toBe(false);
    });
  });
});

describe('validateSignedRange', () => {
  describe('valid values', () => {
    it.each`
      label      | value  | limit
      ${'Test'}  | ${0}   | ${10}
      ${'Test'}  | ${10}  | ${10}
      ${'Test'}  | ${-10} | ${10}
      ${'Test'}  | ${5}   | ${10}
      ${'Test'}  | ${-5}  | ${10}
      ${'Value'} | ${0}   | ${90}
      ${'Value'} | ${90}  | ${90}
      ${'Value'} | ${-90} | ${90}
    `(
      'returns undefined for $label=$value within ±$limit',
      ({ label, value, limit }) => {
        expect(validateSignedRange(label, value, limit)).toBeUndefined();
      },
    );
  });

  describe('out of range values', () => {
    it('returns error for value above limit', () => {
      expect(validateSignedRange('Test', 11, 10)).toBe(
        '[ERROR] Test value (11) is outside valid range (-10 to 10).',
      );
    });

    it('returns error for value below negative limit', () => {
      expect(validateSignedRange('Test', -11, 10)).toBe(
        '[ERROR] Test value (-11) is outside valid range (-10 to 10).',
      );
    });

    it('returns error for large out of range values', () => {
      expect(validateSignedRange('Latitude', 91, 90)).toBe(
        '[ERROR] Latitude value (91) is outside valid range (-90 to 90).',
      );
    });
  });

  describe('non-finite values', () => {
    it('returns error for NaN', () => {
      expect(validateSignedRange('Test', Number.NaN, 10)).toBe(
        '[ERROR] Invalid test value (NaN); expected a finite number.',
      );
    });

    it('returns error for Infinity', () => {
      expect(validateSignedRange('Test', Number.POSITIVE_INFINITY, 10)).toBe(
        '[ERROR] Invalid test value (Infinity); expected a finite number.',
      );
    });

    it('returns error for -Infinity', () => {
      expect(validateSignedRange('Test', Number.NEGATIVE_INFINITY, 10)).toBe(
        '[ERROR] Invalid test value (-Infinity); expected a finite number.',
      );
    });

    it('lowercases label in invalid value error', () => {
      expect(validateSignedRange('Latitude', Number.NaN, 90)).toBe(
        '[ERROR] Invalid latitude value (NaN); expected a finite number.',
      );
    });
  });
});

describe('validateNumericCoordinate', () => {
  describe('valid coordinates', () => {
    it.each`
      lat      | lon
      ${0}     | ${0}
      ${90}    | ${180}
      ${-90}   | ${-180}
      ${45.5}  | ${-74.006}
      ${-45.5} | ${74.006}
      ${0}     | ${180}
      ${0}     | ${-180}
      ${90}    | ${0}
      ${-90}   | ${0}
    `('returns empty array for lat=$lat, lon=$lon', ({ lat, lon }) => {
      expect(validateNumericCoordinate(lat, lon)).toStrictEqual([]);
    });
  });

  describe('latitude errors only', () => {
    it('returns error for latitude above 90', () => {
      const errors = validateNumericCoordinate(91, 0);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Latitude value (91) is outside valid range (-90 to 90).',
      );
    });

    it('returns error for latitude below -90', () => {
      const errors = validateNumericCoordinate(-91, 0);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Latitude value (-91) is outside valid range (-90 to 90).',
      );
    });

    it('returns error for NaN latitude', () => {
      const errors = validateNumericCoordinate(Number.NaN, 0);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Invalid latitude value (NaN); expected a finite number.',
      );
    });

    it('returns error for Infinity latitude', () => {
      const errors = validateNumericCoordinate(Number.POSITIVE_INFINITY, 0);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Invalid latitude value (Infinity); expected a finite number.',
      );
    });
  });

  describe('longitude errors only', () => {
    it('returns error for longitude above 180', () => {
      const errors = validateNumericCoordinate(0, 181);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Longitude value (181) is outside valid range (-180 to 180).',
      );
    });

    it('returns error for longitude below -180', () => {
      const errors = validateNumericCoordinate(0, -181);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Longitude value (-181) is outside valid range (-180 to 180).',
      );
    });

    it('returns error for NaN longitude', () => {
      const errors = validateNumericCoordinate(0, Number.NaN);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Invalid longitude value (NaN); expected a finite number.',
      );
    });

    it('returns error for Infinity longitude', () => {
      const errors = validateNumericCoordinate(0, Number.POSITIVE_INFINITY);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(
        '[ERROR] Invalid longitude value (Infinity); expected a finite number.',
      );
    });
  });

  describe('both errors', () => {
    it('returns both errors for out of range lat and lon', () => {
      const errors = validateNumericCoordinate(100, 200);
      expect(errors).toHaveLength(2);
      expect(errors[0]).toBe(
        '[ERROR] Latitude value (100) is outside valid range (-90 to 90).',
      );
      expect(errors[1]).toBe(
        '[ERROR] Longitude value (200) is outside valid range (-180 to 180).',
      );
    });

    it('returns both errors for NaN lat and Infinity lon', () => {
      const errors = validateNumericCoordinate(
        Number.NaN,
        Number.POSITIVE_INFINITY,
      );
      expect(errors).toHaveLength(2);
      expect(errors[0]).toBe(
        '[ERROR] Invalid latitude value (NaN); expected a finite number.',
      );
      expect(errors[1]).toBe(
        '[ERROR] Invalid longitude value (Infinity); expected a finite number.',
      );
    });

    it('returns both errors for -Infinity lat and lon', () => {
      const errors = validateNumericCoordinate(
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      );
      expect(errors).toHaveLength(2);
      expect(errors[0]).toBe(
        '[ERROR] Invalid latitude value (-Infinity); expected a finite number.',
      );
      expect(errors[1]).toBe(
        '[ERROR] Invalid longitude value (-Infinity); expected a finite number.',
      );
    });
  });
});
