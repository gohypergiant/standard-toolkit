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
import { or, orFn, swappedOr, swappedOrFn } from './';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('or', () => {
  it('should return true for true || true', () => {
    expect(or(true)(true)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(or(true)(false)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(or(false)(true)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(or(false)(false)).toEqual(false);
  });
});

describe('orFn', () => {
  it('should return true for true || true', () => {
    expect(orFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(orFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(orFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(orFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});

describe('swappedOr', () => {
  it('should return true for true || true', () => {
    expect(swappedOr(true)(true)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(swappedOr(true)(false)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(swappedOr(false)(true)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(swappedOr(false)(false)).toEqual(false);
  });
});

describe('swappedOrFn', () => {
  it('should return true for true || true', () => {
    expect(swappedOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(swappedOrFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(swappedOrFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(swappedOrFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});
