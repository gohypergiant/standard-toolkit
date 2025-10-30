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
import type { ButtonProps, LinkButtonProps, ToggleButtonProps } from './types';

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

export function ButtonProvider({
  children,
  ...props
}: ProviderProps<ButtonProps>) {
  return (
    <ButtonContext.Provider value={props}>{children}</ButtonContext.Provider>
  );
}

export const LinkButtonContext =
  createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

export function LinkButtonProvider({
  children,
  ...props
}: ProviderProps<LinkButtonProps>) {
  return (
    <LinkButtonContext.Provider value={props}>
      {children}
    </LinkButtonContext.Provider>
  );
}

export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

export function ToggleButtonProvider({
  children,
  ...props
}: ProviderProps<ToggleButtonProps>) {
  return (
    <ToggleButtonContext.Provider value={props}>
      {children}
    </ToggleButtonContext.Provider>
  );
}
