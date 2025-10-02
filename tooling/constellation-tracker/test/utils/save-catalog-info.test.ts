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
import { stringify } from 'yaml';
import { saveCatalogInfo } from '../../src/utils/save-catalog-info.js';
import type { CatalogInfo } from '../../src/utils/catalog-info-template.js';

vi.mock('node:fs');
vi.mock('yaml');

describe('saveCatalogInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save catalog info to the specified path', () => {
    const mockCatalogInfo: CatalogInfo = {
      metadata: {
        name: 'test-package',
        description: 'Test package description',
      },
      spec: {
        type: 'library',
      },
    } as CatalogInfo;

    vi.mocked(stringify).mockReturnValue('yaml-content');

    saveCatalogInfo(mockCatalogInfo, '/path/to/catalog-info.yaml');

    expect(stringify).toHaveBeenCalledWith(mockCatalogInfo);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/path/to/catalog-info.yaml',
      '---\nyaml-content',
    );
  });
});
