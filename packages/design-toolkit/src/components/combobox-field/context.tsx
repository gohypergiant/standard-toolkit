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
import { createContext } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { ProviderProps } from '@/lib/types';
import type { OptionsDataItem } from '../options/types';
import type { ComboBoxFieldProps } from './types';

export const ComboBoxFieldContext =
  // biome-ignore lint/suspicious/noExplicitAny: Setting a type would restrict it beyond what the component allows to extend to
  createContext<ContextValue<ComboBoxFieldProps<any>, HTMLDivElement>>(null);

export function ComboBoxFieldProvider<T extends OptionsDataItem>({
  children,
  ...props
}: ProviderProps<ComboBoxFieldProps<T>>) {
  return (
    <ComboBoxFieldContext.Provider value={props}>
      {children}
    </ComboBoxFieldContext.Provider>
  );
}
