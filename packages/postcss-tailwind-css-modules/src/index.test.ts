/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import postcss, { type Result } from 'postcss';
import globalGroupPlugin from './index.js';

function processCSS(input: string, filename = 'test.module.css'): Result {
  return postcss([globalGroupPlugin()]).process(input, {
    from: filename,
  });
}

describe('globalGroupPlugin', () => {
  describe('group/ class transformation', () => {
    it('should wrap group/name class in :global()', () => {
      const input = '.group\\/sidebar { color: red; }';
      const result = processCSS(input);

      expect(result.css).toBe(':global(.group\\/sidebar) { color: red; }');
    });

    it('should wrap multiple group/ classes in the same selector', () => {
      const input = '.group\\/header.group\\/nav { color: blue; }';
      const result = processCSS(input);

      expect(result.css).toBe(
        ':global(.group\\/header):global(.group\\/nav) { color: blue; }',
      );
    });

    it('should handle group/ classes with various naming conventions', () => {
      const testCases = [
        {
          input: '.group\\/sidebar-nav { }',
          expected: ':global(.group\\/sidebar-nav) { }',
        },
        {
          input: '.group\\/main_content { }',
          expected: ':global(.group\\/main_content) { }',
        },
        {
          input: '.group\\/item123 { }',
          expected: ':global(.group\\/item123) { }',
        },
      ];

      for (const { input, expected } of testCases) {
        const result = processCSS(input);
        expect(result.css).toBe(expected);
      }
    });

    it('should handle group/ classes in complex selectors', () => {
      const input = '.container .group\\/sidebar:hover > .item { }';
      const result = processCSS(input);

      expect(result.css).toBe(
        '.container :global(.group\\/sidebar):hover > .item { }',
      );
    });

    it('should handle group/ classes with pseudo-classes', () => {
      const input = '.group\\/sidebar:hover { }';
      const result = processCSS(input);

      expect(result.css).toBe(':global(.group\\/sidebar):hover { }');
    });

    it('should handle group/ classes with pseudo-elements', () => {
      const input = '.group\\/sidebar::before { }';
      const result = processCSS(input);

      expect(result.css).toBe(':global(.group\\/sidebar)::before { }');
    });
  });

  describe('file filtering', () => {
    it('should only process .module.css files', () => {
      const input = '.group\\/sidebar { color: red; }';

      const moduleResult = processCSS(input, 'test.module.css');
      expect(moduleResult.css).toBe(
        ':global(.group\\/sidebar) { color: red; }',
      );

      const regularResult = processCSS(input, 'test.css');
      expect(regularResult.css).toBe('.group\\/sidebar { color: red; }');
    });

    it('should not process files without .module.css extension', () => {
      const input = '.group\\/sidebar { }';
      const testCases = [
        'styles.css',
        'module.css.map',
        'test.module.scss',
        'test.css.module',
      ];

      for (const filename of testCases) {
        const result = processCSS(input, filename);
        expect(result.css).toBe(input);
      }
    });

    it('should handle files without source information', () => {
      const input = '.group\\/sidebar { }';
      const result = postcss([globalGroupPlugin()]).process(input, {
        from: undefined,
      });

      expect(result.css).toBe(input);
    });
  });

  describe('non-group classes', () => {
    it('should not modify regular classes', () => {
      const input = '.regular-class { color: blue; }';
      const result = processCSS(input);

      expect(result.css).toBe(input);
    });

    it('should not modify classes that start with group but do not have forward slash', () => {
      const input = '.group { color: red; }';
      const result = processCSS(input);

      expect(result.css).toBe(input);
    });

    it('should not modify classes containing group/', () => {
      const input = '.not-group\\/test { }';
      const result = processCSS(input);

      expect(result.css).toBe(input);
    });

    it('should handle mixed group/ and regular classes', () => {
      const input = '.regular.group\\/sidebar { }';
      const result = processCSS(input);

      expect(result.css).toBe('.regular:global(.group\\/sidebar) { }');
    });
  });

  describe('multiple rules', () => {
    it('should process multiple rules in the same file', () => {
      const input = `
        .group\\/sidebar { color: red; }
        .group\\/header { color: blue; }
        .regular { color: green; }
      `;
      const result = processCSS(input);

      expect(result.css).toContain(':global(.group\\/sidebar)');
      expect(result.css).toContain(':global(.group\\/header)');
      expect(result.css).toContain('.regular { color: green; }');
    });

    it('should handle multiple selectors in a single rule', () => {
      const input = '.group\\/sidebar, .group\\/header { color: red; }';
      const result = processCSS(input);

      expect(result.css).toBe(
        ':global(.group\\/sidebar),:global( .group\\/header) { color: red; }',
      );
    });
  });

  describe('duplicate processing prevention', () => {
    it('should not double-wrap classes that are already processed', () => {
      const input = '.group\\/sidebar { color: red; }';
      const firstPass = postcss([globalGroupPlugin()]).process(input, {
        from: 'test.module.css',
      });

      expect(firstPass.css).toBe(':global(.group\\/sidebar) { color: red; }');

      const secondPass = postcss([globalGroupPlugin()]).process(firstPass.css, {
        from: 'test.module.css',
      });

      expect(secondPass.css).toBe(
        ':global(:global(.group\\/sidebar)) { color: red; }',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const input = '';
      const result = processCSS(input);

      expect(result.css).toBe('');
    });

    it('should handle rules without group/ classes', () => {
      const input = `
        .class1 { color: red; }
        #id1 { color: blue; }
        div { color: green; }
      `;
      const result = processCSS(input);

      expect(result.css).toBe(input);
    });

    it('should handle at-rules', () => {
      const input = `
        @media (min-width: 768px) {
          .group\\/sidebar { color: red; }
        }
      `;
      const result = processCSS(input);

      expect(result.css).toContain(':global(.group\\/sidebar)');
    });

    it('should handle keyframes', () => {
      const input = `
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(100px); }
        }
      `;
      const result = processCSS(input);

      expect(result.css).toBe(input);
    });

    it('should preserve whitespace and formatting', () => {
      const input = '.group\\/sidebar {\n  color: red;\n  padding: 10px;\n}';
      const result = processCSS(input);

      expect(result.css).toContain('color: red;');
      expect(result.css).toContain('padding: 10px;');
    });
  });

  describe('plugin metadata', () => {
    it('should have postcss property set to true', () => {
      expect(globalGroupPlugin.postcss).toBe(true);
    });

    it('should have correct plugin name', () => {
      const plugin = globalGroupPlugin();
      expect(plugin.postcssPlugin).toBe(
        '@accelint/postcss-tailwind-css-modules',
      );
    });
  });
});
