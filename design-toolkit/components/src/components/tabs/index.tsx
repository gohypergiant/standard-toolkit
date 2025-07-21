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
import { cn } from '@/lib/utils';
import 'client-only';
import { cva } from 'cva';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';

export interface TabsProps extends AriaTabsProps {}

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
    restrictions: {
      [TabList.displayName]: { min: 1, max: 1 },
    },
  });

  return (
    <AriaTabs
      orientation={orientation}
      isDisabled={isDisabled}
      className={cn(
        'group flex w-content flex-row orientation-horizontal:flex-col',
        className,
      )}
      {...rest}
    >
      {children}
    </AriaTabs>
  );
};

Tabs.displayName = 'Tabs';

export interface TabListProps extends AriaTabListProps<object> {
  /** Whether the tabs are displaying iconography or text. */
  variant?: 'default' | 'icons';
  /** Whether the tabs are used as drawer controls. */
  drawer?: 'left' | 'right' | 'top' | 'bottom';
}

const tabListStyles = cva('flex orientation-horizontal:flex-row flex-col', {
  variants: {
    variant: {
      icons:
        '[&>*]:p-xs orientation-horizontal:[&>*]:pr-s orientation-horizontal:[&>*]:pl-s [&>*]:leading-[0]',
      default: '[&>*]:p-s [&>*]:text-header-m',
    },
    drawer: {
      left: 'orientation-vertical:gap-xs rounded-r-large bg-surface-default p-s',
      right:
        'orientation-vertical:gap-xs rounded-l-large bg-surface-default p-s',
      top: 'orientation-vertical:gap-xs rounded-b-large bg-surface-default p-s',
      bottom:
        'orientation-vertical:gap-xs rounded-t-large bg-surface-default p-s',
    },
  },
});

const TabList = ({
  children,
  className,
  variant = 'default',
  drawer = undefined,
  ...rest
}: TabListProps) => {
  containsExactChildren({
    children,
    componentName: TabList.displayName,
    restrictions: {
      [Tab.displayName]: { min: 1 },
    },
  });

  return (
    <AriaTabList
      className={cn(tabListStyles({ variant, drawer }), className)}
      {...rest}
    >
      {children}
    </AriaTabList>
  );
};

TabList.displayName = 'Tabs.List';
Tabs.List = TabList;

const tabBaseStyles = cn(
  'fg-default-dark cursor-pointer p-s outline-none',
  'rounded-medium group-orientation-horizontal:rounded-small group-orientation-horizontal:rounded-b-none',
  'group-orientation-horizontal:border-static-light group-orientation-horizontal:border-b',
  'group-orientation-vertical:border group-orientation-vertical:border-transparent',
);

const tabStyles = cva(tabBaseStyles, {
  variants: {
    isSelected: {
      true: 'fg-highlight bg-highlight-subtle group-orientation-horizontal:border-highlight',
    },
    isHovered: {
      true: 'fg-default-light group-orientation-horizontal:border-interactive-hover',
    },
    isFocused: {
      true: 'fg-default-light group-orientation-horizontal:border-interactive-hover',
    },
    isDisabled: {
      true: 'fg-disabled cursor-not-allowed group-orientation-horizontal:border-interactive-disabled',
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isHovered: true,
      className: 'fg-highlight group-orientation-horizontal:border-highlight',
    },
    {
      isSelected: true,
      isFocused: true,
      className:
        'fg-highlight group-orientation-horizontal:border-interactive-hover group-orientation-vertical:border-interactive-hover',
    },
    {
      isDisabled: true,
      isSelected: true,
      className:
        'fg-disabled bg-interactive-disabled group-orientation-horizontal:border-interactive-disabled',
    },
  ],
});

export interface TabProps extends AriaTabProps {}

const Tab = ({
  id,
  children,
  className,
  isDisabled = false,
  ...rest
}: TabProps) => {
  return (
    <AriaTab
      id={id}
      className={({ isSelected, isHovered, isFocused, isDisabled }) =>
        cn(
          tabStyles({ isSelected, isHovered, isFocused, isDisabled }),
          className,
        )
      }
      isDisabled={isDisabled}
      {...rest}
    >
      {children}
    </AriaTab>
  );
};

Tab.displayName = 'Tabs.Tab';
Tabs.Tab = Tab;

export interface TabPanelProps extends AriaTabPanelProps {}

const TabPanel = ({ id, children, className, ...rest }: TabPanelProps) => {
  return (
    <AriaTabPanel
      id={id}
      className={cn(
        'fg-default-light p-s group-orientation-vertical:pt-0 group-orientation-horizontal:pl-0',
        className,
      )}
      {...rest}
    >
      {children}
    </AriaTabPanel>
  );
};

TabPanel.displayName = 'Tabs.Panel';
Tabs.Panel = TabPanel;
