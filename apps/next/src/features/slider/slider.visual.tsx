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
import { Slider } from '@accelint/design-toolkit/components/slider';
import type { SliderProps } from '@accelint/design-toolkit/components/slider/types';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { THEME_MODES } from '~/visual-regression/lib/theme-modes';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
} from '~/visual-regression/vitest';

// =============================================================================
// Static Scenarios
// =============================================================================

const scenarioConfigs: {
  name: string;
  slug: string;
  props: SliderProps;
  container?: string;
}[] = [
  {
    name: 'default',
    slug: 'default',
    props: { defaultValue: 30, label: 'Opacity' },
  },
  {
    name: 'with-input',
    slug: 'with-input',
    props: { defaultValue: 50, label: 'Volume', showInput: true },
  },
  {
    name: 'range',
    slug: 'range',
    props: { defaultValue: [20, 80], label: 'Opacity' },
  },
  {
    name: 'range-with-input',
    slug: 'range-with-input',
    props: { defaultValue: [20, 80], label: 'Price Range', showInput: true },
  },
  {
    name: 'with-evenly-spaced-markers',
    slug: 'with-evenly-spaced-markers',
    props: { defaultValue: 50, label: 'Volume', markers: 5 },
  },
  {
    name: 'with-specific-marker-values',
    slug: 'with-specific-marker-values',
    props: {
      defaultValue: 50,
      label: 'Temperature (°F)',
      markers: [0, 32, 72, 100],
    },
  },
  {
    name: 'with-labeled-markers',
    slug: 'with-labeled-markers',
    props: {
      defaultValue: 50,
      label: 'Quality',
      markers: [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ],
      showMarkerLabels: true,
    },
    container: 'w-[400px] px-xxl pb-xl',
  },
  {
    name: 'vertical',
    slug: 'vertical',
    props: {
      defaultValue: 50,
      label: 'Brightness',
      orientation: 'vertical',
      markers: [
        { value: 0, label: 'Min' },
        { value: 50, label: '50%' },
        { value: 100, label: 'Max' },
      ],
      showMarkerLabels: true,
    },
    container: 'h-[300px]',
  },
  {
    name: 'range-with-markers',
    slug: 'range-with-markers',
    props: {
      defaultValue: [25, 75],
      label: 'Price Range',
      markers: [0, 25, 50, 75, 100],
    },
  },
  {
    name: 'disabled',
    slug: 'disabled',
    props: {
      defaultValue: 50,
      label: 'Disabled Slider',
      isDisabled: true,
      markers: 5,
    },
  },
  {
    name: 'snap-to-labeled-markers',
    slug: 'snap-to-labeled-markers',
    props: {
      defaultValue: 50,
      label: 'Rating',
      markers: [
        { value: 0, label: 'Poor' },
        { value: 25, label: 'Fair' },
        { value: 50, label: 'Good' },
        { value: 75, label: 'Great' },
        { value: 100, label: 'Excellent' },
      ],
      snapToMarkers: true,
      showMarkerLabels: true,
    },
    container: 'w-[400px] px-xxl pb-xl',
  },
  {
    name: 'stack-layout',
    slug: 'stack-layout',
    props: { defaultValue: 30, label: 'Opacity', layout: 'stack' },
  },
  {
    name: 'hidden-label',
    slug: 'hidden-label',
    props: { defaultValue: 30, label: 'Opacity', showLabel: false },
  },
  {
    name: 'hidden-value-labels',
    slug: 'hidden-value-labels',
    props: { defaultValue: 30, label: 'Opacity', showValueLabels: false },
  },
];

createVisualTestScenarios(
  'Slider',
  scenarioConfigs.map((config) => ({
    name: config.name,
    screenshotName: `slider-${config.slug}.png`,
    className: 'inline-block p-s',
    render: () => (
      <div className={config.container ?? 'w-[400px]'}>
        <Slider {...config.props} />
      </div>
    ),
  })),
);

// =============================================================================
// Interactive Tests
// =============================================================================

const renderSlider = (props: SliderProps) => (
  <div className="w-[400px] p-s">
    <Slider {...props} />
  </div>
);

const interactiveVariants = [
  {
    id: 'default',
    name: 'Default',
    props: {
      defaultValue: 30,
      label: 'Slider',
    },
  },
  {
    id: 'range',
    name: 'Range',
    props: {
      defaultValue: [20, 80] as [number, number],
      label: 'Range',
    },
  },
  {
    id: 'with-markers',
    name: 'With Markers',
    props: {
      defaultValue: 50,
      label: 'Markers',
      markers: 5,
    },
  },
] satisfies { id: string; name: string; props: SliderProps }[];

createInteractiveVisualTests<SliderProps>({
  componentName: 'Slider',
  renderComponent: renderSlider,
  testId: 'test-slider',
  interactionTarget: '[class*="thumb"]',
  variants: interactiveVariants,
  states: ['default', 'hover', 'focus', 'disabled'],
});

// =============================================================================
// Dragging State Tests
// =============================================================================

/**
 * The slider uses `data-dragging` (not `data-pressed`) for the thumb's active
 * drag state. The generic `triggerState` helper sets `data-pressed`, which has
 * no visual effect on slider thumbs. These tests manually set `data-dragging`
 * on the visible thumb element.
 */
describe('Slider Dragging State', () => {
  for (const mode of THEME_MODES) {
    describe(`${mode} mode`, () => {
      for (const variant of interactiveVariants) {
        test(`${variant.name} dragging state`, async () => {
          render(
            <ThemeProvider defaultMode={mode}>
              <div
                data-testid="test-slider-dragging"
                className="inline-block"
              >
                {renderSlider(variant.props)}
              </div>
            </ThemeProvider>,
          );

          const wrapper = page.getByTestId('test-slider-dragging');
          const thumb = wrapper
            .element()
            .querySelector('[class*="thumb"]');

          if (thumb instanceof HTMLElement) {
            thumb.setAttribute('data-dragging', 'true');
          }

          await new Promise<void>((r) =>
            requestAnimationFrame(() => requestAnimationFrame(() => r())),
          );

          await expect
            .element(wrapper)
            .toMatchScreenshot(
              `slider-${variant.id}-dragging-${mode}.png`,
            );
        });
      }
    });
  }
});

// =============================================================================
// Tooltip on Hover Tests
// =============================================================================

/**
 * The slider thumb is wrapped in a `TooltipTrigger` that shows the current
 * value on hover. These tests trigger hover on the visible thumb to activate
 * the tooltip, then capture the screenshot.
 */
describe('Slider Tooltip on Hover', () => {
  for (const mode of THEME_MODES) {
    describe(`${mode} mode`, () => {
      for (const variant of interactiveVariants) {
        test(`${variant.name} tooltip on hover`, async () => {
          render(
            <ThemeProvider defaultMode={mode}>
              <div
                data-testid="test-slider-tooltip"
                className="inline-block"
              >
                {renderSlider(variant.props)}
              </div>
            </ThemeProvider>,
          );

          const wrapper = page.getByTestId('test-slider-tooltip');
          const thumb = wrapper
            .element()
            .querySelector('[class*="thumb"]');

          if (thumb) {
            await userEvent.hover(thumb);
          }

          // Wait for tooltip delay (default 250ms) + paint
          await new Promise((r) => setTimeout(r, 500));

          await expect
            .element(wrapper)
            .toMatchScreenshot(
              `slider-${variant.id}-tooltip-hover-${mode}.png`,
            );
        });
      }
    });
  }
});
