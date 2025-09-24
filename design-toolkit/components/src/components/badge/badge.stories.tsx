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
  COMMON_ARG_TYPES,
  createArgTypeSelect,
  createParameters,
} from '^storybook/utils';
import { CRITICALITY_VALUES } from '@/constants/criticality-variants';
import { Badge } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: '',
    variant: 'info',
  },
  argTypes: {
    children: COMMON_ARG_TYPES.children,
    variant: createArgTypeSelect(
      'Badge color variant indicating different levels of importance',
      CRITICALITY_VALUES,
    ),
  },
  parameters: {
    ...createParameters('centered'),
    docs: {
      subtitle:
        'A small status indicator component for labeling and notifications',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Badge {...args} />,
};

export const WithText: Story = {
  name: 'With Text',
  render: (args) => (
    <div className='flex items-center gap-m'>
      <span className='fg-primary-bold text-body-m'>
        You have new notifications
      </span>
      <Badge {...args} />
    </div>
  ),
  args: {
    // Note: this is to override defaults for this story specifically
    children: '99+',
  },
};
