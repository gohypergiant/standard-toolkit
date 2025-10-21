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

import { COMMON_CONTROL, createControl, EXCLUSIONS } from '^storybook/utils';
import { Placeholder } from '@accelint/icons';
import { Icon } from '../icon';
import { Link } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    allowsVisited: false,
    children: 'Text',
    isDisabled: false,
    isVisited: false,
  },
  argTypes: {
    children: COMMON_CONTROL.children,
    allowsVisited: createControl.boolean(
      'Whether the link can be styled when visited',
    ),
    isDisabled: COMMON_CONTROL.isDisabled,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle: 'Accessible link component for navigation and actions.',
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: Link,
};

export const CustomVisitedStyles: Story = {
  args: {
    allowsVisited: true,
  },
  render: ({ children, ...args }) => (
    <Link.Provider
      {...args}
      className='enabled:visited:fg-accent-primary-pressed enabled:visited:underline'
    >
      <Link isVisited>{children}</Link>
    </Link.Provider>
  ),
};

export const Multiple: Story = {
  render: ({ children, ...args }) => (
    <>
      <p className='fg-primary-bold'>
        Some example text with a
        <Link {...args}>
          <Icon size='small'>
            <Placeholder />
          </Icon>
          {children as ReactNode}
        </Link>
        injected into it. There can be multiple
        <Link {...args}>
          <Icon size='small'>
            <Placeholder />
          </Icon>
          {children as ReactNode}
        </Link>
        here.
      </p>
    </>
  ),
};
