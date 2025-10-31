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

import { TableCell } from './cell';
import { TableRowStyles } from './styles';
import type { TableRowProps } from './types';

export function TableRow<T>({
  ref,
  children,
  className,
  row,
  ...rest
}: TableRowProps<T>) {
  const cells = row?.getAllCells();

  return (
    <tr
      {...rest}
      ref={ref}
      className={TableRowStyles({ className })}
      data-pinned={row?.getIsPinned() || null}
      data-selected={row?.getIsSelected() || null}
    >
      {children ||
        cells?.map((cell) => <TableCell key={cell.id} cell={cell} />)}
    </tr>
  );
}
