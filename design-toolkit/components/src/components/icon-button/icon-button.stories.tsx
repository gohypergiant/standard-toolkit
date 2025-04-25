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

import { Link as LinkIcon } from '@/icons/link';
import { Placeholder } from '@/icons/placeholder';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../tooltip';
import { IconButton } from './index';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/Icon',
  component: IconButton,
  args: {
    className: '',
    children: 'IconButton',
    isDisabled: false,
    size: 'medium',
    variant: 'primary',
  },
  argTypes: {
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: (args) => (
    <IconButton {...args}>
      <Placeholder />
    </IconButton>
  ),
};

export const Link: Story = {
  render: (args) => (
    <a className={IconButton.as(args)} href='/'>
      <LinkIcon />
    </a>
  ),
};

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip>
      <Tooltip.Trigger>
        <IconButton {...args}>
          <Placeholder />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Body>Tool label</Tooltip.Body>
    </Tooltip>
  ),
};
