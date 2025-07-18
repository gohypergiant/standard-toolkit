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

/**
 * Borrowed from here:
 * @see https://gist.github.com/sikanhe/f9ac68dd4c78c914c29cc98e7b875466
 */

import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import * as babel from '@babel/core';
import BabelPluginReactCompiler from 'babel-plugin-react-compiler';
import type { Plugin } from 'esbuild';

function logInfo(filename, event) {
  // console.log(filename);
  // console.log(event);

  if (event.kind === 'CompileSuccess') {
    console.info(`✅ ${relative(resolve(), filename)} ${event.fnName}`);
  }

  if (event.kind === 'CompileError') {
    console.error(
      `❌ ${relative(resolve(), filename)}
       ${event.detail.severity}.
       ${event.detail.reason}
      `,
    );
  }
}

export function reactCompilerEsbuildPlugin({
  filter,
  sourceMaps,
}: {
  filter: RegExp;
  sourceMaps: boolean;
}): Plugin {
  return {
    name: 'esbuild-react-compiler-plugin',
    setup(build) {
      let timings: number[] = [];

      build.onEnd(() => {
        if (timings.length < 1) {
          return;
        }

        const totalTime = timings.reduce((sum, x) => sum + x, 0).toFixed(0);

        console.log(`[⚛️  React Compiler] ${timings.length} files changed`);
        console.log(`[⚛️  React Compiler] Used ${totalTime} ms`);

        timings = [];
      });

      build.onLoad({ filter }, (args) => {
        const contents = readFileSync(args.path, 'utf8');

        const t0 = performance.now();

        const output = build.esbuild.transformSync(contents, {
          loader: 'tsx',
          jsx: 'automatic',
          define: build.initialOptions.define,
          target: build.initialOptions.target,
          format: build.initialOptions.format,
        });

        const transformResult = babel.transformSync(output.code, {
          // NOTE: https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L275
          plugins: [
            [
              BabelPluginReactCompiler,
              {
                logger: {
                  logEvent: logInfo,
                },
              },
            ],
          ],
          filename: args.path,
          caller: {
            name: 'esbuild-react-compiler-plugin',
            supportsStaticESM: true,
          },
          sourceMaps,
        });

        timings.push(performance.now() - t0);

        return {
          contents: transformResult?.code ?? undefined,
          loader: 'js',
        };
      });
    },
  };
}
