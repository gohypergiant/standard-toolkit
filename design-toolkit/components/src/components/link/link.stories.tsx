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
import { Icon } from '../icon';
import { Link } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Text',
    isDisabled: false,
    isVisited: false,
    allowsVisited: false,
  },
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
    allowsVisited: {
      control: 'boolean',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Link> = {
  render: (args) => <Link {...args} />,
};

export const WithIcon: StoryObj<typeof Link> = {
  render: ({ children, ...args }) => (
    <Link {...args}>
      <>
        <Icon>
          <Placeholder />
        </Icon>
        {children}
      </>
    </Link>
  ),
};

export const CustomVisitedStyles: StoryObj<typeof Link> = {
  args: {
    allowsVisited: true,
  },
  render: ({ children, ...args }) => (
    <Link.Provider
      {...args}
      className='enabled:visited:fg-accent-primary-pressed enabled:visited:underline'
    >
      <Link>{children}</Link>
    </Link.Provider>
  ),
};

export const Injected: StoryObj<typeof Link> = {
  render: ({ children, ...args }) => (
    <>
      <p className='fg-primary-bold'>
        Some example text with a
        <Link {...args}>
          <>
            <Icon>
              <Placeholder />
            </Icon>
            {children}
          </>
        </Link>
        injected into it. There can be multiple
        <Link {...args}>
          <>
            <Icon>
              <Placeholder />
            </Icon>
            {children}
          </>
        </Link>
        here.
      </p>
    </>
  ),
};
