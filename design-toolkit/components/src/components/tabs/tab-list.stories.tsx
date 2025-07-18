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

import { Add, Check, Group } from '@accelint/icons';
import { Icon } from '@/components/icon';
import { Tabs } from '@/components/tabs/index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs.List> = {
  title: 'Components/Tabs/Tabs.List',
  component: Tabs.List,
  args: {
    variant: 'default',
    drawer: undefined,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'icons'],
      table: {
        defaultValue: { summary: 'default' },
        readonly: true,
      },
    },
    drawer: {
      control: 'select',
      options: [undefined, 'left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs.List>;

export const Default: Story = {
  render: ({ ...args }) => (
    <div className='flex w-full flex-row flex-wrap gap-m'>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className='fg-default-light'>Horizontal Orientation</h5>
        <Tabs>
          <Tabs.List {...args}>
            <Tabs.Tab id='Storybook-Tab-1'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='Storybook-Tab-2'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='Storybook-Tab-3'>Tab 3</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className='fg-default-light'>Vertical Orientation</h5>
        <Tabs orientation='vertical'>
          <Tabs.List {...args}>
            <Tabs.Tab id='Storybook-Vert-Tab-1'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='Storybook-Vert-Tab-2'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='Storybook-Vert-Tab-3'>Tab 3</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  ),
};

Default.args = {
  variant: 'default',
};

export const Icons: Story = {
  render: ({ ...args }) => (
    <div className='flex w-full flex-row flex-wrap gap-m'>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className='fg-default-light'>Horizontal Orientation</h5>
        <Tabs>
          <Tabs.List {...args} variant='icons'>
            <Tabs.Tab id='Storybook-Icon-Tab-1'>
              <Icon>
                <Add />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Icon-Tab-2'>
              <Icon>
                <Check />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Icon-Tab-3'>
              <Icon>
                <Group />
              </Icon>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className='fg-default-light'>Vertical Orientation</h5>
        <Tabs orientation='vertical'>
          <Tabs.List {...args} variant='icons'>
            <Tabs.Tab id='Storybook-Vert-Icon-Tab-1'>
              <Icon>
                <Add />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Vert-Icon-Tab-2'>
              <Icon>
                <Check />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Vert-Icon-Tab-3'>
              <Icon>
                <Group />
              </Icon>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  ),
};

Icons.args = {
  variant: 'icons',
};
