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
  createSizeControl,
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/shared-controls';
import {
  createSizeVariantsStory,
  createStatesStory,
} from '^storybook/story-templates';
import { Input } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    autoSize: false,
    disabled: false,
    placeholder: 'Enter text...',
    size: 'medium',
    isClearable: true,
    isInvalid: false,
  },
  argTypes: {
    size: createSizeControl('COMPACT'),
    placeholder: STANDARD_ARG_TYPES.placeholder,
    disabled: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isInvalid: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isClearable: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    autoSize: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: createStandardParameters('form'),
};

export default meta;

export const Default: StoryObj<typeof Input> = {
  render: (args) => <Input {...args} />,
};

export const States: StoryObj<typeof Input> = createStatesStory({
  Component: Input,
  baseProps: { placeholder: 'Type here...' },
  stateProps: {
    disabled: { disabled: true, placeholder: 'Disabled input' },
    error: { isInvalid: true, placeholder: 'Invalid input' },
  },
});

export const AllSizes: StoryObj<typeof Input> = createSizeVariantsStory({
  Component: Input,
  sizes: ['small', 'medium'],
  baseProps: { placeholder: 'Sample text' },
});

export const InputTypes: StoryObj<typeof Input> = {
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
