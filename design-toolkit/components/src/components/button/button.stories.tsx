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

import { Placeholder } from '@/icons/placeholder';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    className: '',
    children: 'Button',
    isDisabled: false,
    size: 'medium',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'flat', 'destructive', 'critical'],
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: ({ children, ...args }) => <Button {...args}>{children}</Button>,
};

export const Link: Story = {
  render: (args) => (
    <a className={Button.as(args)} href='/'>
      Link
    </a>
  ),
};

export const ButtonWithLeftIcon: Story = {
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Placeholder />
      {children}
    </Button>
  ),
};

export const ButtonWithRightIcon: Story = {
  render: ({ children, ...args }) => (
    <Button {...args}>
      {children}
      <Placeholder />
    </Button>
  ),
};
