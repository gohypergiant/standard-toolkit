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

import { ColorPicker } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  args: {
    items: ['#ECECE6', '#898989', '#62a6ff', '#30D27E', '#FCA400', '#D4231D'],
  },
  argTypes: {
    className: { type: 'string' },
    value: {
      control: {
        type: 'color',
        presetColors: [
          '#ECECE6',
          '#898989',
          '#62a6ff',
          '#30D27E',
          '#FCA400',
          '#D4231D',
        ],
      },
      description: 'The currently selected color.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when the color is changed.',
    },
    items: {
      description: 'Array of color options to choose from.',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ColorPicker> = {
  render: ColorPicker,
};

export const Controlled: StoryObj<typeof ColorPicker> = {
  args: {
    value: '#30D27E',
  },
  render: ColorPicker,
};
