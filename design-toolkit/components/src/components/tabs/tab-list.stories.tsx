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

import type { Meta, StoryObj } from '@storybook/react';
import { Add, Check, Group } from '@accelint/icons';
import { Tabs } from '@/components/tabs/index';
import { Icon } from '@/components/icon';

/**
 * The `<List>` component is a direct wrapper around the TabList component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Tabs.html">here</a>.
 */
const meta: Meta<typeof Tabs.List> = {
  title: 'Components/Tabs/Tabs.List',
  component: Tabs.List,
  args: {
    isIcons: false,
    isDrawer: undefined,
    label: 'Storybook Tab List',
  },
  argTypes: {
    isIcons: {
      table: {
        defaultValue: { summary: 'false' },
        readonly: true,
      },
    },
    isDrawer: {
      control: 'select',
      options: [undefined, 'left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'undefined' } },
    },
    label: {
      table: {
        defaultValue: { summary: '' },
        readonly: true,
      },
    }
  },
};

export default meta;
type Story = StoryObj<typeof Tabs.List>;

export const Default: Story = {
  render: ({...args}) => (
    <div className="flex flex-col gap-m">
      <h5 className="fg-default-light">Horizontal Orientation</h5>
      <Tabs>
        <Tabs.List {...args} label="Storybook Tab List">
          <Tabs.Tab id="Storybook-Tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <h5 className="fg-default-light">Vertical Orientation</h5>
      <Tabs orientation="vertical">
        <Tabs.List {...args} label="Storybook Vertical Tab List">
          <Tabs.Tab id="Storybook-Vert-Tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Vert-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="Storybook-Vert-Tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </div>
  ),
};

Default.args = {
  isIcons: false,
};

export const Icons: Story = {
  render: ({...args}) => (
    <div className="flex flex-col gap-m">
      <h5 className="fg-default-light">Horizontal Orientation</h5>
      <div>
        <Tabs>
          <Tabs.List {...args} isIcons label="Storybook Icon Tab List">
            <Tabs.Tab id="Storybook-Icon-Tab-1"><Icon><Add /></Icon></Tabs.Tab>
            <Tabs.Tab id="Storybook-Icon-Tab-2"><Icon><Check /></Icon></Tabs.Tab>
            <Tabs.Tab id="Storybook-Icon-Tab-3"><Icon><Group /></Icon></Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
      <h5 className="fg-default-light">Vertical Orientation</h5>
      <div>
        <Tabs orientation="vertical">
          <Tabs.List {...args} isIcons label="Storybook Vertical Icon Tab List">
            <Tabs.Tab id="Storybook-Vert-Icon-Tab-1"><Icon><Add /></Icon></Tabs.Tab>
            <Tabs.Tab id="Storybook-Vert-Icon-Tab-2"><Icon><Check /></Icon></Tabs.Tab>
            <Tabs.Tab id="Storybook-Vert-Icon-Tab-3"><Icon><Group /></Icon></Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  ),
};

Icons.args = {
  isIcons: true,
};
