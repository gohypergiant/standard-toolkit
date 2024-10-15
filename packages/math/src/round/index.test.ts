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
import { round } from './';

const value = 1.2345;

describe('round', () => {
  it('rounds to precision', () => {
    const a = round(1, value);
    const b = round(2, value);
    const c = round(3, value);
    const d = round(4, value);

    expect(a).toEqual(1.2);
    expect(b).toEqual(1.23);
    expect(c).toEqual(1.235);
    expect(d).toEqual(1.2345);
  });

  it('throws if precision is not integer', () => {
    expect(() => round(1.1, 1)).toThrow(Error);
  });
});
