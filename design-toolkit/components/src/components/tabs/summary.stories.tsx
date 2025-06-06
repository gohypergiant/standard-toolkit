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

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div className='flex w-full flex-row flex-wrap gap-m'>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className="fg-default-light">Horizontal Orientation</h5>
        <Tabs orientation="horizontal">
          <Tabs.List label="Storybook Tab List">
            <Tabs.Tab id="Storybook-Tab-1">Tab 1</Tabs.Tab>
            <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
            <Tabs.Tab id="Storybook-Tab-3">Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="Storybook-Tab-1">
            Tab 1 Content
          </Tabs.Panel>
          <Tabs.Panel id="Storybook-Tab-2">
            Tab 2 Content
          </Tabs.Panel>
          <Tabs.Panel id="Storybook-Tab-3">
            Tab 3 Content
          </Tabs.Panel>
        </Tabs>
      </div>
      <div className='flex w-[300px] flex-col gap-m'>
        <h5 className="fg-default-light">Vertical Orientation</h5>
        <Tabs orientation="vertical">
          <Tabs.List label="Storybook Tab List">
            <Tabs.Tab id="Storybook-Vert-Tab-1">Tab 1</Tabs.Tab>
            <Tabs.Tab id="Storybook-Vert-Tab-2">Tab 2</Tabs.Tab>
            <Tabs.Tab id="Storybook-Vert-Tab-3">Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="Storybook-Vert-Tab-1">
            Tab 1 Content
          </Tabs.Panel>
          <Tabs.Panel id="Storybook-Vert-Tab-2">
            Tab 2 Content
          </Tabs.Panel>
          <Tabs.Panel id="Storybook-Vert-Tab-3">
            Tab 3 Content
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  ),
};
