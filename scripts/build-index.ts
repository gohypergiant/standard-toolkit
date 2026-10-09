#!/usr/bin/env zx

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

import { createRequire } from 'node:module';
import {
  type Declaration,
  type ExportNamedDeclaration,
  type ModuleExportName,
  parseSync,
} from 'oxc-parser';
import { $, argv, chalk, echo, fs, glob, path, spinner, YAML } from 'zx';
import { getFormattedHeader } from './license.js';

const INDEX_REGEX = /[\\/]index\.[tj]sx?$/;
const EXT_REGEX = /\.[tj]sx?$/;
const PRIVATE_REGEX = /^\/\/ __private-exports\n/;
// A package's own root barrel is the output of this script, never an input
const PACKAGE_INDEX_REGEX = /^[^/]+\/[^/]+\/src\/index\.[tj]sx?$/;
const CLIENT_DIRECTIVE = `'use client';\n`;

const HEADER_MSG = `${getFormattedHeader('.ts')}\n\n/**\n * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.\n */\n`;

// Biome's assist would regroup the statements by source and move type exports
// below value exports, so sorting stays the responsibility of this script.
const BIOME_IGNORE =
  '\n// biome-ignore-all assist/source/organizeImports: This comment is used to prevent the biome tool from altering the import statements in this file.\n\n';

const IGNORE_LIST = [
  '**/node_modules',
  '**/dist',
  '**/__{fixtures,fixture,mocks,mock,tests,test}__',
  '**/*.{bench,spec,test,test-d,stories}.*',
  '**/examples.*',
];

const require = createRequire(import.meta.url);

const BIOME_BIN = require.resolve('@biomejs/biome/bin/biome');

type FileExports = { code: string[]; types: string[] };

type FileNode = {
  name: string;
  type: 'file';
  path: string;
  exports: FileExports;
};

type DirectoryNode = {
  name: string;
  type: 'dir';
  children: TreeNode[];
};

type TreeNode = FileNode | DirectoryNode;

type IndexFile = { file: string; exports: string[] };

type ExportsParser = (filePath: string) => Promise<FileExports>;

/**
 * Code-unit comparison, so generated barrels do not depend on the host locale.
 */
function compareNames(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

/** Reads the workspace globs from pnpm-workspace.yaml as a single glob prefix */
async function getWorkspaceGlob(root: string): Promise<string> {
  const workspaceFile = await fs.readFile(
    path.join(root, 'pnpm-workspace.yaml'),
    'utf-8',
  );
  const { packages } = YAML.parse(workspaceFile) as { packages: string[] };
  const workspaces = packages.map((pattern) => pattern.replace('/*', ''));

  return workspaces.length > 1
    ? `{${workspaces.join(',')}}/**`
    : `${workspaces[0]}/**`;
}

/**
 * Parses the file and returns its named export statements. Files that start
 * with `// __private-exports` opt out of being hoisted into the barrel.
 */
async function getNamedExports(
  filePath: string,
): Promise<ExportNamedDeclaration[]> {
  const contents = await fs.readFile(filePath, 'utf-8');

  if (PRIVATE_REGEX.test(contents)) {
    return [];
  }

  const { program, errors } = parseSync(filePath, contents, {
    sourceType: 'module',
  });

  if (errors.length > 0) {
    const details = errors.map((error) => error.message).join('; ');

    throw new Error(`Failed to parse ${filePath} with oxc-parser. ${details}`);
  }

  return program.body.filter(
    (node): node is ExportNamedDeclaration =>
      node.type === 'ExportNamedDeclaration',
  );
}

/** Names bound by an `export <declaration>` statement */
function getDeclarationNames(declaration: Declaration | null): string[] {
  if (!declaration) {
    return [];
  }

  switch (declaration.type) {
    case 'VariableDeclaration':
      return declaration.declarations.flatMap((declarator) =>
        declarator.id.type === 'Identifier' ? [declarator.id.name] : [],
      );
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
      return declaration.id ? [declaration.id.name] : [];
    case 'TSEnumDeclaration':
    case 'TSTypeAliasDeclaration':
    case 'TSInterfaceDeclaration':
      return [declaration.id.name];
    default:
      return [];
  }
}

function getExportedName(exported: ModuleExportName): string {
  return exported.type === 'Identifier' ? exported.name : exported.value;
}

function sortExports(exports: FileExports): FileExports {
  exports.code.sort(compareNames);
  exports.types.sort(compareNames);

  return exports;
}

/** Get all of the exports from the given *code* file. Split between code and type */
async function codeFileExports(filePath: string): Promise<FileExports> {
  const exports: FileExports = { code: [], types: [] };

  for (const node of await getNamedExports(filePath)) {
    const names = getDeclarationNames(node.declaration);
    const target = node.exportKind === 'type' ? exports.types : exports.code;

    target.push(...names);
  }

  return sortExports(exports);
}

/** Get all of the exports from the given *barrel* file. Split between code and type */
async function barrelFileExports(filePath: string): Promise<FileExports> {
  const exports: FileExports = { code: [], types: [] };

  for (const node of await getNamedExports(filePath)) {
    for (const specifier of node.specifiers) {
      const isType =
        node.exportKind === 'type' || specifier.exportKind === 'type';
      const target = isType ? exports.types : exports.code;

      target.push(getExportedName(specifier.exported));
    }
  }

  return sortExports(exports);
}

/**
 * Get a tree structure of the files with their exports. The top level is one
 * node per workspace folder (e.g. `packages`), then one per package.
 */
async function getFileTree(
  root: string,
  assets: string[],
  parseExports: ExportsParser,
): Promise<DirectoryNode[]> {
  const workspaces: DirectoryNode[] = [];
  const directories = new Map<string, DirectoryNode>();

  for (const assetPath of assets) {
    const parts = assetPath.split('/');
    const file = parts.pop();
    let branch: DirectoryNode | undefined;
    let partPath = '';

    for (const part of parts) {
      partPath += `${part}/`;
      let directory = directories.get(partPath);

      if (!directory) {
        directory = { name: part, type: 'dir', children: [] };
        directories.set(partPath, directory);

        if (branch) {
          branch.children.push(directory);
        } else {
          workspaces.push(directory);
        }
      }

      branch = directory;
    }

    if (!(file && branch)) {
      continue;
    }

    const exports = await parseExports(path.resolve(root, assetPath));

    branch.children.push({
      name: file,
      type: 'file',
      path: assetPath,
      exports,
    });
  }

  return workspaces;
}

/** Convert the leaf exports into ESM export statements */
function aggregateExports(children: TreeNode[], packageRoot: string): string[] {
  const exports: string[] = [];
  const sortedChildren = [...children].sort((left, right) =>
    compareNames(left.name, right.name),
  );

  for (const child of sortedChildren) {
    if (child.type === 'dir') {
      exports.push(...aggregateExports(child.children, packageRoot));

      continue;
    }

    const shortenedPath = child.path
      .replace(packageRoot, '.')
      .replace(INDEX_REGEX, '')
      .replace(EXT_REGEX, '')
      .replaceAll('\\', '/');

    if (child.exports.code.length) {
      exports.push(
        `export { ${child.exports.code.join(', ')} } from '${shortenedPath}';`,
      );
    }

    if (child.exports.types.length) {
      exports.push(
        `export type { ${child.exports.types.join(', ')} } from '${shortenedPath}';`,
      );
    }
  }

  return exports;
}

/** Get a list of *code* files */
async function getCodeFiles(
  root: string,
  workspace: string | undefined,
  ignores: string | undefined,
): Promise<string[]> {
  const ignoreList = ignores
    ? ignores.split(',').map((pattern) => `**/${pattern.trim()}`)
    : [];
  const workspaceGlob = workspace || (await getWorkspaceGlob(root));
  const globPattern = `${workspaceGlob}/src/**/*.{ts,tsx,js,jsx}`;

  return glob(globPattern, {
    ignore: [...IGNORE_LIST, ...ignoreList],
    cwd: root,
  });
}

/** Get a list of *barrel* files */
async function getBarrelFiles(
  root: string,
  workspace: string | undefined,
): Promise<string[]> {
  const workspaceGlob = workspace || (await getWorkspaceGlob(root));
  const globPattern = `${workspaceGlob}/src/**/index.{ts,tsx,js,jsx}`;

  return glob(globPattern, { ignore: IGNORE_LIST, cwd: root });
}

/** Get the output file and export statements for every package in the tree */
function getIndexFiles(root: string, tree: DirectoryNode[]): IndexFile[] {
  const indexes: IndexFile[] = [];

  for (const workspace of tree) {
    for (const wsPackage of workspace.children) {
      if (wsPackage.type !== 'dir') {
        continue;
      }

      // path.join uses path.sep, which breaks the generated paths on Windows
      const packageDir = path
        .join(workspace.name, wsPackage.name, 'src')
        .replaceAll(path.sep, '/');
      const file = path
        .join(root, packageDir, 'index.ts')
        .replaceAll(path.sep, '/');

      // The glob is rooted at `src`, so it is the package's only child
      const srcDirectory = wsPackage.children.at(0);
      const exports =
        srcDirectory?.type === 'dir'
          ? aggregateExports(srcDirectory.children, packageDir)
          : [];

      indexes.push({ file, exports });
    }
  }

  return indexes;
}

/** Write one index file and format it with Biome */
async function writeIndexFile(
  { file, exports }: IndexFile,
  ext: '.ts' | '.js',
  isClient: boolean,
): Promise<void> {
  const newFile = file.replace(EXT_REGEX, ext);

  echo(chalk.green(`Writing ${exports.length} exports in ${newFile}...`));

  const body = (isClient ? [CLIENT_DIRECTIVE] : [])
    .concat([HEADER_MSG, BIOME_IGNORE, ...exports])
    .join('\n');

  await fs.writeFile(newFile, body, 'utf-8');
  await $`${process.execPath} ${BIOME_BIN} check ${newFile} --linter-enabled=false --write`;
}

function outputHelp(): void {
  console.log(`build-index [workspace] [ignores]

  If the workspace is not provided then the script will index every workspace listed in pnpm-workspace.yaml.

  The ignore list should be a comma separated list of files to ignore. They are split and then added to Glob's ignore list. ("**/<file>, **/<file>, ...")

  The --barrels flag denotes that the script should only look for barrel files and hoist just those to the root index file.

  The --js flag denotes that the script should write the index file as .js instead of the default .ts

  The --client flag denotes that the root index file should include the 'use client' directive`);
}

await spinner(chalk.green('Generating index file...'), async () => {
  if (argv.h || argv.help) {
    return outputHelp();
  }

  const root = path.resolve(import.meta.dirname, '..');

  // Package scripts invoke this from their own folder
  process.chdir(root);

  const [workspace, ignores] = argv._ as [
    string | undefined,
    string | undefined,
  ];
  const ext = argv.js ? '.js' : '.ts';

  const files = argv.barrels
    ? await getBarrelFiles(root, workspace)
    : await getCodeFiles(root, workspace, ignores);

  if (!files.length) {
    return echo(chalk.red('No files found. Exiting.'));
  }

  const inputFiles = files.filter(
    (filePath) => !PACKAGE_INDEX_REGEX.test(filePath),
  );
  const parseExports = argv.barrels ? barrelFileExports : codeFileExports;
  const tree = await getFileTree(root, inputFiles, parseExports);
  const indexes = getIndexFiles(root, tree);

  await Promise.all(
    indexes.map((index) => writeIndexFile(index, ext, Boolean(argv.client))),
  );
});
