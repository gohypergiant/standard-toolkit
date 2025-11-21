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

import Placeholder from '@accelint/icons/placeholder';
import {
  ListLayout as AriaListLayout,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
import { MenuItemLabel } from '../menu/item-label';
import { List } from '.';
import { ListItem } from './item';
import { ListItemActions } from './item-actions';
import { ListItemContent } from './item-content';
import { ListItemDescription } from './item-description';
import { ListItemIcon } from './item-icon';
import { ListItemIndicator } from './item-indicator';
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
    <ListItemActions>
      <Menu>
        <MenuItem>
          <MenuItemLabel>Edit</MenuItemLabel>
        </MenuItem>
        <MenuItem>
          <MenuItemLabel>Delete</MenuItemLabel>
        </MenuItem>
      </Menu>
    </ListItemActions>
  );
}

const items: CustomListItem[] = [
  {
    id: 1,
    icon: <Placeholder />,
    title: 'Red Panda',
    description: 'Tree-dwelling mammal',
    actions: <ListItemMenu />,
  },
  {
    id: 2,
    icon: <Placeholder />,
    title: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
    indicator: <Placeholder />,
    actions: <ListItemMenu />,
  },
  {
    id: 3,
    icon: <Placeholder />,
    title: 'Dog',
    description: 'Loyal companion',
    indicator: <Placeholder />,
    actions: <ListItemMenu />,
  },
  {
    id: 4,
    icon: <Placeholder />,
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
    icon: <Placeholder />,
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
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemContent>
              <ListItemTitle>{item.title}</ListItemTitle>
              {item.description && (
                <ListItemDescription>{item.description}</ListItemDescription>
              )}
            </ListItemContent>
            {item.indicator && (
              <ListItemIndicator>{item.indicator}</ListItemIndicator>
            )}
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
        <ListItemIcon>
          <Placeholder />
        </ListItemIcon>
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
        <ListItemIndicator>
          <Placeholder />
        </ListItemIndicator>
        <ListItemMenu />
      </ListItem>
    </List>
  ),
};

const manyItems: CustomListItem[] = Array.from(
  { length: 5000 },
  (_, index) => ({
    id: index,
    title: `Item ${index}`,
    description: `Description for item ${index}`,
    icon: <Placeholder />,
    actions: <ListItemMenu />,
  }),
);

export const Virtualized: Story = {
  render: ({ ...args }) => (
    <div className='h-[400px] w-[300px]'>
      <AriaVirtualizer
        layout={AriaListLayout}
        layoutOptions={{ rowHeight: 48 }}
      >
        <List {...args} aria-label='Virtualized items list' items={manyItems}>
          {(item) => (
            <ListItem key={item.id} id={item.id} textValue={item.title}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemContent>
                <ListItemTitle>{item.title}</ListItemTitle>
                {item.description && (
                  <ListItemDescription>{item.description}</ListItemDescription>
                )}
              </ListItemContent>
              {item.actions}
            </ListItem>
          )}
        </List>
      </AriaVirtualizer>
    </div>
  ),
};
