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

import { describe, expect, it } from 'vitest';
import { findCommonBasePath } from '../../src/utils/find-common-base-path';

describe('findCommonBasePath', () => {
  it('returns empty string for empty array', () => {
    expect(findCommonBasePath([])).toBe('');
  });

  it('returns dirname for single path', () => {
    expect(findCommonBasePath(['/foo/bar/baz.txt'])).toBe('/foo/bar');
  });

  it('finds common base path for simple paths', () => {
    expect(
      findCommonBasePath([
        '/foo/bar/baz.txt',
        '/foo/bar/qux.txt',
        '/foo/bar/quux/corge.txt',
      ]),
    ).toBe('/foo/bar');
  });

  it('returns root if only root is common', () => {
    expect(
      findCommonBasePath([
        '/foo/bar/baz.txt',
        '/baz/bar/foo.txt',
        '/qux/quux/corge.txt',
      ]),
    ).toBe('');
  });

  it('handles paths with different cases', () => {
    expect(findCommonBasePath(['/Foo/Bar/Baz.txt', '/foo/bar/Qux.txt'])).toBe(
      '/foo/bar',
    );
  });

  it('handles paths with different lengths', () => {
    expect(
      findCommonBasePath(['/a/b/c/d.txt', '/a/b/e.txt', '/a/b/f/g/h.txt']),
    ).toBe('/a/b');
  });

  it('returns empty string if no common base', () => {
    expect(findCommonBasePath(['/a/b/c.txt', '/x/y/z.txt'])).toBe('');
  });

  it('handles relative paths', () => {
    expect(
      findCommonBasePath([
        'foo/bar/baz.txt',
        'foo/bar/qux.txt',
        'foo/bar/quux/corge.txt',
      ]),
    ).toBe('foo/bar');
  });

  it('handles windows paths', () => {
    expect(
      findCommonBasePath([
        'C:\\foo\\bar\\baz.txt',
        'C:\\foo\\bar\\qux.txt',
        'C:\\foo\\bar\\quux\\corge.txt',
      ]),
    ).toBe('c:\\foo\\bar');
  });

  it('returns empty string if all paths are unique', () => {
    expect(findCommonBasePath(['/a/b/c.txt', '/d/e/f.txt', '/g/h/i.txt'])).toBe(
      '',
    );
  });

  it('ignores duplicate paths', () => {
    expect(
      findCommonBasePath([
        '/foo/bar/baz.txt',
        '/foo/bar/baz.txt',
        '/foo/bar/qux.txt',
      ]),
    ).toBe('/foo/bar');
  });
});

// We recommend installing an extension to run vitest tests.
