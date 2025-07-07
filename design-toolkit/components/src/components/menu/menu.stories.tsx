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
          <Menu.Icon>
            <Placeholder />
          </Menu.Icon>
          <Menu.Label>Songbirds</Menu.Label>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Submenu>
          <Menu.Item>
            <Menu.Label>North American Birds</Menu.Label>
          </Menu.Item>
          <Menu>
            <Menu.Item>
              <Menu.Icon>
                <Placeholder />
              </Menu.Icon>
              <Menu.Label>Blue Jay</Menu.Label>
              <Menu.Description>Cyanocitta cristata</Menu.Description>
            </Menu.Item>
            <Menu.Item isDisabled>
              <Menu.Icon>
                <Placeholder />
              </Menu.Icon>
              <Menu.Label>Gray catbird</Menu.Label>
              <Menu.Description>Dumetella carolinensis</Menu.Description>
            </Menu.Item>
          </Menu>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Section header='Additional Notable Species'>
          <Menu.Item>
            <Menu.Icon>
              <Placeholder />
            </Menu.Icon>
            <Menu.Label>Mallard</Menu.Label>
            <Menu.Description>Anas platyrhynchos</Menu.Description>
          </Menu.Item>
          <Menu.Item>
            <Menu.Icon>
              <Placeholder />
            </Menu.Icon>
            <Menu.Label>Chimney swift</Menu.Label>
            <Menu.Description>Chaetura pelagica</Menu.Description>
          </Menu.Item>
          <Menu.Item>
            <Menu.Icon>
              <Placeholder />
            </Menu.Icon>
            <Menu.Label>Brünnich's guillemot</Menu.Label>
            <Menu.Description>Dumetella carolinensis</Menu.Description>
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
                  <Menu.Icon>{item.prefixIcon}</Menu.Icon>
                  <Menu.Label>{item.name}</Menu.Label>
                  {item.description && (
                    <Menu.Description>{item.description}</Menu.Description>
                  )}
                </Menu.Item>
                <Menu items={item.children}>{(item) => render(item)}</Menu>
              </Menu.Submenu>
            );
          }
          return (
            <Menu.Item key={item.id} isDisabled={item.isDisabled}>
              <Menu.Icon>{item.prefixIcon}</Menu.Icon>
              <Menu.Label>{item.name}</Menu.Label>
              {item.description && (
                <Menu.Description>{item.description}</Menu.Description>
              )}
            </Menu.Item>
          );
        }}
      </Menu>
    </Menu.Trigger>
  ),
};
