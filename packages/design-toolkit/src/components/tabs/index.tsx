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
 *   <TabsList>
 *     <TabsListTab id="overview">Overview</TabsListTab>
 *     <TabsListTab id="details">Details</TabsListTab>
 *     <TabsListTab id="settings">Settings</TabsListTab>
 *   </TabsList>
 *   <TabsPanel id="overview">Overview content</TabsPanel>
 *   <TabsPanel id="details">Details content</TabsPanel>
 *   <TabsPanel id="settings">Settings content</TabsPanel>
 * </Tabs>
 *
 * @example
 * // Vertical tabs
 * <Tabs orientation="vertical">
 *   <TabsList>
 *     <TabsListTab id="profile">Profile</TabsListTab>
 *     <TabsListTab id="account">Account</TabsListTab>
 *   </TabsList>
 *   <TabsPanel id="profile">Profile settings</TabsPanel>
 *   <TabsPanel id="account">Account settings</TabsPanel>
 * </Tabs>
 *
 * @example
 * // Icon tabs
 * <Tabs>
 *   <TabsList variant="icons">
 *     <TabsListTab id="home">
 *       <Icon><Home /></Icon>
 *     </TabsListTab>
 *     <TabsListTab id="search">
 *       <Icon><Search /></Icon>
 *     </TabsListTab>
 *   </TabsList>
 *   <TabsPanel id="home">Home content</TabsPanel>
 *   <TabsPanel id="search">Search content</TabsPanel>
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
