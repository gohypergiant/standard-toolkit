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

import type { RowSelectionState } from '@tanstack/react-table';

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

export const DATA: Person[] = [
  {
    id: 'cassius',
    firstName: 'Cassius',
    lastName: 'Wren',
    age: 27,
    visits: 45,
    status: 'Inactive',
    progress: 38,
  },
  {
    id: 'sable',
    firstName: 'Sable',
    lastName: 'Kincaid',
    age: 44,
    visits: 19,
    status: 'Pending',
    progress: 91,
  },
  {
    id: 'artemis',
    firstName: 'Artemis',
    lastName: 'Voss',
    age: 31,
    visits: 84,
    status: 'Active',
    progress: 72,
  },
];

export type ScenarioName =
  | 'default'
  | 'empty'
  | 'all features'
  | 'with selected rows'
  | 'all rows selected'
  | 'sorted ascending'
  | 'sorted descending'
  | 'kebab position left'
  | 'full width'
  | 'minimal'
  | 'hidden peripherals';

export type TableScenario = {
  name: ScenarioName;
  screenshotName: string;
  className?: string;
  showCheckbox?: boolean;
  kebabPosition?: 'left' | 'right';
  persistHeaderKebabMenu?: boolean;
  persistRowKebabMenu?: boolean;
  persistNumerals?: boolean;
  enableSorting?: boolean;
  enableColumnReordering?: boolean;
  enableRowActions?: boolean;
  fullWidth?: boolean;
  rowSelection?: RowSelectionState;
  emptyData?: boolean;
  isSorted?: 'asc' | 'desc';
};

export const PROP_COMBOS: TableScenario[] = [
  {
    name: 'default',
    className: 'inline-block',
    screenshotName: 'table-default.png',
  },
  {
    name: 'empty',
    className: 'inline-block',
    screenshotName: 'table-empty.png',
    emptyData: true,
  },
  {
    name: 'all features',
    className: 'inline-block',
    screenshotName: 'table-all-features.png',
    showCheckbox: true,
    persistNumerals: true,
  },
  {
    name: 'with selected rows',
    className: 'inline-block',
    screenshotName: 'table-selected-rows.png',
    showCheckbox: true,
    persistNumerals: true,
    rowSelection: { artemis: true, sable: true },
  },
  {
    name: 'all rows selected',
    className: 'inline-block',
    screenshotName: 'table-all-rows-selected.png',
    showCheckbox: true,
    rowSelection: { artemis: true, cassius: true, sable: true },
  },
  {
    name: 'sorted ascending',
    className: 'inline-block',
    screenshotName: 'table-sorted-asc.png',
    persistNumerals: true,
    isSorted: 'asc',
  },
  {
    name: 'sorted descending',
    className: 'inline-block',
    screenshotName: 'table-sorted-desc.png',
    persistNumerals: true,
    isSorted: 'desc',
  },
  {
    name: 'kebab position left',
    className: 'inline-block',
    screenshotName: 'table-kebab-left.png',
    showCheckbox: true,
    kebabPosition: 'left',
    persistNumerals: true,
  },
  {
    name: 'full width',
    className: 'w-[1200px]',
    screenshotName: 'table-full-width.png',
    showCheckbox: true,
    persistNumerals: true,
    fullWidth: true,
  },
  {
    name: 'minimal',
    className: 'inline-block',
    screenshotName: 'table-minimal.png',
    enableSorting: false,
    enableColumnReordering: false,
    enableRowActions: false,
  },
  {
    name: 'hidden peripherals',
    className: 'inline-block',
    screenshotName: 'table-hidden-peripherals.png',
    showCheckbox: true,
    persistRowKebabMenu: false,
    persistHeaderKebabMenu: false,
    persistNumerals: false,
  },
];
