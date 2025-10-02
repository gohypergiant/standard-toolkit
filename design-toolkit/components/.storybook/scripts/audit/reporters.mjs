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

import { chalk, path } from 'zx';

/**
 * Generate audit report
 */
export function generateReport(results) {
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
  const infoFiles = results.filter(
    (result) =>
      result.issues.some((issue) => issue.severity === 'info') &&
      !result.issues.some((issue) => issue.severity === 'error') &&
      !result.issues.some((issue) => issue.severity === 'warning'),
  );

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

  // Show info issues when there are no errors or warnings
  if (errorCount === 0 && warningCount === 0 && infoFiles.length > 0) {
    console.log(chalk.blue.bold('\nℹ️  FILES WITH INFO SUGGESTIONS:'));
    infoFiles.forEach((result) => {
      console.log(
        chalk.blue(
          `\nℹ️  ${result.component} (${path.relative(process.cwd(), result.file)})`,
        ),
      );
      result.issues
        .filter((issue) => issue.severity === 'info')
        .forEach((issue) => {
          console.log(chalk.blue(`   • ${issue.message}`));
          console.log(chalk.gray(`     Fix: ${issue.fix}`));
        });
    });
  }

  return {
    errorCount,
    infoCount,
    success: errorCount === 0,
    summary(location) {
      console.log(chalk.bold.blue('\nSTORYBOOK AUDIT REPORT\n'));
      console.log(`${chalk.red('Errors:')} ${errorCount}`);
      console.log(`${chalk.yellow('Warnings:')} ${warningCount}`);
      console.log(`${chalk.blue('Info:')} ${infoCount}\n`);
      console.log(`${chalk.gray('Total issues:')} ${totalIssues}`);
      console.log(`${chalk.gray('Total files:')} ${totalFiles}`);
      console.log(`${chalk.gray('Location:')} ${location}`);
    },
    totalFiles,
    totalIssues,
    warningCount,
  };
}
