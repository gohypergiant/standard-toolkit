/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import ChevronDown from '@accelint/icons/chevron-down';
import Placeholder from '@accelint/icons/placeholder';
import Plus from '@accelint/icons/plus';
import { useState } from 'react';
import { Icon } from '../../icon';
import { Menu } from '../../menu';
import { MenuItem } from '../../menu/item';
import { MenuItemDescription } from '../../menu/item-description';
import { MenuItemLabel } from '../../menu/item-label';
import { MenuSection } from '../../menu/section';
import { MenuSeparator } from '../../menu/separator';
import { MenuSubmenu } from '../../menu/submenu';
import { MenuTrigger } from '../../menu/trigger';
import { Tooltip } from '../../tooltip';
import { TooltipTrigger } from '../../tooltip/trigger';
import { Button } from '../';
import type { Meta, StoryObj } from '@storybook/react-vite';

type StoryArgs = {
  buttonVariant: 'filled' | 'flat' | 'icon' | 'outline';
  buttonColor: 'mono-muted' | 'mono-bold' | 'accent' | 'serious' | 'critical';
  buttonSize: 'large' | 'medium' | 'small' | 'xsmall';
  menuVariant: 'compact' | 'cozy';
  isDisabled: boolean;
};

const meta = {
  title: 'Components/Button/Composition/Menu Button',
  tags: ['!autodocs'],
  args: {
    buttonVariant: 'filled',
    buttonColor: 'mono-muted',
    buttonSize: 'medium',
    menuVariant: 'cozy',
    isDisabled: false,
  },
  argTypes: {
    buttonVariant: {
      control: 'select',
      options: ['filled', 'flat', 'icon', 'outline'],
    },
    buttonColor: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent', 'serious', 'critical'],
    },
    buttonSize: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
    menuVariant: {
      control: 'select',
      options: ['compact', 'cozy'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

const chevronStyle = (isOpen: boolean) => ({
  transform: isOpen ? 'rotate(180deg)' : undefined,
  transition: 'transform 150ms',
});

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <MenuTrigger onOpenChange={setIsOpen}>
        <Button
          variant={args.buttonVariant}
          color={args.buttonColor}
          size={args.buttonSize}
          isDisabled={args.isDisabled}
        >
          {args.buttonVariant !== 'icon' && 'Menu'}
          <Icon style={chevronStyle(isOpen)}>
            <ChevronDown />
          </Icon>
        </Button>
        <Menu variant={args.menuVariant}>
          <MenuItem id='option-1'>
            <MenuItemLabel>Option 1</MenuItemLabel>
          </MenuItem>
          <MenuItem id='option-2'>
            <MenuItemLabel>Option 2</MenuItemLabel>
          </MenuItem>
          <MenuItem id='option-3'>
            <MenuItemLabel>Option 3</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithIcon: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <MenuTrigger onOpenChange={setIsOpen}>
        <Button variant='filled' color='accent'>
          <Icon>
            <Plus />
          </Icon>
          Create New
          <Icon style={chevronStyle(isOpen)}>
            <ChevronDown />
          </Icon>
        </Button>
        <Menu>
          <MenuItem id='new-file'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>New File</MenuItemLabel>
          </MenuItem>
          <MenuItem id='new-folder'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>New Folder</MenuItemLabel>
          </MenuItem>
          <MenuItem id='new-project'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>New Project</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const IconOnly: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <MenuTrigger onOpenChange={setIsOpen}>
        <Button variant='icon' aria-label='More options'>
          <Icon>
            <Placeholder />
          </Icon>
          <Icon style={chevronStyle(isOpen)}>
            <ChevronDown />
          </Icon>
        </Button>
        <Menu>
          <MenuItem id='edit'>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='duplicate'>
            <MenuItemLabel>Duplicate</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem id='delete' color='critical'>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithSections: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <MenuTrigger onOpenChange={setIsOpen}>
        <Button>
          File
          <Icon style={chevronStyle(isOpen)}>
            <ChevronDown />
          </Icon>
        </Button>
        <Menu>
          <MenuSection title='Create'>
            <MenuItem id='new-file'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>New File</MenuItemLabel>
            </MenuItem>
            <MenuItem id='new-folder'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>New Folder</MenuItemLabel>
            </MenuItem>
          </MenuSection>
          <MenuSeparator />
          <MenuSection title='Actions'>
            <MenuItem id='save'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Save</MenuItemLabel>
            </MenuItem>
            <MenuItem id='export'>
              <Icon>
                <Placeholder />
              </Icon>
              <MenuItemLabel>Export</MenuItemLabel>
            </MenuItem>
          </MenuSection>
          <MenuSeparator />
          <MenuItem id='settings'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Settings</MenuItemLabel>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithSubmenus: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <MenuTrigger onOpenChange={setIsOpen}>
        <Button>
          Export
          <Icon style={chevronStyle(isOpen)}>
            <ChevronDown />
          </Icon>
        </Button>
        <Menu>
          <MenuItem id='quick-export'>
            <MenuItemLabel>Quick Export</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuSubmenu>
            <MenuItem>
              <MenuItemLabel>Export As...</MenuItemLabel>
            </MenuItem>
            <Menu>
              <MenuItem id='export-pdf'>
                <MenuItemLabel>PDF</MenuItemLabel>
                <MenuItemDescription>
                  Portable Document Format
                </MenuItemDescription>
              </MenuItem>
              <MenuItem id='export-csv'>
                <MenuItemLabel>CSV</MenuItemLabel>
                <MenuItemDescription>
                  Comma Separated Values
                </MenuItemDescription>
              </MenuItem>
              <MenuItem id='export-json'>
                <MenuItemLabel>JSON</MenuItemLabel>
                <MenuItemDescription>
                  JavaScript Object Notation
                </MenuItemDescription>
              </MenuItem>
            </Menu>
          </MenuSubmenu>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithSelection: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<Set<string>>(
      new Set(['medium']),
    );

    return (
      <div className='flex flex-col gap-m'>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button>
            Font Size
            <Icon style={chevronStyle(isOpen)}>
              <ChevronDown />
            </Icon>
          </Button>
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

export const WithTooltip: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <TooltipTrigger isDisabled={isOpen}>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button variant='icon' aria-label='More options'>
            <Icon>
              <Placeholder />
            </Icon>
            <Icon style={chevronStyle(isOpen)}>
              <ChevronDown />
            </Icon>
          </Button>
          <Menu>
            <MenuItem id='edit'>
              <MenuItemLabel>Edit</MenuItemLabel>
            </MenuItem>
            <MenuItem id='duplicate'>
              <MenuItemLabel>Duplicate</MenuItemLabel>
            </MenuItem>
            <MenuSeparator />
            <MenuItem id='delete' color='critical'>
              <MenuItemLabel>Delete</MenuItemLabel>
            </MenuItem>
          </Menu>
        </MenuTrigger>
        <Tooltip>More options</Tooltip>
      </TooltipTrigger>
    );
  },
};
