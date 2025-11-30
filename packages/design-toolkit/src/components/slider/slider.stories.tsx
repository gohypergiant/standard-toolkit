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
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
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
    isDisabled: false,
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
    markers: {
      control: 'object',
      description: 'Configure discrete marker points on the slider track',
    },
    showMarkerLabels: {
      control: 'boolean',
      description: 'Whether to show labels on markers',
    },
    snapToMarkers: {
      control: 'boolean',
      description: 'When true, the slider can only be set to marker values',
    },
    showInput: {
      control: 'boolean',
      description: 'Whether to display numeric input fields',
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

export const WithInput: Story = {
  args: {
    defaultValue: 50,
    label: 'Volume',
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

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const RangeWithInput: Story = {
  args: {
    defaultValue: [20, 80],
    label: 'Price Range',
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

export const WithEvenlySpacedMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Volume',
    markers: 5,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const WithSpecificMarkerValues: Story = {
  args: {
    defaultValue: 50,
    label: 'Temperature (°F)',
    markers: [0, 32, 72, 100],
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const WithLabeledMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Quality',
    markers: [
      { value: 0, label: 'Low' },
      { value: 50, label: 'Medium' },
      { value: 100, label: 'High' },
    ],
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const WithDetailedLabeledMarkers: Story = {
  args: {
    defaultValue: 25,
    label: 'Video Quality',
    markers: [
      { value: 0, label: '480p' },
      { value: 25, label: '720p' },
      { value: 50, label: '1080p' },
      { value: 75, label: '1440p' },
      { value: 100, label: '4K' },
    ],
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const VerticalWithMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Brightness',
    orientation: 'vertical',
    markers: [
      { value: 0, label: 'Min' },
      { value: 50, label: '50%' },
      { value: 100, label: 'Max' },
    ],
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='h-[300px] w-[200px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const RangeWithMarkers: Story = {
  args: {
    defaultValue: [25, 75],
    label: 'Price Range',
    markers: [0, 25, 50, 75, 100],
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const DisabledWithMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Disabled Slider',
    isDisabled: true,
    markers: 5,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const SnapToMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Discrete Selection',
    markers: [0, 25, 50, 75, 100],
    snapToMarkers: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const SnapToLabeledMarkers: Story = {
  args: {
    defaultValue: 50,
    label: 'Rating',
    markers: [
      { value: 0, label: 'Poor' },
      { value: 25, label: 'Fair' },
      { value: 50, label: 'Good' },
      { value: 75, label: 'Great' },
      { value: 100, label: 'Excellent' },
    ],
    snapToMarkers: true,
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const SnapToUnevenMarkers: Story = {
  args: {
    defaultValue: 0,
    label: 'Zoom Level',
    markers: [
      { value: 0, label: '1x' },
      { value: 10, label: '2x' },
      { value: 25, label: '4x' },
      { value: 50, label: '8x' },
      { value: 100, label: '16x' },
    ],
    snapToMarkers: true,
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};

export const RangeWithSnap: Story = {
  args: {
    defaultValue: [25, 75],
    label: 'Price Range',
    markers: [
      { value: 0, label: '$0' },
      { value: 25, label: '$25' },
      { value: 50, label: '$50' },
      { value: 75, label: '$75' },
      { value: 100, label: '$100' },
    ],
    snapToMarkers: true,
    showMarkerLabels: true,
  },
  render: ({ ...args }) => {
    return (
      <div className='size-[400px]'>
        <Slider {...args} />
      </div>
    );
  },
};
