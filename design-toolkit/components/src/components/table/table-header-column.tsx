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
import type { ForwardedRef, ThHTMLAttributes } from 'react';

const headerCellStyles = cva(
  'h-12 p-m text-left align-middle font-medium text-body-s text-default-dark hover:text-default-light [&:has([role=checkbox])]:pr-0 ',

  {
    variants: {
      narrow: {
        true: 'px-0 py-m ',
        false: 'p-m',
      },
    },
    defaultVariants: {
      narrow: false,
    },
  },
);

export type TableHeaderColumnProps = ThHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof headerCellStyles> & {
    ref?: ForwardedRef<HTMLTableCellElement>;
  };

export function HeaderColumn({
  ref,
  className,
  narrow,
  ...props
}: TableHeaderColumnProps) {
  return (
    <th
      ref={ref}
      className={cn(headerCellStyles({ narrow, className }))}
      {...props}
    />
  );
}
