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
import { PopoverContent } from './content';
import { PopoverFooter } from './footer';
import { PopoverTitle } from './title';
import { PopoverTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react-vite';

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

export const Simple: StoryObj<typeof meta> = {
  render: ({ ...args }) => (
    <PopoverTrigger>
      <Icon className='fg-primary-bold'>
        <Information />
      </Icon>
      <Popover {...args}>
        <PopoverTitle>Popover Title</PopoverTitle>
        <PopoverContent>
          Lorum Ipsum text for the dialog shall go here.
        </PopoverContent>
      </Popover>
    </PopoverTrigger>
  ),
};

export const WithActions: StoryObj<typeof meta> = {
  render: () => (
    <PopoverTrigger>
      <Button variant='icon'>
        <Icon>
          <Delete />
        </Icon>
      </Button>
      <Popover>
        {({ close }) => (
          <>
            <PopoverTitle>Delete Item</PopoverTitle>
            <PopoverContent>
              Are you sure you want to delete this item?
            </PopoverContent>
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
      </Popover>
    </PopoverTrigger>
  ),
};

export const CustomComposition: StoryObj<typeof meta> = {
  render: () => {
    return (
      <PopoverTrigger>
        <span className='fg-primary-bold'>Settings</span>
        <Popover classNames={{ popover: 'min-w-sm' }}>
          {() => (
            <>
              <PopoverTitle>Notification Settings</PopoverTitle>
              <PopoverContent className='space-y-s'>
                <Checkbox>Email Notifications</Checkbox>
                <Checkbox>Push Notifications</Checkbox>
                <Checkbox>SMS Notifications</Checkbox>
              </PopoverContent>
            </>
          )}
        </Popover>
      </PopoverTrigger>
    );
  },
};
