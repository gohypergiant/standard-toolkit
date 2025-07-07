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

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import type { ForwardedRef, TdHTMLAttributes } from 'react';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof cellStyles> & {
    ref?: ForwardedRef<HTMLTableCellElement>;
  };

const cellStyles = cva(
  'min-w-l text-left align-middle font-display text-body-s text-default-light hover:group-not-data-selected/row:bg-surface-raised',
  {
    variants: {
      narrow: {
        true: 'px-0 py-m text-center',
        false: 'p-m',
      },
      numeral: {
        true: ' text-default-dark hover:text-default-light',
        false: '',
      },
      // This is used to control the visibility of the cell content
      // when the cell or table row is hovered.
      // If true, the cell is always visible.
      persistent: {
        true: 'visible',
        false: 'hover:*:visible group-hover/row:*:visible',
      },
    },
    defaultVariants: {
      narrow: false,
      numeral: false,
      persistent: true,
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
  },
);

export function TableCell({
  ref,
  className,
  narrow,
  numeral,
  persistent,
  ...props
}: TableCellProps) {
  return (
    <td
      ref={ref}
      className={cn(cellStyles({ narrow, numeral, persistent, className }))}
      {...props}
    />
  );
}
