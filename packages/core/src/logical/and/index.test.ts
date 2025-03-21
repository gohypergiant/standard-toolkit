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
import { and, andFn } from './';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('and', () => {
  it('should return true for true && true', () => {
    expect(and(true)(true)).toEqual(true);
  });

  it('should return false for true && false', () => {
    expect(and(true)(false)).toEqual(false);
  });

  it('should return false for false && true', () => {
    expect(and(false)(true)).toEqual(false);
  });

  it('should return false for false && false', () => {
    expect(and(false)(false)).toEqual(false);
  });
});

describe('andFn', () => {
  it('should return true for true && true', () => {
    expect(andFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return false for false && true', () => {
    expect(andFn(isOdd)(isEven)(6)).toEqual(false);
  });

  it('should return false for true && false', () => {
    expect(andFn(isEven)(isOdd)(6)).toEqual(false);
  });

  it('should return false for false && false', () => {
    expect(andFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});
