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

import type { StoryObj, Meta } from '@storybook/react';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './button';
import type { ButtonProps, LinkButtonProps, ToggleButtonProps } from './types';

const meta: Meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Hello',
  },
};

export default meta;

export const Default: StoryObj<ButtonProps> = {
  render: (props) => (
    <Button {...props}>
      {['icon', 'floating'].includes(`${props.variant}`) ? (
        <Icon>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <title>Example Icon</title>
            <path
              d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
              clipRule='evenodd'
              fillRule='evenodd'
            />
          </svg>
        </Icon>
      ) : (
        props.children
      )}
    </Button>
  ),
};

export const Link: StoryObj<LinkButtonProps> = {
  render: (props) => (
    <LinkButton {...props}>
      {['icon', 'floating'].includes(`${props.variant}`) ? (
        <Icon>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <title>Example Icon</title>
            <path
              d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
              clipRule='evenodd'
              fillRule='evenodd'
            />
          </svg>
        </Icon>
      ) : (
        props.children
      )}
    </LinkButton>
  ),
};

export const Toggle: StoryObj<ToggleButtonProps> = {
  render: (props) => (
    <ToggleButton {...props}>
      {['icon', 'floating'].includes(`${props.variant}`) ? (
        <Icon>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <title>Example Icon</title>
            <path
              d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
              clipRule='evenodd'
              fillRule='evenodd'
            />
          </svg>
        </Icon>
      ) : (
        props.children
      )}
    </ToggleButton>
  ),
};
