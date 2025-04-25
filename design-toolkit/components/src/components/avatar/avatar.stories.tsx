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
import { Badge } from '../badge';
import { Avatar } from './';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    className: '',
    children: '',
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <Avatar
      source='/static/avatar-example.jpeg'
      alt='Colm Tuite'
      {...args}
      className='brightness-150 saturate-200 sepia-50'
    />
  ),
};

export const WithBadge: Story = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar
        source='/static/avatar-example.jpeg'
        alt='Colm Tuite'
        {...args}
        className='brightness-150 saturate-200 sepia-50'
      >
        <Badge variant='serious'>9</Badge>
      </Avatar>

      <Avatar
        source='/static/avatar-example.jpeg'
        alt='Colm Tuite'
        {...args}
        className='brightness-150 saturate-200 sepia-50'
      >
        <Badge variant='serious' />
      </Avatar>
    </div>
  ),
};

export const WithFallback: Story = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar alt='Colm Tuite' {...args} />
      <Avatar source='/static/avatar-example.jpeg' alt='Colm Tuite' {...args} />
      <Avatar alt='Colm Tuite' source={<>PX</>} {...args}>
        <Badge variant={'info'} />
      </Avatar>
    </div>
  ),
};
