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
import * as validatePackageModule from '../src/validate-package.js';

// Mock the entire module to control when it's imported
vi.mock('../src/validate-package.js', async () => {
  const actual = await vi.importActual<typeof validatePackageModule>(
    '../src/validate-package.js',
  );
  return {
    ...actual,
    // Re-export the function but we'll mock it in the tests
    validatePackage: vi.fn(actual.validatePackage),
  };
});

vi.mock('node:fs');
vi.mock('ansis', () => ({
  default: {
    red: (text: string) => text,
  },
}));

describe('validatePackage', () => {
  const { validatePackage } = validatePackageModule;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods for each test
    // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  it('should not exit when package.json has all required fields', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/package.json',
      'utf-8',
    );
    expect(process.exit).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should exit with code 1 when repository.url is missing', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      repository: {},
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'repository.url'`,
    );
  });

  it('should exit with code 1 when name is missing', () => {
    const mockPackageJson = {
      title: 'Test Package',
      description: 'Test package description',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'name'`,
    );
  });

  it('should exit with code 1 when title is missing', () => {
    const mockPackageJson = {
      name: 'test-package',
      description: 'Test package description',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'title'`,
    );
  });

  it('should exit with code 1 when description is missing', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'description'`,
    );
  });

  it('should exit with code 1 when subPath is missing', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      repository: {
        url: 'https://github.com/org/repo',
      },
      owner: 'default/team',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'subPath'`,
    );
  });

  it('should exit with code 1 when owner is missing', () => {
    const mockPackageJson = {
      name: 'test-package',
      title: 'Test Package',
      description: 'Test package description',
      repository: {
        url: 'https://github.com/org/repo',
      },
      subPath: 'packages/test-package',
    };

    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    validatePackage('/path/to/package.json');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error: Your package.json must contain 'owner'`,
    );
  });
});
