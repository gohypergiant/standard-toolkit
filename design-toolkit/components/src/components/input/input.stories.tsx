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
  createControl,
  createStatesStory,
  EXCLUSIONS,
} from '^storybook/utils';
import { SIZE } from '@/constants/size';
import { Input } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    autoSize: false,
    disabled: false,
    placeholder: 'Enter text...',
    size: SIZE.MEDIUM,
    isClearable: true,
    isInvalid: false,
  },
  argTypes: {
    autoSize: createControl.boolean('Autosize component to fit content'),
    isInvalid: COMMON_CONTROL.isInvalid,
    isClearable: createControl.boolean('Provide a button to clear the input'),
    size: COMMON_CONTROL.size.compact,
    placeholder: COMMON_CONTROL.placeholder,

    // using a manual definition specifically for `disabled`
    // because React Aria components use `disabled`
    // and we can not standardize on `isDisabled` as a result
    disabled: createControl.boolean('Disable the input'),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle: 'A flexible text input component with enhanced features',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Input,
};

export const States: Story = createStatesStory({
  Component: Input,
  baseProps: { placeholder: 'Type here...' },
  stateProps: {
    disabled: { disabled: true, placeholder: 'Disabled input' },
    error: { isInvalid: true, placeholder: 'Invalid input' },
  },
});

export const InputTypes: Story = {
  name: 'Input Types',
  render: () => (
    <div className='max-w-sm space-y-m'>
      <Input type='text' placeholder='Text input' />
      <Input type='email' placeholder='Email input' />
      <Input type='password' placeholder='Password input' />
      <Input type='number' placeholder='Number input' />
      <Input type='search' placeholder='Search input' />
      <Input type='url' placeholder='URL input' />
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
