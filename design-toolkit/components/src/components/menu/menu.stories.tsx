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

import Kebab from '@accelint/icons/kebab';
import Placeholder from '@accelint/icons/placeholder';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Menu } from './';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    variant: 'cozy',
    selectionMode: 'single',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'none'],
    },
  },
};

export default meta;

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  prefixIcon?: ReactNode;
  children?: MenuItem[];
  isDisabled?: boolean;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'North American Birds',
    children: [
      {
        id: 2,
        prefixIcon: <Placeholder />,
        name: 'Blue jay',
        description: 'Cyanocitta cristata',
      },
      {
        id: 3,
        prefixIcon: <Placeholder />,
        name: 'Gray catbird',
        description: 'Dumetella carolinensis',
        isDisabled: true,
      },
      {
        id: 4,
        prefixIcon: <Placeholder />,
        name: 'Black-capped chickadee',
        description: 'Poecile atricapillus',
      },
      {
        id: 5,
        prefixIcon: <Placeholder />,
        name: 'Song sparrow',
        description: 'Melospiza melodia',
      },
    ],
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'African Birds',
    children: [
      {
        id: 6,
        prefixIcon: <Placeholder />,
        name: 'Lilac-breasted roller',
        description: 'Coracias caudatus',
      },
      {
        id: 7,
        prefixIcon: <Placeholder />,
        name: 'Hornbill',
        description: 'Bucerotidae',
      },
    ],
  },
];

export const Basic: StoryObj<typeof Menu> = {
  render: (args) => (
    <Menu.Trigger>
      <IconButton aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </IconButton>
      <Menu {...args}>
        <Menu.Item>
          <Menu.Item.Icon>
            <Placeholder />
          </Menu.Item.Icon>
          <Menu.Item.Label>Songbirds</Menu.Item.Label>
          <Menu.Item.Keyboard>⌘A</Menu.Item.Keyboard>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Submenu>
          <Menu.Item>
            <Menu.Item.Label>North American Birds</Menu.Item.Label>
          </Menu.Item>
          <Menu>
            <Menu.Item>
              <Menu.Item.Icon>
                <Placeholder />
              </Menu.Item.Icon>
              <Menu.Item.Label>Blue Jay</Menu.Item.Label>
              <Menu.Item.Description>Cyanocitta cristata</Menu.Item.Description>
            </Menu.Item>
            <Menu.Item isDisabled>
              <Menu.Item.Icon>
                <Placeholder />
              </Menu.Item.Icon>
              <Menu.Item.Label>Gray catbird</Menu.Item.Label>
              <Menu.Item.Description>
                Dumetella carolinensis
              </Menu.Item.Description>
            </Menu.Item>
          </Menu>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Section header='Additional Notable Species'>
          <Menu.Item>
            <Menu.Item.Icon>
              <Placeholder />
            </Menu.Item.Icon>
            <Menu.Item.Label>Mallard</Menu.Item.Label>
            <Menu.Item.Description>Anas platyrhynchos</Menu.Item.Description>
            <Menu.Item.Keyboard>⌘V</Menu.Item.Keyboard>
          </Menu.Item>
          <Menu.Item>
            <Menu.Item.Icon>
              <Placeholder />
            </Menu.Item.Icon>
            <Menu.Item.Label>Chimney swift</Menu.Item.Label>
            <Menu.Item.Description>Chaetura pelagica</Menu.Item.Description>
          </Menu.Item>
          <Menu.Item>
            <Menu.Item.Icon>
              <Placeholder />
            </Menu.Item.Icon>
            <Menu.Item.Label>Brünnich's guillemot</Menu.Item.Label>
            <Menu.Item.Description>
              Dumetella carolinensis
            </Menu.Item.Description>
            <Menu.Item.Keyboard>⌘X</Menu.Item.Keyboard>
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </Menu.Trigger>
  ),
};

export const Dynamic: StoryObj<typeof Menu> = {
  render: (args) => (
    <Menu.Trigger>
      <IconButton aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </IconButton>
      <Menu<MenuItem> {...args} items={menuItems}>
        {function render(item) {
          if (item.children) {
            return (
              <Menu.Submenu>
                <Menu.Item key={item.id} isDisabled={item.isDisabled}>
                  <Menu.Item.Icon>{item.prefixIcon}</Menu.Item.Icon>
                  <Menu.Item.Label>{item.name}</Menu.Item.Label>
                  {item.description && (
                    <Menu.Item.Description>
                      {item.description}
                    </Menu.Item.Description>
                  )}
                </Menu.Item>
                <Menu items={item.children}>{(item) => render(item)}</Menu>
              </Menu.Submenu>
            );
          }
          return (
            <Menu.Item key={item.id} isDisabled={item.isDisabled}>
              <Menu.Item.Icon>{item.prefixIcon}</Menu.Item.Icon>
              <Menu.Item.Label>{item.name}</Menu.Item.Label>
              {item.description && (
                <Menu.Item.Description>
                  {item.description}
                </Menu.Item.Description>
              )}
            </Menu.Item>
          );
        }}
      </Menu>
    </Menu.Trigger>
  ),
};
