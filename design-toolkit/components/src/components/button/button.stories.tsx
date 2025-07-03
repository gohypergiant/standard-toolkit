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
import type { Meta, StoryObj } from '@storybook/react';
import { composeRenderProps } from 'react-aria-components';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './';
import { ButtonStylesDefaults } from './styles';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    color: ButtonStylesDefaults.color,
    hierarchy: ButtonStylesDefaults.hierarchy,
    size: ButtonStylesDefaults.size,
    variant: ButtonStylesDefaults.variant,
    isDisabled: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
    hierarchy: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'flat', 'icon', 'floating'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Button> = {
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

export const Link: StoryObj<typeof LinkButton> = {
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

export const Toggle: StoryObj<typeof ToggleButton> = {
  render: ({ children, ...props }) => (
    <ToggleButton {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === 'icon' || props.variant === 'floating' ? (
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
