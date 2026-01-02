#!/usr/bin/env node

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

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

// NOTE: the "coverage" directory inside the project to look for coverage data in
const COVERAGE = 'coverage';
// NOTE: the directory at the root level to store the results in; "coverage"
// NOTE: using "coverage" is convenient since it is already an ignored directory
const OUTPUT_DIR = 'coverage';

const emptyStats = () => ({
  lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
  statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
  functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
  branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
});
const getPackageContent = async (pkg) =>
  JSON.parse(await fs.readFile(path.join(process.cwd(), pkg)));

async function getPackageFiles() {
  const args = [
    'ls-files',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    '**/package.json',
  ];
  const { stdout } = await execFileP('git', args);
  const results = stdout.trim().split(/\r?\n/).filter(Boolean);

  if (!results.length) {
    throw new Error('No package files found');
  }

  return results;
}

async function main() {
  const packages = await getPackageFiles();
  const summary = {};

  for (const pkg of packages) {
    const pkgDir = path.dirname(pkg);
    const coveragePath = path.join(pkgDir, COVERAGE, 'coverage-summary.json');

    try {
      const { name } = await getPackageContent(pkg); // should not be able to fail!
      const content = await fs.readFile(coveragePath, 'utf8');
      const json = JSON.parse(content);

      summary[pkgDir] = {
        name,
        ...(json.total ?? emptyStats()),
      };
    } catch (_e) {
      // File doesn't exist or is unreadable — fall back to empty/defaults
      summary[pkgDir] = emptyStats();
    }
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const outputFile = path.join(
    OUTPUT_DIR,
    `${process.argv[2] || ''}coverage-summary.json`,
  );

  await fs.writeFile(outputFile, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Wrote ${outputFile}`);
}

main().catch((err) => {
  console.error('❌ Failed to generate summary:', err);
  process.exit(1);
});
