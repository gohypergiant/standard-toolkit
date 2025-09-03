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

export const tableHeaderStyles = tv({
  base: ['group/theader'],
});

export const TableCellStylesDefaults = {
  narrow: false,
  numeral: false,
  kebab: false,
  persistent: true,
} as const;

export const cellStyles = tv({
  base: [
    'fg-primary-bold min-w-l row:bg-surface-raised text-left align-middle font-display text-body-s',
  ],
  variants: {
    narrow: {
      true: 'px-0 py-m text-center',
      false: 'p-m',
    },
    numeral: {
      true: 'fg-primary-muted hover:fg-primary-bold',
      false: '',
    },
    kebab: {
      true: '',
      false: '',
    },
    persistent: {
      true: 'visible',
      false: 'hover:*:visible group-hover/row:*:visible',
    },
    selectedCol: {
      true: [
        'bg-accent-primary-muted',
        'border-x-1',
        'border-r-highlight-bold',
        'border-l-highlight-bold',
      ],
      false: '',
    },
    isLastSelectedRow: {
      true: ['border-b-1', 'border-b-highlight-bold'],
      false: '',
    },
  },
  defaultVariants: TableCellStylesDefaults,
  compoundVariants: [
    {
      persistent: false,
      numeral: true,
      className: 'fg-primary-muted group-not-pinned/row:*:invisible',
    },
    {
      persistent: false,
      numeral: false,
      kebab: false,
      className: '*:invisible',
    },
    {
      persistent: false,
      kebab: true,
      className: 'group-not-pinned/row:*:invisible',
    },
  ],
});

export const TableHeaderCellStylesDefaults = {
  narrow: false,
} as const;

export const headerCellStyles = tv({
  base: [
    'group/header-cell fg-primary-muted hover:fg-primary-bold h-12 p-m text-left align-middle font-medium·text-body-s [&:has([role=checkbox])]:pr-0',
    'active:bg-accent-primary-muted',
    'selected:bg-accent-primary-muted',
    'selected:border-t-1',
    'selected:border-x-1',
    'selected:border-r-highlight-bold',
    'selected:border-l-highlight-bold',
    'selected:border-t-highlight-bold',
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

export const rowStyles = tv({
  base: [
    'group/row',
    'border-transparent group-not-selected/tbody:border-1',
    '[&:not([data-top])]:active:bg-accent-primary-muted',
    'selected:bg-accent-primary-muted',
    'selected:border-x-highlight-bold',
    /** Ensure border is applied to first and last selected rows */
    'has-[+[data-selected]]:not-selected:border-b-highlight-bold',
    'has-[+[not-selected="true"]]:selected:border-b-highlight-bold',
    'group-not-selected/tbody:first-of-type:border-t-static-light',
    'selected:first-of-type:border-t-highlight-bold',
    'selected:last-of-type:border-b-highlight-bold',
  ],
});

export const tableBodyStyles = tv({
  base: ['group/tbody'],
});

export const TableStyles = tv({
  slots: {
    base: 'group/table',
    headerCellButton: 'group flex items-center justify-between gap-xxs',
    pinIcon: 'mx-auto block',
    rowCell: '',
    rowKebab: '',
    headerKebab: '',
    menuItem: 'cursor-pointer disabled:cursor-auto',
  },
  variants: {
    persistNums: {
      true: {
        rowCell: 'mx-auto block text-center',
      },
      false: {
        rowCell:
          'invisible group-hover/table:mx-auto group-hover/table:block group-hover/table:text-center',
      },
    },
    persistKebab: {
      true: {
        rowKebab: '',
        headerKebab: '',
      },
      false: {
        rowKebab: 'opacity-0 hover:opacity-100',
        headerKebab: 'opacity-0 group-hover:opacity-100',
      },
    },
  },
});
