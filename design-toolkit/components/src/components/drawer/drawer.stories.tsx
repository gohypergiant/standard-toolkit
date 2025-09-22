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
import { Drawer } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import type { DrawerMenuProps, DrawerProps } from './types';

const meta: Meta<DrawerProps & Pick<DrawerMenuProps, 'position'>> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
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
};

export default meta;
const ids = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

type DrawerWithAdditionalArgs = ComponentProps<typeof Drawer> &
  Pick<DrawerMenuProps, 'position'> & {
    toggle?: boolean;
  };

export const StaticHeaderFooter: StoryObj<DrawerWithAdditionalArgs> = {
  args: {
    toggle: false,
  },
  render: ({ placement, size, toggle, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <Drawer.Layout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu position={position}>
              <Drawer.Menu.Item toggle={toggle} for={ids.a} textValue='Menu A'>
                A
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle={toggle} for={ids.b} textValue='Menu B'>
                B
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle={toggle} for={ids.c} textValue='Menu C'>
                C
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Title</Drawer.Header.Title>
                <Drawer.Close />
              </Drawer.Header>
              <Drawer.Content>
                <Drawer.View id={ids.a}>View A</Drawer.View>
                <Drawer.View id={ids.b}>View B</Drawer.View>
                <Drawer.View id={ids.c}>View C</Drawer.View>
              </Drawer.Content>
              <Drawer.Footer>Footer</Drawer.Footer>
            </Drawer.Panel>
          </Drawer>
        </Drawer.Layout>
      </div>
    );
  },
};

export const DynamicHeaderFooter: StoryObj<DrawerWithAdditionalArgs> = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <Drawer.Layout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu position={position}>
              <Drawer.Menu.Item toggle for={ids.a} textValue='Menu A'>
                A
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle for={ids.b} textValue='Menu B'>
                B
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle for={ids.c} textValue='Menu C'>
                C
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.View id={ids.a}>
                <Drawer.Header>
                  <Drawer.Header.Title>Title A</Drawer.Header.Title>
                </Drawer.Header>
                <Drawer.Content>Content A</Drawer.Content>
                <Drawer.Footer>Footer A</Drawer.Footer>
              </Drawer.View>
              <Drawer.View id={ids.b}>
                <Drawer.Header>
                  <Drawer.Header.Title>Title B</Drawer.Header.Title>
                </Drawer.Header>
                <Drawer.Content>Content B</Drawer.Content>
                <Drawer.Footer>Footer B</Drawer.Footer>
              </Drawer.View>
              <Drawer.View id={ids.c}>
                <Drawer.Header>
                  <Drawer.Header.Title>Title C</Drawer.Header.Title>
                </Drawer.Header>
                <Drawer.Content>Content C</Drawer.Content>
                <Drawer.Footer>Footer C</Drawer.Footer>
              </Drawer.View>
            </Drawer.Panel>
          </Drawer>
        </Drawer.Layout>
      </div>
    );
  },
};

export const OpenCloseTrigger: StoryObj<DrawerWithAdditionalArgs> = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen'>
        <Drawer.Layout>
          <Drawer.Layout.Main>
            <div className='flex h-full items-center justify-center bg-surface-muted'>
              <Drawer.Trigger for={`open:${ids.a}`}>
                <Button>Open</Button>
              </Drawer.Trigger>
            </div>
          </Drawer.Layout.Main>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu position={position}>
              <Drawer.Menu.Item toggle for={ids.a} textValue='Menu A'>
                A
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.View id={ids.a}>
                <Drawer.Header>
                  <Drawer.Header.Title>Title A</Drawer.Header.Title>
                  <Drawer.Close />
                </Drawer.Header>
                <Drawer.Content>Content A</Drawer.Content>
                <Drawer.Footer>Footer A</Drawer.Footer>
              </Drawer.View>
            </Drawer.Panel>
          </Drawer>
        </Drawer.Layout>
      </div>
    );
  },
};

export const SimpleStack: StoryObj<DrawerWithAdditionalArgs> = {
  render: ({ placement, size, position }) => {
    return (
      <div className='fg-primary-bold h-screen bg-surface-muted'>
        <Drawer.Layout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu position={position}>
              <Drawer.Menu.Item toggle for={ids.a} textValue='Menu A'>
                A
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.View id={ids.a}>
                <Drawer.Header title='Title A' />
                <Drawer.Content>Content A</Drawer.Content>
                <Drawer.Footer>
                  <Drawer.Trigger for={ids.b}>
                    <Button variant='outline'>Show B</Button>
                  </Drawer.Trigger>
                </Drawer.Footer>
              </Drawer.View>
              <Drawer.View id={ids.b}>
                <Drawer.Header title='Title B' />
                <Drawer.Content>Content B</Drawer.Content>
                <Drawer.Footer>Footer B</Drawer.Footer>
              </Drawer.View>
            </Drawer.Panel>
          </Drawer>
        </Drawer.Layout>
      </div>
    );
  },
};
