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
import {
  nullishOr,
  nullishOrFn,
  swappedNullishOr,
  swappedNullishOrFn,
} from './';

const isEven = (x: number) => !(x & 1);

// biome-ignore lint/suspicious/noExplicitAny: For testing
const nullVal = (_x: any) => null;

describe('nullishOr', () => {
  it('should return true for true ?? true', () => {
    expect(nullishOr(true)(true)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(nullishOr(true)(null)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(nullishOr(null)(true)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(nullishOr(null)(null)).toBeNull();
  });
});

describe('nullishOrFn', () => {
  it('should return true for true ?? true', () => {
    expect(nullishOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(nullishOrFn(nullVal)(isEven)(6)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(nullishOrFn(isEven)(nullVal)(6)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(nullishOrFn(nullVal)(nullVal)(6)).toEqual(null);
  });
});

describe('swappedNullishOr', () => {
  it('should return true for true ?? true', () => {
    expect(swappedNullishOr(true)(true)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(swappedNullishOr(true)(null)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(swappedNullishOr(null)(true)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(swappedNullishOr(null)(null)).toEqual(null);
  });
});

describe('swappedNullishOrFn', () => {
  it('should return true for true ?? true', () => {
    expect(swappedNullishOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(swappedNullishOrFn(nullVal)(isEven)(6)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(swappedNullishOrFn(isEven)(nullVal)(6)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(swappedNullishOrFn(nullVal)(nullVal)(6)).toEqual(null);
  });
});
