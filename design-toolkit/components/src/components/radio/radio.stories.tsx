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

import { RadioGroup } from './group';
import { Radio } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { RadioGroupProps } from './types';

type Alias = React.FC<RadioGroupProps>;

const meta = {
  title: 'Components/Radio',
  component: RadioGroup as Alias,
  args: {
    orientation: 'vertical',
    isDisabled: false,
    isRequired: false,
    label: 'Header',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'validationBehavior'],
    },
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, label, ...args }) => (
    <RadioGroup label={label} {...args}>
      <Radio value='1'>Radio text</Radio>
      <Radio value='2'>Radio text</Radio>
      <Radio value='3'>Radio text</Radio>
    </RadioGroup>
  ),
};
