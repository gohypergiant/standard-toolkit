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

import { default as babelParser } from '@babel/parser';
import { chalk, echo, fs, glob, path } from 'zx';

const COMPONENT_GLOB = '**/src/components/*/index.tsx';
const SOURCE_DIRS = ['design-toolkit', 'packages'];

const babelOptions = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'decorators-legacy'],
  allowImportExportEverywhere: true,
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  allowUndeclaredExports: true,
  strictMode: false,
};

// Get component name from declaration
const getComponentName = ({ declarations, id }) =>
  id?.name || declarations?.[0]?.id?.name || 'Unknown';

/**
 * Main audit function
 */
async function auditDocblocks(dirs) {
  const allIssues = [];

  for (const pattern of dirs) {
    const files = await glob(pattern);

    for (const file of files) {
      const result = checkComponentFile(file);

      if (result.issues.length > 0) {
        allIssues.push(result);
      }
    }
  }

  if (allIssues.length === 0) {
    echo(chalk.green('All components have proper docblocks!'));

    return;
  }

  echo(chalk.yellow('Found components missing proper docblocks:\n'));

  for (const { filePath, componentName, issues } of allIssues) {
    echo(chalk.cyan(`${componentName} (${filePath}):`));

    for (const issue of issues) {
      echo(`  ${issue.name}: Missing ${issue.missing.join(', ')}`);
    }

    echo('');
  }

  echo(
    chalk.blue(
      '\nConsider adding JSDoc comments with descriptions and @example tags to improve component documentation.',
    ),
  );
  echo(
    chalk.gray(`Example format:
/**
 * ComponentName - Brief description of what the component does
 *
 * Longer description explaining the component's purpose, behavior, and key features.
 * Should be at least 10 characters long and meaningful.
 *
 * @example
 * // Basic usage
 * <ComponentName>Content</ComponentName>
 *
 * @example
 * // Advanced usage
 * <ComponentName prop="value">Content</ComponentName>
 */`),
  );
}

/**
 * Extract JSDoc comment from AST node
 */
function getJSDocComment(node) {
  if (node.leadingComments) {
    return node.leadingComments.find(
      (comment) =>
        comment.type === 'CommentBlock' && comment.value.startsWith('*'),
    );
  }
}

/**
 * Check if JSDoc has required sections
 */
function validateJSDoc(jsDoc) {
  if (!jsDoc) {
    return { valid: false, missing: ['JSDoc comment'] };
  }

  const content = jsDoc.value;
  const missing = [];

  // Check for description (first line after opening)
  const lines = content
    .split('\n')
    .map((line) => line.trim().replace(/^\*\s?/, ''));
  const descriptionLine = lines.find((line) => line && !line.startsWith('@'));

  if (!descriptionLine || descriptionLine.length < 10) {
    missing.push('meaningful description');
  }

  // Check for @example
  if (!content.includes('@example')) {
    missing.push('@example tag');
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Check if a node is an exported function/component
 */
function isExportedComponent(node) {
  if (node.type !== 'ExportNamedDeclaration' || !node.declaration) {
    return false;
  }

  const declaration = node.declaration;

  return (
    declaration.type === 'FunctionDeclaration' ||
    (declaration.type === 'VariableDeclaration' &&
      declaration.declarations.some(
        (d) =>
          d.init?.type === 'ArrowFunctionExpression' ||
          d.init?.type === 'FunctionExpression',
      ))
  );
}

/**
 * Check a single component file for docblock compliance
 */
function checkComponentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const componentName = path.basename(path.dirname(filePath));

  try {
    const ast = babelParser.parse(content, babelOptions);
    const issues = [];

    // Check if AST body exists and is iterable
    const body = ast.program?.body || ast.body;
    const hasValidBody = body && Array.isArray(body);

    if (!hasValidBody) {
      return {
        filePath,
        componentName,
        issues: [
          {
            name: 'Parse Error',
            missing: ['AST body is not available or not an array'],
          },
        ],
      };
    }

    // Find exported functions/components
    for (const node of body) {
      if (isExportedComponent(node)) {
        const name = getComponentName(node.declaration);
        const jsDoc = getJSDocComment(node);
        const validation = validateJSDoc(jsDoc);

        if (!validation.valid) {
          issues.push({
            name,
            missing: validation.missing,
          });
        }
      }
    }

    return { filePath, componentName, issues };
  } catch (error) {
    return {
      filePath,
      componentName,
      issues: [{ name: 'Parse Error', missing: [error.message] }],
    };
  }
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  echo(
    `
${chalk.blue('Docblock Audit Script')}

${chalk.bold('Usage:')}
  pnpm zx scripts/audit-docblocks.mjs [filter]   # Direct execution
  pnpm run audit:docblocks [filter]              # Via package script

${chalk.bold('Examples:')}
  pnpm run audit:docblocks                       # All source directories
  pnpm run audit:docblocks design-toolkit        # Filter by directory name

${chalk.bold('Options:')}
  -h, --help                                     # Show this help message

${chalk.bold('Description:')}
  Audits React components for proper JSDoc documentation with meaningful
  descriptions and @example tags. Scans: ${chalk.cyan(SOURCE_DIRS.join(', '))}
  `.trim(),
  );
  process.exit(0);
}

const filter = process.argv.at(3);
const dirs = SOURCE_DIRS
  // apply filter if provided
  .filter((str) => !filter || str.includes(filter))
  // format glob string
  .map((dir) => `${dir}/${COMPONENT_GLOB}`);

echo(chalk.blue('🔍 Auditing component docblocks...\n'));

await auditDocblocks(dirs);
