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

import type { MenuProps } from '@accelint/design-toolkit/components/menu/types';

export type ScenarioName =
  | 'Cozy - Basic items'
  | 'Compact - Basic items'
  | 'Color variants'
  | 'Disabled items'
  | 'Sections and separators'
  | 'Simple menu'
  | 'Single selection'
  | 'Multiple selection';

export type MenuScenario = {
  name: ScenarioName;
  variant: NonNullable<MenuProps<object>['variant']>;
  selectionMode?: MenuProps<object>['selectionMode'];
  selectedKeys?: Set<string>;
  screenshotName: string;
};

export const PROP_COMBOS: MenuScenario[] = [
  {
    name: 'Cozy - Basic items',
    variant: 'cozy',
    screenshotName: 'menu-cozy-basic.png',
  },
  {
    name: 'Compact - Basic items',
    variant: 'compact',
    screenshotName: 'menu-compact-basic.png',
  },
  {
    name: 'Color variants',
    variant: 'cozy',
    screenshotName: 'menu-cozy-colors.png',
  },
  {
    name: 'Disabled items',
    variant: 'cozy',
    screenshotName: 'menu-cozy-disabled.png',
  },
  {
    name: 'Sections and separators',
    variant: 'cozy',
    screenshotName: 'menu-cozy-sections.png',
  },
  {
    name: 'Simple menu',
    variant: 'cozy',
    screenshotName: 'menu-cozy-simple.png',
  },
  {
    name: 'Single selection',
    variant: 'cozy',
    selectionMode: 'single',
    selectedKeys: new Set(['medium']),
    screenshotName: 'menu-cozy-single-selection.png',
  },
  {
    name: 'Multiple selection',
    variant: 'cozy',
    selectionMode: 'multiple',
    selectedKeys: new Set(['bold', 'underline']),
    screenshotName: 'menu-cozy-multiple-selection.png',
  },
];
