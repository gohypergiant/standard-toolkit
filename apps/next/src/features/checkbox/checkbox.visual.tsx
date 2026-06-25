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

import { Checkbox } from '@accelint/design-toolkit/components/checkbox';
import { CheckboxGroup } from '@accelint/design-toolkit/components/checkbox/group';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import { PROP_COMBOS } from './variants';
import type { CheckboxProps } from '@accelint/design-toolkit/components/checkbox/types';

// ---------------------------------------------------------------------------
// CheckboxGroup — static scenarios
// ---------------------------------------------------------------------------

createVisualTestScenarios(
  'CheckboxGroup',
  PROP_COMBOS.map(({ name, props }) => ({
    name,
    render: () => (
      <CheckboxGroup label='Options' {...props}>
        <Checkbox value='a'>Option A</Checkbox>
        <Checkbox value='b'>Option B</Checkbox>
      </CheckboxGroup>
    ),
    screenshotName: `checkbox-group-${name}.png`,
    className: 'inline-block p-s',
  })),
);

// ---------------------------------------------------------------------------
// Checkbox — interactive states
// ---------------------------------------------------------------------------

const standardVariants = generateVariantMatrix<CheckboxProps>({
  dimensions: {
    isSelected: [true, false],
    labelPosition: ['start', 'end'],
  },
  baseProps: { children: 'Option' },
});

const indeterminateVariants = generateVariantMatrix<CheckboxProps>({
  dimensions: {
    isSelected: [true, false],
    labelPosition: ['start', 'end'],
  },
  baseProps: { children: 'Option', isIndeterminate: true },
});

const renderCheckbox = (props: CheckboxProps) => <Checkbox {...props} />;

createInteractiveVisualTests({
  componentName: 'Checkbox',
  renderComponent: renderCheckbox,
  testId: 'test-checkbox',
  className: 'inline-block p-s',
  variants: standardVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: 'label',
});

createInteractiveVisualTests({
  componentName: 'CheckboxIndeterminate',
  renderComponent: renderCheckbox,
  testId: 'test-checkbox-indeterminate',
  className: 'inline-block p-s',
  variants: indeterminateVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: 'label',
});
