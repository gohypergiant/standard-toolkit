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
import { ClassificationBanner } from './index';

const meta: Meta<typeof ClassificationBanner> = {
  title: 'Components/ClassificationBanner',
  component: ClassificationBanner,
  args: {
    className: '',
    children: '',
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
    <ClassificationBanner variant='unclassified' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const CUI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='cui' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const Confidential: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='confidential' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const Secret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='secret' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const TopSecret: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='top-secret' {...args}>
      {children}
    </ClassificationBanner>
  ),
};

export const TopSecretSCI: Story = {
  render: ({ children, ...args }) => (
    <ClassificationBanner variant='top-secret-sci' {...args}>
      {children}
    </ClassificationBanner>
  ),
};
