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

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/**
 * Extract deduplicated test file paths that contain at least one failed assertion
 * from Vitest JSON output. Prints newline-separated paths to stdout.
 *
 * Usage: node extract-failed-files.mjs <test-results.json> [--relative-to=<dir>]
 */

function parseArgs(argv) {
  let inputPath = null;
  let relativeTo = null;

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--relative-to=')) {
      relativeTo = arg.slice('--relative-to='.length);
    } else if (!inputPath) {
      inputPath = arg;
    }
  }

  return { inputPath, relativeTo };
}

async function main() {
  const { inputPath, relativeTo } = parseArgs(process.argv);

  if (!inputPath) {
    console.error(
      'Usage: node extract-failed-files.mjs <test-results.json> [--relative-to=<dir>]',
    );
    process.exit(1);
  }

  let testResults;
  try {
    const content = await fs.readFile(inputPath, 'utf8');
    testResults = JSON.parse(content);
  } catch (err) {
    console.error(`Failed to read test results: ${err.message}`);
    process.exit(1);
  }

  if (!testResults || typeof testResults !== 'object') {
    console.error('Invalid test results: expected an object');
    process.exit(1);
  }

  if (!Array.isArray(testResults.testResults)) {
    console.error('Invalid test results: missing or invalid testResults array');
    process.exit(1);
  }

  const failedFiles = new Set();

  for (const testFile of testResults.testResults) {
    if (!testFile || !Array.isArray(testFile.assertionResults)) {
      continue;
    }

    const hasFailed = testFile.assertionResults.some(
      (assertion) => assertion.status === 'failed',
    );

    if (hasFailed && testFile.name) {
      let filePath = testFile.name;

      if (relativeTo) {
        filePath = path.relative(relativeTo, filePath);
      }

      failedFiles.add(filePath);
    }
  }

  if (failedFiles.size > 0) {
    for (const file of failedFiles) {
      console.log(file);
    }
  }
}

main().catch((err) => {
  console.error('Failed to extract failed files:', err);
  process.exit(1);
});
