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

export const TableHeaderStyles = tv({
  base: ['group/theader'],
});

export const TableCellStylesDefaults = {
  narrow: false,
  numeral: false,
  kebab: false,
  persistent: true,
} as const;

export const TableCellStyles = tv({
  base: [
    'fg-primary-bold min-w-l row:bg-surface-raised text-left align-middle font-display text-body-s',
    'selection-end:border-b-1 selection-end:border-b-[var(--outline-accent-primary-bold)]',
    'selected:bg-accent-primary-muted selected:shadow-[1px_1px_0_0_var(--outline-accent-primary-bold),-1px_0_0_0_var(--outline-accent-primary-bold)]',
  ],
  variants: {
    narrow: {
      true: 'py-m text-center',
      false: 'p-m',
    },
    isNumeral: {
      true: 'fg-primary-muted hover:fg-primary-bold px-s group-not-pinned/row:*:invisible',
      false: '',
    },
    notPersistNums: {
      true: 'invisible hover:*:visible group-hover/row:*:visible',
      false: '',
    },
  },
  defaultVariants: TableCellStylesDefaults,
});

export const TableHeaderCellStylesDefaults = {
  narrow: false,
} as const;

export const TableHeaderCellStyles = tv({
  base: [
    'group/header-cell group fg-primary-muted hover:fg-primary-bold flex h-12 items-center justify-between gap-xxs text-left align-middle font-medium text-body-s [&:has([role=checkbox])]:pr-0',
    'selected:bg-accent-primary-muted',
    'selected:shadow-[1px_0_0_0_var(--outline-accent-primary-bold),-1px_-1px_0_0_var(--outline-accent-primary-bold)]',
  ],
  variants: {
    narrow: {
      true: 'px-0 py-m',
      false: 'p-m',
    },
    isKebabEnabled: {
      true: 'pr-0',
      false: '',
    },
    notPersistHeaderKebab: {
      true: 'opacity-0 hover:opacity-100',
      false: '',
    },
  },
  defaultVariants: {
    narrow: TableHeaderCellStylesDefaults.narrow,
  },
});

export const TableRowStyles = tv({
  base: [
    'group/row',
    'border-transparent group-not-selected/tbody:border-1',
    'selected:bg-accent-primary-muted',
    'selected:border-x-[var(--outline-accent-primary-bold)]',
    /** Ensure border is applied to first and last selected rows */
    'has-[+[data-selected]]:not-selected:border-b-[var(--outline-accent-primary-bold)]',
    'not-has-[+[data-selected]]:data-selected:border-b-[var(--outline-accent-primary-bold)]',
    'group-not-selected/tbody:first-of-type:border-t-[var(--outline-static)]',
    'selected:first-of-type:border-t-[var(--outline-accent-primary-bold)]',
  ],
});

export const TableBodyStyles = tv({
  base: ['group/tbody'],
});

export const TableStyles = tv({
  slots: {
    base: 'group/table',
    menuItem: 'cursor-pointer disabled:cursor-auto',
    notPersistRowKebab: 'invisible hover:*:visible group-hover/row:*:visible',
  },
});
