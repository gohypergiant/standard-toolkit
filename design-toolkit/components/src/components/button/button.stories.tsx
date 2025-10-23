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
import { useState } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { Icon } from '../icon';
import { Button, LinkButton, ToggleButton } from './';
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

export const PerfTest: Story = {
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
  render: (props) => {
    const [key, setKey] = useState(0);

    return (
      <div className='flex flex-col gap-l'>
        <Button
          variant='outline'
          onPress={() => setKey((oldKey) => oldKey + 1)}
        >
          Rerender
        </Button>
        <div key={key} className='grid grid-cols-4 gap-s'>
          {Array.from({ length: 1000 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: intentional
            <Button key={i} {...props}>
              Button {i}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};
