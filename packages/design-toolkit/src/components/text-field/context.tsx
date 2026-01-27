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

import type { ProviderProps } from '@/lib/types';
import 'client-only';
import { createContext } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { TextFieldProps } from './types';

/** Context for sharing props across TextField components */
export const TextFieldContext =
  createContext<ContextValue<TextFieldProps, HTMLDivElement>>(null);

/**
 * Sets default props for all TextField components within.
 *
 * @example
 * ```tsx
 * <TextFieldProvider isRequired>
 *   <TextField label="First Name">
 *     <Input placeholder="Enter first name" />
 *   </TextField>
 *   <TextField label="Last Name">
 *     <Input placeholder="Enter last name" />
 *   </TextField>
 * </TextFieldProvider>
 * ```
 *
 * @param props - ProviderProps with TextFieldProps.
 * @param props.children - Child components that receive the context.
 * @returns The TextFieldContext provider wrapping children.
 */
export function TextFieldProvider({
  children,
  ...props
}: ProviderProps<TextFieldProps>) {
  return (
    <TextFieldContext.Provider value={props}>
      {children}
    </TextFieldContext.Provider>
  );
}
