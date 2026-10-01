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
import { URL } from 'node:url';
import { type ExportNamedDeclaration, parseSync } from 'oxc-parser';
import { $, argv, chalk, echo, fs, glob, path, spinner } from 'zx';
import { getFormattedHeader } from './license.js';

const INDEX_REGEX = /[\\/]index\.[tj]sx?$/;
const EXT_REGEX = /\.[tj]sx?$/;
const PRIVATE_REGEX = /^\/\/ __private-exports\n/;
const CLIENT_DIRECTIVE = `'use client';\n`;

const HEADER_MSG = `${getFormattedHeader('.ts')}\n\n/**\n * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.\n */\n`;

const BIOME_IGNORE =
  '\n// biome-ignore-all assist/source/organizeImports: This comment is used to prevent the biome tool from altering the import statements in this file.\n\n';

const IGNORE_LIST = [
  '**/node_modules',
  '**/dist',
  '**/__{fixtures,fixture,mocks,mock,tests,test}__',
  '**/*.{bench,spec,test,test-d,stories}.*',
  '**/examples.*',
  '**/tokens/example-usage.tsx',
];

const require = createRequire(import.meta.url);

const BIOME_BIN = require.resolve('@biomejs/biome/bin/biome');

const baseOxcOpt = {
  sourceType: 'module',
} as const;

function getOxcLanguage(filePath: string): 'js' | 'jsx' | 'ts' | 'tsx' {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.jsx':
      return 'jsx';
    case '.tsx':
      return 'tsx';
    case '.ts':
      return 'ts';
    default:
      return 'js';
  }
}

type FileExports = { code: string[]; types: string[] };

type FileTreeFileNode = {
  name: string;
  type: 'file';
  path: string;
  exports: FileExports;
};

type FileTreeDirectoryNode = {
  name: string;
  type: 'dir';
  children: FileTreeNode[];
};

type FileTreeNode = FileTreeFileNode | FileTreeDirectoryNode;

type WorkspacePackageNode = {
  name: string;
  children: FileTreeDirectoryNode[];
};

type WorkspaceNode = {
  name: string;
  children: WorkspacePackageNode[];
};

function sortByName(p1: { name: string }, p2: { name: string }): number {
  return p1.name.localeCompare(p2.name);
}

const hasNodeModules = (dirPath: string, pathSegs: string | string[]) =>
  fs.existsSync(dirPath) && !pathSegs.includes('node_modules');

function getProjectRoot(pathSegs: string | string[]): string {
  if (!pathSegs.length) {
    throw new Error('Could not find project root.');
  }

  const segs = Array.isArray(pathSegs) ? pathSegs : pathSegs.split(path.sep);
  const nodeModulesPath = segs.concat(['node_modules']).join('/');

  return hasNodeModules(nodeModulesPath, segs)
    ? segs.join('/')
    : getProjectRoot(segs.slice(0, -1));
}

function getWorkspaceGlob(root: string): string {
  const packageFile = require(`${root}/package.json`);
  const workspaces = packageFile.workspaces.map((w: string) =>
    w.replace('/*', ''),
  );

  return workspaces.length > 1
    ? `{${workspaces.join(',')}}/**`
    : `${workspaces[0]}/**`;
}

/** Generates an AST from the given file */
async function getAST(filePath: string) {
  const contents = await fs.readFile(filePath, 'utf-8');
  const parserOptions = {
    ...baseOxcOpt,
    lang: getOxcLanguage(filePath),
  } as const;

  // We want to ignore any file that starts with `// __private-exports` so that the
  // developer has the autonomy to either bubble up barrels or skip that step.
  // or to just ignore code files altogether.
  // * NOTE: This will probably supercede the need for the "ignore" flag
  if (contents.match(PRIVATE_REGEX)) {
    return parseSync(filePath, '', parserOptions);
  }

  const ast = parseSync(filePath, contents, parserOptions);

  if (ast.errors.length > 0) {
    const details = ast.errors.map((error) => error.message).join('; ');

    throw new Error(`Failed to parse ${filePath} with oxc-parser. ${details}`);
  }

  return ast;
}

/** Filters the AST body to just code export nodes */
const getCodeExports = (ast: ReturnType<typeof parseSync>) =>
  ast.program.body.filter(
    (node): node is ExportNamedDeclaration =>
      node.type === 'ExportNamedDeclaration' && node.exportKind !== 'type',
  );

/** Filters the AST body to just type export nodes */
const getTypeExports = (ast: ReturnType<typeof parseSync>) =>
  ast.program.body.filter(
    (node): node is ExportNamedDeclaration =>
      node.type === 'ExportNamedDeclaration' && node.exportKind === 'type',
  );

function collectDefinedStrings<T>(
  items: T[],
  getValue: (item: T) => string | undefined,
): string[] {
  const values: string[] = [];

  for (const item of items) {
    const value = getValue(item);

    if (value) {
      values.push(value);
    }
  }

  return values;
}

/** Get all of the exports from the given *code* file. Split between code and type */
async function codeFileExports(filePath: string): Promise<FileExports> {
  const ast = await getAST(filePath);
  // ---------------- Code Exports -------------------------
  const codeExports = getCodeExports(ast);

  // If it doesn't have `declaration` it is probably a re-export
  const codeNames = codeExports
    .flatMap((node) =>
      node.declaration?.type === 'TSEnumDeclaration' ||
      node.declaration?.type === 'FunctionDeclaration' ||
      node.declaration?.type === 'ClassDeclaration'
        ? [node.declaration?.id?.name]
        : // @ts-ignore
          node.declaration?.declarations?.map((dec) => dec.id.name),
    )
    .filter(Boolean)
    .sort();

  // ---------------- Type Exports -------------------------
  const typeExports = getTypeExports(ast);

  // If it doesn't have `declaration` it is probably a re-export
  const typeNames = collectDefinedStrings(
    typeExports,
    // @ts-expect-error
    (node) => node.declaration?.id.name,
  ).sort((left, right) => left.localeCompare(right));

  return { code: codeNames, types: typeNames };
}

/** Get all of the exports from the given *barrel* file. Split between code and type */
async function barrelFileExports(filePath: string): Promise<FileExports> {
  const ast = await getAST(filePath);

  if (!ast) {
    return { code: [], types: [] };
  }

  // ---------------- Code Exports -------------------------
  const codeExports = getCodeExports(ast);

  const codeNames = codeExports
    .flatMap((node) =>
      node.specifiers.map((spec) =>
        spec.exportKind === 'type'
          ? // @ts-expect-error
            `type ${spec.exported.name}`
          : // @ts-expect-error
            spec.exported.name,
      ),
    )
    .filter(Boolean)
    .sort();

  // ---------------- Type Exports -------------------------
  const typeExports = getTypeExports(ast);

  const typeNames = typeExports
    // @ts-expect-error
    .flatMap((node) => node.specifiers.map((spec) => spec.exported.name))
    .filter(Boolean)
    .sort();

  // Since there might be some `{ type SomeType }`s in the code array, we want to
  // swap thos into the type array.
  const filteredCodeNames: string[] = [];
  const typeFromCode: string[] = [];

  for (const exportName of codeNames) {
    if (exportName.startsWith('type ')) {
      typeFromCode.push(exportName.replace('type ', ''));
      continue;
    }

    filteredCodeNames.push(exportName);
  }

  typeNames.push(...typeFromCode);

  return { code: filteredCodeNames, types: typeNames };
}

/** Get a tree structure of the files with their exports */
async function getFileTree(
  root: string,
  assets: string[],
  parserFn: (filePath: string) => Promise<FileExports>,
) {
  const tree = { root: {} };

  for (const assetPath of assets) {
    const parts = assetPath.split('/');
    const file = parts.pop();

    if (!file) {
      continue;
    }

    let branch = tree;
    let partPath = '';

    for (const part of parts) {
      partPath += `${part}/`;

      if (partPath === `${part}/`) {
        // @ts-expect-error
        tree.root[partPath] = tree[partPath] ??= { name: part, children: [] };
        // @ts-expect-error
      } else if (tree[partPath] === undefined) {
        // @ts-expect-error
        tree[partPath] = { name: part, type: 'dir', children: [] };
        // @ts-expect-error
        branch.children.push(tree[partPath]);
      }

      // @ts-expect-error
      branch = tree[partPath];
    }

    const exports = await parserFn(path.resolve(root, assetPath));

    // @ts-expect-error
    branch.children.push({
      name: file,
      type: 'file',
      path: assetPath,
      exports,
    });
  }

  return Object.values(tree.root) as WorkspaceNode[];
}

/** Convert the leave exports into ESM export statements */
function aggregateExports(
  children: FileTreeNode[],
  packageRoot: string,
): string[] {
  const exports: string[] = [];
  const sortedChildren = [...children].sort(sortByName);

  // Loop through the children and collect the code export and type exports
  // while converting them into an export statement.
  for (const child of sortedChildren) {
    if (child.type === 'file') {
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
          `export type { ${child.exports.types.join(
            ', ',
          )} } from '${shortenedPath}';`,
        );
      }
    } else if (child.type === 'dir') {
      exports.push(...aggregateExports(child.children, packageRoot));
    }
  }

  return exports;
}

/** Get a list of *code* files */
function getCodeFiles(
  root: string,
  workspace: string | undefined,
  ignores: string | undefined,
) {
  const ignoreList = ignores
    ? ignores.split(',').map((f) => `**/${f.trim()}`)
    : [];

  const workspaceGlob = workspace || getWorkspaceGlob(root);
  const globPattern = `${workspaceGlob}/src/**/*.{ts,tsx,js,jsx}`;
  const ignorePattern = [...IGNORE_LIST, ...ignoreList];

  return glob(globPattern, { ignore: ignorePattern, cwd: root });
}

/** Get a list of *barrel* files */
function getBarrelFiles(root: string, workspace: string | undefined) {
  const workspaceGlob = workspace || getWorkspaceGlob(root);
  const globPattern = `${workspaceGlob}/src/**/index.{ts,tsx,js,jsx}`;

  return glob(globPattern, { ignore: IGNORE_LIST, cwd: root });
}

/** Get all of the export statements for all of the workspaces */
function getNewExportList(root: string, tree: WorkspaceNode[]) {
  return tree.flatMap((workspace) =>
    workspace.children.map((wsPackage) => {
      // path.join will use path.sep as the join character. Thats not needed in this case
      // and ends of breaking the script (Windows). So replace all path.sep with just '/'
      const packageDir = path
        .join(workspace.name, wsPackage.name, 'src')
        .replaceAll(path.sep, '/');

      const absOutDir = path.join(root, packageDir).replaceAll(path.sep, '/');

      const outFile = path
        .join(absOutDir, 'index.ts')
        .replaceAll(path.sep, '/');

      const srcDirectory = wsPackage.children.at(0);

      if (!srcDirectory) {
        return [outFile, []] as [string, string[]];
      }

      // If this was a multi-project, general use script we would loop again.
      // Skip to the `src` folder's children
      const exportList = aggregateExports(srcDirectory.children, packageDir);

      return [outFile, exportList] as [string, string[]];
    }),
  );
}

/** Write the index files for all of the workspaces */
function writeAllIndexes(
  indexes: [string, string[]][],
  ext: '.ts' | '.js',
  isClient: boolean,
) {
  return Promise.all(
    indexes.map(([file, content]) => {
      const newFile = file.replace(EXT_REGEX, ext);

      echo(chalk.green(`Writing ${content.length} exports in ${newFile}...`));

      const body = (isClient ? [CLIENT_DIRECTIVE] : [])
        .concat([HEADER_MSG, BIOME_IGNORE, ...content])
        .join('\n');

      fs.writeFile(newFile, body, 'utf-8');

      return $`${process.execPath} ${BIOME_BIN} check ${newFile} --linter-enabled=false --write`;
    }),
  );
}

/** Build the index files for the workspaces */
async function buildIndexFiles(
  root: string,
  ext: '.ts' | '.js',
  files: string[],
  parserFn: (filePath: string) => Promise<FileExports>,
  isClient: boolean,
) {
  const indexes = getNewExportList(
    root,
    await getFileTree(root, files, parserFn),
  );

  await writeAllIndexes(indexes, ext, isClient);
}

function outputHelp() {
  return console.log(`build-index []

  If the workspace is not provided then the script will attempt to get all workspaces from the root package.json.

  The ignore list should be a comma separated list of files to ignore. They are split and then added to Glob's ignore list. ("**/<file>, **/<file>, ...")

  The --barrels flag denotes that the script should only look for barrel files and hoist just those to the root index file.

  The --js flag denotes that the script should write the index file as .js instead of the default .ts

  The --client flag denotes that the root index file should include the 'use client' directive`);
}

await spinner(chalk.green('Generating index file...'), async () => {
  if (argv.h || argv.help) {
    return outputHelp();
  }

  // Normal __dirname is not in ESM context. This mimics it.
  let __dirname = new URL('.', import.meta.url).pathname;

  // The result of the above has a leading `/`. Works fine as is in *nix systems
  // but fails under Windows. And removing causes it to fail under *nix.
  // Check OS and remove if needed.
  if (process.platform.match(/^win/)) {
    __dirname = __dirname.replace(/^\//, '');
  }

  // __dirname will always use '/' (URL) even on Windows
  const root = getProjectRoot(__dirname.split('/'));

  // Change to the project root in case it was called from a package folder
  // Which is the case when being called from a packages package.json
  process.chdir(root);

  const [workspace, ignores] = argv._;
  const ext = argv.js ? '.js' : '.ts';

  // Get a list of the files for the given workspace
  const files = argv.barrels
    ? await getBarrelFiles(root, workspace)
    : await getCodeFiles(root, workspace, ignores);

  if (!files.length) {
    return echo(chalk.red('No files found. Exiting.'));
  }

  const filteredFiles = files.filter(
    (f) => !f.startsWith(`${workspace}/src/index`),
  );

  return buildIndexFiles(
    root,
    ext,
    filteredFiles,
    argv.barrels ? barrelFileExports : codeFileExports,
    argv.client,
  );
});
