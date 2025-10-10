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

import { COMMON_CONTROL, EXCLUSIONS, MOCK_DATA } from '^storybook/utils';
import { Placeholder } from '@accelint/icons';
import { SIZE } from '@/constants/size';
import { Badge } from '../badge';
import { Icon } from '../icon';
import { Avatar } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    children: '',
    imageProps: {
      alt: 'User avatar',
      src: MOCK_DATA.USERS[0]?.avatar,
    },
    size: SIZE.MEDIUM,
  },
  argTypes: {
    size: COMMON_CONTROL.size.compact,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'fallbackProps'],
    },
    docs: {
      subtitle: 'A user profile image component with fallback support',
    },
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Avatar,
};

export const WithBadge: Story = {
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-l'>
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

export const WithContent: Story = {
  args: {
    // Note: this is to turn off some defaults for this story specifically
    children: <span className='fg-primary-bold text-shadow-2xs'>SC</span>,
    imageProps: undefined,
  },
  render: ({ children, ...args }) => (
    <div className='flex items-center gap-l'>
      {/* Text initials */}
      <Avatar {...args}>{children}</Avatar>

      {/* Icon fallback */}
      <Avatar {...args}>
        <Icon className='fg-primary-bold'>
          <Placeholder />
        </Icon>
      </Avatar>

      {/* Status indicator */}
      <Avatar {...args} classNames={{ content: 'items-end' }}>
        <Badge offset={0} placement='bottom' variant='normal'>
          Online
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

export const WithFallback: Story = {
  args: {
    // Note: this is to turn off some defaults for this story specifically
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
