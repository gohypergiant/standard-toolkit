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

import { TableHeaderCell } from './header-cell';
import { TableHeaderStyles } from './styles';
import type { TableHeaderProps } from './types';

export function TableHeader<T>({
  ref,
  children,
  className,
  headerGroups,
  columnSelection,
  ...rest
}: TableHeaderProps<T>) {
  return (
    <thead {...rest} ref={ref} className={TableHeaderStyles(className)}>
      {children ||
        headerGroups?.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeaderCell key={header.id} header={header} />
            ))}
          </tr>
        ))}
    </thead>
  );
}
