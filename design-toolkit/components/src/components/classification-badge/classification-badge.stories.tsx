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
import { ClassificationBadge } from './index';

const meta: Meta<typeof ClassificationBadge> = {
  title: 'Components/ClassificationBadge',
  component: ClassificationBadge,
  args: {
    className: '',
    children: '',
    size: 'medium',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClassificationBadge>;

export const Missing: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='missing' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const Unclassified: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='unclassified' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const CUI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='cui' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const Confidential: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='confidential' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const Secret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='secret' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const TopSecret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='top-secret' {...args}>
      {children}
    </ClassificationBadge>
  ),
};

export const TopSecretSCI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBadge variant='top-secret-sci' {...args}>
      {children}
    </ClassificationBadge>
  ),
};
