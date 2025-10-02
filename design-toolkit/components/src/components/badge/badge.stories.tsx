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
import { CRITICALITY } from '@/constants/criticality';
import { Badge } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: '',
    variant: CRITICALITY.INFO,
  },
  argTypes: {
    children: COMMON_CONTROL.children,
    variant: createControl.select(
      'Badge color variant indicating different levels of importance',
      Object.values(CRITICALITY),
    ),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'A small status indicator component for labeling and notifications',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Badge,
};

export const WithText: Story = {
  args: {
    // Note: this is to override defaults for this story specifically
    children: '99+',
  },
  render: Badge,
};
