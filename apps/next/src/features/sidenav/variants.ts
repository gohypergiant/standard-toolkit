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

export type SidenavScenario = {
  name: string;
  screenshotName: string;
  isOpen?: boolean;
  isHiddenWhenClosed?: boolean;
  hasDisabledItems?: boolean;
};

export const PROP_COMBOS: SidenavScenario[] = [
  { name: 'Collapsed', screenshotName: 'sidenav-collapsed.png' },
  {
    name: 'Expanded',
    screenshotName: 'sidenav-expanded.png',
    isOpen: true,
  },
  {
    name: 'Collapsed, hidden when closed',
    screenshotName: 'sidenav-hidden-when-closed.png',
    isHiddenWhenClosed: true,
  },
  {
    name: 'With disabled items',
    screenshotName: 'sidenav-disabled-items.png',
    isOpen: true,
    hasDisabledItems: true,
  },
];
