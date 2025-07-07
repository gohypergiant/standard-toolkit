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
import type { ForwardedRef, HTMLAttributes } from 'react';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  ref?: ForwardedRef<HTMLTableRowElement>;
};

export function TableRow({ ref, className, ...props }: TableRowProps) {
  return (
    <tr
      ref={ref}
      className={cn(
        'group/row',
        'border-1 border-transparent data-selected:border-x-highlight-bold',
        'data-active:bg-highlight-subtle data-selected:bg-highlight-subtle',
        /** Ensure border is applied to first and last selected rows */
        'has-[+[data-selected="true"]]:not-data-selected:border-b-highlight-bold has-[+[data-selected="false"]]:data-selected:border-b-highlight-bold ',
        'not-data-selected:first-of-type:border-t-static-light data-selected:last-of-type:border-b-highlight-bold data-selected:first-of-type:border-t-highlight-bold',
        className,
      )}
      {...props}
    />
  );
}
