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
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { RadioGroupProps, RadioProps } from './types';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: {
    orientation: 'vertical',
    isDisabled: false,
    isRequired: false,
    label: 'Header',
    labelPosition: 'end',
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
    docs: {
      subtitle: 'Exclusive selection from a group of options',
    },
  },
} satisfies Meta<RadioGroupProps & Pick<RadioProps, 'labelPosition'>>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: ({ children, label, labelPosition, ...args }) => (
    <RadioGroup label={label} {...args}>
      <Radio value='1' labelPosition={labelPosition}>
        Radio text
      </Radio>
      <Radio value='2' labelPosition={labelPosition}>
        Radio text
      </Radio>
      <Radio value='3' labelPosition={labelPosition}>
        Radio text
      </Radio>
    </RadioGroup>
  ),
};
