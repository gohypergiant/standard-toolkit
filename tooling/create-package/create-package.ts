#! /usr/bin/env node

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
import path from 'node:path';
import { Argument, Command } from 'commander';
import startCase from 'lodash/startCase.js';

const program = new Command();

const NAME_PREFIX = '@accelint';

program
  .name('create-package')
  .description('Create a new package with standard files and folders')
  .addArgument(
    new Argument(
      '<name>',
      'The name of the package to create (eg. @accelint/my-package)',
    ),
  )
  .action(async (name: string) => {
    const fullName = name.startsWith(`${NAME_PREFIX}/`)
      ? name
      : `${NAME_PREFIX}/${name}`;

    console.log({ fullName });

    // Create the main folder
    const rootPath = path.join(process.cwd(), '..', '..', 'packages', name);
    fs.mkdirSync(rootPath, { recursive: true });

    // Create the src folder
    const srcPath = path.join(rootPath, 'src');
    fs.mkdirSync(srcPath, { recursive: true });

    // Create the package.json file
    const packageJsonContent = {
      name: fullName,
      version: '0.0.0',

      private: false,
      license: 'Apache-2.0',
      repository: {
        type: 'git',
        url: 'https://github.com/gohypergiant/standard-toolkit',
      },
      type: 'module',
      files: ['dist/**'],
      types: './dist/index.d.ts',
      exports: {
        '.': {
          import: {
            types: './dist/index.d.ts',
            default: './dist/index.js',
          },
          default: './dist/index.js',
        },
        './package.json': './package.json',
      },
      scripts: {
        build: 'pnpm run format && pnpm run license && pnpm tsup',
        license: 'pnpm zx ../../scripts/license.mjs --files src',
        'license:initial': 'pnpm zx ../../scripts/license.mjs',
        dev: 'pnpm tsc --watch',
        index: `pnpm zx ../../scripts/indexer.mjs packages/${name}`,
        format: 'pnpm biome check --linter-enabled=false . --write',
        lint: 'pnpm biome lint',
      },

      main: 'src/index.ts',
      dependencies: {},
      devDependencies: {
        '@accelint/biome-config': 'workspace:*',
        '@accelint/design-toolkit': 'workspace:*',
        '@accelint/typescript-config': 'workspace:*',
        '@types/node': '20',
        '@types/react': '^19.0.10',
        '@types/react-dom': '^19.0.4',
        'esbuild-fix-imports-plugin': '1.0.21',
        lodash: '^4.17.21',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        tsup: '8.5.0',
        typescript: '^5.8.3',
      },
      peerDependencies: {
        lodash: '^4.17.21',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      // biome-ignore lint/style/useNamingConvention: Schema requires this exact casing
      $schema: 'https://json.schemastore.org/package',
      author: 'https://hypergiant.com',
      publishConfig: {
        access: 'public',
      },
      sideEffects: false,
      engines: {
        node: '>=18',
        pnpm: '>=9',
      },
    };
    fs.writeFileSync(
      path.join(rootPath, 'package.json'),
      JSON.stringify(packageJsonContent, null, 2),
    );

    // Create a basic tsconfig.json file
    const tsconfigContent = {
      $schema: 'https://json.schemastore.org/tsconfig',
      extends: '@accelint/typescript-config/tsc/dom/library',
      include: ['./src', './.storybook/*.tsx'],
      exclude: [
        'node_modules',
        '**/*.bench.ts',
        '**/*.test.ts',
        '**/*.test-d.ts',
      ],
      compilerOptions: {
        jsx: 'react-jsx',
        rootDir: '.',
        outDir: 'dist',
        paths: {
          '@/*': ['./src/*'],
        },
        types: ['node'],
      },
    };
    fs.writeFileSync(
      path.join(rootPath, 'tsconfig.json'),
      JSON.stringify(tsconfigContent, null, 2),
    );

    // Create a basic README.md file
    const readmeContent = `# ${fullName}

${startCase(name.replace(`${NAME_PREFIX}/`, '').replace(/-/g, ' '))}

> :warning: Add a detailed description of what this package provides

## Installation

\`\`\`shell
npm install ${fullName}
# or
yarn add ${fullName}
# or
pnpm add ${fullName}
\`\`\`

## Background

> :warning: Add any background information here

### :llama: Background info 1

### :camel: Background info 2
`;

    // # ${name}\n\nThis is the ${fullName} package.\n`;
    fs.writeFileSync(path.join(rootPath, 'README.md'), readmeContent);

    // Create a stubbed index.ts file
    const indexTsContent = `
    export function main() {
      console.log('This is the main function from ${name}');
    }
`;

    fs.writeFileSync(path.join(srcPath, 'index.ts'), indexTsContent);

    // Create an empty CHANGELOG.md file
    fs.writeFileSync(path.join(rootPath, 'CHANGELOG.md'), `# ${fullName}\n`);

    // Create the tsup.config.ts file
    const tsupConfigContent = `import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
  ],
  bundle: false,
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  metafile: true,
});

`;
    fs.writeFileSync(path.join(rootPath, 'tsup.config.ts'), tsupConfigContent);

    // Create typedoc.mjs file
    const typedocContent = `/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  name: '@accelint/dependency-cruiser',
};
`;
    fs.writeFileSync(path.join(rootPath, 'typedoc.mjs'), typedocContent);

    console.log(`Package ${name} created successfully at ${rootPath}`);

    // Build in the generated root directory
    process.chdir(rootPath);
    console.log(`Changed working directory to ${process.cwd()}`);
    console.log('Running pnpm install...');
    const { execSync } = await import('node:child_process');
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('Running pnpm build...');
    execSync('pnpm run build', { stdio: 'inherit' });
    console.log('Running additional scripts...');
    execSync('pnpm run license:initial', { stdio: 'inherit' });
    console.log(`Package ${name} built successfully.`);
  });

program.parse();
