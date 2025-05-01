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
    className: undefined,
    children: '',
    source: 'https://placedog.net/100x100?id=144',
    size: 'medium',
  },
  argTypes: {
    className: {
      type: 'string',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
    source: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <Avatar
      source='https://placedog.net/100x100?id=144'
      alt='Cute Doggie'
      {...args}
    />
  ),
};

export const WithBadge: Story = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar
        source='https://placedog.net/100x100?id=144'
        alt='Cute Doggie'
        {...args}
      >
        <Badge variant='serious'>9</Badge>
      </Avatar>

      <Avatar
        source='https://placedog.net/100x100?id=144'
        alt='Cute Doggie'
        {...args}
      >
        <Badge variant='serious' />
      </Avatar>
    </div>
  ),
};

export const WithFallback: Story = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar {...args} source='http://not-here' alt='Cute Doggie' />
      <Avatar
        source='https://placedog.net/100x100?id=144'
        alt='Cute Doggie'
        {...args}
      />
      <Avatar {...args} alt='Cute Doggie' source={<>PX</>}>
        <Badge variant={'info'} />
      </Avatar>
    </div>
  ),
};
