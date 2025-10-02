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
  COMMON_CONTROL,
  createControl,
  createStatesStory,
  EXCLUSIONS,
  hideControls,
} from '^storybook/utils';
import { Placeholder } from '@accelint/icons';
import { composeRenderProps } from 'react-aria-components';
import { SIZE } from '@/constants/size';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './';
import { COLORS } from './colors';
import { SIZES } from './sizes';
import { VARIANTS } from './variants';
import type { Meta, StoryObj } from '@storybook/react';
import type { Variant } from './types';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    color: COLORS.MONO_MUTED,
    isDisabled: false,
    size: SIZES.MEDIUM,
    variant: VARIANTS.FLAT,
  },
  argTypes: {
    children: COMMON_CONTROL.children,
    color: createControl.select(
      'Color variant indicating different levels of importance',
      Object.values(COLORS),
      COLORS.ACCENT,
    ),
    isDisabled: COMMON_CONTROL.isDisabled,
    size: createControl.select(
      'Size variant of the component',
      Object.values(SIZES),
    ),
    variant: createControl.select(
      'Button variant',
      Object.values(VARIANTS),
      VARIANTS.OUTLINE,
    ),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle:
        'A versatile interactive button component with multiple variants',
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
  render: ({ children, ...props }) => (
    <Button {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === VARIANTS.ICON ||
        props.variant === VARIANTS.FLOATING ? (
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
  render: ({ children, ...props }) => (
    <LinkButton {...props} href='#' onClick={(e) => e.preventDefault()}>
      {composeRenderProps(children, (children) =>
        props.variant === VARIANTS.ICON ||
        props.variant === VARIANTS.FLOATING ? (
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
  argTypes: {
    // NOTE: custom variant options specifically for Toggle
    variant: createControl.select('Button variant', [
      VARIANTS.OUTLINE,
      VARIANTS.FLAT,
      VARIANTS.ICON,
    ]),
  },
  render: ({ children, ...props }) => (
    <ToggleButton {...props}>
      {composeRenderProps(children, (children) =>
        props.variant === VARIANTS.ICON ? (
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

export const States: Story = createStatesStory({
  Component: Button,
  baseProps: { children: 'Button' },
  stateProps: {
    disabled: { isDisabled: true, children: 'Disabled' },
    loading: { isPending: true, children: 'Loading...' },
  },
});

export const AllVariants: Story = {
  render: () => (
    <div className='flex gap-xl'>
      {Object.values(VARIANTS).map((variant: Variant[keyof Variant]) => (
        <div key={variant} className='space-y-s'>
          <h4 className='fg-primary-bold text-header-l capitalize'>
            {variant}
          </h4>
          <div className='space-y-xs'>
            {Object.values(SIZE).map((size) => (
              <Button
                className='capitalize'
                key={size}
                size={size}
                variant={variant}
              >
                {variant === VARIANTS.FLOATING ? size[0] : size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  ...hideControls(meta),
};
