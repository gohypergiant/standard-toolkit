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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { collectDependencies } from '../src/collect-dependencies.js';
import { getCatalogInfo } from '../src/get-catalog-info.js';
import { saveCatalogInfo } from '../src/utils/save-catalog-info.js';
import { validateInput } from '../src/validate-input.js';
import { validatePackage } from '../src/validate-package.js';
import type { CatalogInfo } from '../src/utils/catalog-info-template.js';
import type { CmdOptions } from '../src/utils/types.js';

// Extract the handleAction function from main.js
// This avoids issues with Commander and other dependencies
const { handleAction } = await import('../src/main.js');

// Mock the dependencies
vi.mock('../src/validate-input.js');
vi.mock('../src/validate-package.js');
vi.mock('../src/get-catalog-info.js');
vi.mock('../src/collect-dependencies.js');
vi.mock('../src/utils/save-catalog-info.js');
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: '',
  })),
}));

// Mock process.cwd
vi.spyOn(process, 'cwd').mockImplementation(() => '/current/working/dir');

describe('handleAction integration', () => {
  const mockCatalogInfo: CatalogInfo = {
    metadata: {
      name: 'test-package',
      description: 'Test description',
      annotations: {},
      links: [],
      tags: [],
    },
    spec: {
      type: 'library',
      lifecycle: 'production',
      owner: 'group:test',
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
  } as unknown as CatalogInfo;

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(validateInput).mockReturnValue(true);
    vi.mocked(getCatalogInfo).mockReturnValue({
      ...mockCatalogInfo,
    });
  });

  it('should call validateInput with correct paths', () => {
    // We'll use try/catch because we don't need the function to complete
    try {
      handleAction({
        nodeModules: '/custom/node_modules',
        package: '/custom/package.json',
      } as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(validateInput).toHaveBeenCalledWith(
      '/custom/node_modules',
      '/custom/package.json',
    );
  });

  it('should call validatePackage with correct path', () => {
    try {
      handleAction({
        package: '/custom/package.json',
      } as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(validatePackage).toHaveBeenCalledWith('/custom/package.json');
  });

  it('should call getCatalogInfo with correct parameters', () => {
    try {
      handleAction({
        catalogInfo: '/custom/catalog-info.yaml',
        package: '/custom/package.json',
        regenerate: true,
      } as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(getCatalogInfo).toHaveBeenCalledWith(
      '/custom/catalog-info.yaml',
      '/custom/package.json',
      true,
    );
  });

  it('should not call collectDependencies when validateInput returns false', () => {
    vi.mocked(validateInput).mockReturnValue(false);

    try {
      handleAction({} as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(collectDependencies).not.toHaveBeenCalled();
    expect(saveCatalogInfo).toHaveBeenCalled();
  });

  it('should update catalog info with dependencies', () => {
    const dependencies: [string, string][] = [
      ['dep1', '1.0.0'],
      ['dep2', '2.0.0'],
    ];

    vi.mocked(collectDependencies).mockReturnValue(dependencies);

    try {
      handleAction({} as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(collectDependencies).toHaveBeenCalled();

    // Get the arguments of the last call to saveCatalogInfo
    const savedCatalogInfo = vi.mocked(saveCatalogInfo).mock.calls[0][0];

    // Check that the dependencies were added to the catalog info
    expect(savedCatalogInfo.metadata.description).toContain('Dependencies:');
    expect(savedCatalogInfo.metadata.description).toContain(
      'dep1@1.0.0, dep2@2.0.0',
    );
    expect(savedCatalogInfo.spec.dependsOn).toEqual([
      'component:dep1',
      'component:dep2',
    ]);
  });

  it('should handle when no dependencies are found', () => {
    vi.mocked(collectDependencies).mockReturnValue([]);

    try {
      handleAction({} as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    expect(collectDependencies).toHaveBeenCalled();
  });

  it('should update existing description with dependencies', () => {
    const dependencies: [string, string][] = [
      ['dep1', '1.0.0'],
      ['dep2', '2.0.0'],
    ];

    vi.mocked(collectDependencies).mockReturnValue(dependencies);
    vi.mocked(getCatalogInfo).mockReturnValue({
      ...mockCatalogInfo,
      metadata: {
        ...mockCatalogInfo.metadata,
        description: 'Test description\n\nDependencies:\nold-dep@0.1.0',
      },
    });

    try {
      handleAction({} as CmdOptions);
    } catch (_e) {
      // Ignore errors
    }

    // Get the arguments of the last call to saveCatalogInfo
    const savedCatalogInfo = vi.mocked(saveCatalogInfo).mock.calls[0][0];

    // Check that the dependencies were updated in the catalog info
    expect(savedCatalogInfo.metadata.description).toContain('Dependencies:');
    expect(savedCatalogInfo.metadata.description).toContain(
      'dep1@1.0.0, dep2@2.0.0',
    );
    expect(savedCatalogInfo.metadata.description).not.toContain(
      'old-dep@0.1.0',
    );
  });
});
