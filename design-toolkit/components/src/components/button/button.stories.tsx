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
} from '^storybook/shared-controls';
import { createStatesStory } from '^storybook/story-templates';
import { Placeholder } from '@accelint/icons';
import { composeRenderProps } from 'react-aria-components';
import { CRITICALITY_VARIANTS } from '@/constants/criticality-variants';
import { SIZE_VARIANTS } from '@/constants/size-variants';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './';
import { ButtonStylesDefaults } from './styles';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    color: ButtonStylesDefaults.color,
    size: 'medium',
    variant: ButtonStylesDefaults.variant,
    isDisabled: false,
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        CRITICALITY_VARIANTS.info,
        CRITICALITY_VARIANTS.serious,
        CRITICALITY_VARIANTS.critical,
      ],
    },
    size: createSizeControl('FULL'), // Button supports all size variants
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outline', 'flat', 'icon', 'floating'],
    },
    isDisabled: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: {
    ...createStandardParameters('form'),
    docs: {
      subtitle:
        'A versatile interactive button component with multiple variants',
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
    <LinkButton {...props} href='#' onClick={(e) => e.preventDefault()}>
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

export const States: StoryObj<typeof Button> = createStatesStory({
  Component: Button,
  baseProps: { children: 'Button' },
  stateProps: {
    disabled: { isDisabled: true, children: 'Disabled' },
    loading: { isPending: true, children: 'Loading...' },
  },
});

export const AllVariants: StoryObj<typeof Button> = {
  render: () => (
    <div className='flex gap-xl'>
      {['filled', 'outline', 'flat', 'icon', 'floating'].map((variant) => (
        <div key={variant} className='space-y-s'>
          <h4 className='fg-primary-bold text-header-l capitalize'>
            {variant}
          </h4>
          <div className='space-y-xs'>
            {Object.values(SIZE_VARIANTS).map((size) => (
              <Button
                className='capitalize'
                key={size}
                size={size}
                variant={
                  `${variant ?? 'filled'}` as
                    | 'flat'
                    | 'icon'
                    | 'filled'
                    | 'outline'
                    | 'floating'
                    | undefined
                }
              >
                {variant === 'floating' ? size[0] : size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};
