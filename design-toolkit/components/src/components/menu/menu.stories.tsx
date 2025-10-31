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
import { type ReactNode, useRef, useState } from 'react';
import { Button } from '../button';
import { Hotkey } from '../hotkey';
import { Icon } from '../icon';
import { Menu } from './';
import { MenuItem } from './item';
import { MenuItemDescription } from './item-description';
import { MenuItemLabel } from './item-label';
import { MenuSection } from './section';
import { MenuSeparator } from './separator';
import { MenuSubmenu } from './submenu';
import { MenuTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react';
import type { MenuItemProps } from './types';

const meta = {
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
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

type MenuItemType = {
  id: number;
  name: string;
  description?: string;
  prefixIcon?: ReactNode;
  children?: MenuItemType[];
  isDisabled?: boolean;
  hotkey?: string;
  color?: MenuItemProps['color'];
};

const menuItems: MenuItemType[] = [
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
        color: 'serious',
      },
      {
        id: 3,
        prefixIcon: <Placeholder />,
        name: 'Gray catbird',
        description: 'Dumetella carolinensis',
        isDisabled: true,
        hotkey: '⌘V',
      },
      {
        id: 4,
        prefixIcon: <Placeholder />,
        name: 'Black-capped chickadee',
        description: 'Poecile atricapillus',
        color: 'critical',
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

export const Basic: Story = {
  render: (args) => (
    <MenuTrigger>
      <Button variant='icon' aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
      <Menu {...args}>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Songbirds</MenuItemLabel>
          <Hotkey variant='flat'>⌘A</Hotkey>
        </MenuItem>
        <MenuSeparator />
        <MenuSubmenu>
          <MenuItem>
            <MenuItemLabel>North American Birds</MenuItemLabel>
          </MenuItem>
          <Menu>
            <MenuItem>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Blue Jay</MenuItemLabel>
              <MenuItemDescription>Cyanocitta cristata</MenuItemDescription>
            </MenuItem>
            <MenuItem isDisabled>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Gray catbird</MenuItemLabel>
              <MenuItemDescription>Dumetella carolinensis</MenuItemDescription>
            </MenuItem>
          </Menu>
        </MenuSubmenu>
        <MenuSeparator />
        <MenuSection title='Additional Notable Species'>
          <MenuItem color='serious'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Mallard</MenuItemLabel>
            <MenuItemDescription>Anas platyrhynchos</MenuItemDescription>
            <Hotkey variant='flat'>⌘V</Hotkey>
          </MenuItem>
          <MenuItem color='critical'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Chimney swift</MenuItemLabel>
            <MenuItemDescription>Chaetura pelagica</MenuItemDescription>
          </MenuItem>
          <MenuItem>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Brünnich's guillemot</MenuItemLabel>
            <MenuItemDescription>Dumetella carolinensis</MenuItemDescription>
            <Hotkey variant='flat'>⌘X</Hotkey>
          </MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
};

export const Dynamic: Story = {
  render: (args) => (
    <MenuTrigger>
      <Button variant='icon' aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
      <Menu<MenuItemType> {...args} items={menuItems}>
        {function render(item) {
          if (item.children) {
            return (
              <MenuSubmenu>
                <MenuItem
                  key={item.id}
                  isDisabled={item.isDisabled}
                  color={item.color}
                >
                  <Icon>{item.prefixIcon}</Icon>
                  <MenuItemLabel>{item.name}</MenuItemLabel>
                  {item.description && (
                    <MenuItemDescription>
                      {item.description}
                    </MenuItemDescription>
                  )}
                  {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
                </MenuItem>
                <Menu items={item.children}>{(item) => render(item)}</Menu>
              </MenuSubmenu>
            );
          }
          return (
            <MenuItem
              key={item.id}
              isDisabled={item.isDisabled}
              color={item.color}
            >
              <Icon>{item.prefixIcon}</Icon>
              <MenuItemLabel>{item.name}</MenuItemLabel>
              {item.description && (
                <MenuItemDescription>{item.description}</MenuItemDescription>
              )}
              {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
            </MenuItem>
          );
        }}
      </Menu>
    </MenuTrigger>
  ),
};

export const ContextMenu: Story = {
  render: () => {
    const [menuPosition, setMenuPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const menuPositionRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role='menu'
        className='fg-primary-bold m-xl flex h-dvh w-dvh items-center justify-center bg-surface-raised'
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPosition({ x: e.clientX, y: e.clientY });
        }}
      >
        right-click for context menu
        <div
          ref={menuPositionRef}
          style={{
            position: 'fixed',
            top: menuPosition?.y,
            left: menuPosition?.x,
          }}
          data-pressed={!!menuPosition || undefined}
        >
          <Menu<MenuItemType>
            popoverProps={{
              placement: 'bottom left',
              offset: 0,
              isOpen: !!menuPosition,
              triggerRef: menuPositionRef,
              onOpenChange: (isOpen) => {
                if (!isOpen) {
                  setMenuPosition(null);
                }
              },
            }}
            onClose={() => setMenuPosition(null)}
            items={menuItems}
          >
            {function render(item) {
              if (item.children) {
                return (
                  <MenuSubmenu>
                    <MenuItem
                      key={item.id}
                      isDisabled={item.isDisabled}
                      color={item.color}
                    >
                      <MenuItemLabel>{item.name}</MenuItemLabel>
                      {item.hotkey && (
                        <Hotkey variant='flat'>{item.hotkey}</Hotkey>
                      )}
                    </MenuItem>
                    <Menu items={item.children}>{(item) => render(item)}</Menu>
                  </MenuSubmenu>
                );
              }
              return (
                <MenuItem
                  key={item.id}
                  isDisabled={item.isDisabled}
                  color={item.color}
                >
                  <MenuItemLabel>{item.name}</MenuItemLabel>
                  {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
                </MenuItem>
              );
            }}
          </Menu>
        </div>
      </div>
    );
  },
};
