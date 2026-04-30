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

import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import globalGroupPlugin from './index.js';

function processCSS(input: string, filename = 'test.module.css') {
  return postcss([globalGroupPlugin()]).process(input, {
    from: filename,
  });
}

describe('postcss-tailwind-css-modules plugin', () => {
  describe('group/ class transformation', () => {
    it('should wrap group/name class in :global()', () => {
      const input = '.group\\/sidebar { color: red; }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar) { color: red; }"`,
      );
    });

    it('should wrap multiple group/ classes in the same selector', () => {
      const input = '.group\\/header.group\\/nav { color: blue; }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/header):global(.group\\/nav) { color: blue; }"`,
      );
    });

    it('should handle group/ class with dashes', () => {
      const input = '.group\\/sidebar-nav { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar-nav) { }"`,
      );
    });

    it('should handle group/ class with underscores', () => {
      const input = '.group\\/main_content { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/main_content) { }"`,
      );
    });

    it('should handle group/ class with numbers', () => {
      const input = '.group\\/item123 { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/item123) { }"`,
      );
    });

    it('should handle group/ classes in complex selectors', () => {
      const input = '.container .group\\/sidebar:hover > .item { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `".container :global(.group\\/sidebar):hover > .item { }"`,
      );
    });

    it('should handle group/ classes with pseudo-classes', () => {
      const input = '.group\\/sidebar:hover { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar):hover { }"`,
      );
    });

    it('should handle group/ classes with pseudo-elements', () => {
      const input = '.group\\/sidebar::before { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar)::before { }"`,
      );
    });
  });

  describe('file filtering', () => {
    it('should only process .module.css files', () => {
      const input = '.group\\/sidebar { color: red; }';

      const moduleResult = processCSS(input, 'test.module.css');
      expect(moduleResult.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar) { color: red; }"`,
      );

      const regularResult = processCSS(input, 'test.css');
      expect(regularResult.css).toMatchInlineSnapshot(
        `".group\\/sidebar { color: red; }"`,
      );
    });

    it('should not process .css files', () => {
      const input = '.group\\/sidebar { }';
      const result = processCSS(input, 'styles.css');

      expect(result.css).toMatchInlineSnapshot(`".group\\/sidebar { }"`);
    });

    it('should not process .css.map files', () => {
      const input = '.group\\/sidebar { }';
      const result = processCSS(input, 'module.css.map');

      expect(result.css).toMatchInlineSnapshot(`".group\\/sidebar { }"`);
    });

    it('should not process .module.scss files', () => {
      const input = '.group\\/sidebar { }';
      const result = processCSS(input, 'test.module.scss');

      expect(result.css).toMatchInlineSnapshot(`".group\\/sidebar { }"`);
    });

    it('should not process .css.module files', () => {
      const input = '.group\\/sidebar { }';
      const result = processCSS(input, 'test.css.module');

      expect(result.css).toMatchInlineSnapshot(`".group\\/sidebar { }"`);
    });
  });

  describe('non-group classes', () => {
    it('should not modify regular classes', () => {
      const input = '.regular-class { color: blue; }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `".regular-class { color: blue; }"`,
      );
    });

    it('should not modify classes that start with group but do not have forward slash', () => {
      const input = '.group { color: red; }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`".group { color: red; }"`);
    });

    it('should not modify classes containing group/', () => {
      const input = '.not-group\\/test { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`".not-group\\/test { }"`);
    });

    it('should handle mixed group/ and regular classes', () => {
      const input = '.regular.group\\/sidebar { }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `".regular:global(.group\\/sidebar) { }"`,
      );
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

      expect(result.css).toMatchInlineSnapshot(`
        "
                :global(.group\\/sidebar) { color: red; }
                :global(.group\\/header) { color: blue; }
                .regular { color: green; }
              "
      `);
    });

    it('should handle multiple selectors in a single rule', () => {
      const input = '.group\\/sidebar, .group\\/header { color: red; }';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar),:global( .group\\/header) { color: red; }"`,
      );
    });
  });

  describe('duplicate processing prevention', () => {
    it('should not double-wrap classes that are already processed', () => {
      const input = '.group\\/sidebar { color: red; }';
      const firstPass = postcss([globalGroupPlugin()]).process(input, {
        from: 'test.module.css',
      });

      expect(firstPass.css).toMatchInlineSnapshot(
        `":global(.group\\/sidebar) { color: red; }"`,
      );

      const secondPass = postcss([globalGroupPlugin()]).process(firstPass.css, {
        from: 'test.module.css',
      });

      expect(secondPass.css).toMatchInlineSnapshot(
        `":global(:global(.group\\/sidebar)) { color: red; }"`,
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const input = '';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`""`);
    });

    it('should handle rules without group/ classes', () => {
      const input = `
        .class1 { color: red; }
        #id1 { color: blue; }
        div { color: green; }
      `;
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`
        "
                .class1 { color: red; }
                #id1 { color: blue; }
                div { color: green; }
              "
      `);
    });

    it('should handle at-rules', () => {
      const input = `
        @media (min-width: 768px) {
          .group\\/sidebar { color: red; }
        }
      `;
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`
        "
                @media (min-width: 768px) {
                  :global(.group\\/sidebar) { color: red; }
                }
              "
      `);
    });

    it('should handle keyframes', () => {
      const input = `
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(100px); }
        }
      `;
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`
        "
                @keyframes slide {
                  from { transform: translateX(0); }
                  to { transform: translateX(100px); }
                }
              "
      `);
    });

    it('should preserve whitespace and formatting', () => {
      const input = '.group\\/sidebar {\n  color: red;\n  padding: 10px;\n}';
      const result = processCSS(input);

      expect(result.css).toMatchInlineSnapshot(`
        ":global(.group\\/sidebar) {
          color: red;
          padding: 10px;
        }"
      `);
    });
  });

  describe('plugin metadata', () => {
    it('should have postcss property set to true', () => {
      expect(globalGroupPlugin.postcss).toBe(true);
    });

    it('should have correct plugin name', () => {
      const pluginInstance = globalGroupPlugin();
      expect(pluginInstance.postcssPlugin).toBe(
        '@accelint/postcss-tailwind-css-modules',
      );
    });
  });
});
