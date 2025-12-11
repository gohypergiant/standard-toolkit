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
import { generateScopedClassName } from './css';

describe('generateScopedClassName', () => {
  describe('Regular class name hashing', () => {
    it('generates scoped class names with hash suffix', () => {
      const result = generateScopedClassName(
        'button',
        '/path/to/button.module.css',
      );

      // Format: _className_hash where hash is 5 base-36 characters
      expect(result).toMatch(/^_button_[a-z0-9]{5}$/);
    });

    it('generates different hashes for different file paths', () => {
      const result1 = generateScopedClassName(
        'button',
        '/path/to/button.module.css',
      );
      const result2 = generateScopedClassName(
        'button',
        '/other/path/button.module.css',
      );

      expect(result1).not.toBe(result2);
    });

    it('generates consistent hashes for the same file path', () => {
      const filePath = '/path/to/component.module.css';
      const result1 = generateScopedClassName('className', filePath);
      const result2 = generateScopedClassName('className', filePath);

      expect(result1).toBe(result2);
    });

    it('preserves the original class name in the output', () => {
      const className = 'myCustomClass';
      const result = generateScopedClassName(className, '/any/path.css');

      expect(result).toContain(className);
      expect(result.startsWith('_myCustomClass_')).toBe(true);
    });

    it('handles different class name formats', () => {
      const testCases = [
        'simple',
        'camelCase',
        'kebab-case',
        'snake_case',
        'PascalCase',
      ];

      for (const className of testCases) {
        const result = generateScopedClassName(className, '/path/file.css');
        expect(result).toMatch(new RegExp(`^_${className}_[a-z0-9]{5}$`));
      }
    });
  });

  describe('Tailwind named group preservation', () => {
    it('preserves group/name classes unchanged', () => {
      const result = generateScopedClassName(
        'group\\/button',
        '/path/to/file.css',
      );

      expect(result).toBe('group\\/button');
    });

    it('does not hash various group/name patterns', () => {
      const groupClasses = [
        'group\\/button',
        'group\\/icon',
        'group\\/card',
        'group\\/menu-item',
      ];

      for (const groupClass of groupClasses) {
        const result = generateScopedClassName(groupClass, '/any/path.css');
        expect(result).toBe(groupClass);
      }
    });

    it('distinguishes between group classes and regular classes with "group" in name', () => {
      // This should be hashed because it doesn't start with "group\/"
      const regularGroup = generateScopedClassName(
        'groupButton',
        '/path/file.css',
      );
      expect(regularGroup).toMatch(/^_groupButton_[a-z0-9]{5}$/);

      // This should NOT be hashed
      const namedGroup = generateScopedClassName(
        'group\\/button',
        '/path/file.css',
      );
      expect(namedGroup).toBe('group\\/button');
    });
  });

  describe('Hash collision probability', () => {
    it('generates unique hashes for typical component set', () => {
      const filePaths = Array.from(
        { length: 1000 },
        (_, i) => `/src/components/component${i}/styles.module.css`,
      );

      const hashes = new Set(
        filePaths.map((path) => generateScopedClassName('className', path)),
      );

      // All 1000 file paths should produce unique hashes
      expect(hashes.size).toBe(1000);
    });

    it('hash format is base-36 with expected length', () => {
      const result = generateScopedClassName('test', '/path/file.css');
      const hashPart = result.split('_')[2];

      expect(hashPart).toHaveLength(5);
      expect(hashPart).toMatch(/^[a-z0-9]{5}$/);
    });
  });

  describe('Edge cases', () => {
    it('handles empty file paths', () => {
      const result = generateScopedClassName('button', '');
      // Empty string hash is deterministic but may be shorter
      expect(result).toMatch(/^_button_[a-z0-9]+$/);
      expect(result.startsWith('_button_')).toBe(true);
    });

    it('handles very long file paths', () => {
      const longPath = '/very/long/path/'.repeat(100) + 'file.module.css';
      const result = generateScopedClassName('className', longPath);

      expect(result).toMatch(/^_className_[a-z0-9]{5}$/);
    });

    it('handles special characters in file paths', () => {
      const specialPaths = [
        '/path/with spaces/file.css',
        '/path/with-dashes/file.css',
        '/path/with_underscores/file.css',
        '/path/with.dots/file.css',
      ];

      for (const path of specialPaths) {
        const result = generateScopedClassName('className', path);
        expect(result).toMatch(/^_className_[a-z0-9]{5}$/);
      }
    });
  });

  describe('Integration with CSS modules', () => {
    it('produces valid CSS class name format', () => {
      const result = generateScopedClassName('myClass', '/path/to/file.css');

      // Must start with underscore or letter for valid CSS
      expect(result).toMatch(/^[_a-zA-Z]/);

      // Should only contain valid CSS class name characters
      expect(result).toMatch(/^[_a-zA-Z0-9-]+$/);
    });

    it('generates expected class names for common components', () => {
      const filePath =
        '/packages/design-toolkit/src/components/button/styles.module.css';

      expect(generateScopedClassName('button', filePath)).toBe('_button_kakjr');
      expect(generateScopedClassName('filled', filePath)).toBe('_filled_kakjr');
      expect(generateScopedClassName('flat', filePath)).toBe('_flat_kakjr');
      expect(generateScopedClassName('outline', filePath)).toBe(
        '_outline_kakjr',
      );
      expect(generateScopedClassName('group\\/button', filePath)).toBe(
        'group\\/button',
      );
    });
  });
});
