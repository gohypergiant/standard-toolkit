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
import { uuid } from '@accelint/core';
import { Button } from '../button';
import { Drawer } from './';
import { DrawerClose } from './close';
import { DrawerContent } from './content';
import { DrawerFooter } from './footer';
import { DrawerHeader } from './header';
import { DrawerHeaderTitle } from './header-title';
import { DrawerLayout } from './layout';
import { DrawerLayoutMain } from './layout-main';
import { DrawerMenu } from './menu';
import { DrawerMenuItem } from './menu-item';
import { DrawerPanel } from './panel';
import { DrawerTrigger } from './trigger';
import { DrawerView } from './view';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import type { DrawerMenuProps, DrawerProps } from './types';

// TODO: more work is needed to clean up the types for easier adoption of Storybook patterns
// this story has a mix of controls from different components
type DrawerWithAdditionalArgs = ComponentProps<typeof Drawer> &
  Pick<DrawerMenuProps, 'position'> & {
    toggle?: boolean;
  };

const meta: Meta<DrawerProps & Pick<DrawerMenuProps, 'position'>> = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    placement: 'left',
    size: 'medium',
    position: 'center',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    position: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<DrawerWithAdditionalArgs>;

const ids = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

export const StaticHeaderFooter: Story = {
  args: {
    toggle: false,
  },
  render: ({ placement, size, toggle, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <DrawerLayout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <DrawerMenu position={position}>
              <DrawerMenuItem toggle={toggle} for={ids.a} textValue='Menu A'>
                A
              </DrawerMenuItem>
              <DrawerMenuItem toggle={toggle} for={ids.b} textValue='Menu B'>
                B
              </DrawerMenuItem>
              <DrawerMenuItem toggle={toggle} for={ids.c} textValue='Menu C'>
                C
              </DrawerMenuItem>
            </DrawerMenu>
            <DrawerPanel>
              <DrawerHeader>
                <DrawerHeaderTitle>Title</DrawerHeaderTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerContent>
                <DrawerView id={ids.a}>View A</DrawerView>
                <DrawerView id={ids.b}>View B</DrawerView>
                <DrawerView id={ids.c}>View C</DrawerView>
              </DrawerContent>
              <DrawerFooter>Footer</DrawerFooter>
            </DrawerPanel>
          </Drawer>
        </DrawerLayout>
      </div>
    );
  },
};

export const DynamicHeaderFooter: Story = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <DrawerLayout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <DrawerMenu position={position}>
              <DrawerMenuItem toggle for={ids.a} textValue='Menu A'>
                A
              </DrawerMenuItem>
              <DrawerMenuItem toggle for={ids.b} textValue='Menu B'>
                B
              </DrawerMenuItem>
              <DrawerMenuItem toggle for={ids.c} textValue='Menu C'>
                C
              </DrawerMenuItem>
            </DrawerMenu>
            <DrawerPanel>
              <DrawerView id={ids.a}>
                <DrawerHeader>
                  <DrawerHeaderTitle>Title A</DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerContent>Content A</DrawerContent>
                <DrawerFooter>Footer A</DrawerFooter>
              </DrawerView>
              <DrawerView id={ids.b}>
                <DrawerHeader>
                  <DrawerHeaderTitle>Title B</DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerContent>Content B</DrawerContent>
                <DrawerFooter>Footer B</DrawerFooter>
              </DrawerView>
              <DrawerView id={ids.c}>
                <DrawerHeader>
                  <DrawerHeaderTitle>Title C</DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerContent>Content C</DrawerContent>
                <DrawerFooter>Footer C</DrawerFooter>
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        </DrawerLayout>
      </div>
    );
  },
};

export const OpenCloseTrigger: Story = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen'>
        <DrawerLayout>
          <DrawerLayoutMain>
            <div className='flex h-full items-center justify-center bg-surface-muted'>
              <DrawerTrigger for={`open:${ids.a}`}>
                <Button>Open</Button>
              </DrawerTrigger>
            </div>
          </DrawerLayoutMain>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <DrawerMenu position={position}>
              <DrawerMenuItem toggle for={ids.a} textValue='Menu A'>
                A
              </DrawerMenuItem>
            </DrawerMenu>
            <DrawerPanel>
              <DrawerView id={ids.a}>
                <DrawerHeader>
                  <DrawerHeaderTitle>Title A</DrawerHeaderTitle>
                  <DrawerClose />
                </DrawerHeader>
                <DrawerContent>Content A</DrawerContent>
                <DrawerFooter>Footer A</DrawerFooter>
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        </DrawerLayout>
      </div>
    );
  },
};

export const SimpleStack: Story = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <DrawerLayout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <DrawerMenu position={position}>
              <DrawerMenuItem toggle for={ids.a} textValue='Menu A'>
                A
              </DrawerMenuItem>
            </DrawerMenu>
            <DrawerPanel>
              <DrawerView id={ids.a}>
                <DrawerHeader title='Title A' />
                <DrawerContent>Content A</DrawerContent>
                <DrawerFooter>
                  <DrawerTrigger for={ids.b}>
                    <Button variant='outline'>Show B</Button>
                  </DrawerTrigger>
                </DrawerFooter>
              </DrawerView>
              <DrawerView id={ids.b}>
                <DrawerHeader title='Title B' />
                <DrawerContent>Content B</DrawerContent>
                <DrawerFooter>Footer B</DrawerFooter>
              </DrawerView>
            </DrawerPanel>
          </Drawer>
        </DrawerLayout>
      </div>
    );
  },
};
