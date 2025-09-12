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
  createArgTypeBool,
  createArgTypeSelect,
  createStandardParameters,
} from '^storybook/utils/controls';
import { MOCK_DATA } from '^storybook/utils/mock-data';
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
    size: createArgTypeSelect('Dialog size', ['small', 'large']),
    isDismissable: createArgTypeBool(
      'Whether the component can be dismissed',
      'true',
    ),
    isKeyboardDismissDisabled: createArgTypeBool(
      'Whether keyboard dismissal is disabled',
      'false',
    ),
  },
  parameters: {
    ...createStandardParameters('centered'),
    docs: {
      subtitle:
        'A modal dialog component for important content and interactions',
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
          <Button>Open Dialog</Button>
          <Dialog {...args}>
            <Dialog.Title>Confirmation Required</Dialog.Title>
            <Dialog.Content>{MOCK_DATA.TEXT_CONTENT.MEDIUM}</Dialog.Content>
            <Dialog.Footer>
              <Button variant='flat'>Cancel</Button>
              <Button>Confirm</Button>
            </Dialog.Footer>
          </Dialog>
        </Dialog.Trigger>
      </div>
    );
  },
  parameters: {
    layout: 'centered',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className='flex gap-m'>
      <div className='relative h-[600px] w-[400px] p-l outline outline-info-bold'>
        <Dialog.Trigger>
          <Button>Small Dialog</Button>
          <Dialog size='small'>
            <Dialog.Title>Small Dialog</Dialog.Title>
            <Dialog.Content>
              This is a compact dialog for simple interactions.
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant='flat'>Cancel</Button>
              <Button>OK</Button>
            </Dialog.Footer>
          </Dialog>
        </Dialog.Trigger>
      </div>

      <div className='relative h-[600px] w-[800px] p-l outline outline-info-bold'>
        <Dialog.Trigger>
          <Button>Large Dialog</Button>
          <Dialog size='large'>
            <Dialog.Title>Large Dialog</Dialog.Title>
            <Dialog.Content>{MOCK_DATA.TEXT_CONTENT.LONG}</Dialog.Content>
            <Dialog.Footer>
              <Button variant='flat'>Cancel</Button>
              <Button>Save Changes</Button>
            </Dialog.Footer>
          </Dialog>
        </Dialog.Trigger>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export const LocalPortal: Story = {
  render: () => {
    const parentRef = useRef(null);

    return (
      <div className='flex h-[600px] w-[960px] outline outline-info-bold'>
        <div className='w-full p-l'>
          <Dialog.Trigger>
            <Button>Open in Local Portal</Button>
            <Dialog parentRef={parentRef}>
              <Dialog.Title>Local Portal Dialog</Dialog.Title>
              <Dialog.Content>
                This dialog is rendered within the blue container instead of the
                document body.
              </Dialog.Content>
              <Dialog.Footer>
                <Button variant='flat'>Cancel</Button>
                <Button>OK</Button>
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
  parameters: {
    layout: 'centered',
    controls: { disable: true },
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
