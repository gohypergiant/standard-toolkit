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

import { expect, it } from 'vitest';
import { find } from './';

const isEven = (x: number) => !(x & 1);
const is100 = (x: number) => x === 100;
const arr = [1, 2, 3, 4, 5];

it('should return the first match of the predicate', () => {
  expect(find(isEven)(arr)).toEqual(2);
});

it('should return `null` if no matches are found', () => {
  expect(find(is100)(arr)).toBeNull();
});
