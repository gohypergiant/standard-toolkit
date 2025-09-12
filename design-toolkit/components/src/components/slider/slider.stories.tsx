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
  STANDARD_ARG_TYPES,
} from '^storybook/shared-controls';
import { Slider } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    ...createStandardParameters('form'),
    docs: {
      subtitle: 'Range input control for selecting numeric values.',
    },
  },
  args: {
    defaultValue: 30,
    layout: 'grid',
    label: 'Opacity',
    maxValue: 100,
    minValue: 0,
    orientation: 'horizontal',
    showInput: false,
    showLabel: true,
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'stack'],
      table: {
        defaultValue: { summary: 'grid' },
        category: 'Layout',
      },
      description: 'Layout arrangement of label and slider',
    },
    orientation: STANDARD_ARG_TYPES.orientation,
    showInput: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        category: 'Features',
      },
      description: 'Whether to show numeric input field',
    },
    showLabel: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
        category: 'Features',
      },
      description: 'Whether to show the label',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Slider> = {
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const Range: StoryObj<typeof Slider> = {
  args: {
    defaultValue: [20, 30],
    showInput: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};
