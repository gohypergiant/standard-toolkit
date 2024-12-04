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

const truthy = [
  // 'on', 'yes', 'ON', 'YES'
  [],
  1,
  '1',
  true,
  'true',
  'Yes',
  {},
  'anything at all',
  ' on',
  'off ',
  'no',
  'Y',
  INFINITY,
  -INFINITY,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  /abc/,
  new Date(),
  new Error('Fun times.'),
  () => void 0,
];
const falsey = [
  // 'off', 'no', 'OFF', 'NO',
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

describe('toBoolean', () => {
  it.each(falsey)('%s', (val) => {
    expect(toBoolean(val)).toBe(false);
  });

  it.each(truthy)('%s', (val) => {
    expect(toBoolean(val)).toBe(true);
  });
});
