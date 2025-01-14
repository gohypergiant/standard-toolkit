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

import type { StoryObj, Meta } from '@storybook/react';
import { AriaLabel } from '../aria';
import { Radio, RadioGroup } from './radio';
import type { RadioGroupProps } from './types';

const meta: Meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Selection List',
    alignInput: 'end',
    orientation: 'vertical',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
    },
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

export const Example: StoryObj<RadioGroupProps> = {
  render: ({ label, alignInput, ...rest }) => (
    <RadioGroup {...rest} alignInput={alignInput}>
      <AriaLabel>{label}</AriaLabel>
      <Radio value='this'>This</Radio>
      <Radio value='that'>That</Radio>
      <Radio value='other'>The Other Thing</Radio>
    </RadioGroup>
  ),
};
