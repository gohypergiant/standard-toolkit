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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for these stories */

import {
  COMMON_CONTROL,
  createStatesStory,
  EXCLUSIONS,
  hideControls,
  MOCK_DATA,
} from '^storybook/utils';
import { Add, Check, Group } from '@accelint/icons';
import { Icon } from '@/components/icon';
import { Tabs } from '@/components/tabs/index';
import { AXIS } from '@/constants/axis';
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
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    orientation: AXIS.HORIZONTAL,
    isDisabled: false,
  },
  argTypes: {
    orientation: COMMON_CONTROL.orientation,
    isDisabled: COMMON_CONTROL.isDisabled,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON],
    },
    docs: {
      subtitle: 'Organize content into multiple panels.',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ ...args }) => (
    <div className='w-full max-w-lg'>
      <Tabs {...args}>
        <Tabs.List>
          <Tabs.List.Tab id='overview'>Overview</Tabs.List.Tab>
          <Tabs.List.Tab id='details'>Details</Tabs.List.Tab>
          <Tabs.List.Tab id='settings'>Settings</Tabs.List.Tab>
        </Tabs.List>
        <Tabs.Panel id='overview'>
          <div className='p-m'>
            <h3 className='fg-primary-bold mb-s text-header-s'>
              Project Overview
            </h3>
            <p className='fg-secondary text-body-m'>
              {MOCK_DATA.TEXT_CONTENT.MEDIUM}
            </p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel id='details'>
          <div className='p-m'>
            <h3 className='fg-primary-bold mb-s text-header-s'>
              Project Details
            </h3>
            <p className='fg-secondary text-body-m'>
              {MOCK_DATA.TEXT_CONTENT.SHORT}
            </p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel id='settings'>
          <div className='p-m'>
            <h3 className='fg-primary-bold mb-s text-header-s'>Settings</h3>
            <p className='fg-secondary text-body-m'>
              Configure your project preferences here.
            </p>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
};

export const States: Story = createStatesStory({
  Component: ({ ...props }) => (
    <Tabs {...props}>
      <Tabs.List>
        <Tabs.List.Tab id='tab1'>Tab 1</Tabs.List.Tab>
        <Tabs.List.Tab id='tab2'>Tab 2</Tabs.List.Tab>
        <Tabs.List.Tab id='tab3'>Tab 3</Tabs.List.Tab>
      </Tabs.List>
      <Tabs.Panel id='tab1'>Content for tab 1</Tabs.Panel>
      <Tabs.Panel id='tab2'>Content for tab 2</Tabs.Panel>
      <Tabs.Panel id='tab3'>Content for tab 3</Tabs.Panel>
    </Tabs>
  ),
  ...hideControls(meta),
});

export const WithIcons: Story = {
  render: ({ ...args }) => (
    <div className='w-full max-w-lg'>
      <Tabs {...args}>
        <Tabs.List>
          <Tabs.List.Tab id='add'>
            <Icon>
              <Add />
            </Icon>
            Create
          </Tabs.List.Tab>
          <Tabs.List.Tab id='check'>
            <Icon>
              <Check />
            </Icon>
            Review
          </Tabs.List.Tab>
          <Tabs.List.Tab id='group'>
            <Icon>
              <Group />
            </Icon>
            Team
          </Tabs.List.Tab>
        </Tabs.List>
        <Tabs.Panel id='add'>
          <div className='p-m'>Create new items and projects</div>
        </Tabs.Panel>
        <Tabs.Panel id='check'>
          <div className='p-m'>Review and approve changes</div>
        </Tabs.Panel>
        <Tabs.Panel id='group'>
          <div className='p-m'>Manage team members and permissions</div>
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
  ...hideControls(meta),
};

export const Orientations: Story = {
  // NOTE: `_args` is purely so that Storybook will use the "controls" from `meta`
  render: (_args) => (
    <div className='space-y-xl'>
      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Horizontal</h4>
        <Tabs orientation='horizontal'>
          <Tabs.List>
            <Tabs.List.Tab id='h1'>First</Tabs.List.Tab>
            <Tabs.List.Tab id='h2'>Second</Tabs.List.Tab>
            <Tabs.List.Tab id='h3'>Third</Tabs.List.Tab>
          </Tabs.List>
          <Tabs.Panel id='h1'>Horizontal panel 1</Tabs.Panel>
          <Tabs.Panel id='h2'>Horizontal panel 2</Tabs.Panel>
          <Tabs.Panel id='h3'>Horizontal panel 3</Tabs.Panel>
        </Tabs>
      </div>

      <div className='space-y-s'>
        <h4 className='fg-primary-bold text-header-s'>Vertical</h4>
        <Tabs orientation='vertical'>
          <Tabs.List>
            <Tabs.List.Tab id='v1'>First</Tabs.List.Tab>
            <Tabs.List.Tab id='v2'>Second</Tabs.List.Tab>
            <Tabs.List.Tab id='v3'>Third</Tabs.List.Tab>
          </Tabs.List>
          <Tabs.Panel id='v1'>Vertical panel 1</Tabs.Panel>
          <Tabs.Panel id='v2'>Vertical panel 2</Tabs.Panel>
          <Tabs.Panel id='v3'>Vertical panel 3</Tabs.Panel>
        </Tabs>
      </div>
    </div>
  ),
  ...hideControls(meta),
};
