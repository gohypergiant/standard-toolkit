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
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    color: 'mono-muted',
    size: 'medium',
    variant: 'filled',
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
      options: ['filled', 'outline', 'flat', 'icon'],
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

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: ({ children, ...props }) => (
    <Button {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' ? (
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

const metaForLink = {
  ...meta,
  component: LinkButton,
} satisfies Meta<typeof LinkButton>;

export const Link: StoryObj<typeof metaForLink> = {
  render: ({ children, ...props }) => (
    <LinkButton {...props} href='/'>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' ? (
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

const metaForToggle = {
  ...meta,
  component: ToggleButton,
  args: {
    variant: 'flat',
  },
} satisfies Meta<typeof ToggleButton>;

export const Toggle: StoryObj<typeof metaForToggle> = {
  args: {
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
