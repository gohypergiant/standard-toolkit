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

import { COMMON_CONTROL, createControl, EXCLUSIONS } from '^storybook/utils';
import { AXIS } from '@/constants/axis';
import { Slider } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const LAYOUT = Object.freeze({
  GRID: 'grid',
  STACK: 'stack',
} as const);

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    defaultValue: 30,
    layout: LAYOUT.GRID,
    label: 'Opacity',
    maxValue: 100,
    minValue: 0,
    orientation: AXIS.HORIZONTAL,
    showInput: false,
    showLabel: true,
    isDisabled: false,
  },
  argTypes: {
    layout: createControl.select(
      'Layout arrangement of label and slider',
      Object.values(LAYOUT),
      LAYOUT.GRID,
    ),
    orientation: COMMON_CONTROL.orientation,
    showInput: createControl.boolean('Whether to show numeric input field'),
    showLabel: createControl.boolean('Whether to show the label'),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'formatOptions'],
    },
    docs: {
      subtitle: 'Range input control for selecting numeric values.',
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const Range: Story = {
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
