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
import { Cancel } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Button } from '../button';
import { Drawer } from './index';
import type { DrawerProps } from './types';

const meta: Meta<DrawerProps> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    placement: 'left',
    size: 'medium',
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
  },
};

export default meta;
const ids = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

type DrawerWithToggleArgs = ComponentProps<typeof Drawer> & {
  toggle?: boolean;
};
export const StaticHeaderFooter: StoryObj<DrawerWithToggleArgs> = {
  args: {
    toggle: false,
  },
  render: ({ placement, size, toggle }) => {
    return (
      <div className='h-screen bg-surface-raised text-default-light'>
        <Drawer.Layout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu>
              <Drawer.Menu.Item toggle={toggle} for={ids.a}>
                A
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle={toggle} for={ids.b}>
                B
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle={toggle} for={ids.c}>
                C
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Title</Drawer.Header.Title>
                <Drawer.Trigger for='close'>
                  <Button>Close</Button>
                </Drawer.Trigger>
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

export const DynamicHeaderFooter: StoryObj<typeof Drawer> = {
  render: ({ placement, size }) => {
    return (
      <div className='h-screen bg-surface-raised text-default-light'>
        <Drawer.Layout>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu>
              <Drawer.Menu.Item toggle for={ids.a}>
                A
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle for={ids.b}>
                B
              </Drawer.Menu.Item>
              <Drawer.Menu.Item toggle for={ids.c}>
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

export const OpenCloseTrigger: StoryObj<typeof Drawer> = {
  render: ({ placement, size }) => {
    return (
      <div className='h-screen text-default-light'>
        <Drawer.Layout>
          <Drawer.Layout.Main>
            <div className='flex h-full items-center justify-center bg-surface-overlay'>
              <Drawer.Trigger for={`open:${ids.a}`}>
                <Button>Open</Button>
              </Drawer.Trigger>
            </div>
          </Drawer.Layout.Main>
          <Drawer id={ids.drawer} placement={placement} size={size}>
            <Drawer.Menu>
              <Drawer.Menu.Item toggle for={ids.a}>
                A
              </Drawer.Menu.Item>
            </Drawer.Menu>
            <Drawer.Panel>
              <Drawer.View id={ids.a}>
                <Drawer.Header>
                  <Drawer.Header.Title>Title A</Drawer.Header.Title>
                  <Drawer.Trigger for='close'>
                    <Cancel className='size-m' />
                  </Drawer.Trigger>
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
