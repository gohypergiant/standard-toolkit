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

import { Placeholder } from '@accelint/icons';
import { Badge } from '../badge';
import { Icon } from '../icon';
import { Avatar } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    children: '',
    imageProps: {
      alt: 'Dog',
      src: 'https://placedog.net/100x100?id=144',
    },
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

export const Default: StoryObj<typeof Avatar> = {
  render: Avatar,
};

export const WithBadge: StoryObj<typeof Avatar> = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar {...args}>
        <Badge variant='critical'>99+</Badge>
      </Avatar>
      <Avatar {...args}>
        <Badge variant='serious'>1</Badge>
      </Avatar>
      <Avatar {...args}>
        <Badge variant='normal' />
      </Avatar>
    </div>
  ),
};

export const WithContent: StoryObj<typeof Avatar> = {
  args: {
    children: <span className='fg-primary-bold text-shadow-2xs'>DS</span>,
  },
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar {...args}>{children}</Avatar>
      <Avatar {...args}>
        <Icon className='fg-primary-bold'>
          <Placeholder />
        </Icon>
      </Avatar>
      <Avatar {...args} classNames={{ content: 'items-end' }}>
        <Badge offset={0} placement='bottom' variant='critical'>
          Offline
        </Badge>
      </Avatar>
    </div>
  ),
};

// Needs to be static (or memoized) to not cause max call stack error with rerendering Fallback (Storybook only issue?)
const fallbackPropsIcon = {
  children: (
    <Icon>
      <Placeholder />
    </Icon>
  ),
};
const fallbackPropsInitials = { children: <>DS</> };

export const WithFallback: StoryObj<typeof Avatar> = {
  args: {
    imageProps: { alt: 'broken url', src: 'http://not-here' },
  },
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-m'>
      <Avatar {...args} />
      <Avatar {...args} fallbackProps={fallbackPropsIcon} />
      <Avatar {...args} fallbackProps={fallbackPropsInitials} />
    </div>
  ),
};
