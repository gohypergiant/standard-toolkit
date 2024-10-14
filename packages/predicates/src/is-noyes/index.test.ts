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

import { describe, it, expect } from 'vitest';
import { isTrue, isYes, isFalse, isNo } from './';

const truthy = [1, '1', 'on', 'true', 'yes', true, 'ON', 'YES', 'TRUE'];
const falsey = [0, '0', 'off', 'false', 'no', false, 'OFF', 'NO', 'FALSE'];

describe('boolean validators', () => {
  for (const item of truthy) {
    it(`should return true for ${item}`, () => {
      expect(isTrue(item)).toBeTruthy();
      expect(isYes(item)).toBeTruthy();
    });
  }

  for (const item of falsey) {
    it(`should return false for ${item}`, () => {
      expect(isFalse(item)).toBeTruthy();
      expect(isNo(item)).toBeTruthy();
    });
  }
});
