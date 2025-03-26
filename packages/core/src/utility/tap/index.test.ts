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

import { beforeEach, expect, it } from 'vitest';
import { tap } from './';

let sideEffect = 5;

const tapper = (n: number) => {
  sideEffect = sideEffect + n;
};

const tapped = tap(tapper);

beforeEach(() => {
  sideEffect = 5;
});

it('should tap the given function', () => {
  const _actual = tapped(5);

  expect(sideEffect).toEqual(10);
});

it('should return the given value', () => {
  const actual = tapped(5);

  expect(actual).toEqual(5);
});
