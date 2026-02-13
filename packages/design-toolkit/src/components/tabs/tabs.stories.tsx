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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { Add, Check, Group } from '@accelint/icons';
import { useState } from 'react';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { TabStyleDefaults } from './constants';
import { TabsProvider } from './context';
import { Tabs } from './index';
import { TabList } from './list';
import { TabPanel } from './panel';
import { Tab } from './tab';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
 * - `Tabs` must include a `TabList`
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    ...TabStyleDefaults,
    orientation: 'horizontal',
    isDisabled: false,
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  parameters: {
    docs: {
      subtitle: 'Tab navigation for organizing content into sections',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: ({ orientation, ...rest }) => {
    const [dimension, setDimension] = useState('300px');
    const isHorizontal = orientation === 'horizontal';
    const isVertical = orientation === 'vertical';
    const style = {
      width: isHorizontal ? dimension : 'auto',
      height: isVertical ? dimension : 'auto',
    };

    return (
      <TabsProvider {...rest} orientation={orientation}>
        <div className='mb-oversized flex justify-center gap-m'>
          <Button onPress={() => setDimension('300px')}>Small</Button>
          <Button onPress={() => setDimension('600px')}>Medium</Button>
          <Button onPress={() => setDimension('1200px')}>Large</Button>
        </div>
        <div
          className={clsx('flex w-full flex-wrap gap-m', {
            'flex-row': isVertical,
            'flex-col': isHorizontal,
          })}
        >
          <div style={style}>
            <Tabs>
              <TabList>
                <Tab id='Storybook-Tab-1'>Tab 1</Tab>
                <Tab id='Storybook-Tab-2'>Tab 2</Tab>
                <Tab id='Storybook-Tab-3'>Tab 3</Tab>
              </TabList>
              <TabPanel id='Storybook-Tab-1'>Panel 1</TabPanel>
              <TabPanel id='Storybook-Tab-2'>Panel 2</TabPanel>
              <TabPanel id='Storybook-Tab-3'>Panel 3</TabPanel>
            </Tabs>
          </div>
          <div style={style}>
            <Tabs>
              <TabList>
                <Tab id='Storybook-Tab-1'>
                  <Icon>
                    <Add />
                  </Icon>
                </Tab>
                <Tab id='Storybook-Tab-2'>
                  <Icon>
                    <Check />
                  </Icon>
                </Tab>
                <Tab id='Storybook-Tab-3'>
                  <Icon>
                    <Group />
                  </Icon>
                </Tab>
              </TabList>
              <TabPanel id='Storybook-Tab-1'>Panel 1</TabPanel>
              <TabPanel id='Storybook-Tab-2'>Panel 2</TabPanel>
              <TabPanel id='Storybook-Tab-3'>Panel 3</TabPanel>
            </Tabs>
          </div>
        </div>
      </TabsProvider>
    );
  },
};
