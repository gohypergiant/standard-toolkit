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
import { inRange } from './in-range';

describe('inRange', () => {
  describe('valid values', () => {
    it.each`
      label        | value   | limit
      ${'Minutes'} | ${'45'} | ${59}
      ${'Seconds'} | ${'0'}  | ${59.999999999}
      ${'Minutes'} | ${'0'}  | ${59}
      ${'Seconds'} | ${'30'} | ${59.999999999}
      ${'Minutes'} | ${'59'} | ${59}
      ${'Minutes'} | ${''}   | ${59}
    `(
      'returns undefined for $label=$value within limit $limit',
      ({ label, value, limit }) => {
        expect(inRange(label, value, limit)).toBeUndefined();
      },
    );
  });

  describe('exceeds max value', () => {
    it.each`
      label        | value   | limit
      ${'Minutes'} | ${'60'} | ${59}
      ${'Seconds'} | ${'61'} | ${59.999999999}
    `(
      'returns error for $label=$value exceeding $limit',
      ({ label, value, limit }) => {
        expect(inRange(label, value, limit)).toBe(
          `${label} value (${value}) exceeds max value (${limit}).`,
        );
      },
    );
  });

  describe('non-numeric string input', () => {
    it('returns error for alphabetic string', () => {
      expect(inRange('Minutes', 'abc', 59)).toBe(
        'Minutes value (abc) is not a valid number.',
      );
    });

    it('returns error for mixed alphanumeric string', () => {
      expect(inRange('Seconds', '12abc', 59)).toBeUndefined();
    });

    it('returns error for non-parseable string', () => {
      expect(inRange('Minutes', 'xyz', 59)).toBe(
        'Minutes value (xyz) is not a valid number.',
      );
    });
  });

  describe('negative value', () => {
    it('returns error for negative numeric string', () => {
      expect(inRange('Minutes', '-5', 59)).toBe(
        'Minutes value (-5) must be positive.',
      );
    });

    it('returns error for negative decimal string', () => {
      expect(inRange('Seconds', '-0.5', 59.999999999)).toBe(
        'Seconds value (-0.5) must be positive.',
      );
    });
  });
});
