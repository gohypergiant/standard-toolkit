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

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsup';
import * as ts from 'typescript';
import createTransformer from '../../tooling/ts-transformer-compound-components/dist/index.js';

const CHECK = /client-only/gm;

async function findCompoundComponents(dir: string): Promise<string[]> {
  const components: string[] = [];
  const files = await glob(['src/components/*/index.tsx']);

  for (const file of files) {
    const content = await fs.readFile(path.join(dir, file), 'utf-8');
    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    // Function to extract component name from a node
    function getComponentName(node: ts.Node): string | undefined {
      if (ts.isFunctionDeclaration(node) && node.name) {
        return node.name.text;
      }
      if (ts.isVariableStatement(node)) {
        const decl = node.declarationList.declarations[0];
        if (ts.isIdentifier(decl.name)) {
          return decl.name.text;
        }
      }
      return undefined;
    }

    // Check each node for @compound-component JSDoc tag
    function visit(node: ts.Node) {
      const jsDoc = ts.getJSDocTags(node);
      if (jsDoc.some((tag) => tag.tagName.getText() === 'compound-component')) {
        const name = getComponentName(node);
        if (name) components.push(name);
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return components;
}

export default defineConfig({
  esbuildOptions: async (options) => {
    options.tsconfig = './tsconfig.json';

    // Automatically detect compound components
    const components = await findCompoundComponents(process.cwd());
    console.log('Detected compound components:', components);

    // Create a TypeScript transformer for validating compound components
    const componentTransformer = createTransformer({ components });
    options.plugins = [
      ...(options.plugins || []),
      {
        name: 'compound-components',
        setup(build: any) {
          build.onLoad(
            { filter: /\.tsx?$/ },
            async (args: { path: string }) => {
              const source = await fs.readFile(args.path, 'utf-8');
              const result = ts.transpileModule(source, {
                compilerOptions: {
                  jsx: ts.JsxEmit.React,
                  module: ts.ModuleKind.ESNext,
                },
                transformers: {
                  before: [
                    componentTransformer as unknown as ts.TransformerFactory<ts.SourceFile>,
                  ],
                },
              });
              return {
                contents: result.outputText,
                loader: 'tsx',
              };
            },
          );
        },
      },
    ];
  },
  entry: [
    'src/index.ts',
    'src/components/*/index.{ts,tsx}',
    'src/test/**/*.{ts,tsx}',
    'src/**/*.css',
    '!src/**/*.{d,stories,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
    '!storybook-static',
  ],
  loader: {
    '.css': 'copy',
  },
  tsconfig: './tsconfig.dist.json',
  metafile: true,
  bundle: false,
  clean: true,
  dts: true,
  format: 'esm',
  minify: true,
  sourcemap: false,
  splitting: true,
  treeshake: true,
  onSuccess: async () => {
    const files = await glob(['dist/**/*.js', '!dist/**/*.js.map']);

    for (let i = 0; i < files.length; i++) {
      const path = files[i];
      const content = await fs.readFile(path, 'utf-8');

      if (CHECK.test(content)) {
        fs.writeFile(path, `${"'use client';"}\n\n${content}`);
      }
    }
  },
});
