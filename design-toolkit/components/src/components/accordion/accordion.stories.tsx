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

import { COMMON_CONTROL, EXCLUSIONS, MOCK_DATA } from '^storybook/utils';
import { Placeholder } from '@accelint/icons';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { Accordion } from './';
import { AccordionStylesDefaults } from './styles';
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
    variant: COMMON_CONTROL.spacingVariant,
    isDisabled: COMMON_CONTROL.isDisabled,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'id'],
    },
    docs: {
      subtitle: 'Content that can expand and collapse.',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const CONTENT = (
  <p className='fg-primary-muted text-body-s'>
    {MOCK_DATA.TEXT_CONTENT.MEDIUM}
  </p>
);

export const Default: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <Accordion.Header>
          <Accordion.Trigger>
            <Icon>
              <Placeholder />
            </Icon>
            Accordion title
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>{CONTENT}</Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const WithMenu: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[280px]'>
      <Accordion {...args}>
        <Accordion.Header>
          <Accordion.Trigger>
            <Icon>
              <Placeholder />
            </Icon>
            Accordion title
          </Accordion.Trigger>
          <Menu.Trigger>
            <Button />
            <Menu>
              <Menu.Item>Edit</Menu.Item>
              <Menu.Item>Delete</Menu.Item>
            </Menu>
          </Menu.Trigger>
        </Accordion.Header>
        <Accordion.Panel>{CONTENT}</Accordion.Panel>
      </Accordion>
    </div>
  ),
};
