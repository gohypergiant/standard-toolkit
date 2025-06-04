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

import { Kebab } from '@accelint/icons';
import type { Meta } from '@storybook/react';
import { MenuTrigger, SubmenuTrigger } from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu, MenuItem, MenuSection, MenuSeparator } from './';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Example = (args: any) => (
  <MenuTrigger>
    <Button variant='outline' className='px-2'>
      <Icon>
        <Kebab className='h-5 w-5' />
      </Icon>
    </Button>
    <Menu {...args}>
      <MenuItem id='new'>New…</MenuItem>
      <MenuItem id='open'>Open…</MenuItem>
      <MenuSeparator />
      <MenuItem id='save'>Save</MenuItem>
      <MenuItem id='saveAs'>Save as…</MenuItem>
      <MenuSeparator />
      <MenuItem id='print'>Print…</MenuItem>
    </Menu>
  </MenuTrigger>
);

export const DisabledItems = (args: any) => <Example {...args} />;
DisabledItems.args = {
  disabledKeys: ['save'],
};

export const Sections = (args: any) => (
  <MenuTrigger>
    <Button variant='outline' className='px-2'>
      <Icon>
        <Kebab className='h-5 w-5' />
      </Icon>
    </Button>
    <Menu {...args}>
      <MenuSection title='Your Content'>
        <MenuItem id='repos'>Repositories</MenuItem>
        <MenuItem id='projects'>Projects</MenuItem>
        <MenuItem id='organizations'>Organizations</MenuItem>
        <MenuItem id='stars'>Stars</MenuItem>
        <MenuItem id='sponsors'>Sponsors</MenuItem>
      </MenuSection>
      <MenuSection title='Your Account'>
        <MenuItem id='profile'>Profile</MenuItem>
        <MenuItem id='status'>Set status</MenuItem>
        <MenuItem id='sign-out'>Sign out</MenuItem>
      </MenuSection>
    </Menu>
  </MenuTrigger>
);

export const Submenu = (args: any) => (
  <MenuTrigger>
    <Button variant='outline' className='px-2'>
      <Icon>
        <Kebab className='h-5 w-5' />
      </Icon>
    </Button>
    <Menu {...args}>
      <MenuItem id='new'>New…</MenuItem>
      <SubmenuTrigger>
        <MenuItem id='open'>Open</MenuItem>
        <Menu>
          <MenuItem id='open-new'>Open in New Window</MenuItem>
          <MenuItem id='open-current'>Open in Current Window</MenuItem>
        </Menu>
      </SubmenuTrigger>
      <MenuSeparator />
      <MenuItem id='print'>Print…</MenuItem>
      <SubmenuTrigger>
        <MenuItem id='share'>Share</MenuItem>
        <Menu>
          <MenuItem id='sms'>SMS</MenuItem>
          <MenuItem id='x'>X</MenuItem>
          <SubmenuTrigger>
            <MenuItem id='email'>Email</MenuItem>
            <Menu>
              <MenuItem id='work'>Work</MenuItem>
              <MenuItem id='personal'>Personal</MenuItem>
            </Menu>
          </SubmenuTrigger>
        </Menu>
      </SubmenuTrigger>
    </Menu>
  </MenuTrigger>
);
