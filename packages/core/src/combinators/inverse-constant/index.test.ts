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
import { inverseConstant } from './';

it('should always return the second value', () => {
  expect(inverseConstant(1)(2)).toEqual(2);
  expect(inverseConstant(9)(7)).toEqual(7);
  expect(inverseConstant(4)(8)).toEqual(8);
});
