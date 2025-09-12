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

import type { HeaderGroup } from '@tanstack/react-table';
import { tableHeaderStyles } from './styles';
import { HeaderCell } from './table-header-cell';
import type { TableHeaderProps } from './types';

export function TableHeader({
  className,
  ref,
  getHeaderGroups,
  moveColumnLeft,
  moveColumnRight,
  persistHeaderKebabMenu,
  setColumnSelection,
  enableColumnReordering,
  enableSorting,
  columnSelection,
  ...props
}: TableHeaderProps) {
  return (
    <thead {...props} ref={ref} className={tableHeaderStyles(className)}>
      {getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
        <tr>
          {headerGroup.headers.map((header) => {
            return (
              <HeaderCell
                key={header.id}
                narrow={
                  header.column.id === 'numeral' || header.column.id === 'kebab'
                }
                data-selected={
                  header.column.id === columnSelection ? '' : undefined
                }
                header={header}
                enableColumnReordering={enableColumnReordering}
                enableSorting={enableSorting}
                moveColumnLeft={moveColumnLeft}
                moveColumnRight={moveColumnRight}
                persistHeaderKebabMenu={persistHeaderKebabMenu}
                setColumnSelection={setColumnSelection}
              ></HeaderCell>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
