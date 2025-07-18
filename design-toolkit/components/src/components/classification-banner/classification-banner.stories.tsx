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

import { ClassificationBanner } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ClassificationBanner> = {
  title: 'Components/ClassificationBanner',
  component: ClassificationBanner,
  args: {
    className: undefined,
    children: '',
    variant: 'missing',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: [
        'missing',
        'unclassified',
        'cui',
        'confidential',
        'secret',
        'top-secret',
        'ts-sci',
      ],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ClassificationBanner>;

export const Missing: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='missing' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const Unclassified: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='unclassified'>
      {children}
    </ClassificationBanner>
  ),
};

export const CUI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='cui'>
      {children}
    </ClassificationBanner>
  ),
};

export const Confidential: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='confidential'>
      {children}
    </ClassificationBanner>
  ),
};

export const Secret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='secret'>
      {children}
    </ClassificationBanner>
  ),
};

export const TopSecret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='top-secret'>
      {children}
    </ClassificationBanner>
  ),
};

export const TopSecretSCI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner {...args} variant='ts-sci'>
      {children}
    </ClassificationBanner>
  ),
};
