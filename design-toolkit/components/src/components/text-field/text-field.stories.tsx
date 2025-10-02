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
  COMMON_STATE_PROPS,
  createStatesStory,
  EXCLUSIONS,
  hideControls,
  MOCK_DATA,
} from '^storybook/utils';
import { SIZE } from '@/constants/size';
import { TextField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
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
    size: SIZE.MEDIUM,
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
  },
  argTypes: {
    size: COMMON_CONTROL.size.compact,
    label: COMMON_CONTROL.label,
    description: COMMON_CONTROL.description,
    errorMessage: COMMON_CONTROL.errorMessage,
    isDisabled: COMMON_CONTROL.isDisabled,
    isInvalid: COMMON_CONTROL.isInvalid,
    isRequired: COMMON_CONTROL.isRequired,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, ...EXCLUSIONS.FORM],
    },
    docs: {
      subtitle:
        'A complete form field component with label, input, and validation',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: TextField,
};

export const States: Story = createStatesStory({
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

export const InputTypes: Story = {
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
  ...hideControls(meta),
};
