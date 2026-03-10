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

import type { Key } from 'react-aria-components';

export type OptionsVariant = {
  name: string;
  size?: 'small' | 'large';
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: Key[];
  useSections?: boolean;
  useColors?: boolean;
  disabledKeys?: Key[];
};

export const PROP_COMBOS: OptionsVariant[] = [
  { name: 'large-no-selection', size: 'large', selectionMode: 'none' },
  { name: 'small-no-selection', size: 'small', selectionMode: 'none' },
  {
    name: 'single-selection',
    size: 'large',
    selectionMode: 'single',
    selectedKeys: ['opt-2'],
  },
  {
    name: 'multiple-selection',
    size: 'large',
    selectionMode: 'multiple',
    selectedKeys: ['opt-1', 'opt-3'],
  },
  {
    name: 'with-sections',
    size: 'large',
    selectionMode: 'none',
    useSections: true,
  },
  {
    name: 'color-variants',
    size: 'large',
    selectionMode: 'none',
    useColors: true,
  },
  {
    name: 'color-selected',
    size: 'large',
    selectionMode: 'single',
    selectedKeys: ['opt-1'],
    useColors: true,
  },
  {
    name: 'color-multi-selected',
    size: 'large',
    selectionMode: 'multiple',
    selectedKeys: ['opt-1', 'opt-3'],
    useColors: true,
  },
  {
    name: 'disabled-items',
    size: 'large',
    selectionMode: 'single',
    disabledKeys: ['opt-2', 'opt-4'],
  },
];
