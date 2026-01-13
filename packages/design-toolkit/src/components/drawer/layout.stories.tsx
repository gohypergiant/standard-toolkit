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
import { Drawer } from './';
import { DrawerContent } from './content';
import { DrawerHeader } from './header';
import { DrawerHeaderTitle } from './header-title';
import { DrawerLayout } from './layout';
import { DrawerLayoutMain } from './layout-main';
import { DrawerMenu } from './menu';
import { DrawerMenuItem } from './menu-item';
import { DrawerPanel } from './panel';
import { DrawerView } from './view';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import type { DrawerLayoutProps, DrawerMenuProps, DrawerProps } from './types';

type DrawerLayoutStoryArgs = DrawerLayoutProps &
  Pick<DrawerProps, 'size'> & {
    toggle?: boolean;
  };

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

const meta: Meta<DrawerLayoutStoryArgs> = {
  title: 'Components/DrawerLayout',
  component: DrawerLayout,
  args: {
    extend: 'left right',
    size: 'medium',
    toggle: true,
  },
  argTypes: {
    extend: {
      control: 'select',
      options: ['top bottom', 'left right', 'top', 'bottom', 'left', 'right'],
      description:
        'Determines which drawers extend to full container dimensions, affecting the overall layout structure',
      table: {
        defaultValue: { summary: 'left right' },
      },
    },
    push: {
      control: 'multi-select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Determines how drawers interact with the main content area. When set, drawers push content aside rather than floating over it',
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of all drawer panels',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    toggle: {
      control: 'boolean',
      description:
        'When true, clicking a menu item toggles the view open/closed. When false, clicking only opens.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<DrawerLayoutStoryArgs>;

export const Default: Story = {
  render: ({ extend, push, size, toggle }) => (
    <div className='h-screen w-full'>
      <DrawerLayout
        extend={extend}
        push={
          (push as unknown as string[])?.join(' ') as DrawerLayoutProps['push']
        }
      >
        <DrawerLayoutMain>
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
        </DrawerLayoutMain>

        <Drawer
          id={ids.top.drawer}
          className='bg-[#ff00008b]'
          placement='top'
          size={size}
        >
          <DrawerMenu position='center'>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.top.views.a}
              textValue='Menu A'
            >
              <ChevronDown className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.top.views.b}
              textValue='Menu B'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.top.views.c}
              textValue='Menu C'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.top.views.d}
              textValue='Menu D'
            >
              <Placeholder />
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Top</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerContent>
              {Object.entries(ids.top.views).map(([_, id]) => (
                <DrawerView id={id} key={id} />
              ))}
            </DrawerContent>
          </DrawerPanel>
        </Drawer>

        <Drawer
          id={ids.bottom.drawer}
          className='bg-[#0000ff8a]'
          placement='bottom'
          size={size}
        >
          <DrawerMenu position='center'>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.bottom.views.a}
              textValue='Menu A'
            >
              <ChevronUp className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.bottom.views.b}
              textValue='Menu B'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.bottom.views.c}
              textValue='Menu C'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.bottom.views.d}
              textValue='Menu D'
            >
              <Placeholder />
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Bottom</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerContent>
              {Object.entries(ids.bottom.views).map(([_, id]) => (
                <DrawerView id={id} key={id} />
              ))}
            </DrawerContent>
          </DrawerPanel>
        </Drawer>

        <Drawer
          id={ids.left.drawer}
          className='bg-[#ffd90087]'
          placement='left'
          size={size}
        >
          <DrawerMenu position='center'>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.a}
              textValue='Menu A'
            >
              <ChevronRight className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.b}
              textValue='Menu B'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.c}
              textValue='Menu C'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.d}
              textValue='Menu D'
            >
              <Placeholder />
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Left</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerContent>
              {Object.entries(ids.left.views).map(([_, id]) => (
                <DrawerView id={id} key={id} />
              ))}
            </DrawerContent>
          </DrawerPanel>
        </Drawer>

        <Drawer
          id={ids.right.drawer}
          className='bg-[#00800084]'
          placement='right'
          size={size}
        >
          <DrawerMenu position='center'>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.right.views.a}
              textValue='Menu A'
            >
              <ChevronLeft className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.right.views.b}
              textValue='Menu B'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.right.views.c}
              textValue='Menu C'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.right.views.d}
              textValue='Menu D'
            >
              <Placeholder />
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Right</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerContent>
              {Object.entries(ids.right.views).map(([_, id]) => (
                <DrawerView id={id} key={id} />
              ))}
            </DrawerContent>
          </DrawerPanel>
        </Drawer>
      </DrawerLayout>
    </div>
  ),
};

type SingleDrawerStoryArgs = DrawerLayoutStoryArgs &
  Pick<DrawerMenuProps, 'position'>;

export const SingleDrawer: StoryObj<SingleDrawerStoryArgs> = {
  args: {
    position: 'center',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'The position of the menu items within the menu bar',
      table: {
        defaultValue: { summary: 'center' },
      },
    },
  },
  render: ({ extend, push, size, toggle, position }) => (
    <div className='h-screen w-full'>
      <DrawerLayout
        extend={extend}
        push={
          (push as unknown as string[])?.join(' ') as DrawerLayoutProps['push']
        }
      >
        <DrawerLayoutMain>
          <div className='flex h-full items-center justify-center bg-surface-overlay' />
        </DrawerLayoutMain>

        <Drawer
          id={ids.left.drawer}
          placement='left'
          size={size}
          defaultView={ids.left.views.a}
        >
          <DrawerMenu position={position}>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.a}
              textValue='Menu A'
            >
              <ChevronRight className='fg-primary-bold cursor-pointer group-open/drawer:rotate-180' />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.b}
              textValue='Menu B'
            >
              <Placeholder />
            </DrawerMenuItem>
            <DrawerMenuItem
              toggle={toggle}
              for={ids.left.views.c}
              textValue='Menu C'
            >
              <Placeholder />
            </DrawerMenuItem>
          </DrawerMenu>

          <DrawerPanel>
            <DrawerHeader>
              <DrawerHeaderTitle>Left Drawer</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerContent>
              <DrawerView id={ids.left.views.a}>View A</DrawerView>
              <DrawerView id={ids.left.views.b}>View B</DrawerView>
              <DrawerView id={ids.left.views.c}>View C</DrawerView>
            </DrawerContent>
          </DrawerPanel>
        </Drawer>
      </DrawerLayout>
    </div>
  ),
};
