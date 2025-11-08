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
import type { Meta, StoryObj } from '@storybook/react';

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
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: TextField,
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
