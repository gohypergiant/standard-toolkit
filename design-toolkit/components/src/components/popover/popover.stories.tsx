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

import { Delete, Information } from '@accelint/icons';
import { Button } from '@/components/button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Popover } from './';
import { PopoverBody } from './body';
import { PopoverContent } from './content';
import { PopoverFooter } from './footer';
import { PopoverTitle } from './title';
import { PopoverTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * The `<Popover>` component is a direct wrapper around the `Popover` component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Popover.html">here</a>.
 */

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    placement: 'bottom',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  render: ({ ...args }) => (
    <Popover>
      <PopoverTrigger>
        <Icon className='fg-primary-bold'>
          <Information />
        </Icon>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <PopoverTitle>Popover Title</PopoverTitle>
        <PopoverBody>
          Lorum Ipsum text for the dialog shall go here.
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant='icon'>
          <Icon>
            <Delete />
          </Icon>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {({ close }) => (
          <>
            <PopoverTitle>Delete Item</PopoverTitle>
            <PopoverBody>
              Are you sure you want to delete this item?
            </PopoverBody>
            <PopoverFooter>
              <Button variant='flat' onPress={close}>
                Cancel
              </Button>
              <Button variant='filled' onPress={close}>
                CTA
              </Button>
            </PopoverFooter>
          </>
        )}
      </PopoverContent>
    </Popover>
  ),
};

export const CustomComposition: Story = {
  render: () => {
    return (
      <Popover>
        <PopoverTrigger>
          <span className='fg-primary-bold'>Settings</span>
        </PopoverTrigger>
        <PopoverContent className='min-w-sm'>
          {() => (
            <>
              <PopoverTitle>Notification Settings</PopoverTitle>
              <PopoverBody className='space-y-s'>
                <Checkbox>Email Notifications</Checkbox>
                <Checkbox>Push Notifications</Checkbox>
                <Checkbox>SMS Notifications</Checkbox>
              </PopoverBody>
            </>
          )}
        </PopoverContent>
      </Popover>
    );
  },
};
