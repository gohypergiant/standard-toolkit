#!/usr/bin/env zx

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

import { createRequire } from 'node:module';
import { URL } from 'node:url';
import { default as babelParser } from '@babel/parser';
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

const baseBabelOpt = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
};

const sortByName = (p1, p2) =>
  p1.name > p2.name ? 1 : p1.name < p2.name ? -1 : 0;

const hasNodeModules = (dirPath, pathSegs) =>
  fs.existsSync(dirPath) && !pathSegs.includes('node_modules');

function getProjectRoot(pathSegs) {
  if (!pathSegs.length) {
    throw Error('Could not find project root.');
  }

  const nodeModulesPath = pathSegs.concat(['node_modules']).join('/');

  return hasNodeModules(nodeModulesPath, pathSegs)
    ? pathSegs.join('/')
    : getProjectRoot(pathSegs.slice(0, -1));
}

function getWorkspaceGlob(root) {
  const packageFile = require(`${root}/package.json`);
  const workspaces = packageFile.workspaces.map((w) => w.replace('/*', ''));

  return workspaces.length > 1
    ? `{${workspaces.join(',')}}/**`
    : `${workspaces[0]}/**`;
}

/** Generates an AST from the given file */
async function getAST(filePath) {
  const contents = await fs.readFile(filePath, 'utf-8');

  // We want to ignore any file that starts with `// __private-exports` so that the
  // developer has the autonomy to either bubble up barrels or skip that step.
  // or to just ignore code files altogether.
  // * NOTE: This will probably supercede the need for the "ignore" flag
  if (contents.match(PRIVATE_REGEX)) {
    return;
  }

  return babelParser.parse(contents, {
    ...baseBabelOpt,
    sourceFilename: filePath,
  });
}

/** Filters the AST body to just code export nodes */
const getCodeExports = (ast) =>
  ast.program.body.filter(
    (node) =>
      node.type === 'ExportNamedDeclaration' && node.exportKind !== 'type',
  );

/** Filters the AST body to just type export nodes */
const getTypeExports = (ast) =>
  ast.program.body.filter(
    (node) =>
      node.type === 'ExportNamedDeclaration' && node.exportKind === 'type',
  );

/** Get all of the exports from the given *code* file. Split between code and type */
async function codeFileExports(filePath) {
  const ast = await getAST(filePath);

  if (!ast) {
    return { code: [], types: [] };
  }

  // ---------------- Code Exports -------------------------
  const codeExports = getCodeExports(ast);

  // If it doesnt have `declaration` it is probably a re-export
  const codeNames = codeExports
    .flatMap((node) =>
      node.declaration?.type === 'TSEnumDeclaration' ||
      node.declaration?.type === 'FunctionDeclaration' ||
      node.declaration?.type === 'ClassDeclaration'
        ? [node.declaration?.id.name]
        : node.declaration?.declarations?.map((dec) => dec.id.name),
    )
    .filter(Boolean)
    .sort();

  // ---------------- Type Exports -------------------------
  const typeExports = getTypeExports(ast);

  // If it doesnt have `declaration` it is probably a re-export
  const typeNames = typeExports
    .map((node) => node.declaration?.id.name)
    .filter(Boolean)
    .sort();

  return { code: codeNames, types: typeNames };
}

/** Get all of the exports from the given *barrel* file. Split between code and type */
async function barrelFileExports(filePath) {
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
          ? `type ${spec.exported.name}`
          : spec.exported.name,
      ),
    )
    .filter(Boolean)
    .sort();

  // ---------------- Type Exports -------------------------
  const typeExports = getTypeExports(ast);

  const typeNames = typeExports
    .flatMap((node) => node.specifiers.map((spec) => spec.exported.name))
    .filter(Boolean)
    .sort();

  // Since there might be some `{ type SomeType }`s in the code array, we want to
  // swap thos into the type array.
  const typeFromCode = codeNames
    .filter((e) => e.startsWith('type '))
    .map((e) => e.replace('type ', ''));

  const filteredCodeNames = codeNames.filter((e) => !e.startsWith('type '));

  typeNames.push(...typeFromCode);

  return { code: filteredCodeNames, types: typeNames };
}

/** Get a tree structure of the files with their exports */
async function getFileTree(root, assets, parserFn) {
  const tree = { root: {} };

  for (const assetPath of assets) {
    const parts = assetPath.split('/');
    const file = parts.pop();

    let branch = tree;
    let partPath = '';

    for (const part of parts) {
      partPath += `${part}/`;

      if (partPath === `${part}/`) {
        tree.root[partPath] = tree[partPath] ??= { name: part, children: [] };
      } else if (tree[partPath] === undefined) {
        tree[partPath] = { name: part, type: 'dir', children: [] };
        branch.children.push(tree[partPath]);
      }

      branch = tree[partPath];
    }

    const exports = await parserFn(path.resolve(root, assetPath));

    branch.children.push({
      name: file,
      type: 'file',
      path: assetPath,
      exports,
    });
  }

  return Object.values(tree.root);
}

/** Convert the leave exports into ESM export statements */
function aggregateExports(children, packageRoot) {
  const exports = [];
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
async function getCodeFiles(root, workspace, ignores) {
  const ignoreList = ignores
    ? ignores.split(',').map((f) => `**/${f.trim()}`)
    : [];

  const workspaceGlob = workspace ? workspace : await getWorkspaceGlob(root);
  const globPattern = `${workspaceGlob}/src/**/*.{ts,tsx,js,jsx}`;
  const ignorePattern = [...IGNORE_LIST, ...ignoreList];

  return glob(globPattern, { ignore: ignorePattern, cwd: root });
}

/** Get a list of *barrel* files */
async function getBarrelFiles(root, workspace) {
  const workspaceGlob = workspace ? workspace : await getWorkspaceGlob(root);
  const globPattern = `${workspaceGlob}/src/**/index.{ts,tsx,js,jsx}`;

  return glob(globPattern, { ignore: IGNORE_LIST, cwd: root });
}

/** Get all of the export statements for all of the workspaces */
function getNewExportList(root, tree) {
  const indexes = [];

  for (const workspace of tree) {
    for (const wsPackage of workspace.children) {
      // path.join will use path.sep as the join character. Thats not needed in this case
      // and ends of breaking the script (Windows). So replace all path.sep with just '/'
      const packageDir = path
        .join(workspace.name, wsPackage.name, 'src')
        .replaceAll(path.sep, '/');

      const absOutDir = path.join(root, packageDir).replaceAll(path.sep, '/');

      const outFile = path
        .join(absOutDir, 'index.ts')
        .replaceAll(path.sep, '/');

      // If this was a multi-project, general use script we would loop again.
      // Skip to the `src` folder's children
      const exportList = aggregateExports(
        wsPackage.children.at(0).children,
        packageDir,
      );

      indexes.push([outFile, exportList]);
    }
  }

  return indexes;
}

/** Write the index files for all of the workspaces */
function writeAllIndexes(indexes, ext, client) {
  return Promise.all(
    indexes.map(([file, content]) => {
      const newFile = file.replace(EXT_REGEX, ext);

      echo(chalk.green(`Writing ${content.length} exports in ${newFile}...`));

      const body = (client ? [CLIENT_DIRECTIVE] : [])
        .concat([HEADER_MSG, BIOME_IGNORE, ...content])
        .join('\n');

      fs.writeFile(newFile, body, 'utf-8');

      return $`pnpm biome format ${newFile} --write`;
    }),
  );
}

/** Build the index files for the workspaces */
async function buildIndexFiles(root, ext, files, parserFn, client) {
  const tree = await getFileTree(root, files, parserFn);

  const indexes = getNewExportList(root, tree);

  await writeAllIndexes(indexes, ext, client);
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
