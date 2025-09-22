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

import { Slider } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
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
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
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
