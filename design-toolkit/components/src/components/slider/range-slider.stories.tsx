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
import { RangeSlider } from './index';

const meta: Meta<typeof Range> = {
  title: 'Components/RangeSlider',
  component: RangeSlider,
  args: {
    orientation: 'horizontal',
    layout: 'stacked',
    label: 'Opacity',
    defaultValue: [20, 30],
    minValue: 0,
    maxValue: 100,
    showInput: true,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <RangeSlider {...args} />
      </div>
    );
  },
};
