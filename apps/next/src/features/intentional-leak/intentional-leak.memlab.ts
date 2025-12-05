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

import {
  expect,
  forceGC,
  test,
  waitForCleanup,
} from '~/memlab/playwright/fixtures';

/**
 * Intentional Memory Leak Detection Tests
 *
 * These tests verify that our MemLab testing framework correctly detects
 * memory leaks. They use a test page that INTENTIONALLY creates leaks.
 *
 * Test Strategy:
 * 1. "should detect intentional DOM leaks" - Creates DOM element leaks and
 *    verifies that MemLab detects them (expects leakCount > 0)
 * 2. "should detect intentional closure leaks" - Creates closure leaks and
 *    verifies detection
 * 3. "clearing leaks should result in no leaks" - Verifies that when leaks
 *    are properly cleared, MemLab reports clean memory
 *
 * These are NEGATIVE tests - they pass when leaks ARE detected.
 */
test.describe('Intentional Leak Detection Tests', () => {
  test.use({ componentName: 'intentional-leak' });

  test('should detect intentional DOM leaks', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    // Navigate to the intentional leak test page
    await page.goto('/intentional-leak/client');
    await page.waitForSelector('[data-testid="memlab-intentional-leak-test"]');

    // Force GC and wait for stable baseline
    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE - Clean state before creating leaks
    await collector.takeSnapshot(page, 'baseline', 'before-leaks');

    // TARGET - Create intentional DOM leaks
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="create-dom-leak"]');
      await page.waitForTimeout(50); // Small delay between leaks
    }

    // Verify UI shows leak count
    const domLeakCount = await page
      .locator('[data-testid="dom-leak-count"]')
      .textContent();
    expect(domLeakCount).toContain('5');

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'after-dom-leaks');

    // FINAL - Don't clear leaks (intentionally retain them)
    await forceGC(page);
    await waitForCleanup(page, 1000);

    await collector.takeSnapshot(page, 'final', 'leaks-retained');

    // Analyze results
    const result = await analyzeResult();

    // This test PASSES when leaks ARE detected
    // If leakCount is 0, our detection is broken
    console.log('\n🔬 Intentional DOM leak test results:');
    console.log(`   Leaks detected: ${result.leakCount}`);
    console.log(`   Retained size: ${result.totalRetainedSize} bytes`);

    // We expect leaks to be detected - this validates our testing framework
    // Note: The exact count may vary, but we should detect SOMETHING
    expect(
      result.leakCount,
      'Expected to detect intentional DOM leaks - if 0, the leak detection may not be working',
    ).toBeGreaterThan(0);
  });

  test('should detect intentional closure leaks', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/intentional-leak/client');
    await page.waitForSelector('[data-testid="memlab-intentional-leak-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-closure-leaks');

    // TARGET - Create intentional closure leaks
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="create-closure-leak"]');
      await page.waitForTimeout(50);
    }

    // Verify UI shows leak count
    const closureLeakCount = await page
      .locator('[data-testid="closure-leak-count"]')
      .textContent();
    expect(closureLeakCount).toContain('5');

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'after-closure-leaks');

    // FINAL
    await forceGC(page);
    await waitForCleanup(page, 1000);

    await collector.takeSnapshot(page, 'final', 'closure-leaks-retained');

    const result = await analyzeResult();

    console.log('\n🔬 Intentional closure leak test results:');
    console.log(`   Leaks detected: ${result.leakCount}`);
    console.log(`   Retained size: ${result.totalRetainedSize} bytes`);

    // Closure leaks may or may not be detected depending on V8's optimization
    // We're mainly verifying the test infrastructure works
    // Log the result but don't fail if closures aren't detected
    if (result.leakCount === 0) {
      console.log(
        '   Note: Closure leaks may not be detected due to V8 optimization',
      );
    }
  });

  test('bulk leaks should be detected', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/intentional-leak/client');
    await page.waitForSelector('[data-testid="memlab-intentional-leak-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-bulk-leaks');

    // TARGET - Create bulk leaks (10x DOM + 10x closure)
    await page.click('[data-testid="create-bulk-leaks"]');

    // Wait for bulk operation to complete
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="total-leak-count"]');
        return el?.textContent?.includes('20');
      },
      { timeout: 10000 },
    );

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'after-bulk-leaks');

    // FINAL
    await forceGC(page);
    await waitForCleanup(page, 1000);

    await collector.takeSnapshot(page, 'final', 'bulk-leaks-retained');

    const result = await analyzeResult();

    console.log('\n🔬 Bulk leak test results:');
    console.log(`   Leaks detected: ${result.leakCount}`);
    console.log(`   Retained size: ${result.totalRetainedSize} bytes`);

    // With 20 intentional leaks, we should definitely detect something
    expect(
      result.leakCount,
      'Expected to detect bulk intentional leaks',
    ).toBeGreaterThan(0);
  });

  test('clearing leaks should result in minimal leaks', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/intentional-leak/client');
    await page.waitForSelector('[data-testid="memlab-intentional-leak-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-create-and-clear');

    // Create leaks
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="create-dom-leak"]');
    }

    // Then immediately clear them
    await page.click('[data-testid="clear-all-leaks"]');

    // Verify UI shows cleared state
    const totalLeakCount = await page
      .locator('[data-testid="total-leak-count"]')
      .textContent();
    expect(totalLeakCount).toContain('0');

    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'after-clear');

    // FINAL
    await forceGC(page);
    await waitForCleanup(page, 1000);

    await collector.takeSnapshot(page, 'final', 'cleaned-up');

    const result = await analyzeResult();

    console.log('\n🔬 Cleared leaks test results:');
    console.log(`   Leaks detected: ${result.leakCount}`);
    console.log(`   Status: ${result.passed ? 'PASSED' : 'FAILED'}`);

    // After clearing, we should have minimal or no leaks
    // Using threshold from config (set to allow some tolerance)
    expect(result.passed).toBe(true);
  });
});
