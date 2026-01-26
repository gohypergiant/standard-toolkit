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

import Add from '@accelint/icons/add';
import Bell from '@accelint/icons/bell';
import Calendar from '@accelint/icons/calendar';
import Edit from '@accelint/icons/edit';
import Settings from '@accelint/icons/settings';
import Star from '@accelint/icons/star';
import { IconPicker } from './';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { IconPickerItem } from './types';

const items: IconPickerItem[] = [
  { id: 'add', icon: Add, label: 'Add' },
  { id: 'edit', icon: Edit, label: 'Edit' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'bell', icon: Bell, label: 'Notifications' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
];

const meta = {
  title: 'Components/IconPicker',
  component: IconPicker,
  args: {
    items,
  },
  argTypes: {
    items: {
      description: 'Array of icon items to choose from.',
    },
    classNames: {
      description: 'Custom class names for picker, item, and icon elements.',
    },
    selectedKeys: {
      control: {
        type: 'select',
        options: ['add', 'edit', 'settings', 'star', 'bell', 'calendar'],
      },
      description: 'The currently selected icon.',
    },
    onSelectionChange: {
      action: 'changed',
      description: 'Callback function when the selection changes.',
    },
  },
  parameters: {
    controls: {
      include: ['items', 'classNames', 'selectedKeys', 'onSelectionChange'],
    },
  },
} satisfies Meta<typeof IconPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: IconPicker,
};

export const Controlled: Story = {
  args: {
    selectedKeys: ['settings'],
  },
  render: IconPicker,
};
