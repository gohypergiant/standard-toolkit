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

import { expect, test } from 'vitest';
import { pipe } from '.';

const binaryAdd = (a: number, b: number) => a + b;
const add3 = (x: number) => x + 3;
const uppercase = (x: string) => x.toUpperCase();
const upperMap = (x: string[]) => x.map((s) => s.toUpperCase());
const splitIt = (s: string) => s.split('');
const stringify = (x: number) =>
  [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ][x] ?? x.toString();

test('it should support unary for first fn call and return the correct result', () => {
  const explodedStrNumVal = pipe(add3, stringify, uppercase, splitIt);
  const upperStrNumVal = pipe(
    add3,
    stringify,
    splitIt,
    upperMap,
    (a: string[]) => a.join(''),
  );

  const actualOne = explodedStrNumVal(3);
  const actualTwo = upperStrNumVal(3);

  expect(actualOne).toStrictEqual(['S', 'I', 'X']);
  expect(actualTwo).toBe('SIX');
});

test('it should support n-ary for first fn call and return the correct result', () => {
  const explodedStrNumVal = pipe(binaryAdd, stringify, uppercase, splitIt);
  const upperStrNumVal = pipe(
    binaryAdd,
    stringify,
    splitIt,
    upperMap,
    (a: string[]) => a.join(''),
  );

  const actualOne = explodedStrNumVal(3, 3);
  const actualTwo = upperStrNumVal(3, 3);

  expect(actualOne).toStrictEqual(['S', 'I', 'X']);
  expect(actualTwo).toBe('SIX');
});
