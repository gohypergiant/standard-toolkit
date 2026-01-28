// __private-exports
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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { TableRow } from './row';
import type { TableBodyProps } from './types';

/**
 * TableBody - Renders the table body section (`<tbody>`).
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader headerGroups={table.getHeaderGroups()} />
 *   <TableBody rows={table.getRowModel().rows} />
 * </Table>
 * ```
 *
 * @param props - {@link TableBodyProps}
 * @param props.children - Custom children content.
 * @param props.className - CSS class for the tbody element.
 * @param props.ref - Ref to the tbody element.
 * @param props.rows - Array of TanStack table rows to render.
 * @returns The rendered TableBody component.
 */
export function TableBody<T>({
  children,
  className,
  ref,
  rows,
  ...rest
}: TableBodyProps<T>) {
  return (
    <tbody {...rest} ref={ref} className={clsx('group/tbody', className)}>
      {children || rows?.map((row) => <TableRow key={row.id} row={row} />)}
    </tbody>
  );
}
