#!/usr/bin/env zx

import { glob, path, chalk } from 'zx';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { parseFileSync } from '@swc/core';

const HEADER_MSG =
  '/**\n * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.\n */\n\n';

const INDEX_REGEX = /[\\/]index\.[tj]sx?$/;
const EXT_REGEX = /\.[tj]sx?$/;
const PRIVATE_REGEX = /^\/\/ __private-exports\n/;

const IGNORE_LIST = [
  '**/node_modules',
  '**/dist',
  '**/__{fixtures,fixture,mocks,mock,tests,test}__',
  '**/*.{bench,spec,test,test-d,stories}.*',
  '**/examples.*',
];

async function getFirstLine(pathToFile) {
  const readable = createReadStream(pathToFile);
  const reader = createInterface({ input: readable });
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  return line;
}

function parse(file) {
  return parseFileSync(file, {
    syntax: 'typescript',
    target: 'es2022',
    tsx: true,
  });
}

function getExports(ast) {
  return ast.body.filter((node) => {
    return (
      node.type === 'ExportDeclaration' &&
      node.declaration.type !== 'TsTypeAliasDeclaration' &&
      node.declaration.type !== 'TsInterfaceDeclaration'
    );
  });
}

function getTypeExports(ast) {
  return ast.body.filter((node) => {
    return (
      node.type === 'ExportDeclaration' &&
      (node.declaration.type === 'TsTypeAliasDeclaration' ||
        node.declaration.type === 'TsInterfaceDeclaration')
    );
  });
}

function isOnlyExports(ast) {
  return ast.body.every((node) => {
    return node.type === 'ExportNamedDeclaration' && node?.specifiers?.length;
  });
}

function extractExportName(node) {
  switch (node.declaration.type) {
    case 'VariableDeclaration':
    case 'ExportDeclaration':
      return node.declaration.declarations.map((decl) => decl.id.value);
    case 'FunctionDeclaration':
      return node.declaration.identifier.value;
    case 'TsTypeAliasDeclaration':
    case 'TsInterfaceDeclaration':
      return node.declaration.id.value;
  }
}

function nameSortFn(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

function createExportNames(nodes) {
  return nodes
    .flatMap(extractExportName)
    .filter(Boolean)
    .sort(nameSortFn)
    .join(', ');
}

// Scan for all index.{ts,js} files recursively
const potentialNotJustExports = await glob(
  ['packages/**/src/**/*.{ts,tsx,js,jsx}'],
  {
    ignore: IGNORE_LIST,
  },
);

// Collect existing export only index.ts files to include in ignore list
const additionalIgnores = potentialNotJustExports.filter(async (file) => {
  const firstLine = await getFirstLine(file);
  const ast = parse(file);

  // console.log(firstLine.match(PRIVATE_REGEX));

  return !firstLine.match(PRIVATE_REGEX);
});

console.log(additionalIgnores.join('\n'));

// We now add an additional list of files to ignore
const filesToScan = await glob(['packages/**/src/**/*.{ts,tsx,js,jsx}'], {
  ignore: [...IGNORE_LIST, ...additionalIgnores],
});

// console.log(filesToScan.join('\n'));

const insertions = new Map();

for (const file of filesToScan) {
  const ast = parse(file);

  // Split regular exports from type exports
  const regularExports = getExports(ast);
  const typeExports = getTypeExports(ast);

  // Find nearest parent index.ts
  const ascendent = path.join(`${path.dirname(file)}/../index.ts`);
  const importPath = path
    .relative(ascendent, file)
    .replace(INDEX_REGEX, '')
    .replace(EXT_REGEX, '')
    .replace('..', '.');

  const regularExportNames = createExportNames(regularExports);
  const typeExportNames = createExportNames(typeExports);

  const priorInsertions = insertions.get(ascendent) ?? '';
  const updates = [priorInsertions];

  if (regularExportNames.length) {
    const exportInsertions = `export { ${regularExportNames} } from '${importPath}';`;
    updates.push(exportInsertions);
  }

  if (typeExportNames.length) {
    const exportTypeInsertions = `export type { ${typeExportNames} } from '${importPath}';`;
    updates.push(exportTypeInsertions);
  }

  insertions.set(ascendent, updates.join('\n'));
}

// NOTE: Staging the theoretical output
// TODO: run files through biome
for (const [key, value] of insertions) {
  console.log(chalk.dim('Will write to:'), chalk.blue(key));
  console.log(
    chalk.dim('Will add export(s):\n'),
    chalk.blue(`${HEADER_MSG}${value}`),
  );
  console.log('\n');
}

insertions.clear();
