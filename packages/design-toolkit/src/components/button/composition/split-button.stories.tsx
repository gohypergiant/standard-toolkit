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

import { ChevronDown, Placeholder } from '@accelint/icons';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import { Menu } from '@/components/menu';
import { MenuItem } from '@/components/menu/item';
import { MenuItemDescription } from '@/components/menu/item-description';
import { MenuItemLabel } from '@/components/menu/item-label';
import { MenuSection } from '@/components/menu/section';
import { MenuSeparator } from '@/components/menu/separator';
import { MenuSubmenu } from '@/components/menu/submenu';
import { MenuTrigger } from '@/components/menu/trigger';
import { Tooltip } from '@/components/tooltip';
import { TooltipTrigger } from '@/components/tooltip/trigger';
import { Button } from '../';
import type { StoryObj } from '@storybook/react-vite';

type StoryArgs = {
  buttonColor: 'mono-muted' | 'mono-bold' | 'accent';
  buttonSize: 'large' | 'medium' | 'small' | 'xsmall';
  menuVariant: 'compact' | 'cozy';
  isDisabled: boolean;
};

const meta = {
  title: 'Components/Button/Composition/Split Button',
  tags: ['!autodocs'],
  args: {
    buttonColor: 'mono-muted',
    buttonSize: 'medium',
    menuVariant: 'compact',
  },
  argTypes: {
    buttonColor: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent'],
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
};

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
      <div className='flex flex-row'>
        <Button
          variant='icon'
          size={args.buttonSize}
          color={args.buttonColor}
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <TooltipTrigger>
          <MenuTrigger onOpenChange={setIsOpen}>
            <Button
              variant='icon'
              color={args.buttonColor}
              className='w-m min-w-m rounded-l-none p-0'
              isDisabled={args.isDisabled}
              size={args.buttonSize}
            >
              <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
                <ChevronDown />
              </Icon>
            </Button>
            <Tooltip>Tool label</Tooltip>
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
        </TooltipTrigger>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='flex flex-row'>
        <Button
          variant='icon'
          size={args.buttonSize}
          color={args.buttonColor}
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button
            variant='icon'
            color={args.buttonColor}
            className='w-m min-w-m rounded-l-none p-0'
            isDisabled={args.isDisabled}
            size={args.buttonSize}
          >
            <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
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
      </div>
    );
  },
};

export const WithSections: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='flex flex-row'>
        <Button
          variant='icon'
          size={args.buttonSize}
          color={args.buttonColor}
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button
            variant='icon'
            color={args.buttonColor}
            className='w-m min-w-m rounded-l-none p-0'
            isDisabled={args.isDisabled}
            size={args.buttonSize}
          >
            <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
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
      </div>
    );
  },
};

export const WithSubmenus: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='flex flex-row'>
        <Button
          variant='icon'
          size={args.buttonSize}
          color={args.buttonColor}
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button
            variant='icon'
            color={args.buttonColor}
            className='w-m min-w-m rounded-l-none p-0'
            isDisabled={args.isDisabled}
            size={args.buttonSize}
          >
            <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
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
      </div>
    );
  },
};

export const WithSelection: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<Set<string>>(
      new Set(['medium']),
    );

    return (
      <div className='flex flex-col gap-m'>
        <Button
          variant='icon'
          size={args.buttonSize}
          color={args.buttonColor}
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <MenuTrigger onOpenChange={setIsOpen}>
          <Button
            variant='icon'
            color={args.buttonColor}
            className='w-m min-w-m rounded-l-none p-0'
            isDisabled={args.isDisabled}
            size={args.buttonSize}
          >
            <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
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
