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
import { getLogger } from '@accelint/logger';
import clsx from 'clsx';
import { dash } from 'radashi';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  DEFAULT_TEST_STATES,
  INTERACTION_STATES,
} from '../../lib/interactive-states';
import { getTargetFromSelector } from '../../lib/selectors';
import { insertModeInFilename, THEME_MODES } from '../../lib/theme-modes';
import type {
  ComponentVariantConfig,
  InteractiveState,
  InteractiveVisualTestConfig,
  ThemeMode,
} from '../../lib/types';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[VRT:Interactive]',
  pretty: true,
});

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]';

/**
 * Find the first focusable element within a container.
 * Includes [tabindex="-1"] because programmatic .focus() works on those elements.
 */
function findFocusableElement(container: Element): HTMLElement | null {
  // Check if container itself is focusable
  if (
    container.matches(FOCUSABLE_SELECTOR) &&
    container instanceof HTMLElement
  ) {
    return container;
  }
  // Otherwise find first focusable descendant
  return container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
}

/**
 * Trigger an interactive state on an element.
 */
async function triggerState(
  element: Element,
  state: InteractiveState,
): Promise<void> {
  switch (state) {
    case 'hover':
      try {
        await userEvent.hover(element, { timeout: 3_000 });
      } catch {
        // Fallback: set data-hovered directly. The design system's hover
        // variant matches [data-hovered], so this produces identical visual
        // output to a real hover interaction.
        if (element instanceof HTMLElement) {
          element.setAttribute('data-hovered', 'true');
        }
      }
      break;
    case 'focus': {
      // Find the actual focusable element within the container
      const focusTarget = findFocusableElement(element);
      if (focusTarget) {
        focusTarget.focus({ focusVisible: true });
      } else {
        logger.warn(
          `No focusable element found for focus state. Element: ${element.tagName}${element.id ? `#${element.id}` : ''}`,
        );
      }
      break;
    }
    case 'pressed': {
      // Set data-pressed directly: vitest browser mode has no mouseDown() API,
      // and react-aria's usePress ignores untrusted synthetic events.
      // The pressed CSS variant matches [data-pressed], so this produces
      // identical visual output to a real press interaction.
      if (element instanceof HTMLElement) {
        element.setAttribute('data-pressed', 'true');
      }
      break;
    }
    case 'default':
    case 'disabled':
      // No interaction needed - these are prop-controlled
      break;
  }
}

/**
 * Wait for browser to complete the next paint cycle.
 * Ensures CSS transitions and visual state changes are rendered.
 */
async function waitForPaint(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

/**
 * Reset element to neutral state
 */
async function resetState(): Promise<void> {
  // Move mouse to body to clear hover
  await userEvent.hover(document.body);
  // Clean up any manually-set data-hovered/data-pressed attributes
  for (const el of document.querySelectorAll('[data-hovered]')) {
    el.removeAttribute('data-hovered');
  }
  for (const el of document.querySelectorAll('[data-pressed]')) {
    el.removeAttribute('data-pressed');
  }
  // Blur active element
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  // Wait for browser to paint cleared state
  await waitForPaint();
}

/**
 * Context for running a single state test
 */
interface StateTestContext<TProps> {
  componentName: string;
  renderComponent: (props: TProps) => React.ReactNode;
  variant: ComponentVariantConfig<TProps>;
  state: InteractiveState;
  mode: ThemeMode;
  testId?: string;
  beforeEach?: () => Promise<void> | void;
  screenshotName?: (variantId: string, state: InteractiveState) => string;
  className?: string;
  interactionTarget?: string;
  screenshotSelector?: string;
  waitMs?: number;
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
  mode: ThemeMode,
): string {
  return `${dash(componentName)}-${dash(variant)}-${state}-${mode}.png`;
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

  render(
    <ThemeProvider defaultMode={ctx.mode}>
      <div
        data-testid={testIdValue}
        className={clsx('inline-block', ctx.className)}
      >
        {ctx.renderComponent(props)}
      </div>
    </ThemeProvider>,
  );

  // Wait for portal-based components to mount (e.g. menus, popovers)
  if (ctx.waitMs) {
    await new Promise((r) => setTimeout(r, ctx.waitMs));
  }

  const wrapperLocator = page.getByTestId(testIdValue);
  const element = wrapperLocator.element();

  // For portal-based components (e.g. menus rendered via Popover), the
  // interaction target may live outside the wrapper in a React portal.
  let interactionElement: Element = element;

  if (ctx.interactionTarget) {
    const found = element.querySelector(ctx.interactionTarget);
    if (found) {
      interactionElement = found;
    } else {
      // Portal elements live outside the wrapper but in the same document.
      const doc = element.ownerDocument;
      for (let i = 0; i < 40; i++) {
        const portalEl = doc.querySelector(ctx.interactionTarget);
        if (portalEl) {
          interactionElement = portalEl;
          break;
        }
        await new Promise((r) => setTimeout(r, 50));
      }
      if (interactionElement === element) {
        logger.warn(
          `Portal element not found for "${ctx.interactionTarget}"`,
        );
      }
    }
  }

  await triggerState(interactionElement, ctx.state);
  await waitForPaint();

  const filename = ctx.screenshotName
    ? insertModeInFilename(
        ctx.screenshotName(ctx.variant.id, ctx.state),
        ctx.mode,
      )
    : defaultScreenshotName(
        ctx.componentName,
        ctx.variant.id,
        ctx.state,
        ctx.mode,
      );

  // For portal-based components, screenshot the actual content element
  // instead of the wrapper which may only contain the trigger.
  const screenshotLocator = ctx.screenshotSelector
    ? (getTargetFromSelector(ctx.screenshotSelector) ?? wrapperLocator)
    : wrapperLocator;

  await expect.element(screenshotLocator).toMatchScreenshot(filename);

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
    beforeEach: customBeforeEach,
    screenshotName,
    className,
    interactionTarget,
    screenshotSelector,
    waitMs,
  } = config;

  describe(`${componentName} Interactive States`, () => {
    for (const mode of THEME_MODES) {
      describe(`${mode} mode`, () => {
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
                  mode,
                  testId,
                  beforeEach: customBeforeEach,
                  screenshotName,
                  className,
                  interactionTarget,
                  screenshotSelector,
                  waitMs,
                }));
            }
          });
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
