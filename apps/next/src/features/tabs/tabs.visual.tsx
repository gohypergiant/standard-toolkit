/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Icon } from '@accelint/design-toolkit/components/icon';
import { Tabs } from '@accelint/design-toolkit/components/tabs';
import { TabList } from '@accelint/design-toolkit/components/tabs/list';
import { TabPanel } from '@accelint/design-toolkit/components/tabs/panel';
import { Tab } from '@accelint/design-toolkit/components/tabs/tab';
import PlaceholderIcon from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  createVisualTestScenarios,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { TabsProps } from '@accelint/design-toolkit/components/tabs/types';

// =============================================================================
// Static Scenarios
// =============================================================================

createVisualTestScenarios('Tabs', [
  {
    name: 'icon-tabs',
    screenshotName: 'tabs-icon-tabs.png',
    className: 'inline-block w-[400px] p-s',
    render: () => (
      <Tabs>
        <TabList>
          <Tab id='tab1'>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Tab>
          <Tab id='tab2'>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Tab>
          <Tab id='tab3'>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Tab>
        </TabList>
        <TabPanel id='tab1'>Panel 1</TabPanel>
        <TabPanel id='tab2'>Panel 2</TabPanel>
        <TabPanel id='tab3'>Panel 3</TabPanel>
      </Tabs>
    ),
  },
]);

// =============================================================================
// Interactive Tests
// =============================================================================

const renderTabs = (props: TabsProps) => (
  <Tabs {...props}>
    <TabList>
      <Tab id='tab1'>Tab 1</Tab>
      <Tab id='tab2'>Tab 2</Tab>
      <Tab id='tab3'>Tab 3</Tab>
    </TabList>
    <TabPanel id='tab1'>Panel 1</TabPanel>
    <TabPanel id='tab2'>Panel 2</TabPanel>
    <TabPanel id='tab3'>Panel 3</TabPanel>
  </Tabs>
);

const interactiveVariants = generateVariantMatrix<TabsProps>({
  dimensions: {
    orientation: ['horizontal', 'vertical'],
  },
});

createInteractiveVisualTests<TabsProps>({
  componentName: 'Tabs',
  renderComponent: renderTabs,
  testId: 'test-tabs',
  variants: interactiveVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: 'w-[400px] p-s',
});

// Horizontal-only layout variants (align, flex)
createInteractiveVisualTests<TabsProps>({
  componentName: 'TabsLayout',
  renderComponent: renderTabs,
  testId: 'test-tabs',
  variants: [
    {
      id: 'align-center',
      name: 'Align Center',
      props: { orientation: 'horizontal', align: 'center' },
    },
    {
      id: 'align-end',
      name: 'Align End',
      props: { orientation: 'horizontal', align: 'end' },
    },
    {
      id: 'flex',
      name: 'Flex',
      props: { orientation: 'horizontal', flex: true },
    },
    {
      id: 'no-flex',
      name: 'No Flex',
      props: { orientation: 'horizontal', flex: false },
    },
  ],
  states: ['default'],
  className: 'w-[400px] p-s',
});
