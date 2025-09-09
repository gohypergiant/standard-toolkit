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

import { useCallback, useRef, useState } from 'react';
import { Button } from '../button';
import { Dialog } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    size: 'small',
    isDismissable: true,
    isKeyboardDismissDisabled: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
    isDismissable: {
      control: 'boolean',
    },
    isKeyboardDismissDisabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: ({ children, ...args }) => {
    return (
      <div className='relative h-[800px] w-[600px] p-l outline outline-info-bold'>
        <Dialog.Trigger>
          <Button>Press Me</Button>
          <Dialog {...args}>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Content>
              Lorum Ipsum text for the dialog shall go here.
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant='flat'>Action 2</Button>
              <Button>Action 1</Button>
            </Dialog.Footer>
          </Dialog>
        </Dialog.Trigger>
      </div>
    );
  },
};

export const LocalPortal: Story = {
  render: () => {
    const parentRef = useRef(null);

    return (
      <div className='flex h-[600px] w-[960px] outline outline-info-bold'>
        <div className='w-full p-l'>
          <Dialog.Trigger>
            <Button>Press Me</Button>
            <Dialog parentRef={parentRef}>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.Content>
                Lorum Ipsum text for the dialog shall go here.
              </Dialog.Content>
              <Dialog.Footer>
                <Button variant='flat'>Action 2</Button>
                <Button>Action 1</Button>
              </Dialog.Footer>
            </Dialog>
          </Dialog.Trigger>
        </div>
        <div
          ref={parentRef}
          className='relative h-full w-[500px] bg-info-bold'
        />
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const handleOpenChange = useCallback((isOpen: boolean) => {
      setOpen(isOpen);
    }, []);
    const handleOpenPress = useCallback(() => setOpen(true), []);

    return (
      <div className='h-[800px] w-[600px] p-l outline outline-info-bold'>
        <Dialog.Trigger isOpen={open} onOpenChange={handleOpenChange}>
          <Button isDisabled>Disabled</Button>
          <Dialog>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Content>
              Lorum Ipsum text for the dialog shall go here.
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant='flat'>Action 2</Button>
              <Button>Action 1</Button>
            </Dialog.Footer>
          </Dialog>
        </Dialog.Trigger>
        <Button onPress={handleOpenPress}>Press Me</Button>
      </div>
    );
  },
};
