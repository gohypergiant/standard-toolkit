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

import { ThemeProvider } from '@accelint/design-toolkit';
import { dash } from 'radashi';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { VisualTestConfig, VisualTestScenario } from '../lib/types';

/**
 * Create a visual regression test for a component using a declarative configuration.
 *
 * This builder reduces boilerplate by providing a consistent structure for:
 * - Rendering the component variants
 * - Waiting for styles/animations
 * - Taking and comparing screenshots
 *
 * @example
 * ```typescript
 * import { createVisualTests } from '~/visual-regression/vitest/test-builder';
 * import { ButtonVariants } from './variants';
 *
 * createVisualTests({
 *   componentName: 'Button',
 *   variantsComponent: ButtonVariants,
 * });
 * ```
 */
export function createVisualTests(config: VisualTestConfig): void {
  const {
    componentName,
    variantsComponent: VariantsComponent,
    screenshotName,
    waitMs = 100,
  } = config;

  const filename = screenshotName ?? `${dash(componentName)}-variants.png`;

  describe(`${componentName} Visual Regression`, () => {
    test('all variants', async () => {
      const { container } = render(
        <ThemeProvider>
          <VariantsComponent />
        </ThemeProvider>,
      );

      // Force container to fill viewport for consistent screenshots across environments
      container.style.width = '100vw';
      container.style.height = '100vh';

      // Wait for styles/animations to settle
      await new Promise((resolve) => setTimeout(resolve, waitMs));

      await expect.element(container).toMatchScreenshot(filename);
    });
  });
}

/**
 * Create multiple visual regression tests from a list of scenarios.
 *
 * Use this for components that need separate screenshots for different states
 * (e.g., Dialog with different sizes, or components with complex interactions).
 *
 * @example
 * ```typescript
 * import { createVisualTestScenarios } from '~/visual-regression/vitest/test-builder';
 * import { DialogVariant, PROP_COMBOS } from './variants';
 *
 * createVisualTestScenarios('Dialog',
 *   PROP_COMBOS.map(props => ({
 *     name: `${props.size} variant`,
 *     render: () => <DialogVariant props={props} />,
 *     screenshotName: `dialog-${props.size}.png`,
 *     waitMs: 300,
 *     selector: '[role="dialog"]',
 *   }))
 * );
 * ```
 */
/**
 * Parse a selector string and return a vitest page locator
 */
function getTargetFromSelector(selector: string) {
  // Extract role from selector like '[role="dialog"]'
  const roleMatch = selector.match(/\[role="([^"]+)"\]/);
  if (roleMatch?.[1]) {
    return page.getByRole(roleMatch[1] as 'dialog');
  }

  // Fall back to getByTestId for data-testid selectors
  const testIdMatch = selector.match(/\[data-testid="([^"]+)"\]/);
  if (testIdMatch?.[1]) {
    return page.getByTestId(testIdMatch[1]);
  }

  return null;
}

export function createVisualTestScenarios(
  componentName: string,
  scenarios: VisualTestScenario[],
): void {
  describe(`${componentName} Visual Regression`, () => {
    for (const scenario of scenarios) {
      test(scenario.name, async () => {
        const { container } = render(
          <ThemeProvider>{scenario.render()}</ThemeProvider>,
        );

        // Wait for rendering/animations
        await new Promise((resolve) =>
          setTimeout(resolve, scenario.waitMs ?? 100),
        );

        // Use selector if provided, otherwise screenshot container
        const target = scenario.selector
          ? getTargetFromSelector(scenario.selector)
          : null;

        if (target) {
          await expect
            .element(target)
            .toMatchScreenshot(scenario.screenshotName);
        } else {
          await expect
            .element(container)
            .toMatchScreenshot(scenario.screenshotName);
        }
      });
    }
  });
}
