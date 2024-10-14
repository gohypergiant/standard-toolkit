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

import { expect, it, describe } from 'vitest';
import { isFiniteNumber, isFiniteNumeric, isNumber, isNumeric } from './';
import {
  floatingPointPairs,
  floatingPointStringPairs,
  nonFinitePairs,
  nonFiniteStringPairs,
  nonNumericPairs,
  numberLikeStringPairs,
  numberLiteralPairs,
} from './__fixtures__';

describe('number validators', () => {
  for (const pairs of numberLiteralPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeTruthy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeTruthy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeTruthy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of floatingPointPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeTruthy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeTruthy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeTruthy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of numberLikeStringPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeFalsy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeTruthy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeFalsy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of floatingPointStringPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeFalsy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeTruthy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeFalsy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of nonFinitePairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeFalsy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeFalsy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeTruthy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of nonFiniteStringPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeFalsy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      expect(isFiniteNumeric(pairs[1])).toBeFalsy();
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeFalsy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      expect(isNumeric(pairs[1])).toBeTruthy();
    });
  }

  for (const pairs of nonNumericPairs) {
    it(`isFiniteNumber: ${pairs[0]}`, () => {
      expect(isFiniteNumber(pairs[1])).toBeFalsy();
    });

    it(`isFiniteNumeric: ${pairs[0]}`, () => {
      // TODO: find a cleaner way to do this
      // NOTE: parseFloat will convert 7.2acdgs to 7.2
      if (pairs[0].includes('trailing non-numeric')) {
        expect(isFiniteNumeric(pairs[1])).toBeTruthy();
      } else {
        expect(isFiniteNumeric(pairs[1])).toBeFalsy();
      }
    });

    it(`isNumber: ${pairs[0]}`, () => {
      expect(isNumber(pairs[1])).toBeFalsy();
    });

    it(`isNumeric: ${pairs[0]}`, () => {
      // TODO: find a cleaner way to do this
      // NOTE: parseFloat will convert 7.2acdgs to 7.2
      if (pairs[0].includes('trailing non-numeric')) {
        expect(isFiniteNumeric(pairs[1])).toBeTruthy();
      } else {
        expect(isFiniteNumeric(pairs[1])).toBeFalsy();
      }
    });
  }
});
