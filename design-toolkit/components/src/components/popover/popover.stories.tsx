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

import { Button } from '@/components/button';
import type { Meta, StoryObj } from '@storybook/react';
import { DialogTrigger } from 'react-aria-components';
import { Popover } from './index';

/**
 * The `<Popover>` component is a direct wrapper around the `Popover` component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Popover.html">here</a>.
 */

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    className: '',
    header: 'Help',
    body: 'For help accessing your account, please contact support.',
    placement: 'bottom',
  },
  argTypes: {
    className: {
      control: 'text',
      type: 'string',
      table: { defaultValue: { summary: '' } },
    },
    header: {
      control: 'text',
      type: 'string',
      table: { defaultValue: { summary: '' } },
    },
    body: {
      control: 'text',
      type: 'string',
      table: { defaultValue: { summary: '' } },
    },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: ({ ...args }) => (
    <DialogTrigger>
      <Button variant='outline' aria-label='Help'>
        ⓘ
      </Button>
      <Popover {...args} />
    </DialogTrigger>
  ),
};
