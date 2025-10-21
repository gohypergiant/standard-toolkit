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

import { EXCLUSIONS } from '^storybook/utils';
import { ColorPicker } from './';
import type { Meta, StoryObj } from '@storybook/react';

const PRESETS = [
  '#ECECE6',
  '#898989',
  '#62a6ff',
  '#30D27E',
  '#FCA400',
  '#D4231D',
];

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  args: {
    items: PRESETS,
  },
  argTypes: {
    value: {
      control: {
        type: 'color',
        presetColors: PRESETS,
      },
      description: 'The currently selected color.',
    },
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'Color picker component for selecting colors from a predefined palette.',
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ColorPicker,
};

export const Controlled: Story = {
  args: {
    value: '#30D27E',
  },
  render: ColorPicker,
};
