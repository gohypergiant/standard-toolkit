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
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { Icon } from '../icon';
import { Drawer } from './index';
import type { DrawerLayoutProps } from './types';

const meta: Meta<DrawerLayoutProps> = {
  title: 'Components/Drawer.Layout',
  component: Drawer.Layout,
  parameters: {
    layout: 'fullscreen',
  },
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
};

export default meta;
type Story = StoryObj<typeof Drawer.Layout>;

const placeholderIcons = Array.from({ length: 6 }, (_, index) => (
  <Drawer.Menu.Item id={`${index + 1}`} key={`${index + 1}`}>
    <Placeholder />
  </Drawer.Menu.Item>
));

export const Default: Story = {
  render: ({ extend, push }) => {
    return (
      <div className='h-screen w-full'>
        <Drawer.Provider>
          <Drawer.Layout extend={extend} push={push}>
            <Drawer id='header' placement='top' size='medium'>
              <Drawer.Menu>
                <Drawer.Trigger for='header'>
                  <Icon className='cursor-pointer text-default-light'>
                    <ChevronDown className='group-open/drawer:rotate-180' />
                  </Icon>
                </Drawer.Trigger>

                {placeholderIcons}
              </Drawer.Menu>

              <Drawer.Content>
                <Drawer.Title>Top</Drawer.Title>
              </Drawer.Content>
            </Drawer>

            <Drawer.Main>
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
                <div className='flex w-1/2 flex-col rounded-large border-2 border-default-dark bg-surface-overlay p-xl [&>*]:my-s'>
                  <p>This page is for demo purposes only!</p>
                </div>
              </div>
            </Drawer.Main>

            <Drawer id='footer' placement='bottom'>
              <Drawer.Menu>
                <Drawer.Trigger for='footer'>
                  <Icon className='cursor-pointer text-default-light'>
                    <ChevronUp className='group-open/drawer:rotate-180' />
                  </Icon>
                </Drawer.Trigger>

                {placeholderIcons}
              </Drawer.Menu>

              <Drawer.Content>
                <Drawer.Title>Bottom</Drawer.Title>
              </Drawer.Content>
            </Drawer>

            <Drawer id='settings' placement='left'>
              <Drawer.Menu>
                <Drawer.Trigger for='settings'>
                  <Icon className='cursor-pointer text-default-light'>
                    <ChevronRight className='group-open/drawer:rotate-180' />
                  </Icon>
                </Drawer.Trigger>

                {placeholderIcons}
              </Drawer.Menu>

              <Drawer.Content>
                <Drawer.Title>Left</Drawer.Title>
              </Drawer.Content>
            </Drawer>

            <Drawer id='sidebar' placement='right'>
              <Drawer.Menu>
                <Drawer.Trigger for='sidebar'>
                  <Icon className='cursor-pointer text-default-light'>
                    <ChevronLeft className='group-open/drawer:rotate-180' />
                  </Icon>
                </Drawer.Trigger>

                {placeholderIcons}
              </Drawer.Menu>

              <Drawer.Content>
                <Drawer.Title>Right</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Layout>
        </Drawer.Provider>
      </div>
    );
  },
};
