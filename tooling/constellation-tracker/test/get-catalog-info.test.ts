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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parse } from 'yaml';
import { getCatalogInfo } from '../src/get-catalog-info.js';
import { logMsg } from '../src/log-messages.js';
import { generateCatalogInfo } from '../src/utils/generate-catalog-info.js';
import { saveCatalogInfo } from '../src/utils/save-catalog-info.js';
import type { CatalogInfo } from '../src/utils/catalog-info-template.js';

vi.mock('node:fs');
vi.mock('yaml');
vi.mock('../src/utils/generate-catalog-info.js');
vi.mock('../src/utils/save-catalog-info.js');
vi.mock('../src/log-messages.js');
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: '',
  })),
}));

describe('getCatalogInfo', () => {
  const mockCatalogInfo: CatalogInfo = {
    metadata: {
      name: 'test-package',
      description: 'Test package description',
    },
    spec: {
      type: 'library',
    },
  } as CatalogInfo;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load existing catalog-info.yaml when it exists and regenerate is false', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue('catalog-info-content');
    vi.mocked(parse).mockReturnValue(mockCatalogInfo);

    const result = getCatalogInfo(
      '/path/to/catalog-info.yaml',
      '/path/to/package.json',
      false,
    );

    expect(result).toEqual(mockCatalogInfo);
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/catalog-info.yaml');
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/catalog-info.yaml',
      'utf-8',
    );
    expect(parse).toHaveBeenCalledWith('catalog-info-content');
    expect(generateCatalogInfo).not.toHaveBeenCalled();
    expect(saveCatalogInfo).not.toHaveBeenCalled();
  });

  it('should regenerate catalog-info.yaml when it exists and regenerate is true', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(generateCatalogInfo).mockReturnValue(mockCatalogInfo);

    const result = getCatalogInfo(
      '/path/to/catalog-info.yaml',
      '/path/to/package.json',
      true,
    );

    expect(result).toEqual(mockCatalogInfo);
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/catalog-info.yaml');
    expect(logMsg).toHaveBeenCalledWith(
      'Re-generating /path/to/catalog-info.yaml',
      expect.anything(),
    );
    expect(generateCatalogInfo).toHaveBeenCalledWith('/path/to/package.json');
    expect(saveCatalogInfo).toHaveBeenCalledWith(
      mockCatalogInfo,
      '/path/to/catalog-info.yaml',
    );
  });

  it('should create catalog-info.yaml when it does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(generateCatalogInfo).mockReturnValue(mockCatalogInfo);

    const result = getCatalogInfo(
      '/path/to/catalog-info.yaml',
      '/path/to/package.json',
      false,
    );

    expect(result).toEqual(mockCatalogInfo);
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/catalog-info.yaml');
    expect(logMsg).toHaveBeenCalledWith(
      'Could not locate /path/to/catalog-info.yaml, creating it',
      expect.anything(),
    );
    expect(generateCatalogInfo).toHaveBeenCalledWith('/path/to/package.json');
    expect(saveCatalogInfo).toHaveBeenCalledWith(
      mockCatalogInfo,
      '/path/to/catalog-info.yaml',
    );
  });
});
