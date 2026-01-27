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
  TabPanel as AriaTabPanel,
  composeRenderProps,
  type TabPanelProps,
} from 'react-aria-components';
import styles from './styles.module.css';

/**
 * TabPanel - Content panel displayed when its corresponding Tab is selected.
 *
 * @example
 * ```tsx
 * <Tabs>
 *   <TabList>
 *     <Tab id="profile">Profile</Tab>
 *   </TabList>
 *   <TabPanel id="profile">
 *     <h2>Profile Information</h2>
 *     <p>User profile content</p>
 *   </TabPanel>
 * </Tabs>
 * ```
 *
 * @param props - TabPanelProps from react-aria-components.
 * @param props.children - Panel content.
 * @param props.className - CSS class for the panel.
 * @returns The rendered TabPanel component.
 */
export function TabPanel({ children, className, ...rest }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...rest}
      className={composeRenderProps(className, (className) =>
        clsx(styles.panel, className),
      )}
    >
      {children}
    </AriaTabPanel>
  );
}
