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
import process from 'node:process';

/**
 * Parse Vitest JSON output and extract failed test information.
 * Usage: node parse-vrt-failures.mjs <test-results.json>
 *
 * Parses test names like:
 * "Button Interactive States > dark mode > filled / accent / medium > hover state"
 * Into structured data: { component, theme, variant, state }
 */

/**
 * Parse a test name into structured components.
 * Format: "Component Interactive States > theme mode > variant > state"
 *
 * Examples:
 * - "Accordion Interactive States > dark mode > cozy > hover state"
 * - "Button Interactive States > light mode > filled / accent / medium > pressed state"
 */
function parseTestName(fullTitle) {
  const parts = fullTitle.split(' > ').map((s) => s.trim());

  // Part 0: Component (remove "Interactive States" suffix)
  let component = 'Unknown';
  if (parts[0]) {
    component = parts[0].replace(/\s*Interactive States$/i, '').trim();
    // If still multi-word, just take first word as component name
    if (!component) {
      const match = parts[0].match(/^(\w+)/);
      if (match) component = match[1];
    }
  }

  // Part 1: Theme (should be "dark mode" or "light mode")
  let theme = 'unknown';
  if (parts[1]) {
    const modePart = parts[1].toLowerCase();
    if (modePart.includes('dark')) {
      theme = 'dark';
    } else if (modePart.includes('light')) {
      theme = 'light';
    }
  }

  // Part 2: Variant (may have slashes like "filled / accent / medium" or simple like "cozy")
  const variant = parts[2] || 'default';

  // Part 3: State (last part, e.g., "hover state", "default state")
  const state = parts[3] || 'default';

  return { component, theme, variant, state };
}

/**
 * Extract a summary from the error message.
 * Looks for pixel diff counts or truncates long messages.
 */
function summarizeError(errorMessage) {
  if (!errorMessage) return 'Test failed';

  // Strip ANSI escape codes and control characters to prevent JSON parsing errors
  const sanitized = errorMessage
    .replace(/\x1b\[[0-9;]*m/g, '') // ANSI escape codes
    .replace(/[\x00-\x1f\x7f]/g, ' ') // Control characters -> space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  // Look for pixel difference patterns
  const pixelMatch = sanitized.match(/(\d+)\s*pixels?\s*differ/i);
  if (pixelMatch) {
    return `${pixelMatch[1]} pixels differ`;
  }

  // Look for percentage difference
  const percentMatch = sanitized.match(/(\d+(?:\.\d+)?)\s*%\s*differ/i);
  if (percentMatch) {
    return `${percentMatch[1]}% differs`;
  }

  // Look for "mismatch" patterns
  const mismatchMatch = sanitized.match(/mismatch[:\s]+(\d+(?:\.\d+)?)/i);
  if (mismatchMatch) {
    return `${mismatchMatch[1]} mismatch`;
  }

  // Truncate long messages
  if (sanitized.length > 50) {
    return sanitized.substring(0, 47) + '...';
  }

  return sanitized || 'Test failed';
}

/**
 * Infer screenshot directory from component name.
 */
function getScreenshotDir(component) {
  const kebabCase = component
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `${kebabCase}/__screenshots__/${kebabCase}.visual.tsx/`;
}

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error('Usage: node parse-vrt-failures.mjs <test-results.json>');
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

  // Validate expected Vitest JSON structure
  if (!testResults || typeof testResults !== 'object') {
    console.error('Invalid test results: expected an object');
    process.exit(1);
  }

  if (!Array.isArray(testResults.testResults)) {
    console.error('Invalid test results: missing or invalid testResults array');
    // Return empty results instead of crashing - allows workflow to continue
    const emptyResult = {
      summary: { passed: 0, failed: 0, total: 0 },
      failures: [],
      groupedByComponent: {},
    };
    console.log(JSON.stringify(emptyResult));
    process.exit(0);
  }

  const summary = {
    passed: testResults.numPassedTests ?? 0,
    failed: testResults.numFailedTests ?? 0,
    total: testResults.numTotalTests ?? 0,
  };

  const failures = [];
  const groupedByComponent = {};

  // Process test results
  for (const testFile of testResults.testResults) {
    // Validate testFile structure
    if (!testFile || !Array.isArray(testFile.assertionResults)) {
      continue;
    }
    for (const assertion of testFile.assertionResults) {
      if (assertion.status === 'failed') {
        const fullTitle = assertion.fullName || assertion.title || 'Unknown';
        const parsed = parseTestName(fullTitle);

        // Extract error message
        const errorMessages = assertion.failureMessages || [];
        const errorSummary = summarizeError(errorMessages[0]);

        failures.push({
          component: parsed.component,
          theme: parsed.theme,
          variant: parsed.variant,
          state: parsed.state,
          fullName: fullTitle,
          screenshotDir: getScreenshotDir(parsed.component),
          errorSummary,
        });

        // Group by component
        groupedByComponent[parsed.component] =
          (groupedByComponent[parsed.component] || 0) + 1;
      }
    }
  }

  const result = {
    summary,
    failures,
    groupedByComponent,
  };

  // Output compact JSON to avoid multiline issues in GitHub Actions outputs
  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error('Failed to parse VRT failures:', err);
  process.exit(1);
});
