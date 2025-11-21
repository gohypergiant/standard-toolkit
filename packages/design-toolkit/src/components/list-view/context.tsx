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
'use client';

import 'client-only';
import { createContext, useContext } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { ListViewDataItem, ListViewProps } from './types';

export const ListViewStylesDefaults = {
  size: 'cozy',
} as const;

export const ListViewContext =
  createContext<ContextValue<ListViewProps<ListViewDataItem>, HTMLDivElement>>(
    null,
  );

export const useListViewItemSize = () => {
  const context = useContext(ListViewContext);

  if (typeof context === 'object' && context !== null) {
    if ('size' in context && context.size) {
      return context.size;
    }
  }

  return ListViewStylesDefaults.size;
};
