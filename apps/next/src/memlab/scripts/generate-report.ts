#!/usr/bin/env npx tsx
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

/**
 * CLI Script to generate HTML report from MemLab JSON reports
 *
 * Usage:
 *   npx tsx src/memlab/scripts/generate-report.ts
 *   npx tsx src/memlab/scripts/generate-report.ts --output ./custom-report.html
 */

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareWithBaseline, loadBaseline } from '../lib/baseline';
import { loadReportsFromDirectory, saveHtmlReport } from '../lib/html-report';
import type { BaselineComparison } from '../lib/baseline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const defaultPath = path.join(__dirname, '../reports/memlab-report.html');
  const outputPath: string =
    outputIndex !== -1 && args[outputIndex + 1]
      ? (args[outputIndex + 1] as string)
      : defaultPath;

  const reportsDir = path.join(__dirname, '../reports');
  const baselineFile = path.join(__dirname, '../config/.memlab-baseline.json');

  console.log('📊 Generating MemLab HTML Report...');
  console.log(`   Reports directory: ${reportsDir}`);
  console.log(`   Output: ${outputPath}`);

  // Load all JSON reports
  const reports = loadReportsFromDirectory(reportsDir);

  if (reports.length === 0) {
    console.log('⚠️ No reports found. Run memlab tests first.');
    process.exit(1);
  }

  console.log(`   Found ${reports.length} component reports`);

  // Load baseline for comparison
  const baseline = loadBaseline(baselineFile);
  const comparisons: BaselineComparison[] = [];

  if (baseline) {
    console.log('   📈 Loading baseline for comparison...');
    for (const report of reports) {
      const comparison = compareWithBaseline(
        {
          status: 'success',
          leaks: report.leaks,
          totalRetainedSize: report.totalRetainedSize,
          leakCount: report.leakCount,
          passed: report.passed,
        },
        report.component,
        baseline,
      );
      if (comparison) {
        comparisons.push(comparison);
      }
    }
  }

  // Generate and save HTML report
  saveHtmlReport(reports, outputPath, baseline, comparisons);

  // Summary
  const passed = reports.filter((r) => r.passed).length;
  const failed = reports.length - passed;

  console.log('\n📋 Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (comparisons.length > 0) {
    const regressions = comparisons.filter((c) => c.isRegression).length;
    const improvements = comparisons.filter((c) => c.isImprovement).length;
    console.log(`   📈 Regressions: ${regressions}`);
    console.log(`   📉 Improvements: ${improvements}`);
  }

  console.log(`\n✨ Report generated: ${outputPath}`);
}

main();
