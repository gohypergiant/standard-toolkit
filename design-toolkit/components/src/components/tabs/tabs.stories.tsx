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

import { Icon } from '@/components/icon';
import { Tabs } from '@/components/tabs/index';
import { Add, Check, Group } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * The `<Tabs>` component is a direct wrapper around the `Tabs` component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Tabs.html">here</a>.
 *
 * ## Composition Requirements
 *
 * Error boundaries for incorrect usage of this component:
 *
 * - `Tabs` must include a `Tabs.List`
 */
const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs/Tabs',
  component: Tabs,
  args: {
    orientation: 'horizontal',
    isDisabled: false,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: ({ ...args }) => (
    <div className='flex w-full flex-row flex-wrap gap-m'>
      <div className='w-[300px]'>
        <Tabs {...args}>
          <Tabs.List>
            <Tabs.Tab id='Storybook-Tab-1'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='Storybook-Tab-2'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='Storybook-Tab-3'>Tab 3</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
      <div className='w-[300px]'>
        <Tabs {...args}>
          <Tabs.List variant='icons'>
            <Tabs.Tab id='Storybook-Icon-Tab-1'>
              <Icon>
                <Add />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Icon-Tab-2'>
              <Icon>
                <Check />
              </Icon>
            </Tabs.Tab>
            <Tabs.Tab id='Storybook-Icon-Tab-3'>
              <Icon>
                <Group />
              </Icon>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  ),
};
