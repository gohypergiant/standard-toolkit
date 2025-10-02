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

import { chalk, fs, glob, path } from 'zx';
import { parseFile } from './ast-parsers.mjs';
import { STORY_GLOB } from './config.mjs';
import {
  extractExportedStories,
  extractImports,
  extractMeta,
} from './extractors.mjs';
import { generateReport } from './reporters.mjs';
import { checkDefaultStoryExport, checkMetaStructure } from './validators.mjs';

// Get target directory from command line arguments
function getTargetDirectory() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Target directory is required'));
    console.log(
      chalk.gray(
        'Usage: node ./.storybook/scripts/audit/index.mjs <directory> [--ci] [--json]',
      ),
    );
    console.log(
      chalk.gray('Example: node ./.storybook/scripts/audit/index.mjs . --ci'),
    );
    process.exit(1);
  }

  const targetDir = args[0];
  if (!fs.existsSync(targetDir)) {
    console.error(
      chalk.red(`❌ Error: Directory "${targetDir}" does not exist`),
    );
    process.exit(1);
  }

  return targetDir;
}

/**
 * Audit a single story file
 */
function auditStoryFile(filePath) {
  const componentName = path.basename(path.dirname(filePath));
  const ast = parseFile(filePath);

  if (ast.error) {
    return Promise.resolve({
      file: filePath,
      component: componentName,
      issues: [
        {
          type: 'parse_error',
          severity: 'error',
          message: `Failed to parse file: ${ast.error}`,
          fix: 'Fix syntax errors in the file',
        },
      ],
    });
  }

  const imports = extractImports(ast);
  const meta = extractMeta(ast);
  const storyExports = extractExportedStories(ast);
  const issues = [];

  // Check meta structure
  issues.push(...checkMetaStructure(meta, filePath));

  // Check for Default story export
  issues.push(...checkDefaultStoryExport(storyExports));

  return Promise.resolve({
    file: filePath,
    component: componentName,
    issues,
    meta: meta ? Object.keys(meta) : [],
    imports: imports.map((imp) => imp.source),
    storyExports,
  });
}

/**
 * Main audit function
 */
async function auditStories() {
  const targetDir = getTargetDirectory();

  const storyFiles = await glob(STORY_GLOB, {
    cwd: targetDir,
    absolute: true,
  });

  if (storyFiles.length === 0) {
    console.log(chalk.yellow(`No story files found in "${targetDir}".`));
    console.log(chalk.gray(`Looking for pattern: ${STORY_GLOB}`));
    return;
  }

  const results = [];
  for (const filePath of storyFiles) {
    const result = await auditStoryFile(filePath);
    results.push(result);
  }

  const report = generateReport(results);

  if (process.argv.includes('--json')) {
    console.log(`\n${JSON.stringify(results, null, 2)}`);
  } else {
    report.summary(path.join('design-toolkit', 'components', STORY_GLOB));
  }

  if (process.argv.includes('--ci') && !report.success) {
    process.exit(1);
  }
}

// Run the audit
auditStories().catch((error) => {
  console.error(chalk.red('Audit failed:'), error);
  process.exit(1);
});
