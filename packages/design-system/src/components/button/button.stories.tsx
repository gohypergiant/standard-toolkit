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

import { actions } from '../../ladle/actions';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './';
import type { Story, StoryDefault } from '@ladle/react';
import type { ButtonProps, LinkButtonProps, ToggleButtonProps } from './types';

export default {
  title: 'Components/Button',
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hello',
    },
    color: {
      control: {
        type: 'select',
      },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'advisory',
        'affirmative',
        'serious',
        'critical',
      ],
      defaultValue: 'primary',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    variant: {
      control: {
        type: 'select',
      },
      options: ['solid', 'hollow', 'bare', 'icon', 'floating'],
      defaultValue: 'solid',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

export const ButtonExample: Story<ButtonProps> = ({
  children,
  variant,
  ...rest
}) => (
  <Button
    {...rest}
    variant={variant}
    {...actions<ButtonProps>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onKeyDown',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
    )}
  >
    {['icon', 'floating'].includes(`${variant}`) ? (
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path
            d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    ) : (
      children
    )}
  </Button>
);

ButtonExample.storyName = 'Button';

export const LinkExample: Story<LinkButtonProps> = ({
  children,
  variant,
  ...rest
}) => (
  <LinkButton
    {...rest}
    variant={variant}
    {...actions<LinkButtonProps>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onKeyDown',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
    )}
  >
    {['icon', 'floating'].includes(`${variant}`) ? (
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path
            d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    ) : (
      children
    )}
  </LinkButton>
);

LinkExample.storyName = 'Link';

LinkExample.argTypes = {
  href: {
    control: {
      type: 'text',
    },
    defaultValue: window.location.href,
  },
  // And all other standard Link DOM attributes
};

export const ControlledToggleExample: Story<ToggleButtonProps> = ({
  children,
  variant,
  ...rest
}) => (
  <ToggleButton
    {...rest}
    variant={variant}
    {...actions<ToggleButtonProps>(
      'onBlur',
      'onChange',
      'onFocus',
      'onFocusChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onKeyDown',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
    )}
  >
    {['icon', 'floating'].includes(`${variant}`) ? (
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path
            d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    ) : (
      children
    )}
  </ToggleButton>
);

ControlledToggleExample.storyName = 'Toggle / Controlled';

ControlledToggleExample.argTypes = {
  isSelected: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const UncontrolledToggleExample: Story<ToggleButtonProps> = ({
  children,
  variant,
  ...rest
}) => (
  <ToggleButton
    {...rest}
    defaultSelected={false}
    variant={variant}
    {...actions<ToggleButtonProps>(
      'onBlur',
      'onChange',
      'onFocus',
      'onFocusChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onKeyDown',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
    )}
  >
    {['icon', 'floating'].includes(`${variant}`) ? (
      <Icon>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Ladle</title>
          <path
            d='M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z'
            clipRule='evenodd'
            fillRule='evenodd'
          />
        </svg>
      </Icon>
    ) : (
      children
    )}
  </ToggleButton>
);

UncontrolledToggleExample.storyName = 'Toggle / Uncontrolled';
