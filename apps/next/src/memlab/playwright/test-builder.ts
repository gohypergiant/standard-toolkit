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

import { expect, forceGC, test, waitForCleanup } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Scenario definition for a memory leak test
 */
export interface TestScenario {
  /** Test name displayed in test runner */
  name: string;
  /** Optional description for documentation */
  description?: string;
  /** Setup function called before baseline snapshot */
  setup?: (page: Page) => Promise<void>;
  /** Action function called between baseline and target snapshots */
  action: (page: Page) => Promise<void>;
  /** Cleanup function called between target and final snapshots */
  cleanup?: (page: Page) => Promise<void>;
  /** Maximum expected leaks (defaults to 0) */
  expectedLeaks?: number;
  /** Custom wait time after action (defaults to standard waitForCleanup) */
  actionWaitMs?: number;
  /** Custom wait time after cleanup (defaults to standard waitForCleanup) */
  cleanupWaitMs?: number;
}

/**
 * Configuration for a component's memory leak tests
 */
export interface ComponentTestConfig {
  /** Name of the component (used for thresholds and reporting) */
  componentName: string;
  /** Path to the test page (e.g., '/button/client') */
  testPagePath: string;
  /** Selector to wait for page ready state */
  testSelector: string;
  /** Array of test scenarios to run */
  scenarios: TestScenario[];
}

/**
 * Create memory leak tests for a component using a declarative configuration
 *
 * This builder reduces boilerplate by providing a consistent structure for:
 * - Navigating to the test page
 * - Managing garbage collection and cleanup timing
 * - Taking baseline/target/final snapshots
 * - Running analysis and assertions
 *
 * @example
 * ```typescript
 * createComponentTests({
 *   componentName: 'Button',
 *   testPagePath: '/button/client',
 *   testSelector: '[data-testid="memlab-button-test"]',
 *   scenarios: [
 *     {
 *       name: 'mount/unmount cycle should not leak memory',
 *       action: async (page) => {
 *         await page.click('[data-testid="toggle-buttons"]');
 *         await page.click('[data-testid="toggle-buttons"]');
 *       },
 *     },
 *   ],
 * });
 * ```
 */
export function createComponentTests(config: ComponentTestConfig): void {
  const { componentName, testPagePath, testSelector, scenarios } = config;

  test.describe(`${componentName} Memory Leak Tests`, () => {
    test.use({ componentName: componentName.toLowerCase() });

    for (const scenario of scenarios) {
      test(scenario.name, async ({ page, collector, analyzeResult }) => {
        // Navigate to test page
        await page.goto(testPagePath);
        await page.waitForSelector(testSelector);

        // Setup phase (optional)
        if (scenario.setup) {
          await scenario.setup(page);
        }

        // Force GC and wait before baseline
        await forceGC(page);
        await waitForCleanup(page);

        // BASELINE snapshot
        await collector.takeSnapshot(page, 'baseline', 'before-action');

        // TARGET: Perform the action
        await scenario.action(page);
        await waitForCleanup(page, scenario.actionWaitMs);

        // TARGET snapshot
        await collector.takeSnapshot(page, 'target', 'after-action');

        // FINAL: Cleanup phase (optional)
        if (scenario.cleanup) {
          await scenario.cleanup(page);
        }

        // Force GC and wait before final snapshot
        await forceGC(page);
        await waitForCleanup(page, scenario.cleanupWaitMs);

        // FINAL snapshot
        await collector.takeSnapshot(page, 'final', 'after-cleanup');

        // Analyze results
        const result = await analyzeResult();
        const maxLeaks = scenario.expectedLeaks ?? 0;

        // Assert leak count is within threshold
        expect(result.leakCount).toBeLessThanOrEqual(maxLeaks);
      });
    }
  });
}

/**
 * Create a stress test scenario that rapidly mounts/unmounts a component
 *
 * @param cycles - Number of mount/unmount cycles (default: 10)
 * @param expectedLeaks - Maximum expected leaks (default: 5 for stress tests)
 */
export function createStressTestScenario(
  cycles = 10,
  expectedLeaks = 5,
): TestScenario {
  return {
    name: 'stress test: rapid mount/unmount cycles',
    description: `Rapidly toggles component ${cycles} times to detect accumulated leaks`,
    action: async (page) => {
      // Click the stress test button which handles the cycling
      await page.click('[data-testid="stress-test"]');
      // Wait for stress test to complete
      await page.waitForSelector(
        '[data-testid="stress-test"]:not([disabled])',
        {
          timeout: 30000,
        },
      );
    },
    expectedLeaks,
    actionWaitMs: 1000,
    cleanupWaitMs: 1000,
  };
}

/**
 * Create a basic mount/unmount test scenario
 *
 * @param toggleSelector - Selector for the toggle button
 * @param contentSelector - Selector to verify component is mounted/unmounted
 */
export function createMountUnmountScenario(
  toggleSelector: string,
  contentSelector?: string,
): TestScenario {
  return {
    name: 'mount/unmount cycle should not leak memory',
    description: 'Basic visibility toggle to test component cleanup',
    action: async (page) => {
      // Toggle off
      await page.click(toggleSelector);
      if (contentSelector) {
        await page
          .waitForSelector(contentSelector, { state: 'hidden', timeout: 5000 })
          // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional swallow
          .catch(() => {});
      }
      // Toggle back on
      await page.click(toggleSelector);
      if (contentSelector) {
        await page
          .waitForSelector(contentSelector, { state: 'visible', timeout: 5000 })
          // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional swallow
          .catch(() => {});
      }
    },
    expectedLeaks: 0,
  };
}
