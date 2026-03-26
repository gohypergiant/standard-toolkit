/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useTheme } from '../../providers/theme-provider';
import { ColorPicker } from './';
import type { Rgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
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
    isRequired: {
      control: 'boolean',
      description: 'Whether the associated field is required.',
    },
    items: {
      description: 'Array of color options to choose from.',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the picker.',
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ColorPicker,
};

export const WithLabel: Story = {
  args: {
    label: 'Pick a color',
  },
  render: ColorPicker,
};

export const Controlled: Story = {
  args: {
    value: '#30D27E',
  },
  render: ColorPicker,
};

const rgbaItems: Rgba255Tuple[] = [
  [236, 236, 230, 255],
  [137, 137, 137, 255],
  [98, 166, 255, 255],
  [48, 210, 126, 255],
  [252, 164, 0, 255],
  [212, 35, 29, 255],
];

export const RgbaTuples: Story = {
  args: {
    items: rgbaItems,
    defaultValue: [48, 210, 126, 255] satisfies Rgba255Tuple,
  },
  render: ColorPicker,
};

export const MixedItems: Story = {
  args: {
    items: [
      '#ECECE6',
      [98, 166, 255, 255] satisfies Rgba255Tuple,
      '#30D27E',
      [252, 164, 0, 255] satisfies Rgba255Tuple,
    ],
  },
  render: ColorPicker,
};

export const ThemeTokens: Story = {
  render: (args) => {
    const { tokens } = useTheme();

    return (
      <ColorPicker
        {...args}
        items={[
          tokens.bg.accent.primary.bold,
          tokens.bg.info.bold,
          tokens.bg.advisory.bold,
          tokens.bg.normal.bold,
          tokens.bg.serious.bold,
          tokens.bg.critical.bold,
        ]}
        defaultValue={tokens.bg.accent.primary.bold}
      />
    );
  },
};
