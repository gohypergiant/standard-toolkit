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

import { SearchField } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  args: {
    inputProps: {
      placeholder: 'Search...',
    },
    variant: 'outlined',
    isDisabled: false,
    isLoading: false,
  },
  argTypes: {
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      table: { defaultValue: { summary: 'outlined' } },
    },
    isLoading: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'slot', 'validationBehavior'],
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Storybook Search Field Component' />
  ),
};
