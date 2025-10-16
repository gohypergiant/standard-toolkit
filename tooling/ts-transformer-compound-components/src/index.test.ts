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

import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { createTransformer } from '.';

describe('Compound Component Transformer', () => {
  // Helper function to run the transformer on a source file
  function transformCode(sourceCode: string) {
    const sourceFile = ts.createSourceFile(
      'test.tsx',
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
    );

    const program = ts.createProgram({
      rootNames: ['test.tsx'],
      options: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.Latest,
      },
      host: {
        ...ts.createCompilerHost({}),
        getSourceFile: (fileName) =>
          fileName === 'test.tsx' ? sourceFile : undefined,
        writeFile: () => undefined,
      },
    });

    const transformer = createTransformer({
      components: ['title', 'content', 'header', 'footer'],
    });

    const result = ts.transform(
      sourceFile,
      [transformer],
      program.getCompilerOptions(),
    );
    const transformedSource = result.transformed[0] as ts.SourceFile & {
      diagnostics?: ts.Diagnostic[];
    };
    return {
      diagnostics: transformedSource.diagnostics || [],
      transformed: transformedSource,
    };
  }

  describe('Component Declaration', () => {
    it('should detect valid compound component structure with function declaration', () => {
      const source = `
        /**
         * @compound-component
         * @requires title exactly 1
         * @requires content exactly 1
         */
        export function ValidComponent({ children }) {
          return <div>{children}</div>;
        }
        ValidComponent.Title = function Title() { return <div>Title</div>; };
        ValidComponent.Content = function Content() { return <div>Content</div>; };
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBe(0);
    });

    it('should detect valid compound component structure with arrow function', () => {
      const source = `
        /**
         * @compound-component
         * @requires title exactly 1
         * @requires content exactly 1
         */
        export const ValidComponent = ({ children }) => {
          return <div>{children}</div>;
        };
        ValidComponent.Title = () => <div>Title</div>;
        ValidComponent.Content = () => <div>Content</div>;
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBe(0);
    });

    it('should ignore non-compound components', () => {
      const source = `
        export function RegularComponent({ children }) {
          return <div>{children}</div>;
        }
        RegularComponent.Title = function Title() { return <div>Title</div>; };
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBe(0);
    });
  });

  describe('Child Component Requirements', () => {
    it('should detect missing required children', () => {
      const source = `
        /**
         * @compound-component
         * @requires title exactly 1
         */
        export function InvalidComponent({ children }) {
          return <div>{children}</div>;
        }
        // Missing Title component
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics[0].messageText).toContain('requires title');
    });

    it('should validate minimum number of children', () => {
      const source = `
        /**
         * @compound-component
         * @requires content min 2
         */
        export function MinComponent({ children }) {
          return <div>{children}</div>;
        }
        MinComponent.Content = () => <div>Only one content</div>;
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics[0].messageText).toContain('at least 2');
    });

    it('should validate maximum number of children', () => {
      const source = `
        /**
         * @compound-component
         * @requires header max 1
         */
        export function MaxComponent({ children }) {
          return <div>{children}</div>;
        }
        MaxComponent.Header = () => <div>Header 1</div>;
        MaxComponent.Header2 = () => <div>Header 2</div>;
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics[0].messageText).toContain('at most 1');
    });
  });

  describe('Complex Validation Rules', () => {
    it('should handle multiple validation rules', () => {
      const source = `
        /**
         * @compound-component
         * @requires header exactly 1
         * @requires content min 1
         * @requires footer max 1
         */
        export function ComplexComponent({ children }) {
          return <div>{children}</div>;
        }
        ComplexComponent.Header = function Header() { return <div>Header</div>; };
        ComplexComponent.Content = function Content() { return <div>Content</div>; };
        ComplexComponent.Footer = function Footer() { return <div>Footer</div>; };
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBe(0);
    });

    it.skip('should validate nested compound components', () => {
      const source = `
        /**
         * @compound-component
         * @requires header exactly 1
         */
        export function ParentComponent({ children }) {
          return <div>{children}</div>;
        }

        /**
         * @compound-component
         * @requires title exactly 1
         */
        ParentComponent.Header = function Header({ children }) {
          return <div>{children}</div>;
        };

        // Usage
        function App() {
          return (
            <ParentComponent>
              <ParentComponent.Header>
                {/* Missing required title */}
              </ParentComponent.Header>
            </ParentComponent>
          );
        }
      `;

      const { diagnostics } = transformCode(source);
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics[0].messageText).toContain('title');
    });
  });
});
