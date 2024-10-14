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

export const numberLiteralPairs = [
  ['negative integer number', -1],
  ['zero integer number', 0],
  ['positive integer number', 1],
  ['octal integer literal', 0o0144],
  ['hexadecimal integer literal', 0xfff],
] as const;

export const floatingPointPairs = [
  ['nagative floating point number', -1.1234],
  ['positive floating point number', 1.1234],
  ['exponential notation', 8e5],
] as const;

export const numberLikeStringPairs = [
  ['negative integer string', '-1'],
  ['zero string', '0'],
  ['positive integer string', '1'],
  ['octal integer literal string', '040'],
  ['hexadecimal integer literal string', '0xFF'],
  ['zero padded integer string', '05'],
] as const;

export const floatingPointStringPairs = [
  ['negative floating point string', '-1.1234'],
  ['positive floating point string', '1.1234'],
  ['exponential notation string', '123e-2'],
  ['zero padded positive floating point string', '01.1234'],
] as const;

export const nonFinitePairs = [
  ['NaN', Number.NaN],
  ['positive Infinity', Number.POSITIVE_INFINITY],
  ['negative Infinity', Number.NEGATIVE_INFINITY],
  // biome-ignore lint/style/useNumberNamespace: want to diff against Number.POSITIVE_INFINITY
  ['positive Infinity primitive', Infinity],
  // biome-ignore lint/style/useNumberNamespace: want to diff against Number.NEGATIVE_INFINITY
  ['negative Infinity primative', -Infinity],
];

export const nonFiniteStringPairs = [
  ['NaN string', 'NaN'],
  ['positive Infinity string', 'Infinity'],
  ['negative Infinity string', '-Infinity'],
] as const;

export const nonNumericPairs = [
  ['empty string', ''],
  ['whitespace character string', '   '],
  ['tab character string', '\t\t'],
  ['alphanumeric character string', 'abcdefghijklm1234567890'],
  ['non-numerc character string', 'xabcdefx'],
  ['number with preceding non-numeric characters', 'bcfed5.2'],
  ['number with trailing non-numeric characters', '7.2acdgs'],
  ['boolean true literal', true],
  ['boolean false literal', false],
  ['undefined value', undefined],
  ['null value', null],
  ['date object value', new Date()],
  ['object value', {}],
  [
    'function instance',
    () => {
      // noop
    },
  ],
] as const;
