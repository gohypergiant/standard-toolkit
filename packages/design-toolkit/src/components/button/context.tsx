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

/**
 * React context for sharing Button configuration across components.
 */
export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

/**
 * Context provider for setting default props across multiple Button components.
 *
 * @param props - The provider props.
 * @param props.children - Child components that will receive the button context.
 * @returns The button context provider wrapping children.
 *
 * @example
 * <ButtonProvider size="small" variant="outline">
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </ButtonProvider>
 */
export function ButtonProvider({
  children,
  ...props
}: ProviderProps<ButtonProps>) {
  return (
    <ButtonContext.Provider value={props}>{children}</ButtonContext.Provider>
  );
}

/**
 * React context for sharing LinkButton configuration across components.
 */
export const LinkButtonContext =
  createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

/**
 * Context provider for setting default props across multiple LinkButton components.
 *
 * @param props - The provider props.
 * @param props.children - Child components that will receive the link button context.
 * @returns The link button context provider wrapping children.
 *
 * @example
 * <LinkButtonProvider size="small" variant="outline">
 *   <LinkButton href="/page1">Link 1</LinkButton>
 *   <LinkButton href="/page2">Link 2</LinkButton>
 * </LinkButtonProvider>
 */
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

/**
 * React context for sharing ToggleButton configuration across components.
 */
export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

/**
 * Context provider for setting default props across multiple ToggleButton components.
 *
 * @param props - The provider props.
 * @param props.children - Child components that will receive the toggle button context.
 * @returns The toggle button context provider wrapping children.
 *
 * @example
 * <ToggleButtonProvider size="small" variant="flat">
 *   <ToggleButton>Toggle 1</ToggleButton>
 *   <ToggleButton>Toggle 2</ToggleButton>
 * </ToggleButtonProvider>
 */
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
