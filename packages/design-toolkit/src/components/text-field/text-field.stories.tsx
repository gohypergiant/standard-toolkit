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

import { TextField } from './';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { InputProps } from '../input/types';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: {
    label: 'Label',
    inputProps: {
      placeholder: 'Placeholder',
      type: 'text',
      isClearable: true,
    },
    description: 'Helper text',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    isReadOnly: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
    inputProps: {
      control: 'object',
    },
    isReadOnly: {
      control: 'boolean',
    },
    minLength: {
      control: 'number',
    },
    maxLength: {
      control: 'number',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className='max-w-[200px]'>
      <TextField {...args} />
    </div>
  ),
};

export const WithPrefix: Story = {
  args: {
    label: 'Price',
    inputProps: {
      placeholder: '0.00',
      type: 'number',
      prefix: '$',
    },
    description: 'Enter the price in dollars',
  },
};

export const WithSuffix: Story = {
  args: {
    label: 'Weight',
    inputProps: {
      placeholder: '0',
      type: 'number',
      suffix: 'kg',
    },
    description: 'Enter the weight in kilograms',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    label: 'Temperature Range',
    inputProps: {
      placeholder: '0',
      type: 'number',
      prefix: '~',
      suffix: '°C',
    },
    description: 'Approximate temperature in Celsius',
  },
};

export const WithInputProps: StoryObj<InputProps> = {
  parameters: {
    controls: {
      expanded: true,
      include: [
        'placeholder',
        'type',
        'isClearable',
        'autoSize',
        'prefix',
        'suffix',
        'pattern',
      ],
    },
  },
  args: {
    placeholder: 'Enter text...',
    type: 'text',
    isClearable: true,
    autoSize: false,
    prefix: '',
    suffix: '',
    pattern: '',
  },
  argTypes: {
    isClearable: {
      control: 'boolean',
    },
    autoSize: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    placeholder: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    pattern: {
      control: 'text',
      description:
        'Regex pattern for validation. Examples: `[A-Za-z]+` (letters only), `[0-9]{5}` (5 digits)',
    },
  },
  render: ({
    isClearable,
    autoSize,
    type,
    placeholder,
    prefix,
    suffix,
    pattern,
  }) => (
    <TextField
      label='TextField with InputProps'
      description='Demonstrates inputProps passed to the underlying Input component'
      inputProps={{
        isClearable,
        autoSize,
        type,
        placeholder,
        prefix,
        suffix,
        pattern,
      }}
    />
  ),
};
