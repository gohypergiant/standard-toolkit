/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { persist, retrieve, STORAGE_ID } from './storage';

describe('storage methods', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    });
    // Initialize storage container
    localStorageMock[STORAGE_ID] = JSON.stringify({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should persist and retrieve an object', () => {
    const obj = { foo: 'bar' };
    persist('test-id', obj);
    const retrieved = retrieve('test-id');
    expect(retrieved).toEqual(obj);
  });

  it('should return undefined for missing id', () => {
    const result = retrieve('missing-id');
    expect(result).toBeUndefined();
  });

  it('should overwrite existing object with same id', () => {
    persist('dup-id', { a: 1, b: 2 });
    persist('dup-id', { a: 2 });
    const retrieved = retrieve('dup-id');
    expect(retrieved).toEqual({ a: 2 });
  });

  it('should persist and retrieve an object with a unique identifier', () => {
    const obj = { foo: 'baz' };
    const uniqueId = 'user-123';
    persist('unique-test-id', obj, uniqueId);
    const retrieved = retrieve('unique-test-id', uniqueId);
    expect(retrieved).toEqual(obj);
  });

  it('should not retrieve an object with a different unique identifier', () => {
    const obj = { foo: 'baz' };
    persist('unique-test-id', obj, 'id-1');
    const retrieved = retrieve('unique-test-id', 'id-2');
    expect(retrieved).toBeUndefined();
  });
});
