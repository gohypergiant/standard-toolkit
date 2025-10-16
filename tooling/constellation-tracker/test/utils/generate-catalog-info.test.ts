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
import { generateCatalogInfo } from '../../src/utils/generate-catalog-info.js';

vi.mock('node:fs');
vi.mock('radash', () => ({
  trim: (str: string, char: string) =>
    str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), ''),
}));

describe('generateCatalogInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate catalog info for a GitHub repository', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      keywords: ['test', 'package'],
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    const result = generateCatalogInfo('/path/to/package.json');

    // Use toMatchObject for more reliable comparison
    expect(result).toMatchObject({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-package',
        title: 'Test Package',
        description: 'Test package description',
        annotations: {
          'package/version': '1.0.0',
          'backstage.io/edit-url':
            'https://github.com/org/repo/blob/main/packages/test-package/catalog-info.yaml',
          'github.com/project-slug': 'org/repo',
        },
        links: [
          {
            url: 'https://github.com/org/repo/tree/main/packages/test-package',
            title: 'Documentation',
            icon: 'docs',
            type: 'documentation',
          },
        ],
        tags: ['test', 'package'],
      },
      spec: {
        type: 'library',
        lifecycle: 'production',
        owner: 'group:default/team',
      },
    });

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/package.json',
      'utf-8',
    );
  });

  it('should generate catalog info for a GitLab repository', () => {
    // Reset the mock implementation before this test
    vi.resetAllMocks();

    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      version: '1.0.0',
      repository: {
        url: 'https://gitlab.com/org/repo',
      },
      subPath: 'packages/test-package',
      keywords: ['test', 'package'],
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    // Create a fresh template for this test
    const freshTemplate = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: '<n>',
        title: '<title>',
        description: '<description>\n',
        annotations: {
          'backstage.io/edit-url': '<catalog-info-edit-url>',
          'backstage.io/techdocs-ref': 'dir:.',
          'package/version': '*',
        },
        links: [],
        tags: [],
      },
      spec: {
        type: 'library',
        lifecycle: 'production',
        owner: 'group:<owner>',
      },
    };

    // Mock Object.assign to return a new object
    const originalAssign = Object.assign;
    Object.assign = vi.fn().mockImplementation(() => {
      return JSON.parse(JSON.stringify(freshTemplate));
    });

    const result = generateCatalogInfo('/path/to/package.json');

    // Restore Object.assign
    Object.assign = originalAssign;

    // Check only the specific properties we care about
    expect(result.metadata.name).toBe('test-package');
    expect(result.metadata.title).toBe('Test Package');
    expect(result.metadata.description).toBe('Test package description');
    expect(result.metadata.annotations['package/version']).toBe('1.0.0');
    expect(result.metadata.annotations['backstage.io/edit-url']).toBe(
      'https://gitlab.com/org/repo/packages/test-package/-/edit/main/catalog-info.yaml',
    );
    expect(result.metadata.annotations['gitlab.com/project-slug']).toBe(
      'org/repo',
    );
    expect(result.metadata.links).toHaveLength(1);
    expect(result.metadata.links[0]).toEqual({
      url: 'https://gitlab.com/org/repo/-/tree/packages/test-package',
      title: 'Documentation',
      icon: 'docs',
      type: 'documentation',
    });
    expect(result.metadata.tags).toEqual(['test', 'package']);
    expect(result.spec.owner).toBe('group:default/team');
  });

  it('should handle missing keywords', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    const result = generateCatalogInfo('/path/to/package.json');

    expect(result.metadata.tags).toEqual([]);
  });
});
