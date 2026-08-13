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

import { Radio } from '@accelint/design-toolkit/components/radio';
import { RadioGroup } from '@accelint/design-toolkit/components/radio/group';
import type { RadioGroupProps } from '@accelint/design-toolkit/components/radio/types';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
} from '~/visual-regression/vitest';
import { PROP_COMBOS } from './variants';

createVisualTestScenarios(
  'RadioGroup',
  PROP_COMBOS.map(({ name, props }) => ({
    name,
    render: () => (
      <RadioGroup label="Options" {...props}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    ),
    screenshotName: `radio-group-${name}.png`,
    className: 'inline-block p-s',
  })),
);

type RadioInteractiveProps = Pick<
  RadioGroupProps,
  'defaultValue' | 'isDisabled'
>;

createInteractiveVisualTests({
  componentName: 'Radio',
  testId: 'test-radio',
  renderComponent: ({ defaultValue, isDisabled }: RadioInteractiveProps) => (
    <RadioGroup
      aria-label="Options"
      defaultValue={defaultValue}
      isDisabled={isDisabled}
    >
      <Radio value="a">Option A</Radio>
    </RadioGroup>
  ),
  variants: [
    {
      id: 'unselected',
      name: 'Unselected',
      props: {},
    },
    {
      id: 'selected',
      name: 'Selected',
      props: { defaultValue: 'a' },
    },
  ],
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: 'inline-block p-s',
  interactionTarget: 'label',
});
