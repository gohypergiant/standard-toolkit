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
import { lookup } from '.';

type Color = [number, number, number] | [number, number, number, number];

const defaultVal =
  <T>(x: T) =>
  (val: unknown) =>
    val ?? x;

const colorTable = {
  FOO: [0, 0, 255, 155] as Color,
  BAR: [255, 0, 255, 155] as Color,
  FIZZ: [230, 0, 0, 155] as Color,
  BUZZ: [0, 128, 0, 155] as Color,
  TEST: null as unknown as Color,
};

const defaultColor: Color = [128, 128, 128, 155];
const colorLookup = lookup(colorTable, defaultVal(defaultColor));
const undefLookup = lookup(colorTable);

describe('tableLookup', () => {
  it('should return the selected value', () => {
    const actualOne = colorLookup('NOPE');
    const actualTwo = colorLookup('BUZZ');

    expect(actualOne).toEqual(defaultColor);
    expect(actualTwo).toEqual(colorTable.BUZZ);
  });

  it('should return the default value for null props', () => {
    const actual = colorLookup('TEST');

    expect(actual).toEqual(defaultColor);
  });

  it('should return the default value for unknown props', () => {
    const actual = colorLookup('UNKNOWN');

    expect(actual).toEqual(defaultColor);
  });

  it('should use identity for undefined default', () => {
    const actualOne = undefLookup('UNKNOWN');
    const actualTwo = undefLookup('BAR');

    expect(actualOne).not.toBeDefined();
    expect(actualTwo).toEqual(colorTable.BAR);
  });
});
