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

import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonContext, type ButtonProps } from '../button';
import { Group } from './group';
import type { GroupProps } from './types';

const meta: Meta = {
  title: 'Components/Group',
  component: Group,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<GroupProps<ButtonProps, HTMLButtonElement>> = {
  args: {
    orientation: 'horizontal',
    reverse: false,
  },
  argTypes: {
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    reverse: {
      control: {
        type: 'boolean',
      },
    },
  },
  render: (props) => (
    <Group<ButtonProps, HTMLButtonElement>
      {...props}
      context={ButtonContext}
      values={{ size: 'sm', variant: 'bare' }}
    >
      <Button>Foo</Button>
      <Button>Bar</Button>
    </Group>
  ),
};
