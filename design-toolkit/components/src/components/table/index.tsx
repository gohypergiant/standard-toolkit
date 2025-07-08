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

import { ActionsCell } from './actions-cell';
import { TableBody } from './table-body';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import { HeaderCell } from './table-header-cell';
import { TableRow } from './table-row';
import type { TableProps } from './types';

export function Table({ className, ref, ...props }: TableProps) {
  return <table ref={ref} className={className} {...props} />;
}

Table.displayName = 'Table';
Table.Body = TableBody;
Table.Cell = TableCell;
Table.Header = TableHeader;
Table.HeaderCell = HeaderCell;
Table.Row = TableRow;
Table.ActionsCell = ActionsCell;
