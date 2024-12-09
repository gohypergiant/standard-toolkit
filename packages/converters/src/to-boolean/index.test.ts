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
import { toBoolean } from './';

// biome-ignore lint/style/useNumberNamespace: testing value
const INFINITY = Infinity;

const falsy = [
  '',
  0,
  0.0,
  '0',
  '0.000',
  '0000.000',
  false,
  'false',
  '  FaLsE ',
  void 0,
  Number.NaN,
  null,
  undefined,
];
const truthy = [
  [],
  1,
  '1',
  true,
  'true',
  {},
  'any non-empty string',
  // 'Yes',
  // 'yes',
  // 'No',
  // 'no',
  // 'off',
  // 'Off',
  // 'OFF',
  // 'On',
  // 'on',
  INFINITY,
  -INFINITY,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  /abc/,
  new Date(),
  new Error('Fun times.'),
  () => void 0,
];

describe('toBoolean', () => {
  it.each(falsy)('%s', (val) => {
    expect(toBoolean(val)).toBe(false);
  });

  it.each(truthy)('%s', (val) => {
    expect(toBoolean(val)).toBe(true);
  });
});
