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

import 'client-only';
import {
  Tabs as AriaTabs,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { TabsContext } from './context';
import { TabStyles } from './styles';
import type { TabsProps } from './types';

const { tabs } = TabStyles();

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
 *     <Tabs.List.Tab id="overview">Overview</Tabs.List.Tab>
 *     <Tabs.List.Tab id="details">Details</Tabs.List.Tab>
 *     <Tabs.List.Tab id="settings">Settings</Tabs.List.Tab>
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
 *     <Tabs.List.Tab id="profile">Profile</Tabs.List.Tab>
 *     <Tabs.List.Tab id="account">Account</Tabs.List.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="profile">Profile settings</Tabs.Panel>
 *   <Tabs.Panel id="account">Account settings</Tabs.Panel>
 * </Tabs>
 *
 * @example
 * // Icon tabs
 * <Tabs>
 *   <Tabs.List variant="icons">
 *     <Tabs.List.Tab id="home">
 *       <Icon><Home /></Icon>
 *     </Tabs.List.Tab>
 *     <Tabs.List.Tab id="search">
 *       <Icon><Search /></Icon>
 *     </Tabs.List.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="home">Home content</Tabs.Panel>
 *   <Tabs.Panel id="search">Search content</Tabs.Panel>
 * </Tabs>
 */
export function Tabs({ ref, ...props }: TabsProps) {
  [props, ref] = useContextProps(props, ref ?? null, TabsContext);

  const { children, className, ...rest } = props;

  return (
    <AriaTabs
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        tabs({ className }),
      )}
    >
      {children}
    </AriaTabs>
  );
}
