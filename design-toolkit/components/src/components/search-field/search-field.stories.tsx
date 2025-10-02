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
  hideControls,
} from '^storybook/utils';
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
    isDisabled: COMMON_CONTROL.isDisabled,
    isLoading: COMMON_CONTROL.isLoading,
    variant: createControl.select('Style variant', ['outlined', 'filled']),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, ...EXCLUSIONS.FORM],
    },
    docs: {
      subtitle:
        'A customizable search input component built on React Aria Components',
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <SearchField {...args} aria-label='Search field' />,
};

export const States: Story = createStatesStory({
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

export const Variants: Story = {
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
  ...hideControls(meta),
};
