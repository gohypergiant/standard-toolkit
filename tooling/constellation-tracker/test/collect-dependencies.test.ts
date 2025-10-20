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
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parse } from 'yaml';
import { collectDependencies } from '../src/collect-dependencies.js';
import { logMsg } from '../src/log-messages.js';

vi.mock('node:fs');
vi.mock('node:path');
vi.mock('yaml');
vi.mock('../src/log-messages.js');

describe('collectDependencies', () => {
  const mockSpinner = {
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should collect dependencies with catalog-info.yaml files', () => {
    // Mock package.json content
    const mockPackageJson = {
      dependencies: {
        dep1: '1.0.0',
        dep2: '2.0.0',
      },
      devDependencies: {
        'dev-dep1': '3.0.0',
      },
    };

    // Mock catalog-info.yaml content for dep1
    const mockCatalogInfoDep1 = {
      metadata: {
        name: 'dep1-name',
        annotations: {
          'package/version': '1.0.0',
        },
      },
    };

    // Mock catalog-info.yaml content for dev-dep1
    const mockCatalogInfoDevDep1 = {
      metadata: {
        name: 'dev-dep1-name',
        annotations: {
          'package/version': '3.0.0',
        },
      },
    };

    // Setup mocks
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (filePath === '/path/to/package.json') {
        return JSON.stringify(mockPackageJson);
      }

      if (filePath === '/path/to/node_modules/dep1/catalog-info.yaml') {
        return 'dep1-catalog-content';
      }

      if (filePath === '/path/to/node_modules/dev-dep1/catalog-info.yaml') {
        return 'dev-dep1-catalog-content';
      }
      return '';
    });

    vi.mocked(fs.existsSync).mockImplementation((filePath) => {
      return (
        filePath === '/path/to/node_modules/dep1/catalog-info.yaml' ||
        filePath === '/path/to/node_modules/dev-dep1/catalog-info.yaml'
      );
    });

    vi.mocked(path.resolve).mockImplementation((...parts) => {
      return parts.join('/');
    });

    vi.mocked(parse).mockImplementation((content) => {
      if (content === 'dep1-catalog-content') {
        return mockCatalogInfoDep1;
      }

      if (content === 'dev-dep1-catalog-content') {
        return mockCatalogInfoDevDep1;
      }
      return {};
    });

    const result = collectDependencies(
      '/path/to/package.json',
      '/path/to/node_modules',
      // biome-ignore lint/suspicious/noExplicitAny: fine for the test
      mockSpinner as any,
    );

    expect(result).toEqual([
      ['dep1-name', '1.0.0'],
      ['dev-dep1-name', '3.0.0'],
    ]);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/package.json',
      'utf-8',
    );
    expect(logMsg).toHaveBeenCalledWith(
      'Loaded dependencies from /path/to/package.json',
      mockSpinner,
    );
    expect(logMsg).toHaveBeenCalledWith(
      'Checking for catalog-info.yaml files...',
      mockSpinner,
    );
  });

  it('should return an empty array when no dependencies have catalog-info.yaml', () => {
    // Mock package.json content
    const mockPackageJson = {
      dependencies: {
        dep1: '1.0.0',
      },
    };

    // Setup mocks
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (filePath === '/path/to/package.json') {
        return JSON.stringify(mockPackageJson);
      }
      return '';
    });

    vi.mocked(fs.existsSync).mockReturnValue(false);

    const result = collectDependencies(
      '/path/to/package.json',
      '/path/to/node_modules',
      // biome-ignore lint/suspicious/noExplicitAny: fine for the test
      mockSpinner as any,
    );

    expect(result).toEqual([]);
  });

  it('should throw an error when package.json cannot be parsed', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() =>
      collectDependencies(
        '/path/to/package.json',
        '/path/to/node_modules',
        // biome-ignore lint/suspicious/noExplicitAny: fine for the test
        mockSpinner as any,
      ),
    ).toThrow(
      'Failed to parse package.json at /path/to/package.json: Error: File not found',
    );

    expect(mockSpinner.fail).toHaveBeenCalledWith(
      'Failed to load dependencies from /path/to/package.json',
    );
  });
});
