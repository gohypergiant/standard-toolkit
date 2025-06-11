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
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from './';

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
  <Menu>
    <Menu.Trigger>
      <Button variant='outline' className='px-2'>
        <Icon>
          <Kebab className='h-5 w-5' />
        </Icon>
      </Button>
    </Menu.Trigger>
    <Menu.List {...args}>
      <Menu.Item id='new'>New…</Menu.Item>
      <Menu.Item id='open'>Open…</Menu.Item>
      <Menu.Separator />
      <Menu.Item id='save'>Save</Menu.Item>
      <Menu.Item id='saveAs'>Save as…</Menu.Item>
      <Menu.Separator />
      <Menu.Item id='print'>Print…</Menu.Item>
    </Menu.List>
  </Menu>
);

export const DisabledItems = (args: any) => <Example {...args} />;
DisabledItems.args = {
  disabledKeys: ['save'],
};

export const Sections = (args: any) => (
  <Menu>
    <Menu.Trigger>
      <Button variant='outline' className='px-2'>
        <Icon>
          <Kebab className='h-5 w-5' />
        </Icon>
      </Button>
    </Menu.Trigger>
    <Menu.List {...args}>
      <Menu.Section title='Your Content'>
        <Menu.Item id='repos'>Repositories</Menu.Item>
        <Menu.Item id='projects'>Projects</Menu.Item>
        <Menu.Item id='organizations'>Organizations</Menu.Item>
        <Menu.Item id='stars'>Stars</Menu.Item>
        <Menu.Item id='sponsors'>Sponsors</Menu.Item>
      </Menu.Section>
      <Menu.Section title='Your Account'>
        <Menu.Item id='profile'>Profile</Menu.Item>
        <Menu.Item id='status'>Set status</Menu.Item>
        <Menu.Item id='sign-out'>Sign out</Menu.Item>
      </Menu.Section>
    </Menu.List>
  </Menu>
);

export const Submenu = (args: any) => (
  <Menu>
    <Menu.Trigger>
      <Button variant='outline' className='px-2'>
        <Icon>
          <Kebab className='h-5 w-5' />
        </Icon>
      </Button>
    </Menu.Trigger>
    <Menu.List {...args}>
      <Menu.Item id='new'>New…</Menu.Item>
      <Menu.SubmenuTrigger>
        <Menu.Item id='open'>Open</Menu.Item>
        <Menu.List>
          <Menu.Item id='open-new'>Open in New Window</Menu.Item>
          <Menu.Item id='open-current'>Open in Current Window</Menu.Item>
        </Menu.List>
      </Menu.SubmenuTrigger>
      <Menu.Separator />
      <Menu.Item id='print'>Print…</Menu.Item>
      <Menu.SubmenuTrigger>
        <Menu.Item id='share'>Share</Menu.Item>
        <Menu.List>
          <Menu.Item id='sms'>SMS</Menu.Item>
          <Menu.Item id='x'>X</Menu.Item>
          <Menu.SubmenuTrigger>
            <Menu.Item id='email'>Email</Menu.Item>
            <Menu.List>
              <Menu.Item id='work'>Work</Menu.Item>
              <Menu.Item id='personal'>Personal</Menu.Item>
            </Menu.List>
          </Menu.SubmenuTrigger>
        </Menu.List>
      </Menu.SubmenuTrigger>
    </Menu.List>
  </Menu>
);
