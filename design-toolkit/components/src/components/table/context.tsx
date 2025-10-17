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

import { createContext } from 'react';
import type { TableContextValue } from './types';

// Only keep values in context that are needed across multiple component levels
export const TableContext = createContext<TableContextValue>({
  moveColumnLeft: () => undefined,
  moveColumnRight: () => undefined,
  setColumnSelection: () => null,
  columnSelection: null,
  persistRowKebabMenu: true,
  persistHeaderKebabMenu: true,
  persistNumerals: true,
  enableSorting: true,
  enableColumnReordering: true,
  enableRowActions: true,
  manualSorting: false,
  handleSortChange: () => undefined,
  handleColumnReordering: () => undefined
});
