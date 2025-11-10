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
import type { TextAreaFieldProps } from './types';

/**
 * Context for TextAreaField component
 *
 * Provides context for TextAreaField component to share props
 */
export const TextAreaFieldContext =
  createContext<ContextValue<TextAreaFieldProps, HTMLDivElement>>(null);

/**
 * Provider for TextAreaField component
 *
 * Allows setting default props for all TextAreaField components within
 */
export function TextAreaFieldProvider({
  children,
  ...props
}: ProviderProps<TextAreaFieldProps>) {
  return (
    <TextAreaFieldContext.Provider value={props}>
      {children}
    </TextAreaFieldContext.Provider>
  );
}
