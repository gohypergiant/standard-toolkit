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

import * as path from 'node:path';
import { test as base, expect, type Page } from '@playwright/test';
import { analyzeSnapshots } from '../lib/analyzer';
import { getCachedConfig } from '../lib/config';
import { HeapSnapshotCollector } from '../lib/heap-snapshot';
import type { AnalysisResult } from '../lib/types';

/**
 * Custom fixtures for MemLab memory leak testing
 */
export interface MemlabTestFixtures {
  /** Heap snapshot collector instance */
  collector: HeapSnapshotCollector;
  /** Name of the component being tested */
  componentName: string;
  /** Function to analyze collected snapshots */
  analyzeResult: () => Promise<AnalysisResult>;
  /** Whether to update baseline with current results */
  updateBaseline: boolean;
}

/**
 * Extended Playwright test with MemLab fixtures
 *
 * Provides:
 * - `collector`: HeapSnapshotCollector for capturing heap snapshots
 * - `componentName`: The name of the component under test
 * - `analyzeResult`: Function to finalize snapshots and run MemLab analysis
 */
export const test = base.extend<MemlabTestFixtures>({
  // Component name is set via test.use({ componentName: 'drawer' })
  componentName: ['unknown', { option: true }],

  // Whether to update baseline (set via env var or test.use)
  updateBaseline: [process.env.UPDATE_BASELINE === 'true', { option: true }],

  // Create a new HeapSnapshotCollector for each test
  collector: async ({ page, componentName }, use) => {
    const config = getCachedConfig();
    const outputDir = path.join(
      config.snapshotDir,
      componentName,
      Date.now().toString(),
    );

    const collector = new HeapSnapshotCollector(outputDir, componentName);
    await collector.initialize(page);

    await use(collector);
  },

  // Provide analysis function that finalizes and analyzes snapshots
  analyzeResult: async ({ collector, componentName, updateBaseline }, use) => {
    const config = getCachedConfig();

    const analyze = async (): Promise<AnalysisResult> => {
      const snapshotDir = await collector.finalize();

      return analyzeSnapshots(snapshotDir, {
        componentName,
        thresholdFile: config.thresholdFile,
        outputDir: config.reportsDir,
        baselineFile: config.baselineFile,
        updateBaseline,
      });
    };

    await use(analyze);
  },
});

export { expect };

/**
 * Helper to force garbage collection in the browser
 *
 * Note: This requires Chrome to be launched with --js-flags=--expose-gc
 */
export async function forceGC(page: Page) {
  await page.evaluate(() => {
    // gc is exposed via --js-flags=--expose-gc Chrome flag
    if (typeof gc !== 'undefined') {
      gc();
    }
  });
}

/**
 * Helper to wait for a brief period to allow React cleanup
 */
export async function waitForCleanup(page: Page, ms = 500) {
  await page.waitForTimeout(ms);
}
