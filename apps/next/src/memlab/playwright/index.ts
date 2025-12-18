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
 * Barrel export for MemLab Playwright test utilities
 *
 * This module provides shared test infrastructure for memory leak testing
 * across all component features. Import from this module in your test files:
 *
 * @example
 * import { expect, forceGC, test, waitForCleanup, createComponentTests } from '~/memlab/playwright';
 */

export { expect, forceGC, test, waitForCleanup } from './fixtures';
export {
  createComponentTests,
  createMountUnmountScenario,
  createStressTestScenario,
} from './test-builder';
export type { MemlabTestFixtures } from './fixtures';
export type { ComponentTestConfig, TestScenario } from './test-builder';
