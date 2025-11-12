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
  TabPanel as AriaTabPanel,
  composeRenderProps,
  type TabPanelProps,
} from 'react-aria-components';
import { TabStyles } from './styles';

const { panel } = TabStyles();

/**
 * TabPanel - Content panel for tabs
 *
 * Container for content associated with a specific tab
 */
export function TabPanel({ children, className, ...rest }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...rest}
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
    >
      {children}
    </AriaTabPanel>
  );
}
