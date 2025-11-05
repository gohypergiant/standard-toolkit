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

import { afterEach, describe, expect, it, vi } from 'vitest';

// Extend the globalThis type to include our symbol
declare global {
  var __HOTKEY_DUPLICATE_CHECK_SYMBOL: symbol | undefined;
}

describe('duplicate-check', () => {
  afterEach(() => {
    delete globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL;
    vi.resetModules();
  });

  it('should set the symbol if it is not set', async () => {
    await vi.importActual('.');

    expect(globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL).toBeDefined();
  });

  it('should throw an error if the symbol is already set', async () => {
    await vi.importActual('.');

    vi.resetModules();

    expect(async () => {
      await vi.importActual('.');
    }).rejects.toThrow();
  });
});
