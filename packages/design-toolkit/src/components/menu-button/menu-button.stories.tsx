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

import Placeholder from '@accelint/icons/placeholder';
import Plus from '@accelint/icons/plus';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Icon } from '../icon';
import { MenuItem } from '../menu/item';
import { MenuItemDescription } from '../menu/item-description';
import { MenuItemLabel } from '../menu/item-label';
import { MenuSection } from '../menu/section';
import { MenuSeparator } from '../menu/separator';
import { MenuSubmenu } from '../menu/submenu';
import { Menu } from '../menu';
import { MenuButton } from './';

const meta = {
  title: 'Components/MenuButton',
  component: MenuButton,
  args: {
    label: 'Actions',
    size: 'medium',
    color: 'mono-muted',
    variant: 'filled',
  },
  argTypes: {
    label: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'xsmall'],
    },
    color: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent', 'serious', 'critical'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'flat', 'outline', 'icon'],
    },
    menuVariant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuButton {...args}>
      <MenuItem id='edit'>
        <MenuItemLabel>Edit</MenuItemLabel>
      </MenuItem>
      <MenuItem id='copy'>
        <MenuItemLabel>Copy</MenuItemLabel>
      </MenuItem>
      <MenuItem id='delete'>
        <MenuItemLabel>Delete</MenuItemLabel>
      </MenuItem>
    </MenuButton>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <MenuButton
      {...args}
      label='Create New'
      icon={<Plus />}
      variant='filled'
      color='accent'
    >
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
    </MenuButton>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <MenuButton variant='icon' aria-label='More options'>
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
    </MenuButton>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className='flex gap-xl'>
      <MenuButton label='Filled' variant='filled'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Flat' variant='flat'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Outline' variant='outline'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-start gap-xl'>
      <MenuButton label='Large' size='large'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Medium' size='medium'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Small' size='small'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='XSmall' size='xsmall'>
        <MenuItem id='option-1'>
          <MenuItemLabel>Option 1</MenuItemLabel>
        </MenuItem>
        <MenuItem id='option-2'>
          <MenuItemLabel>Option 2</MenuItemLabel>
        </MenuItem>
      </MenuButton>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className='flex gap-xl'>
      <MenuButton label='Mono Muted' color='mono-muted'>
        <MenuItem id='option'>
          <MenuItemLabel>Option</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Mono Bold' color='mono-bold'>
        <MenuItem id='option'>
          <MenuItemLabel>Option</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Accent' color='accent'>
        <MenuItem id='option'>
          <MenuItemLabel>Option</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Serious' color='serious'>
        <MenuItem id='option'>
          <MenuItemLabel>Option</MenuItemLabel>
        </MenuItem>
      </MenuButton>

      <MenuButton label='Critical' color='critical'>
        <MenuItem id='option'>
          <MenuItemLabel>Option</MenuItemLabel>
        </MenuItem>
      </MenuButton>
    </div>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <MenuButton {...args} label='File'>
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
    </MenuButton>
  ),
};

export const WithSubmenus: Story = {
  render: (args) => (
    <MenuButton {...args} label='Export'>
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
            <MenuItemDescription>Portable Document Format</MenuItemDescription>
          </MenuItem>
          <MenuItem id='export-csv'>
            <MenuItemLabel>CSV</MenuItemLabel>
            <MenuItemDescription>Comma Separated Values</MenuItemDescription>
          </MenuItem>
          <MenuItem id='export-json'>
            <MenuItemLabel>JSON</MenuItemLabel>
            <MenuItemDescription>
              JavaScript Object Notation
            </MenuItemDescription>
          </MenuItem>
        </Menu>
      </MenuSubmenu>
    </MenuButton>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <MenuButton {...args} label='Disabled' isDisabled>
      <MenuItem id='option-1'>
        <MenuItemLabel>Option 1</MenuItemLabel>
      </MenuItem>
      <MenuItem id='option-2'>
        <MenuItemLabel>Option 2</MenuItemLabel>
      </MenuItem>
    </MenuButton>
  ),
};

export const WithActionHandler: Story = {
  render: (args) => {
    const [lastAction, setLastAction] = useState<string | null>(null);

    return (
      <div className='flex flex-col gap-m'>
        <MenuButton
          {...args}
          label='Actions'
          onAction={(key) => setLastAction(String(key))}
        >
          <MenuItem id='edit'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Edit</MenuItemLabel>
          </MenuItem>
          <MenuItem id='duplicate'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Duplicate</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem id='delete' color='critical'>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Delete</MenuItemLabel>
          </MenuItem>
        </MenuButton>

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

export const WithSelection: Story = {
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState<Set<string>>(
      new Set(['medium']),
    );

    return (
      <div className='flex flex-col gap-m'>
        <MenuButton
          {...args}
          label='Font Size'
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
        </MenuButton>

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
  render: () => (
    <MenuButton variant='icon' aria-label='More options' tooltip='More options'>
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
    </MenuButton>
  ),
};
