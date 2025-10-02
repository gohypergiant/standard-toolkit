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
  COMMON_CONTROL,
  createStatesStory,
  EXCLUSIONS,
} from '^storybook/utils';
import { AXIS } from '@/constants/axis';
import { Radio } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { RadioGroupProps } from './types';

type Alias = React.FC<RadioGroupProps>;

const meta = {
  title: 'Components/Radio',
  component: Radio.Group as Alias,
  args: {
    orientation: AXIS.VERTICAL,
    isDisabled: false,
    isRequired: false,
    label: 'Choose an option',
  },
  argTypes: {
    orientation: COMMON_CONTROL.orientation,
    label: COMMON_CONTROL.label,
    isDisabled: COMMON_CONTROL.isDisabled,
    isRequired: COMMON_CONTROL.isRequired,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'A form control for exclusive selection within a group of options',
    },
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, label, ...args }) => (
    <Radio.Group label={label} {...args}>
      <Radio value='h1'>Option A</Radio>
      <Radio value='h2'>Option B</Radio>
      <Radio value='h3'>Option C</Radio>
      <Radio value='h3'>Option D</Radio>
      <Radio value='h3'>Option E</Radio>
      <Radio value='h3'>Option F</Radio>
      <Radio value='h3'>Option G</Radio>
      <Radio value='h3'>Option H</Radio>
    </Radio.Group>
  ),
};

export const States: Story = createStatesStory({
  Component: ({ ...props }) => (
    <Radio.Group {...props}>
      <Radio value='option1'>Option 1</Radio>
      <Radio value='option2'>Option 2</Radio>
      <Radio value='option3'>Option 3</Radio>
    </Radio.Group>
  ),
  baseProps: {
    label: 'Select preference',
  },
  stateProps: {
    disabled: { isDisabled: true, label: 'Disabled options' },
  },
});
