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
import type { Meta, StoryObj } from '@storybook/react-vite';
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
          <Menu
            selectedKeys={new Set(['selected-1', 'selected-2', 'selected-3'])}
          >
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
            <MenuItem id='selected-1' color='serious'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Mallard</MenuItemLabel>
              <MenuItemDescription>Anas platyrhynchos</MenuItemDescription>
              <Hotkey variant='flat'>⌘V</Hotkey>
            </MenuItem>
            <MenuItem id='selected-2' color='critical'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Chimney swift</MenuItemLabel>
              <MenuItemDescription>Chaetura pelagica</MenuItemDescription>
            </MenuItem>
            <MenuItem id='selected-3'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Brünnich's guillemot</MenuItemLabel>
              <MenuItemDescription>Dumetella carolinensis</MenuItemDescription>
              <Hotkey variant='flat'>⌘X</Hotkey>
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

export const DynamicMenuHeader: Story = {
  render: (args) => {
    const SectionHeader = () => (
      <div>
        <div className='text-body-m'>Additional Notable Species</div>
        <div className='text-body-xs'>These birds sound made up.</div>
      </div>
    );

    return (
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
            <Menu
              selectedKeys={new Set(['selected-1', 'selected-2', 'selected-3'])}
            >
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
                <MenuItemDescription>
                  Dumetella carolinensis
                </MenuItemDescription>
              </MenuItem>
              <MenuItem id='selected-1' color='serious'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Mallard</MenuItemLabel>
                <MenuItemDescription>Anas platyrhynchos</MenuItemDescription>
                <Hotkey variant='flat'>⌘V</Hotkey>
              </MenuItem>
              <MenuItem id='selected-2' color='critical'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Chimney swift</MenuItemLabel>
                <MenuItemDescription>Chaetura pelagica</MenuItemDescription>
              </MenuItem>
              <MenuItem id='selected-3'>
                <Icon>
                  <Placeholder />
                </Icon>
                <MenuItemLabel>Brünnich's guillemot</MenuItemLabel>
                <MenuItemDescription>
                  Dumetella carolinensis
                </MenuItemDescription>
                <Hotkey variant='flat'>⌘X</Hotkey>
              </MenuItem>
            </Menu>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuSection title={<SectionHeader />}>
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
    );
  },
};

/**
 * Demonstrates using `popoverProps` to customize menu placement.
 * The menu will appear above the trigger button instead of below.
 */
export const CustomPlacement: Story = {
  render: (args) => (
    <div className='flex h-[300px] items-end gap-xl p-xl'>
      <MenuTrigger>
        <Button>Top Start</Button>
        <Menu {...args} popoverProps={{ placement: 'top start' }}>
          <MenuItem id='edit'>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='copy'>
            <MenuItemLabel>Copy</MenuItemLabel>
          </MenuItem>
          <MenuItem id='delete'>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <MenuTrigger>
        <Button>Top End</Button>
        <Menu {...args} popoverProps={{ placement: 'top end' }}>
          <MenuItem id='edit'>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='copy'>
            <MenuItemLabel>Copy</MenuItemLabel>
          </MenuItem>
          <MenuItem id='delete'>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <MenuTrigger>
        <Button>Bottom Start</Button>
        <Menu {...args} popoverProps={{ placement: 'bottom start' }}>
          <MenuItem id='edit'>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='copy'>
            <MenuItemLabel>Copy</MenuItemLabel>
          </MenuItem>
          <MenuItem id='delete'>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <MenuTrigger>
        <Button>Bottom End</Button>
        <Menu {...args} popoverProps={{ placement: 'bottom end' }}>
          <MenuItem id='edit'>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='copy'>
            <MenuItemLabel>Copy</MenuItemLabel>
          </MenuItem>
          <MenuItem id='delete'>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  ),
};

/**
 * Demonstrates using `onAction` to handle menu item selection.
 * Open the browser console to see the selected item key logged.
 */
export const WithActionHandler: Story = {
  render: (args) => {
    const [lastAction, setLastAction] = useState<string | null>(null);

    return (
      <div className='flex flex-col gap-m'>
        <MenuTrigger>
          <Button>Actions Menu</Button>
          <Menu
            {...args}
            onAction={(key) => {
              console.log('Selected:', key);
              setLastAction(String(key));
            }}
          >
            <MenuItem id='new-file'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>New File</MenuItemLabel>
              <Hotkey variant='flat'>⌘N</Hotkey>
            </MenuItem>
            <MenuItem id='open-file'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Open File</MenuItemLabel>
              <Hotkey variant='flat'>⌘O</Hotkey>
            </MenuItem>
            <MenuSeparator />
            <MenuItem id='save'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Save</MenuItemLabel>
              <Hotkey variant='flat'>⌘S</Hotkey>
            </MenuItem>
            <MenuItem id='save-as'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Save As...</MenuItemLabel>
              <Hotkey variant='flat'>⇧⌘S</Hotkey>
            </MenuItem>
            <MenuSeparator />
            <MenuItem id='delete' color='critical'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Delete</MenuItemLabel>
              <Hotkey variant='flat'>⌘⌫</Hotkey>
            </MenuItem>
          </Menu>
        </MenuTrigger>

        {lastAction && (
          <div className='fg-primary-bold text-body-m'>
            Last action:{' '}
            <code className='rounded bg-surface-raised p-xs'>{lastAction}</code>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Demonstrates multi-select functionality with `selectionMode='multiple'`.
 */
export const MultipleSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(['bold']),
    );

    return (
      <div className='flex flex-col gap-m'>
        <MenuTrigger>
          <Button>Text Formatting</Button>
          <Menu
            selectionMode='multiple'
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          >
            <MenuItem id='bold'>
              <MenuItemLabel>Bold</MenuItemLabel>
              <Hotkey variant='flat'>⌘B</Hotkey>
            </MenuItem>
            <MenuItem id='italic'>
              <MenuItemLabel>Italic</MenuItemLabel>
              <Hotkey variant='flat'>⌘I</Hotkey>
            </MenuItem>
            <MenuItem id='underline'>
              <MenuItemLabel>Underline</MenuItemLabel>
              <Hotkey variant='flat'>⌘U</Hotkey>
            </MenuItem>
            <MenuItem id='strikethrough'>
              <MenuItemLabel>Strikethrough</MenuItemLabel>
              <Hotkey variant='flat'>⇧⌘X</Hotkey>
            </MenuItem>
          </Menu>
        </MenuTrigger>

        <div className='fg-primary-bold text-body-m'>
          Selected:{' '}
          <code className='rounded bg-surface-raised p-xs'>
            {Array.from(selectedKeys).join(', ') || 'none'}
          </code>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates single-select functionality with `selectionMode='single'`.
 */
export const SingleSelection: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<Set<string>>(
      new Set(['medium']),
    );

    return (
      <div className='flex flex-col gap-m'>
        <MenuTrigger>
          <Button>Font Size</Button>
          <Menu
            selectionMode='single'
            selectedKeys={selectedKey}
            onSelectionChange={(keys) => setSelectedKey(keys as Set<string>)}
          >
            <MenuItem id='small'>
              <MenuItemLabel>Small</MenuItemLabel>
            </MenuItem>
            <MenuItem id='medium'>
              <MenuItemLabel>Medium</MenuItemLabel>
            </MenuItem>
            <MenuItem id='large'>
              <MenuItemLabel>Large</MenuItemLabel>
            </MenuItem>
            <MenuItem id='extra-large'>
              <MenuItemLabel>Extra Large</MenuItemLabel>
            </MenuItem>
          </Menu>
        </MenuTrigger>

        <div className='fg-primary-bold text-body-m'>
          Selected:{' '}
          <code className='rounded bg-surface-raised p-xs'>
            {Array.from(selectedKey)[0] || 'none'}
          </code>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates disabled menu items.
 */
export const DisabledItems: Story = {
  render: (args) => (
    <MenuTrigger>
      <Button>Menu with Disabled Items</Button>
      <Menu {...args}>
        <MenuItem id='available'>
          <MenuItemLabel>Available Action</MenuItemLabel>
        </MenuItem>
        <MenuItem id='disabled-1' isDisabled>
          <MenuItemLabel>Disabled Action</MenuItemLabel>
          <MenuItemDescription>
            This action is not available
          </MenuItemDescription>
        </MenuItem>
        <MenuItem id='another-available'>
          <MenuItemLabel>Another Available Action</MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem id='disabled-2' isDisabled>
          <MenuItemLabel>Also Disabled</MenuItemLabel>
        </MenuItem>
        <MenuItem id='delete' color='critical'>
          <MenuItemLabel>Delete (Available)</MenuItemLabel>
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

/**
 * Demonstrates all color variants for menu items.
 */
export const ColorVariants: Story = {
  render: (args) => (
    <MenuTrigger>
      <Button>Color Variants</Button>
      <Menu {...args}>
        <MenuItem id='info' color='info'>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Info (Default)</MenuItemLabel>
          <MenuItemDescription>Standard menu item</MenuItemDescription>
        </MenuItem>
        <MenuItem id='serious' color='serious'>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Serious</MenuItemLabel>
          <MenuItemDescription>Warning or important action</MenuItemDescription>
        </MenuItem>
        <MenuItem id='critical' color='critical'>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Critical</MenuItemLabel>
          <MenuItemDescription>
            Destructive or dangerous action
          </MenuItemDescription>
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

/**
 * Demonstrates a simple menu without icons or descriptions.
 */
export const SimpleMenu: Story = {
  render: (args) => (
    <MenuTrigger>
      <Button>Simple Menu</Button>
      <Menu {...args}>
        <MenuItem id='cut'>
          <MenuItemLabel>Cut</MenuItemLabel>
        </MenuItem>
        <MenuItem id='copy'>
          <MenuItemLabel>Copy</MenuItemLabel>
        </MenuItem>
        <MenuItem id='paste'>
          <MenuItemLabel>Paste</MenuItemLabel>
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

/**
 * Demonstrates using popoverProps with offset to add spacing between trigger and menu.
 */
export const WithOffset: Story = {
  render: (args) => (
    <div className='flex gap-xl'>
      <MenuTrigger>
        <Button>No Offset</Button>
        <Menu {...args} popoverProps={{ placement: 'bottom', offset: 0 }}>
          <MenuItem id='item-1'>
            <MenuItemLabel>Menu Item 1</MenuItemLabel>
          </MenuItem>
          <MenuItem id='item-2'>
            <MenuItemLabel>Menu Item 2</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <MenuTrigger>
        <Button>8px Offset</Button>
        <Menu {...args} popoverProps={{ placement: 'bottom', offset: 8 }}>
          <MenuItem id='item-1'>
            <MenuItemLabel>Menu Item 1</MenuItemLabel>
          </MenuItem>
          <MenuItem id='item-2'>
            <MenuItemLabel>Menu Item 2</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <MenuTrigger>
        <Button>16px Offset</Button>
        <Menu {...args} popoverProps={{ placement: 'bottom', offset: 16 }}>
          <MenuItem id='item-1'>
            <MenuItemLabel>Menu Item 1</MenuItemLabel>
          </MenuItem>
          <MenuItem id='item-2'>
            <MenuItemLabel>Menu Item 2</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  ),
};
