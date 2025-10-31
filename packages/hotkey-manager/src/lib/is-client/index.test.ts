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

describe('isClient', () => {
  // Store the original window object
  const originalWindow = global.window;

  afterEach(() => {
    // Restore window after each test
    global.window = originalWindow;
  });

  it('should return true when window is defined (client environment)', async () => {
    // Ensure window is defined
    global.window = {} as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isClient } = await import('.');

    expect(isClient).toBe(true);
  });

  it('should return false when window is undefined (server environment)', async () => {
    // Mock server environment by setting window to undefined
    global.window = undefined as any;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isClient } = await import('.');

    expect(isClient).toBe(false);
  });
});
