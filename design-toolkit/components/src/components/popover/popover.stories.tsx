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
import { Delete, Information } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
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
    placement: 'bottom',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Simple: Story = {
  render: ({ ...args }) => (
    <Popover>
      <Popover.Trigger>
        <Icon className='fg-primary-bold'>
          <Information />
        </Icon>
      </Popover.Trigger>
      <Popover.Content {...args}>
        <Popover.Title>Popover Title</Popover.Title>
        <Popover.Body>
          Lorum Ipsum text for the dialog shall go here.
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <Button variant='icon'>
          <Icon>
            <Delete />
          </Icon>
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        {({ close }) => (
          <>
            <Popover.Title>Delete Item</Popover.Title>
            <Popover.Body>
              Are you sure you want to delete this item?
            </Popover.Body>
            <Popover.Footer>
              <Button variant='flat' onPress={close}>
                Cancel
              </Button>
              <Button variant='filled' onPress={close}>
                CTA
              </Button>
            </Popover.Footer>
          </>
        )}
      </Popover.Content>
    </Popover>
  ),
};

export const CustomComposition: Story = {
  render: () => {
    return (
      <Popover>
        <Popover.Trigger>
          <span className='fg-primary-bold'>Settings</span>
        </Popover.Trigger>
        <Popover.Content className='min-w-sm'>
          {() => (
            <>
              <Popover.Title>Notification Settings</Popover.Title>
              <Popover.Body className='space-y-s'>
                <Checkbox>Email Notifications</Checkbox>
                <Checkbox>Push Notifications</Checkbox>
                <Checkbox>SMS Notifications</Checkbox>
              </Popover.Body>
            </>
          )}
        </Popover.Content>
      </Popover>
    );
  },
};
