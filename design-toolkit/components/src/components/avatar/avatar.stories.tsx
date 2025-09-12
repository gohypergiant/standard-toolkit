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

import {
  createSizeControl,
  createStandardParameters,
} from '^storybook/utils/controls';
import { MOCK_DATA } from '^storybook/utils/mock-data';
import { createSizeVariantsStory } from '^storybook/utils/templates';
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
      alt: 'User avatar',
      src: MOCK_DATA.USERS[0]?.avatar,
    },
    size: 'medium',
  },
  argTypes: {
    size: createSizeControl('COMPACT'),
  },
  parameters: {
    ...createStandardParameters('content'),
    docs: {
      subtitle: 'A user profile image component with fallback support',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Avatar> = {
  render: (args) => <Avatar {...args} />,
};

export const WithBadge: StoryObj<typeof Avatar> = {
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
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};

export const WithContent: StoryObj<typeof Avatar> = {
  args: {
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
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};

export const AllSizes: StoryObj<typeof Avatar> = createSizeVariantsStory({
  Component: Avatar,
  sizes: ['small', 'medium'],
  baseProps: {
    imageProps: {
      alt: 'User avatar',
      src: MOCK_DATA.USERS[0]?.avatar,
    },
  },
});

export const UserGallery: StoryObj<typeof Avatar> = {
  name: 'User Examples',
  render: () => (
    <div className='flex items-center gap-m'>
      {MOCK_DATA.USERS.map((user) => (
        <div key={user.id} className='flex flex-col items-center gap-s'>
          <Avatar
            imageProps={{
              alt: user.name,
              src: user.avatar,
            }}
          >
            <Badge
              variant={
                user.status === 'online'
                  ? 'normal'
                  : user.status === 'away'
                    ? 'advisory'
                    : 'critical'
              }
            />
          </Avatar>
          <span className='fg-primary-bold text-center text-body-s'>
            {user.name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
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
