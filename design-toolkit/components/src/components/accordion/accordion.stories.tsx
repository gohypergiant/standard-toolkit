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

import { Placeholder } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
import { MenuTrigger } from '../menu/trigger';
import { Accordion } from './';
import { AccordionHeader } from './header';
import { AccordionPanel } from './panel';
import { AccordionStylesDefaults } from './styles';
import { AccordionTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * The accordion will stretch to fill the entire width of its parent container.
 */
const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    isDisabled: false,
    variant: AccordionStylesDefaults.variant,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
  parameters: {
    docs: {
      subtitle: 'Content that can expand and collapse.',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <AccordionHeader>
          <AccordionTrigger>
            <Icon>
              <Placeholder />
            </Icon>
            Accordion title
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <p className='fg-primary-muted text-body-s'>
            This is a placeholder content for an accordion. Please replace with
            an actual content instance.
          </p>
        </AccordionPanel>
      </Accordion>
    </div>
  ),
};

export const WithMenu: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <AccordionHeader>
          <AccordionTrigger>
            <Icon>
              <Placeholder />
            </Icon>
            Accordion title
          </AccordionTrigger>
          <MenuTrigger>
            <Button />
            <Menu>
              <MenuItem>Foo</MenuItem>
              <MenuItem>Bar</MenuItem>
            </Menu>
          </MenuTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <p className='fg-primary-muted text-body-s'>
            This is a placeholder content for an accordion. Please replace with
            an actual content instance.
          </p>
        </AccordionPanel>
      </Accordion>
    </div>
  ),
};
