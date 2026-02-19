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
 * Uses ancestorTitles array from Vitest JSON output to extract structured data.
 * ancestorTitles: ["Button Interactive States", "dark mode", "filled / accent / medium"]
 * title: "hover state"
 * → { component: "Button", theme: "dark", variant: "filled / accent / medium", state: "hover state" }
 */

/**
 * Parse a test assertion into structured components using ancestorTitles + title.
 *
 * Vitest v4 uses space-separated fullName (no " > " delimiters), so we rely on
 * the ancestorTitles array which preserves the describe() nesting structure.
 */
function parseAssertion(assertion) {
  const ancestors = assertion.ancestorTitles || [];
  const title = assertion.title || '';

  // ancestorTitles[0]: "Component Interactive States" or "Component"
  let component = 'Unknown';
  if (ancestors[0]) {
    component = ancestors[0].replace(/\s*Interactive States$/i, '').trim();
    if (!component) {
      const match = ancestors[0].match(/^(\w+)/);
      if (match) component = match[1];
    }
  }

  // ancestorTitles[1]: "dark mode" or "light mode"
  let theme = 'unknown';
  if (ancestors[1]) {
    const modePart = ancestors[1].toLowerCase();
    if (modePart.includes('dark')) theme = 'dark';
    else if (modePart.includes('light')) theme = 'light';
  }

  // ancestorTitles[2]: variant (e.g., "filled / accent / medium", "cozy")
  const variant = ancestors[2] || 'default';

  // title: state (e.g., "hover state", "default state")
  const state = title || 'default';

  // Reconstruct fullName with " > " for display
  const fullName = [...ancestors, title].filter(Boolean).join(' > ');

  return { component, theme, variant, state, fullName };
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

/**
 * Analyze failure patterns to suggest a likely root cause.
 */
function analyzeRootCause(failures, groupedByComponent, groupedByTheme) {
  if (failures.length === 0) return null;

  const componentNames = Object.keys(groupedByComponent);
  const themeNames = Object.keys(groupedByTheme);

  // Single component with many failures → likely that component changed
  for (const [comp, count] of Object.entries(groupedByComponent)) {
    if (count >= 20 || (count >= failures.length * 0.8 && count >= 3)) {
      return `Likely root cause: changes to ${comp}`;
    }
  }

  // All failures share one theme → theme token issue
  const nonUnknownThemes = themeNames.filter((t) => t !== 'unknown');
  if (
    nonUnknownThemes.length === 1 &&
    groupedByTheme[nonUnknownThemes[0]] === failures.length
  ) {
    const theme = nonUnknownThemes[0];
    return `All failures in ${theme} mode — check ${theme} theme tokens`;
  }

  // Many components, many themes → widespread regression
  if (componentNames.length >= 3 && failures.length >= 5) {
    return 'Widespread regression — likely a foundation/token change';
  }

  return null;
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
    // Extract relative file path (strip absolute prefix up to apps/next/)
    const rawName = testFile.name || '';
    const appsIdx = rawName.indexOf('apps/next/');
    const relativeFile = appsIdx >= 0 ? rawName.slice(appsIdx + 'apps/next/'.length) : rawName;

    for (const assertion of testFile.assertionResults) {
      if (assertion.status === 'failed') {
        const parsed = parseAssertion(assertion);

        // Extract error message
        const errorMessages = assertion.failureMessages || [];
        const errorSummary = summarizeError(errorMessages[0]);

        failures.push({
          component: parsed.component,
          file: relativeFile,
          theme: parsed.theme,
          variant: parsed.variant,
          state: parsed.state,
          fullName: parsed.fullName,
          screenshotDir: getScreenshotDir(parsed.component),
          errorSummary,
        });

        // Group by component
        groupedByComponent[parsed.component] =
          (groupedByComponent[parsed.component] || 0) + 1;
      }
    }
  }

  // Group by theme
  const groupedByTheme = {};
  for (const f of failures) {
    groupedByTheme[f.theme] = (groupedByTheme[f.theme] || 0) + 1;
  }

  // Determine root cause hint
  const rootCauseHint = analyzeRootCause(
    failures,
    groupedByComponent,
    groupedByTheme,
  );

  const result = {
    summary,
    failures,
    groupedByComponent,
    groupedByTheme,
    rootCauseHint,
  };

  // Output compact JSON to avoid multiline issues in GitHub Actions outputs
  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error('Failed to parse VRT failures:', err);
  process.exit(1);
});
