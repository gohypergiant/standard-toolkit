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

import { tv } from '@/lib/utils';

export const TableCellStylesDefaults = {
  narrow: false,
  numeral: false,
  persistent: true,
} as const;

export const cellStyles = tv({
  base: [
    'min-w-l text-left align-middle font-display text-body-s text-default-light hover:group-not-data-selected/row:bg-surface-raised',
  ],
  variants: {
    narrow: {
      true: 'px-0 py-m text-center',
      false: 'p-m',
    },
    numeral: {
      true: ' text-default-dark hover:text-default-light',
      false: '',
    },
    persistent: {
      true: 'visible',
      false: 'hover:*:visible group-hover/row:*:visible',
    },
  },
  defaultVariants: {
    narrow: TableCellStylesDefaults.narrow,
    numeral: TableCellStylesDefaults.numeral,
    persistent: TableCellStylesDefaults.persistent,
  },
  compoundVariants: [
    {
      persistent: false,
      numeral: true,
      className: 'text-default-dark group-not-data-pinned/row:*:invisible',
    },
    {
      persistent: false,
      numeral: false,
      className: '*:invisible',
    },
  ],
});

export const TableHeaderCellStylesDefaults = {
  narrow: false,
} as const;

export const headerCellStyles = tv({
  base: [
    'group/header-cell h-12 p-m text-left align-middle font-medium text-body-s text-default-dark hover:text-default-light [&:has([role=checkbox])]:pr-0 ',
  ],
  variants: {
    narrow: {
      true: 'px-0 py-m ',
      false: 'p-m',
    },
  },
  defaultVariants: {
    narrow: TableHeaderCellStylesDefaults.narrow,
  },
});

export const actionsCellStyles = tv({
  slots: {
    button: 'block cursor-pointer align-middle',
    popover: 'border border-default-light bg-surface-raised',
    menuItem: 'text-default-light hover:bg-highlight-bold',
  },
  variants: {
    persistent: {
      true: {
        button: '*:visible',
      },
      false: {
        button: '*:invisible hover:*:visible group-hover/header-cell:*:visible',
      },
    },
  },
});

export const rowStyles = tv({
  base: [
    'group/row',
    'border-transparent group-not-data-selected/tbody:border-1 data-selected:border-x-highlight-bold',
    'data-active:bg-highlight-subtle data-selected:bg-highlight-subtle',
    /** Ensure border is applied to first and last selected rows */
    'has-[+[data-selected="true"]]:not-data-selected:border-b-highlight-bold has-[+[data-selected="false"]]:data-selected:border-b-highlight-bold ',
    'group-not-data-selected/tbody:first-of-type:border-t-static-light data-selected:last-of-type:border-b-highlight-bold data-selected:first-of-type:border-t-highlight-bold',
  ],
});

export const tableBodyStyles = tv({
  base: ['group/tbody'],
});
