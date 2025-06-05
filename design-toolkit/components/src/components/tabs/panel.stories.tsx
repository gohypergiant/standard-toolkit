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
import { Tabs } from '@/components/tabs/index';

/**
 * The `<Panel>` component is a direct wrapper around the TabPanel component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Tabs.html">here</a>.
 */
const meta: Meta<typeof Tabs.Panel> = {
  title: 'Components/Tabs/Tabs.Panel',
  component: Tabs.Panel,
  args: {
    id: 'Storybook-Tab-1',
    children: 'Tab 1 Content',
  },
  argTypes: {
    id: {
      control: 'text',
      table: { readonly: true },
    },
    children: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs.Panel>;

export const Default: Story = {
  render: ({ id, children }) => (
    <div className="flex flex-col gap-m">
      <h5 className="fg-default-light">Horizontal Orientation</h5>
      <Tabs orientation="horizontal">
        <Tabs.List label="Storybook Horizontal Tab List">
          <Tabs.Tab id={id}>Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id={id}>
          {children}
        </Tabs.Panel>
        <Tabs.Panel id="Storybook-Tab-2">
          Tab 2 Content
        </Tabs.Panel>
        <Tabs.Panel id="Storybook-Tab-3">
          Tab 3 Content
        </Tabs.Panel>
      </Tabs>
      <h5 className="fg-default-light">Vertical Orientation</h5>
      <Tabs orientation="vertical">
        <Tabs.List label="Storybook Vertical Tab List">
          <Tabs.Tab id={`${id}-Vertical`}>Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Vert-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="Storybook-Vert-Tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id={`${id}-Vertical`}>
          {children}
        </Tabs.Panel>
        <Tabs.Panel id="Storybook-Vert-Tab-2">
          Tab 2 Content
        </Tabs.Panel>
        <Tabs.Panel id="Storybook-Vert-Tab-3">
          Tab 3 Content
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
};
