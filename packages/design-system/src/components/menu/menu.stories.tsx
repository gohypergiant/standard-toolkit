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

import type { Story, StoryDefault } from '@ladle/react';
import type { ReactNode } from 'react';
import { Collection, MenuTrigger, SubmenuTrigger } from 'react-aria-components';
import { actions } from '../../ladle/actions';
import {
  AriaHeader,
  AriaKeyboard,
  AriaSection,
  AriaSeparator,
  AriaText,
} from '../aria';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu, MenuItem, MenuList } from './';
import type { MenuListProps, MenuProps } from './types';

export default {
  title: 'Components/Menu',
  argTypes: {
    selectionBehavior: {
      control: {
        type: 'select',
      },
      options: ['toggle', 'replace'],
      defaultValue: 'toggle',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
    selectionMode: {
      control: {
        type: 'select',
      },
      options: ['none', 'single', 'multiple'],
      defaultValue: 'single',
    },
  },
} satisfies StoryDefault;

// example of a static collection
export const MenuBasicExample: Story<MenuProps> = (props) => (
  <MenuTrigger>
    <Button aria-label='Menu'>☰ Open Menu</Button>
    <Menu>
      <MenuList
        {...props}
        aria-label='Action Menu'
        {...actions<MenuListProps<object>>(
          'onAction',
          'onClose',
          'onScroll',
          'onSelectionChange',
        )}
      >
        <MenuItem textValue='DL1234'>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>DL1234</AriaText>
          <AriaText slot='description'>Recommended</AriaText>
          <AriaKeyboard>⌘X</AriaKeyboard>
        </MenuItem>
        <MenuItem textValue='AA123'>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>AA123</AriaText>
          <AriaText slot='description'>Arriving</AriaText>
          <AriaKeyboard>⌘V</AriaKeyboard>
        </MenuItem>
        <MenuItem textValue='DL5678' isDisabled>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>DL5678</AriaText>
        </MenuItem>
      </MenuList>
    </Menu>
  </MenuTrigger>
);

MenuBasicExample.storyName = 'Basic Menu';

export const MenuControlledExample: Story<
  MenuProps & MenuListProps<object>
> = ({ selectedKeys, ...rest }) => (
  <MenuTrigger>
    <Button aria-label='Menu'>☰ Controlled Menu</Button>
    <Menu>
      <MenuList
        {...rest}
        aria-label='Action Menu'
        selectedKeys={selectedKeys}
        {...actions<MenuListProps<object>>(
          'onAction',
          'onClose',
          'onScroll',
          'onSelectionChange',
        )}
      >
        <MenuItem textValue='DL1234'>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>DL1234</AriaText>
          <AriaText slot='description'>Recommended</AriaText>
          <AriaKeyboard>⌘X</AriaKeyboard>
        </MenuItem>
        <MenuItem textValue='AA123'>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>AA123</AriaText>
          <AriaText slot='description'>Arriving</AriaText>
          <AriaKeyboard>⌘V</AriaKeyboard>
        </MenuItem>
        <MenuItem textValue='DL5678' isDisabled>
          <Icon size='md'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <title>Ladle</title>
              <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
            </svg>
          </Icon>
          <AriaText slot='label'>DL5678</AriaText>
        </MenuItem>
      </MenuList>
    </Menu>
  </MenuTrigger>
);

MenuControlledExample.storyName = 'Controlled Menu';

MenuControlledExample.argTypes = {
  selectedKeys: {
    control: {
      type: 'multi-select',
    },
    options: ['DL1234', 'AA123', 'DL5678'],
    defaultValue: [],
  },
  selectionMode: {
    control: {
      type: 'select',
    },
    options: ['multiple'],
    defaultValue: 'multiple', // lock to multiple
  },
};

type NavItem = {
  id: string;
  name?: string;
  icon?: ReactNode;
  section?: NavItem[];
  children?: NavItem[];
};

const icon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <title>Ladle</title>
    <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z' />
  </svg>
);

/**
 * Note: all items need unique keys
 */
const menuItems: NavItem[] = [
  { id: '1', name: 'Menu Item One', icon },
  { id: '2', name: 'Menu Item Two', icon },
  { id: '3', name: 'Menu Item Three', icon },
  {
    id: '4',
    name: 'Menu With Children',
    children: [
      { id: '5', name: 'Child One' },
      { id: '6', name: 'Child Two' },
    ],
  },
];

export const MenuDynamicExample: Story<MenuListProps<NavItem>> = (props) => (
  <MenuTrigger>
    <Button aria-label='Menu'>☰ Open Menu</Button>
    <Menu>
      <MenuList<NavItem>
        {...props}
        items={menuItems}
        {...actions<MenuListProps<NavItem>>(
          'onAction',
          'onClose',
          'onScroll',
          'onSelectionChange',
        )}
      >
        {function renderSubmenu(item) {
          if (item.children) {
            return (
              <SubmenuTrigger>
                <MenuItem>
                  {item.icon && <Icon size='md'>{item.icon}</Icon>}
                  <AriaText slot='label'>{item.name}</AriaText>
                  <Icon size='sm' slot='more'>
                    <svg className='chevron' viewBox='0 0 24 24'>
                      <title>Ladle</title>
                      <path d='m9 18 6-6-6-6' />
                    </svg>
                  </Icon>
                </MenuItem>
                <Menu>
                  <MenuList items={item.children}>{renderSubmenu}</MenuList>
                </Menu>
              </SubmenuTrigger>
            );
          }

          return (
            <MenuItem>
              {item.icon && <Icon size='md'>{item.icon}</Icon>}
              <AriaText slot='label'>{item.name}</AriaText>
            </MenuItem>
          );
        }}
      </MenuList>
    </Menu>
  </MenuTrigger>
);

MenuDynamicExample.storyName = 'Dynamic Items';

const nestedNavItems: NavItem[] = [
  {
    id: '1',
    name: 'Section Header One',
    section: [
      { id: '1.1', name: 'Section Item One' },
      { id: '1.2', name: 'Section Item Two' },
    ],
  },
  { id: '2', name: 'Menu Item Two' },
  { id: '3', name: 'Menu Item Three' },
  {
    id: '4',
    name: 'Menu With Submenu One',
    children: [
      { id: '4.5', name: 'Submenu Item One' },
      { id: '4.6', name: 'Submenu Item Two' },
    ],
  },
  { id: '7' },
  {
    id: '8',
    name: 'Section Header Two',
    section: [
      { id: '8.1', name: 'Section Item Three' },
      { id: '8.2', name: 'Section Item Four' },
    ],
  },
];

// dynamic sections with sections and header
export const MenuSectionsExample: Story<MenuListProps<NavItem>> = (props) => (
  <MenuTrigger>
    <Button aria-label='Menu'>☰ Open Menu</Button>
    <Menu>
      <MenuList<NavItem>
        {...props}
        items={nestedNavItems}
        {...actions<MenuListProps<NavItem>>(
          'onAction',
          'onClose',
          'onScroll',
          'onSelectionChange',
        )}
      >
        {function renderSubmenu(item) {
          if (item.children) {
            return (
              <SubmenuTrigger>
                <MenuItem>
                  <AriaText slot='label'>{item.name}</AriaText>
                  <Icon size='sm' slot='more'>
                    <svg className='chevron' viewBox='0 0 24 24'>
                      <title>Ladle</title>
                      <path d='m9 18 6-6-6-6' />
                    </svg>
                  </Icon>
                </MenuItem>
                <Menu>
                  <MenuList items={item.children}>{renderSubmenu}</MenuList>
                </Menu>
              </SubmenuTrigger>
            );
          }

          if (item.section) {
            return (
              <AriaSection>
                <AriaHeader>{item.name}</AriaHeader>
                <Collection items={item.section}>{renderSubmenu}</Collection>
              </AriaSection>
            );
          }

          return item.name ? (
            <MenuItem>
              <AriaText slot='label'>{item.name}</AriaText>
            </MenuItem>
          ) : (
            <AriaSeparator />
          );
        }}
      </MenuList>
    </Menu>
  </MenuTrigger>
);

MenuSectionsExample.storyName = 'With Sections';
