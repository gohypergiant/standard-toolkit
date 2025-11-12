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
import { composeRenderProps } from 'react-aria-components';
import { Icon } from '../icon';
import { Button } from './';
import { LinkButton } from './link';
import { ToggleButton } from './toggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    size: 'medium',
    isDisabled: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent', 'serious', 'critical'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'flat', 'icon', 'floating'],
    },
  },
  parameters: {
    controls: {
      exclude: [
        'form',
        'formAction',
        'formEncType',
        'formMethod',
        'formNoValidate',
        'formTarget',
        'name',
        'value',
      ],
    },
  },
} satisfies Meta<typeof Button>;

const metaForLink = {
  ...meta,
  component: LinkButton,
} satisfies Meta<typeof LinkButton>;

const metaForToggle = {
  ...meta,
  component: ToggleButton,
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryForLink = StoryObj<typeof metaForLink>;
type StoryForToggle = StoryObj<typeof metaForToggle>;

export const Default: Story = {
  args: {
    color: 'mono-muted',
    variant: 'flat',
  },
  render: ({ children, ...props }) => (
    <Button {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' || props.variant === 'floating' ? (
          <Icon>
            <Placeholder />
          </Icon>
        ) : (
          children
        ),
      )}
    </Button>
  ),
};

export const Link: StoryForLink = {
  args: {
    color: 'mono-muted',
    variant: 'flat',
  },
  render: ({ children, ...props }) => (
    <LinkButton {...props} href='/'>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' || props.variant === 'floating' ? (
          <Icon>
            <Placeholder />
          </Icon>
        ) : (
          children
        ),
      )}
    </LinkButton>
  ),
};

export const Toggle: StoryForToggle = {
  args: {
    color: 'mono-muted',
    variant: 'flat',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'flat', 'icon'],
    },
  },
  render: ({ children, ...props }) => (
    <ToggleButton {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' ? (
          <Icon>
            <Placeholder />
          </Icon>
        ) : (
          children
        ),
      )}
    </ToggleButton>
  ),
};
