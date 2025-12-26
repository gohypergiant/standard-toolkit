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
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  DEFAULT_TEST_STATES,
  INTERACTION_STATES,
} from '../lib/interactive-states';
import type {
  ComponentVariantConfig,
  InteractiveState,
  InteractiveVisualTestConfig,
} from '../lib/types';

/**
 * Trigger an interactive state on an element
 */
async function triggerState(
  element: Element,
  state: InteractiveState,
): Promise<void> {
  switch (state) {
    case 'hover':
      await userEvent.hover(element);
      break;
    case 'focus':
      if (element instanceof HTMLElement) {
        element.focus();
        // Dispatch keyboard event to ensure focus-visible styling
        element.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
        );
      }
      break;
    case 'pressed':
      // Dispatch mousedown to trigger :active state
      element.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
      );
      break;
    case 'default':
    case 'disabled':
      // No interaction needed - these are prop-controlled
      break;
  }
}

/**
 * Reset element to neutral state
 */
async function resetState(): Promise<void> {
  // Move mouse to body to clear hover
  await userEvent.hover(document.body);
  // Release any mouse buttons
  document.body.dispatchEvent(
    new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
  );
  // Blur active element
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

/**
 * Context for running a single state test
 */
interface StateTestContext<TProps> {
  componentName: string;
  renderComponent: (props: TProps) => React.ReactNode;
  variant: ComponentVariantConfig<TProps>;
  state: InteractiveState;
  testId?: string;
  waitMs: number;
  beforeEach?: () => Promise<void> | void;
  screenshotName?: (variantId: string, state: InteractiveState) => string;
}

/**
 * Check if a state should be skipped for a variant
 */
function shouldSkipState<TProps>(
  variant: ComponentVariantConfig<TProps>,
  state: InteractiveState,
): boolean {
  const isDisabled = (variant.props as Record<string, unknown>).isDisabled;
  return Boolean(isDisabled && INTERACTION_STATES.includes(state));
}

/**
 * Generate screenshot filename
 */
function defaultScreenshotName(
  componentName: string,
  variant: string,
  state: InteractiveState,
): string {
  return `${dash(componentName)}-${dash(variant)}-${state}.png`;
}

/**
 * Run a single state test
 */
async function runStateTest<TProps>(
  ctx: StateTestContext<TProps>,
): Promise<void> {
  if (ctx.beforeEach) {
    await ctx.beforeEach();
  }

  const props =
    ctx.state === 'disabled'
      ? { ...ctx.variant.props, isDisabled: true }
      : ctx.variant.props;

  const testIdValue = ctx.testId ?? `test-${dash(ctx.componentName)}`;

  const { container } = render(
    <ThemeProvider>
      <div data-testid={testIdValue} className='inline-block'>
        {ctx.renderComponent(props)}
      </div>
    </ThemeProvider>,
  );

  container.style.padding = '24px';

  await new Promise((resolve) => setTimeout(resolve, ctx.waitMs));

  const locator = page.getByTestId(testIdValue);
  const element = locator.element();

  await triggerState(element, ctx.state);

  await new Promise((resolve) => setTimeout(resolve, 50));

  const filename = ctx.screenshotName
    ? ctx.screenshotName(ctx.variant.id, ctx.state)
    : defaultScreenshotName(ctx.componentName, ctx.variant.id, ctx.state);

  await expect.element(locator).toMatchScreenshot(filename);

  await resetState();
}

/**
 * Create interactive visual regression tests for components.
 *
 * Tests each variant in multiple interactive states (hover, focus, pressed, disabled).
 * Uses Playwright-inspired patterns for reliable state triggering.
 *
 * @example
 * ```typescript
 * createInteractiveVisualTests({
 *   componentName: 'Button',
 *   renderComponent: (props) => <Button {...props}>Click me</Button>,
 *   testId: 'test-button',
 *   variants: [
 *     { id: 'filled-accent', name: 'Filled Accent', props: { variant: 'filled', color: 'accent' } },
 *     { id: 'outline-critical', name: 'Outline Critical', props: { variant: 'outline', color: 'critical' } },
 *   ],
 *   states: ['default', 'hover', 'focus', 'pressed'],
 * });
 * ```
 */
export function createInteractiveVisualTests<TProps>(
  config: InteractiveVisualTestConfig<TProps>,
): void {
  const {
    componentName,
    renderComponent,
    variants,
    states = DEFAULT_TEST_STATES,
    testId,
    waitMs = 100,
    beforeEach: customBeforeEach,
    screenshotName,
  } = config;

  describe(`${componentName} Interactive States`, () => {
    for (const variant of variants) {
      if (variant.skip) {
        continue;
      }

      const variantStates = variant.states ?? states;

      describe(variant.name, () => {
        for (const state of variantStates) {
          if (shouldSkipState(variant, state)) {
            continue;
          }

          test(`${state} state`, () =>
            runStateTest({
              componentName,
              renderComponent,
              variant,
              state,
              testId,
              waitMs,
              beforeEach: customBeforeEach,
              screenshotName,
            }));
        }
      });
    }
  });
}

/**
 * Options for generating variant matrix
 */
export interface VariantMatrixOptions<TProps> {
  /** Map of prop names to arrays of values to test */
  dimensions: {
    [K in keyof TProps]?: TProps[K][];
  };
  /** Base props to include in all variants */
  baseProps?: Partial<TProps>;
  /** Custom name formatter (defaults to "value1 / value2 / ...") */
  formatName?: (combination: Partial<TProps>) => string;
}

/**
 * Generate all variant combinations for a component.
 * Useful for exhaustively testing variant matrices across any set of props.
 *
 * @example
 * ```typescript
 * // Button with variant, color, and size dimensions
 * const variants = generateVariantMatrix<ButtonProps>({
 *   dimensions: {
 *     variant: ['filled', 'outline', 'flat'],
 *     color: ['mono-muted', 'accent', 'critical'],
 *     size: ['medium'],
 *   },
 * });
 *
 * // Checkbox with just size dimension
 * const checkboxVariants = generateVariantMatrix<CheckboxProps>({
 *   dimensions: {
 *     size: ['small', 'medium', 'large'],
 *   },
 *   baseProps: { label: 'Test' },
 * });
 * ```
 */
export function generateVariantMatrix<TProps>(
  options: VariantMatrixOptions<TProps>,
): ComponentVariantConfig<TProps>[] {
  const { dimensions, baseProps = {}, formatName } = options;

  const dimensionKeys = Object.keys(dimensions) as Array<keyof TProps>;

  if (dimensionKeys.length === 0) {
    return [];
  }

  // Get arrays of values for each dimension
  const dimensionValues = dimensionKeys.map(
    (key) => dimensions[key] as TProps[keyof TProps][],
  );

  // Generate cartesian product of all dimension values
  const combinations = cartesianProduct(dimensionValues);

  return combinations.map((values) => {
    // Build the props object from dimension key-value pairs
    const dimensionProps = dimensionKeys.reduce(
      (acc, key, index) => {
        acc[key] = values[index];
        return acc;
      },
      {} as Partial<TProps>,
    );

    const props = { ...baseProps, ...dimensionProps } as TProps;

    // Generate id from values joined with dashes
    const id = values.map((v) => String(v)).join('-');

    // Generate name from values joined with slashes, or use custom formatter
    const name = formatName
      ? formatName(dimensionProps)
      : values.map((v) => String(v)).join(' / ');

    return { id, name, props };
  });
}

/**
 * Compute the cartesian product of multiple arrays.
 * @example cartesianProduct([['a', 'b'], [1, 2]]) => [['a', 1], ['a', 2], ['b', 1], ['b', 2]]
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) {
    return [[]];
  }

  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((combo) => curr.map((item) => [...combo, item])),
    [[]],
  );
}
