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
  createStandardParameters,
  createVariantControl,
} from '^storybook/shared-controls';
import { createStatesStory } from '^storybook/story-templates';
import { SearchField } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchField> = {
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
    variant: createVariantControl(['outlined', 'filled']),
    isDisabled: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    isLoading: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: createStandardParameters('form'),
};

export default meta;

export const Default: StoryObj<typeof SearchField> = {
  render: (args) => <SearchField {...args} aria-label='Search field' />,
};

export const States: StoryObj<typeof SearchField> = createStatesStory({
  Component: ({ ...props }) => (
    <SearchField {...props} aria-label='Search field' />
  ),
  baseProps: {
    inputProps: { placeholder: 'Search products...' },
  },
  stateProps: {
    disabled: { isDisabled: true },
    loading: { isLoading: true },
  },
});

export const Variants: StoryObj<typeof SearchField> = {
  render: () => (
    <div className='max-w-sm space-y-l'>
      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Outlined</h4>
        <SearchField
          variant='outlined'
          inputProps={{ placeholder: 'Search with outline...' }}
          aria-label='Outlined search field'
        />
      </div>

      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Filled</h4>
        <SearchField
          variant='filled'
          inputProps={{ placeholder: 'Search with fill...' }}
          aria-label='Filled search field'
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
