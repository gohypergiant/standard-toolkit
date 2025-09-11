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
import { chalk, fs, glob, path } from 'zx';

const STORY_GLOB = 'src/components/*/*.stories.tsx';

// Get target directory from command line arguments
function getTargetDirectory() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Target directory is required'));
    console.log(
      chalk.gray('Usage: node audit-stories.mjs <directory> [--ci] [--json]'),
    );
    console.log(chalk.gray('Example: node audit-stories.mjs . --ci'));
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

/**
 * Parse TypeScript/JSX file with Babel
 */
function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return babelParser.parse(content, babelOptions);
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Extract imports from AST
 */
function extractImports(ast) {
  if (ast.error) {
    return [];
  }

  return ast.program.body
    .filter((node) => node.type === 'ImportDeclaration')
    .map((node) => ({
      source: node.source.value,
      specifiers: node.specifiers.map((spec) => ({
        type: spec.type,
        imported: spec.imported?.name || spec.local.name,
        local: spec.local.name,
      })),
    }));
}

/**
 * Extract meta object configuration
 */
function extractMeta(ast) {
  if (ast.error) {
    return null;
  }

  const metaDeclaration = ast.program.body.find(
    (node) =>
      node.type === 'VariableDeclaration' &&
      node.declarations?.[0]?.id?.name === 'meta',
  );

  if (!metaDeclaration) {
    return null;
  }

  const metaObject = metaDeclaration.declarations[0].init;
  if (metaObject?.type !== 'ObjectExpression') {
    return null;
  }

  const properties = {};
  metaObject.properties.forEach((prop) => {
    if (prop.key?.name) {
      properties[prop.key.name] = extractObjectValue(prop.value);
    }
  });

  return properties;
}

/**
 * Extract value from object property (simplified)
 */
function extractObjectValue(node) {
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'ObjectExpression': {
      const obj = {};

      node.properties.forEach((prop) => {
        if (prop.key?.name) {
          obj[prop.key.name] = extractObjectValue(prop.value);
        }
      });
      return obj;
    }
    case 'ArrayExpression':
      return node.elements.map(extractObjectValue);
    case 'CallExpression':
      return { type: 'function_call', name: node.callee?.name };
    case 'SpreadElement':
      return { type: 'spread', argument: extractObjectValue(node.argument) };
    default:
      return { type: node.type };
  }
}

/**
 * Check if shared utilities are imported
 */
function checkSharedImports(imports) {
  const issues = [];
  const hasSharedControls = imports.some(
    (imp) =>
      imp.source.includes('shared-controls') &&
      imp.specifiers.some(
        (spec) => spec.imported === 'createStandardParameters',
      ),
  );

  if (!hasSharedControls) {
    issues.push({
      type: 'missing_import',
      severity: 'error',
      message:
        'Missing import for createStandardParameters from shared-controls',
      fix: "Add: import { createStandardParameters } from '^storybook/shared-controls';",
    });
  }

  return issues;
}

/**
 * Check meta object structure
 */
function checkMetaStructure(meta) {
  const issues = [];

  if (!meta) {
    issues.push({
      type: 'missing_meta',
      severity: 'error',
      message: 'Missing meta object',
      fix: 'Add meta object with title, component, and parameters',
    });
    return issues;
  }

  // Check required properties
  if (!meta.title) {
    issues.push({
      type: 'missing_title',
      severity: 'error',
      message: 'Missing title property in meta',
      fix: "Add title: 'Components/ComponentName'",
    });
  }

  if (!meta.component) {
    issues.push({
      type: 'missing_component',
      severity: 'error',
      message: 'Missing component property in meta',
      fix: 'Add component: ComponentName',
    });
  }

  if (meta.parameters) {
    // Check if parameters uses createStandardParameters
    const paramsStr = JSON.stringify(meta.parameters);
    if (
      !(
        paramsStr.includes('createStandardParameters') ||
        paramsStr.includes('function_call')
      )
    ) {
      issues.push({
        type: 'missing_standard_parameters',
        severity: 'warning',
        message: 'Parameters should use createStandardParameters',
        fix: "Use createStandardParameters('category') in parameters",
      });
    }

    // Check for docs subtitle
    if (!(meta.parameters?.docs?.subtitle || paramsStr.includes('subtitle'))) {
      issues.push({
        type: 'missing_docs_subtitle',
        severity: 'warning',
        message: 'Missing docs subtitle in parameters',
        fix: "Add docs: { subtitle: 'Brief component description' }",
      });
    }
  } else {
    issues.push({
      type: 'missing_parameters',
      severity: 'error',
      message: 'Missing parameters property in meta',
      fix: 'Add parameters with createStandardParameters and docs subtitle',
    });
  }

  // Check argTypes structure
  if (meta.argTypes) {
    const argTypesIssues = checkArgTypes(meta.argTypes);
    issues.push(...argTypesIssues);
  }

  return issues;
}

/**
 * Check argTypes structure and categorization
 */
function checkArgTypes(argTypes) {
  const issues = [];

  if (typeof argTypes !== 'object') {
    return issues;
  }

  Object.entries(argTypes).forEach(([propName, config]) => {
    if (typeof config !== 'object') {
      return;
    }

    // Check for table.category
    if (!config.table?.category) {
      issues.push({
        type: 'missing_category',
        severity: 'warning',
        message: `ArgType '${propName}' missing table.category`,
        fix: `Add table: { category: 'Visual|Behavior|Layout|Features|State|Content|Styling' }`,
      });
    }

    // Check for description
    if (!config.description) {
      issues.push({
        type: 'missing_description',
        severity: 'info',
        message: `ArgType '${propName}' missing description`,
        fix: `Add description: 'Brief description of the prop'`,
      });
    }

    // Check for default value summary
    if (config.control && !config.table?.defaultValue?.summary) {
      issues.push({
        type: 'missing_default_summary',
        severity: 'info',
        message: `ArgType '${propName}' missing default value summary`,
        fix: `Add table: { defaultValue: { summary: 'defaultValue' } }`,
      });
    }
  });

  return issues;
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
  const issues = [];

  // Check imports
  issues.push(...checkSharedImports(imports));

  // Check meta structure
  issues.push(...checkMetaStructure(meta, filePath));

  return Promise.resolve({
    file: filePath,
    component: componentName,
    issues,
    meta: meta ? Object.keys(meta) : [],
    imports: imports.map((imp) => imp.source),
  });
}

/**
 * Generate audit report
 */
function generateReport(results) {
  const totalFiles = results.length;
  const totalIssues = results.reduce(
    (sum, result) => sum + result.issues.length,
    0,
  );
  const errorCount = results.reduce(
    (sum, result) =>
      sum + result.issues.filter((issue) => issue.severity === 'error').length,
    0,
  );
  const warningCount = results.reduce(
    (sum, result) =>
      sum +
      result.issues.filter((issue) => issue.severity === 'warning').length,
    0,
  );
  const infoCount = results.reduce(
    (sum, result) =>
      sum + result.issues.filter((issue) => issue.severity === 'info').length,
    0,
  );

  // Group by severity
  const errorFiles = results.filter((result) =>
    result.issues.some((issue) => issue.severity === 'error'),
  );
  const warningFiles = results.filter(
    (result) =>
      result.issues.some((issue) => issue.severity === 'warning') &&
      !result.issues.some((issue) => issue.severity === 'error'),
  );
  const cleanFiles = results.filter((result) => result.issues.length === 0);

  if (errorFiles.length > 0) {
    console.log(chalk.red.bold('🚨 FILES WITH ERRORS:'));
    errorFiles.forEach((result) => {
      console.log(
        chalk.red(
          `\n❌ ${result.component} (${path.relative(process.cwd(), result.file)})`,
        ),
      );
      result.issues
        .filter((issue) => issue.severity === 'error')
        .forEach((issue) => {
          console.log(chalk.red(`   • ${issue.message}`));
          console.log(chalk.gray(`     Fix: ${issue.fix}`));
        });
    });
  }

  if (warningFiles.length > 0) {
    console.log(chalk.yellow.bold('\n⚠️  FILES WITH WARNINGS:'));
    warningFiles.forEach((result) => {
      console.log(
        chalk.yellow(
          `\n⚠️  ${result.component} (${path.relative(process.cwd(), result.file)})`,
        ),
      );
      result.issues
        .filter((issue) => issue.severity === 'warning')
        .forEach((issue) => {
          console.log(chalk.yellow(`   • ${issue.message}`));
          console.log(chalk.gray(`     Fix: ${issue.fix}`));
        });
    });
  }

  if (cleanFiles.length > 0) {
    console.log(chalk.green.bold('\n✅ STANDARDIZED FILES:'));
    cleanFiles.forEach((result) => {
      console.log(chalk.green(`✅ ${result.component}`));
    });
  }

  return {
    errorCount,
    infoCount,
    success: errorCount === 0,
    summary(location) {
      console.log(chalk.bold.blue('\n📊 STORYBOOK AUDIT REPORT\n'));
      console.log(`${chalk.gray('Location:')} ${location}`);
      console.log(`${chalk.gray('Files audited:')} ${totalFiles}`);
      console.log('');
      console.log(`${chalk.red('Errors:')} ${errorCount}`);
      console.log(`${chalk.yellow('Warnings:')} ${warningCount}`);
      console.log(`${chalk.blue('Info:')} ${infoCount}\n`);
      console.log(`${chalk.gray('Total issues:')} ${totalIssues}\n`);
    },
    totalFiles,
    totalIssues,
    warningCount,
  };
}

/**
 * Main audit function
 */
async function auditStories() {
  console.log(chalk.blue('🔍 Auditing Storybook structure...\n'));

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
    report.summary(path.resolve(targetDir).replace(path.resolve('$HOME'), ''));
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
