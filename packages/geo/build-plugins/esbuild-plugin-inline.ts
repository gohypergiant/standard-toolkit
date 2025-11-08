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
import type { Plugin } from 'esbuild';

const pattern = new RegExp(
  [
    // esbuild-inline block
    '//\\s*@esbuild-inline[^\\n]*\\n',

    // export declaration (left-hand side)
    '([\\s\\S]*?=)',

    // capture everything in between
    '([\\s\\S]*?)',

    // end marker
    '//\\s*@esbuild-inline-end',
  ].join(''),
  'im',
);

/**
 * Esbuild plugin to inline RegExp constructed from array.join()
 * Only processes files with the `// @esbuild-inline` annotation
 *
 * @example
 * export const myRegex =
 *  // @esbuild-inline
 *  new RegExp( ... );
 * // @esbuild-inline-end
 */
export const pluginInline: Plugin = {
  name: 'esbuild-inline',
  setup(build) {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: build tooling
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      // Skip node_modules
      if (args.path.includes('node_modules')) {
        return null;
      }

      const contents = await fs.readFile(args.path, 'utf8');

      // Only process files with the annotation
      if (!contents.includes('// @esbuild-inline')) {
        return null;
      }

      try {
        const match = pattern.exec(contents);
        if (!match) {
          return null;
        }

        const [fullMatch, declaration, code] = match;

        if (declaration && code) {
          const exec = new Function(`return ${code.trim()}`);
          const result = exec();

          // Serialize the result appropriately
          const serialized =
            result instanceof RegExp
              ? result.toString()
              : JSON.stringify(result);

          const replacement = `${declaration} ${serialized}`;
          const transformed = contents.replace(fullMatch, replacement);

          return { contents: transformed, loader: 'ts' };
        }

        if (code) {
          throw new Error('Missing export declaration');
        }

        throw new Error('Missing code body');
      } catch (e) {
        if ('message' in (e as Error)) {
          if ((e as Error).message.includes('Missing')) {
            console.warn(
              `[esbuild-inline] ${(e as Error).message} in ${args.path}`,
            );
          } else {
            console.warn(
              `[esbuild-inline] Error evaluating regex in ${args.path}: ${(e as Error).message}`,
            );
          }
        } else {
          console.warn(
            `[esbuild-inline] Failed to transform regex in ${args.path}:`,
            e,
          );
        }

        return null;
      }
    });
  },
};
