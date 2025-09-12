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
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/utils/controls';
import { createStatesStory } from '^storybook/utils/templates';
import { Checkbox } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    children: 'I agree to the terms and conditions',
    isDisabled: false,
    isIndeterminate: false,
  },
  argTypes: {
    children: STANDARD_ARG_TYPES.children,
    isDisabled: STANDARD_ARG_TYPES.isDisabled,
    isIndeterminate: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: {
    ...createStandardParameters('form'),
    docs: {
      subtitle:
        'A form control for binary or multiple selection with group support',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => <Checkbox {...args} />,
};

export const States: Story = createStatesStory({
  Component: Checkbox,
  baseProps: { children: 'Enable notifications' },
  stateProps: {
    disabled: { isDisabled: true, children: 'Disabled option' },
  },
});

export const CheckStates: Story = {
  name: 'Check States',
  render: () => (
    <div className='space-y-m'>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled unchecked</Checkbox>
      <Checkbox isDisabled defaultSelected>
        Disabled checked
      </Checkbox>
      <Checkbox isDisabled isIndeterminate>
        Disabled indeterminate
      </Checkbox>
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
