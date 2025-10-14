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
import { glob } from 'tinyglobby';
import * as ts from 'typescript';
import { createTransformer } from '.';

interface Config {
  path: string;
}

export async function checkCompoundComponents(config: Config) {
  const components = await findCompoundComponents(config.path);
  console.log('Detected compound components:', components);

  const componentTransformer = createTransformer({ components });

  return {
    name: 'compound-components',
    setup(build: any) {
      build.onLoad({ filter: /\.tsx?$/ }, async (args: { path: string }) => {
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
      });
    },
  };
}

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
        if (name) {
          components.push(name);
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return components;
}
