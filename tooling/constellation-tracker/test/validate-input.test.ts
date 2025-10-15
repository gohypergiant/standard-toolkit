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

import fs from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as validateInputModule from '../src/validate-input.js';

// Mock the entire module to control when it's imported
vi.mock('../src/validate-input.js', async () => {
  const actual = await vi.importActual<typeof validateInputModule>(
    '../src/validate-input.js',
  );
  return {
    ...actual,
    // Re-export the function but we'll mock it in the tests
    validateInput: vi.fn(actual.validateInput),
  };
});

vi.mock('node:fs');
vi.mock('ansis', () => ({
  default: {
    red: (text: string) => text,
    yellow: (text: string) => text,
  },
}));

describe('validateInput', () => {
  const { validateInput } = validateInputModule;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods for each test
    // biome-ignore-start lint/suspicious/noEmptyBlockStatements: intentional
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // biome-ignore-end lint/suspicious/noEmptyBlockStatements: intentional
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true when both package.json and node_modules exist', () => {
    vi.mocked(fs.existsSync).mockImplementation(() => true);

    const result = validateInput(
      '/path/to/node_modules',
      '/path/to/package.json',
    );

    expect(result).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/package.json');
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/node_modules');
    expect(process.exit).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should exit with code 1 when package.json does not exist', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      return path !== '/path/to/package.json';
    });

    validateInput('/path/to/node_modules', '/path/to/package.json');

    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/package.json');
    expect(console.error).toHaveBeenCalledWith(
      'Error: The specified package.json does not exist',
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should return false when package.json exists but node_modules does not', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      return path === '/path/to/package.json';
    });

    const result = validateInput(
      '/path/to/node_modules',
      '/path/to/package.json',
    );

    expect(result).toBe(false);
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/package.json');
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/node_modules');
    expect(console.warn).toHaveBeenCalledWith(
      'Warning: The specified node_modules directory does not exist, assuming no dependencies',
    );
    expect(process.exit).not.toHaveBeenCalled();
  });
});
