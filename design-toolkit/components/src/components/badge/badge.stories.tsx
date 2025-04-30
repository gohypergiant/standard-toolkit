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
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    className: '',
    children: '',
    variant: 'info',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'normal', 'serious', 'critical', 'advisory'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: ({ children, ...args }) => <Badge {...args}>{children}</Badge>,
};

export const WithText: Story = {
  render: ({ children, ...args }) => (
    <Badge {...args}>{children || '99+'}</Badge>
  ),
};
