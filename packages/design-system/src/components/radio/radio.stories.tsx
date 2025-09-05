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

import { AriaLabel } from '../aria';
import { Radio, RadioGroup } from './';
import type { Story, StoryDefault } from '@ladle/react';
import type { RadioGroupProps } from './types';

export default {
  title: 'Components / RadioGroup',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Selection List',
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
      defaultValue: 'end',
    },
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'vertical',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

export const Example: Story<RadioGroupProps> = ({
  label,
  alignInput,
  ...rest
}) => (
  <RadioGroup {...rest} alignInput={alignInput}>
    <AriaLabel>{label}</AriaLabel>
    <Radio value='this'>This</Radio>
    <Radio value='that'>That</Radio>
    <Radio value='other'>The Other Thing</Radio>
  </RadioGroup>
);
