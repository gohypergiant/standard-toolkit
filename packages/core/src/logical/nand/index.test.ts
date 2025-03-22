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
import { nand, nandFn } from './';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('nand', () => {
  it('should return false for true && true', () => {
    expect(nand(true)(true)).toEqual(false);
  });

  it('should return true for true && false', () => {
    expect(nand(true)(false)).toEqual(true);
  });

  it('should return true for false && true', () => {
    expect(nand(false)(true)).toEqual(true);
  });

  it('should return true for false && false', () => {
    expect(nand(false)(false)).toEqual(true);
  });
});

describe('nandFn', () => {
  it('should return false for true && true', () => {
    expect(nandFn(isEven)(isEven)(6)).toEqual(false);
  });

  it('should return true for false && true', () => {
    expect(nandFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true && false', () => {
    expect(nandFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return true for false && false', () => {
    expect(nandFn(isOdd)(isOdd)(6)).toEqual(true);
  });
});
