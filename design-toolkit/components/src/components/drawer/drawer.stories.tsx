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

import { COMMON_CONTROL, createControl, EXCLUSIONS } from '^storybook/utils';
import { uuid } from '@accelint/core';
import { PLACEMENT } from '@/constants/placement';
import { SIZE } from '@/constants/size';
import { Button } from '../button';
import { Drawer } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import type { DrawerMenuProps, DrawerProps } from './types';

// TODO: more work is needed to clean up the types for easier adoption of Storybook patterns
// this story has a mix of controls from different components
type DrawerWithAdditionalArgs = ComponentProps<typeof Drawer> &
  Pick<DrawerMenuProps, 'position'> & {
    toggle?: boolean;
  };

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    placement: PLACEMENT.LEFT,
    size: SIZE.MEDIUM,
    position: 'center',
  },
  argTypes: {
    size: COMMON_CONTROL.size.standard,
    placement: COMMON_CONTROL.placement,
    position: createControl.select('Location of drawer "tabs"', [
      'start',
      'center',
      'end',
    ]),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'defaultView', 'onChange'],
    },
    docs: {
      subtitle: 'Sliding panel for navigation and content organization.',
    },
    layout: 'fullscreen',
  },
} satisfies Meta<DrawerProps & Pick<DrawerMenuProps, 'position'>>;

export default meta;
type Story = StoryObj<DrawerWithAdditionalArgs>;

const ids = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

export const Default: Story = {
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

export const DynamicHeaderFooter: Story = {
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

export const OpenCloseTrigger: Story = {
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

export const SimpleStack: Story = {
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
