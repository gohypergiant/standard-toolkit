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
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
import { MenuItemLabel } from '../menu/item-label';
import { MenuTrigger } from '../menu/trigger';
import { ListView } from './';
import { ListViewItem } from './item';
import { ListViewItemContent } from './item-content';
import { ListViewItemDescription } from './item-description';
import { ListViewItemTitle } from './item-title';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

const meta = {
  title: 'Components/ListView',
  component: ListView,
  args: {
    size: 'cozy',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
} satisfies Meta<typeof ListView>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomListViewItem {
  id: number;
  name: string;
  description?: string;
  isDisabled?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  menu?: ReactNode;
}

const items: CustomListViewItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'Red Panda',
    description: 'Tree-dwelling mammal',
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
  {
    id: 2,
    prefixIcon: <Placeholder />,
    name: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
  {
    id: 3,
    prefixIcon: <Placeholder />,
    name: 'Dog',
    description: 'Loyal companion',
    suffixIcon: <Placeholder />,
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
  {
    id: 4,
    prefixIcon: <Placeholder />,
    name: 'Aardvark',
    description: 'Ant-eating nocturnal',
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
  {
    id: 5,
    name: 'Kangaroo',
    description: 'Pouch-bearing jumper',
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'Snake',
    description: 'Slithering reptile',
    menu: (
      <MenuTrigger>
        <Button variant='icon' aria-label='Actions'>
          <Icon>
            <Kebab />
          </Icon>
        </Button>
        <Menu>
          <MenuItem>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    ),
  },
];

export const Default: Story = {
  render: ({ children, ...args }) => (
    <ListView {...args} items={items}>
      {(item) => (
        <ListViewItem
          key={item.id}
          id={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
        >
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <ListViewItemContent>
            <ListViewItemTitle>{item.name}</ListViewItemTitle>
            {item.description && (
              <ListViewItemDescription>
                {item.description}
              </ListViewItemDescription>
            )}
          </ListViewItemContent>
          {item.suffixIcon && <Icon>{item.suffixIcon}</Icon>}
          {item.menu}
        </ListViewItem>
      )}
    </ListView>
  ),
};
