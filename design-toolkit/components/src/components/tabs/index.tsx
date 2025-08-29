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

'use client';
import { containsExactChildren } from '@/lib/react';
import 'client-only';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
  composeRenderProps,
} from 'react-aria-components';
import { TabListStylesDefaults, TabStyles } from './styles';
import type { TabListProps } from './types';

const { list, tab, tabs, panel } = TabStyles();

/**
 * Tabs - A tab navigation component for organizing content into sections
 *
 * Provides accessible tab navigation with keyboard support and proper ARIA implementation.
 * Supports both horizontal and vertical orientations with icon and text variants.
 * Perfect for organizing related content into separate, focusable sections.
 *
 * @example
 * // Basic horizontal tabs
 * <Tabs>
 *   <Tabs.List>
 *     <Tabs.Tab id="overview">Overview</Tabs.Tab>
 *     <Tabs.Tab id="details">Details</Tabs.Tab>
 *     <Tabs.Tab id="settings">Settings</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="overview">Overview content</Tabs.Panel>
 *   <Tabs.Panel id="details">Details content</Tabs.Panel>
 *   <Tabs.Panel id="settings">Settings content</Tabs.Panel>
 * </Tabs>
 *
 * @example
 * // Vertical tabs
 * <Tabs orientation="vertical">
 *   <Tabs.List>
 *     <Tabs.Tab id="profile">Profile</Tabs.Tab>
 *     <Tabs.Tab id="account">Account</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="profile">Profile settings</Tabs.Panel>
 *   <Tabs.Panel id="account">Account settings</Tabs.Panel>
 * </Tabs>
 *
 * @example
 * // Icon tabs
 * <Tabs>
 *   <Tabs.List variant="icons">
 *     <Tabs.Tab id="home">
 *       <Icon><Home /></Icon>
 *     </Tabs.Tab>
 *     <Tabs.Tab id="search">
 *       <Icon><Search /></Icon>
 *     </Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="home">Home content</Tabs.Panel>
 *   <Tabs.Panel id="search">Search content</Tabs.Panel>
 * </Tabs>
 */
export const Tabs = ({
  children,
  className,
  orientation = 'horizontal',
  isDisabled = false,
  ...rest
}: TabsProps) => {
  containsExactChildren({
    children,
    componentName: Tabs.displayName,
    restrictions: [[TabList, { min: 1, max: 1 }]],
  });

  return (
    <AriaTabs
      {...rest}
      orientation={orientation}
      isDisabled={isDisabled}
      className={composeRenderProps(className, (className) =>
        tabs({ className }),
      )}
    >
      {children}
    </AriaTabs>
  );
};

Tabs.displayName = 'Tabs';

const TabList = ({
  children,
  className,
  variant = TabListStylesDefaults.variant,
  ...rest
}: TabListProps) => {
  containsExactChildren({
    children,
    componentName: TabList.displayName,
    restrictions: [[Tab, { min: 1 }]],
  });

  return (
    <AriaTabList
      {...rest}
      className={composeRenderProps(className, (className) =>
        list({ variant, className }),
      )}
    >
      {children}
    </AriaTabList>
  );
};

TabList.displayName = 'Tabs.List';
Tabs.List = TabList;

const Tab = ({
  id,
  children,
  className,
  isDisabled = false,
  ...rest
}: TabProps) => {
  return (
    <AriaTab
      {...rest}
      id={id}
      className={composeRenderProps(className, (className) =>
        tab({ className }),
      )}
      isDisabled={isDisabled}
    >
      {children}
    </AriaTab>
  );
};

Tab.displayName = 'Tabs.Tab';
Tabs.Tab = Tab;

const TabPanel = ({ id, children, className, ...rest }: TabPanelProps) => {
  return (
    <AriaTabPanel
      {...rest}
      id={id}
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
    >
      {children}
    </AriaTabPanel>
  );
};

TabPanel.displayName = 'Tabs.Panel';
Tabs.Panel = TabPanel;
