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

// biome-ignore lint/style/useNumberNamespace: want to diff against Number.NEGATIVE_INFINITY
const INFINITY = Infinity;
const { POSITIVE_INFINITY, NEGATIVE_INFINITY } = Number;

describe('number validators', () => {
  it.each`
    label                                      | value                | isFiniteNumber | isFiniteNumeric | isNumber | isNumeric
    ${'integer literal: negative'}             | ${-1}                | ${true}        | ${true}         | ${true}  | ${true}
    ${'integer literal: zero'}                 | ${0}                 | ${true}        | ${true}         | ${true}  | ${true}
    ${'integer literal: positive'}             | ${1}                 | ${true}        | ${true}         | ${true}  | ${true}
    ${'integer literal: octal'}                | ${0o0144}            | ${true}        | ${true}         | ${true}  | ${true}
    ${'integer literal: hexadecimal'}          | ${0xfff}             | ${true}        | ${true}         | ${true}  | ${true}
    ${'floating point: nagative'}              | ${-1.1234}           | ${true}        | ${true}         | ${true}  | ${true}
    ${'floating point: positive'}              | ${1.1234}            | ${true}        | ${true}         | ${true}  | ${true}
    ${'floating point: exponential notation'}  | ${8e5}               | ${true}        | ${true}         | ${true}  | ${true}
    ${'number-like string: negative'}          | ${'-1'}              | ${false}       | ${true}         | ${false} | ${true}
    ${'number-like string: zero'}              | ${'0'}               | ${false}       | ${true}         | ${false} | ${true}
    ${'number-like string: positive'}          | ${'1'}               | ${false}       | ${true}         | ${false} | ${true}
    ${'number-like string: octal'}             | ${'040'}             | ${false}       | ${true}         | ${false} | ${true}
    ${'number-like string: hexadecimal'}       | ${'0xFF'}            | ${false}       | ${true}         | ${false} | ${true}
    ${'number-like string: zero padded'}       | ${'05'}              | ${false}       | ${true}         | ${false} | ${true}
    ${'float string: negative'}                | ${'-1.1234'}         | ${false}       | ${true}         | ${false} | ${true}
    ${'float string: positive'}                | ${'1.1234'}          | ${false}       | ${true}         | ${false} | ${true}
    ${'float string: exponential notation'}    | ${'123e-2'}          | ${false}       | ${true}         | ${false} | ${true}
    ${'float string: zero padded'}             | ${'01.1234'}         | ${false}       | ${true}         | ${false} | ${true}
    ${'non-finite number: NaN'}                | ${Number.NaN}        | ${false}       | ${false}        | ${true}  | ${true}
    ${'non-finite number: positive'}           | ${POSITIVE_INFINITY} | ${false}       | ${false}        | ${true}  | ${true}
    ${'non-finite number: negative'}           | ${NEGATIVE_INFINITY} | ${false}       | ${false}        | ${true}  | ${true}
    ${'non-finite number: positive primitive'} | ${INFINITY}          | ${false}       | ${false}        | ${true}  | ${true}
    ${'non-finite number: negative primitive'} | ${-INFINITY}         | ${false}       | ${false}        | ${true}  | ${true}
    ${'non-finite string: NaN string'}         | ${'NaN'}             | ${false}       | ${false}        | ${false} | ${true}
    ${'non-finite string: positive'}           | ${'Infinity'}        | ${false}       | ${false}        | ${false} | ${true}
    ${'non-finite string: negative'}           | ${'-Infinity'}       | ${false}       | ${false}        | ${false} | ${true}
    ${'non-numeric: empty'}                    | ${''}                | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: whitespace character'}     | ${'   '}             | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: tab character'}            | ${'\t\t'}            | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: alphanumeric '}            | ${'abcdefghi123456'} | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: non-numeric '}             | ${'xabcdefx'}        | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: preceding non-numeric'}    | ${'bcfed5.2'}        | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: literal true'}             | ${true}              | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: literal false'}            | ${false}             | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: undefined'}                | ${undefined}         | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: null'}                     | ${null}              | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: date object'}              | ${new Date()}        | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: object'}                   | ${{}}                | ${false}       | ${false}        | ${false} | ${false}
    ${'non-numeric: function instance'}        | ${() => void 0}      | ${false}       | ${false}        | ${false} | ${false}
  `('$label', ({ value, ...expected }) => {
    expect(isFiniteNumber(value)).toBe(expected.isFiniteNumber);
    expect(isFiniteNumeric(value)).toBe(expected.isFiniteNumeric);
    expect(isNumber(value)).toBe(expected.isNumber);
    expect(isNumeric(value)).toBe(expected.isNumeric);
  });

  it('should be different for number with trailing non-numeric characters', () => {
    const value = '7.2abcdef';

    expect(isFiniteNumber(value)).toBe(false);
    expect(isNumber(value)).toBe(false);

    // NOTE: these differ from it.each testing above
    // parseFloat will convert value to 7.2 just fine
    expect(isFiniteNumeric(value)).toBe(true);
    expect(isNumeric(value)).toBe(true);
  });
});
