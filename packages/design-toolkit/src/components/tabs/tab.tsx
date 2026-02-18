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
import { clsx } from '@accelint/design-foundation/lib/utils';
import {
  Tab as AriaTab,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { TabStyleDefaults } from './constants';
import { TabContext } from './context';
import styles from './styles.module.css';
import type { TabProps } from './types';

/**
 * Tab - Selectable tab within a TabList.
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab id="profile">Profile</Tab>
 *   <Tab id="settings">Settings</Tab>
 *   <Tab id="notifications" isDisabled>Notifications</Tab>
 * </TabList>
 * ```
 *
 * @param props - TabProps from react-aria-components.
 * @param props.children - Tab label content.
 * @param props.className - CSS class for the tab.
 * @param props.flex - Boolean to determine if the Tab should grow in size (up to a max width).
 * @param props.align - Justification alignment for content within the Tab
 * @returns The rendered Tab component.
 */
export function Tab({ ref, ...props }: TabProps) {
  [props, ref] = useContextProps(props, ref, TabContext);

  const { children, className, align, flex, ...rest } = {
    ...TabStyleDefaults,
    ...props,
  };

  return (
    <AriaTab
      {...rest}
      className={composeRenderProps(className, (className) =>
        clsx(styles.tab, styles[align], flex && styles.flex, className),
      )}
    >
      {children}
    </AriaTab>
  );
}
