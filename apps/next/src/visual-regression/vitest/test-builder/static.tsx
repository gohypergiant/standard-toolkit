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

import { ThemeProvider } from '@accelint/design-toolkit';
import { dash } from 'radashi';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { getTargetFromSelector } from '../../lib/selectors';
import { insertModeInFilename, THEME_MODES } from '../../lib/theme-modes';
import type { VisualTestConfig, VisualTestScenario } from '../../lib/types';

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
  } = config;

  const baseFilename = screenshotName ?? `${dash(componentName)}-variants.png`;

  describe(`${componentName} Visual Regression`, () => {
    for (const mode of THEME_MODES) {
      const filename = insertModeInFilename(baseFilename, mode);

      test(`all variants (${mode} mode)`, async () => {
        const { container } = render(
          <ThemeProvider defaultMode={mode}>
            <VariantsComponent />
          </ThemeProvider>,
        );

        // Force container to fill viewport for consistent screenshots across environments
        container.style.width = '100vw';
        container.style.height = '100vh';

        await expect.element(container).toMatchScreenshot(filename);
      });
    }
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
export function createVisualTestScenarios(
  componentName: string,
  scenarios: VisualTestScenario[],
): void {
  describe(`${componentName} Visual Regression`, () => {
    for (const scenario of scenarios) {
      for (const mode of THEME_MODES) {
        const filename = insertModeInFilename(scenario.screenshotName, mode);

        test(`${scenario.name} (${mode} mode)`, async () => {
          const testIdValue = `vrt-scenario-${dash(scenario.name)}`;

          render(
            <ThemeProvider defaultMode={mode}>
              <div data-testid={testIdValue} className={scenario.className}>
                {scenario.render()}
              </div>
            </ThemeProvider>,
          );

          // Wait for animations/transitions if specified
          if (scenario.waitMs) {
            await new Promise((resolve) =>
              setTimeout(resolve, scenario.waitMs),
            );
          }

          // Use selector if provided, otherwise screenshot the wrapper
          const target = scenario.selector
            ? getTargetFromSelector(scenario.selector)
            : page.getByTestId(testIdValue);

          await expect.element(target).toMatchScreenshot(filename);
        });
      }
    }
  });
}
