import { uuid } from '@accelint/core';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Placeholder,
} from '@accelint/icons';
import { Drawer } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import type { DrawerLayoutProps } from './types';

type Alias = React.FC<DrawerLayoutProps>;

const ids = {
  top: {
    drawer: uuid(),
    views: {
      a: uuid(),
      b: uuid(),
      c: uuid(),
      d: uuid(),
    },
  },
  bottom: {
    drawer: uuid(),
    views: {
      a: uuid(),
      b: uuid(),
      c: uuid(),
      d: uuid(),
    },
  },
  left: {
    drawer: uuid(),
    views: {
      a: uuid(),
      b: uuid(),
      c: uuid(),
      d: uuid(),
    },
  },
  right: {
    drawer: uuid(),
    views: {
      a: uuid(),
      b: uuid(),
      c: uuid(),
      d: uuid(),
    },
  },
} as const;

const meta = {
  title: 'Components/Drawer.Layout',
  component: Drawer.Layout as Alias,
  args: {
    extend: 'left right',
    push: 'left right',
  },
  argTypes: {
    extend: {
      control: 'select',
      options: ['top bottom', 'left right', 'top', 'bottom', 'left', 'right'],
    },
    push: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ extend, push }) => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Layout extend={extend} push={push}>
          <Drawer.Layout.Main>
            <div
              className='flex h-full items-center justify-center bg-surface-overlay'
              style={
                {
                  '--single': '40px',
                  '--double': 'calc(2 * var(--single))',
                  backgroundImage: `
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.8) 99%),
            radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.4) 99%)
          `,
                  backgroundSize: 'var(--double) var(--double)',
                  backgroundPosition:
                    'center, calc(50% + var(--single)) calc(50% + var(--single))',
                } as CSSProperties
              }
            >
              <div className='flex w-1/2 flex-col rounded-large bg-surface-overlay p-xl outline-2 outline-info-bold [&>*]:my-s'>
                <p>This page is for demo purposes only!</p>
              </div>
            </div>
          </Drawer.Layout.Main>

          <Drawer id={ids.top.drawer} placement='top' size='medium'>
            <Drawer.Menu>
              <Drawer.Menu.Item toggle for={ids.top.views.a} textValue='Menu A'>
                <ChevronDown className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.top.views.b} textValue='Menu B'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.top.views.c} textValue='Menu C'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.top.views.d} textValue='Menu D'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>

            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Top</Drawer.Header.Title>
              </Drawer.Header>
              <Drawer.Content>
                {Object.entries(ids.top.views).map(([_, id]) => (
                  <Drawer.View id={id} key={id} />
                ))}
              </Drawer.Content>
            </Drawer.Panel>
          </Drawer>

          <Drawer id={ids.bottom.drawer} placement='bottom'>
            <Drawer.Menu>
              <Drawer.Menu.Item
                toggle
                for={ids.bottom.views.a}
                textValue='Menu A'
              >
                <ChevronUp className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.bottom.views.b} textValue='Menu B'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.bottom.views.c} textValue='Menu C'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.bottom.views.d} textValue='Menu D'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>

            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Bottom</Drawer.Header.Title>
              </Drawer.Header>
              <Drawer.Content>
                {Object.entries(ids.bottom.views).map(([_, id]) => (
                  <Drawer.View id={id} key={id} />
                ))}
              </Drawer.Content>
            </Drawer.Panel>
          </Drawer>

          <Drawer id={ids.left.drawer} placement='left'>
            <Drawer.Menu>
              <Drawer.Menu.Item
                toggle
                for={ids.left.views.a}
                textValue='Menu A'
              >
                <ChevronRight className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.left.views.b} textValue='Menu B'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.left.views.c} textValue='Menu C'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.left.views.d} textValue='Menu D'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>

            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Left</Drawer.Header.Title>
              </Drawer.Header>
              <Drawer.Content>
                {Object.entries(ids.left.views).map(([_, id]) => (
                  <Drawer.View id={id} key={id} />
                ))}
              </Drawer.Content>
            </Drawer.Panel>
          </Drawer>

          <Drawer id={ids.right.drawer} placement='right'>
            <Drawer.Menu>
              <Drawer.Menu.Item
                toggle
                for={ids.right.views.a}
                textValue='Menu A'
              >
                <ChevronLeft className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.right.views.b} textValue='Menu B'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.right.views.c} textValue='Menu C'>
                <Placeholder />
              </Drawer.Menu.Item>
              <Drawer.Menu.Item for={ids.right.views.d} textValue='Menu D'>
                <Placeholder />
              </Drawer.Menu.Item>
            </Drawer.Menu>

            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Header.Title>Right</Drawer.Header.Title>
              </Drawer.Header>
              <Drawer.Content>
                {Object.entries(ids.right.views).map(([_, id]) => (
                  <Drawer.View id={id} key={id} />
                ))}
              </Drawer.Content>
            </Drawer.Panel>
          </Drawer>
        </Drawer.Layout>
      </div>
    );
  },
};
