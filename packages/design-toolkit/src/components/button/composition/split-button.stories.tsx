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
import { MenuItemLabel } from '@/components/menu/item-label';
import { MenuTrigger } from '@/components/menu/trigger';
import { Tooltip } from '@/components/tooltip';
import { TooltipTrigger } from '@/components/tooltip/trigger';
import { Button } from '../';
import { ToggleButton } from '../toggle';
import type { StoryObj } from '@storybook/react-vite';

type StoryArgs = {
  buttonColor: 'mono-muted' | 'mono-bold' | 'accent';
  menuVariant: 'compact' | 'cozy';
  isDisabled: boolean;
};

const meta = {
  title: 'Components/Button/Composition/Split Button',
  tags: ['!autodocs'],
  args: {
    buttonColor: 'mono-muted',
  },
  argTypes: {
    buttonColor: {
      control: 'select',
      options: ['mono-muted', 'mono-bold', 'accent'],
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
          color='mono-muted'
          isDisabled={args.isDisabled}
          className='rounded-r-none'
        >
          <Icon>
            <Placeholder />
          </Icon>
        </Button>
        <TooltipTrigger>
          <MenuTrigger onOpenChange={setIsOpen}>
            <ToggleButton
              variant='icon'
              color={args.buttonColor}
              className='w-m min-w-m rounded-l-none p-0'
              isDisabled={args.isDisabled}
              isSelected={isOpen}
            >
              <Icon style={chevronStyle(isOpen)} className='flex h-full w-m'>
                <ChevronDown />
              </Icon>
            </ToggleButton>
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
