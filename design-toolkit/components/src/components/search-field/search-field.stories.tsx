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

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';
import { SearchField } from './index';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  args: {
    isDisabled: false,
    isLoading: false,
    placeholder: 'Search',
    variant: 'outlined',
  },
  argTypes: {
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    isLoading: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      type: 'string',
      table: { defaultValue: { summary: 'Search' } },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      table: { defaultValue: { summary: 'outlined' } },
    },

    // disable and remove controls for these fields
    children: { control: false, if: { arg: '' } },
    style: { control: false, if: { arg: '' } },
    slot: { control: false, if: { arg: '' } },
    validationBehavior: { control: false, if: { arg: '' } },
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Storybook Search Field Component' />
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A comprehensive view of all SearchField variants and states for visual testing.',
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-xxl'>
      <Variant title='Outlined (default)'>
        <SearchField
          aria-label='Outlined search field'
          placeholder='Search...'
        />
      </Variant>

      <Variant title='Filled'>
        <SearchField
          aria-label='Filled search field'
          placeholder='Search...'
          variant='filled'
        />
      </Variant>

      <Variant title='Loading'>
        <SearchField
          aria-label='Loading search field'
          isLoading={true}
          placeholder='Searching...'
        />
      </Variant>

      <Variant title='Clear Button'>
        <SearchField
          aria-label='Search field with clear button'
          placeholder='Search...'
          value='example search'
        />
      </Variant>

      <Variant title='Disabled'>
        <SearchField
          aria-label='Disabled search field'
          isDisabled={true}
          placeholder='Search...'
        />
      </Variant>

      <Variant title='Multiple fields with shared defaults'>
        <SearchField.Provider variant='filled'>
          <div className='space-y-3'>
            <SearchField
              placeholder='Search products...'
              aria-label='Product search'
            />
            <SearchField
              placeholder='Search categories...'
              aria-label='Category search'
            />
          </div>
        </SearchField.Provider>
      </Variant>
    </div>
  ),
};

function Variant({ children, title }: { title: string } & PropsWithChildren) {
  return (
    <div>
      <p className='fg-default-light'>{title}</p>
      {children}
    </div>
  );
}
