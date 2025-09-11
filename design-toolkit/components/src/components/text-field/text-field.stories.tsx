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

import { MOCK_DATA } from '^storybook/mock-data';
import {
  createSizeControl,
  createStandardParameters,
  STANDARD_ARG_TYPES,
} from '^storybook/shared-controls';
import {
  COMMON_STATE_PROPS,
  createStatesStory,
} from '^storybook/story-templates';
import { TextField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  args: {
    label: 'Label',
    inputProps: {
      placeholder: 'Enter text...',
      type: 'text',
      isClearable: true,
    },
    description: 'Helper text to guide the user',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
  },
  argTypes: {
    size: createSizeControl('COMPACT'),
    label: STANDARD_ARG_TYPES.label,
    description: STANDARD_ARG_TYPES.description,
    errorMessage: STANDARD_ARG_TYPES.errorMessage,
    isDisabled: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isInvalid: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isRequired: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: createStandardParameters('form'),
};

export default meta;

export const Default: StoryObj<typeof TextField> = {
  render: (args) => <TextField {...args} />,
};

export const States: StoryObj<typeof TextField> = createStatesStory({
  Component: TextField,
  baseProps: {
    label: 'Email Address',
    inputProps: { placeholder: 'Enter your email' },
  },
  stateProps: {
    ...COMMON_STATE_PROPS.FORM_FIELD,
    error: {
      isInvalid: true,
      errorMessage: MOCK_DATA.ERROR_MESSAGES.INVALID_EMAIL,
    },
  },
});

export const InputTypes: StoryObj<typeof TextField> = {
  name: 'Input Types',
  render: () => (
    <div className='max-w-md space-y-l'>
      <TextField
        label='Email'
        inputProps={{ type: 'email', placeholder: 'Enter your email' }}
      />
      <TextField
        label='Password'
        inputProps={{ type: 'password', placeholder: 'Enter your password' }}
      />
      <TextField
        label='Search'
        inputProps={{ type: 'search', placeholder: 'Search...' }}
      />
      <TextField
        label='Number'
        inputProps={{ type: 'number', placeholder: '0' }}
      />
      <TextField
        label='URL'
        inputProps={{ type: 'url', placeholder: 'https://example.com' }}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
