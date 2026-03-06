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

import { SearchField } from '@accelint/design-toolkit/components/search-field';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { SearchFieldProps } from '@accelint/design-toolkit/components/search-field/types';

const variants = generateVariantMatrix<SearchFieldProps>({
  dimensions: {
    variant: ['outline', 'filled'],
  },
  baseProps: {
    defaultValue: 'Search query',
    'aria-label': 'Search',
  },
});

const renderSearchField = (props: SearchFieldProps) => (
  <SearchField {...props} />
);

createInteractiveVisualTests({
  componentName: 'SearchField',
  renderComponent: renderSearchField,
  testId: 'test-search-field',
  variants,
  className: 'p-s',
  states: ['default', 'hover', 'focus', 'disabled'],
});

const scenarioVariants = ['outline', 'filled'] as const;

const scenarioConfigs = [
  {
    name: 'empty with placeholder',
    props: { inputProps: { placeholder: 'Search...' } },
    slug: 'placeholder',
  },
  {
    name: 'loading',
    props: { isLoading: true, defaultValue: 'Loading results' },
    slug: 'loading',
  },
  {
    name: 'with value',
    props: { defaultValue: 'Search query' },
    slug: 'with-value',
  },
];

createVisualTestScenarios(
  'SearchField Scenarios',
  scenarioVariants.flatMap((variant) =>
    scenarioConfigs.map((config) => ({
      name: `${config.name} (${variant})`,
      render: () => (
        <div data-testid='screenshot-target' className='inline-block p-s'>
          <SearchField
            variant={variant}
            aria-label='Search'
            {...config.props}
          />
        </div>
      ),
      selector: '[data-testid="screenshot-target"]',
      screenshotName: `search-field-${config.slug}-${variant}.png`,
    })),
  ),
);
