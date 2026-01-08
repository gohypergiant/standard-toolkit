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
import { List } from '.';
import { ListItem } from './item';
import { ListItemContent } from './item-content';
import { ListItemDescription } from './item-description';
import { ListItemTitle } from './item-title';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

const meta = {
  title: 'Components/List',
  component: List,
  args: {
    variant: 'cozy',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomListItem {
  id: number;
  isDisabled?: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  indicator?: ReactNode;
  actions: ReactNode;
}

function ListItemMenu() {
  return (
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
  );
}

function ListItemIcon() {
  return (
    <Icon className='fg-primary-bold flex shrink-0 items-center justify-center'>
      <Placeholder />
    </Icon>
  );
}

function ListItemIndicator() {
  return (
    <div className='flex items-center justify-center gap-m rounded-round bg-surface-muted'>
      <Icon className='fg-primary-muted'>
        <Placeholder />
      </Icon>
    </div>
  );
}

const items: CustomListItem[] = [
  {
    id: 1,
    icon: <ListItemIcon />,
    title: 'Red Panda',
    description: 'Tree-dwelling mammal',
    actions: <ListItemMenu />,
  },
  {
    id: 2,
    icon: <ListItemIcon />,
    title: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
    indicator: <ListItemIndicator />,
    actions: <ListItemMenu />,
  },
  {
    id: 3,
    icon: <ListItemIcon />,
    title: 'Dog',
    description: 'Loyal companion',
    indicator: <ListItemIndicator />,
    actions: <ListItemMenu />,
  },
  {
    id: 4,
    icon: <ListItemIcon />,
    title: 'Aardvark',
    description: 'Ant-eating nocturnal',
    actions: <ListItemMenu />,
  },
  {
    id: 5,
    title: 'Kangaroo',
    description: 'Pouch-bearing jumper',
    actions: <ListItemMenu />,
  },
  {
    id: 6,
    icon: <ListItemIcon />,
    title: 'Snake',
    description: 'Slithering reptile',
    actions: <ListItemMenu />,
  },
  {
    id: 7,
    title: 'Turtle',
    actions: <ListItemMenu />,
  },
];

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='h-[400px] w-[300px]'>
      <List
        {...args}
        items={items}
        aria-label='Animals list'
        selectedKeys={new Set(['selected-1', 'selected-4'])}
      >
        {(item) => (
          <ListItem
            key={item.id}
            id={`selected-${item.id}`}
            textValue={item.title}
            isDisabled={item.isDisabled}
          >
            {item.icon}
            <ListItemContent>
              <ListItemTitle>{item.title}</ListItemTitle>
              {item.description && (
                <ListItemDescription>{item.description}</ListItemDescription>
              )}
            </ListItemContent>
            {item.indicator}
            {item.actions}
          </ListItem>
        )}
      </List>
    </div>
  ),
};

export const Stateful: Story = {
  render: ({ ...args }) => (
    <List
      {...args}
      aria-label='Stateful items list'
      selectedKeys={new Set(['stateful-2', 'stateful-3'])}
      selectionMode='multiple'
    >
      <ListItem key='stateful-1' textValue='Stateful Item 1'>
        <ListItemIcon />
        <ListItemContent>
          <ListItemTitle>Stateful Item 1</ListItemTitle>
          <ListItemDescription>
            This is a stateful list view item.
          </ListItemDescription>
        </ListItemContent>
        <ListItemMenu />
      </ListItem>
      <ListItem id='stateful-2' key='stateful-2' textValue='Stateful Item 2'>
        <ListItemContent>
          <ListItemTitle>Stateful Item 2</ListItemTitle>
          <ListItemDescription>
            Another stateful list view item.
          </ListItemDescription>
        </ListItemContent>
        <ListItemMenu />
      </ListItem>
      <ListItem
        id='stateful-3'
        key='stateful-3'
        textValue='Stateful Item 3'
        isDisabled
      >
        <ListItemContent>
          <ListItemTitle>Stateful Item 3</ListItemTitle>
          <ListItemDescription>
            Another stateful list view item.
          </ListItemDescription>
        </ListItemContent>
        <ListItemIcon />
        <ListItemMenu />
      </ListItem>
    </List>
  ),
};
