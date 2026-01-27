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
import type { IconProps } from './types';

/**
 * Context for sharing Icon props across component tree.
 */
export const IconContext =
  createContext<ContextValue<IconProps, HTMLSpanElement>>(null);

/**
 * IconProvider - Context provider for setting default Icon props.
 *
 * Use this to configure shared size across multiple Icon components.
 *
 * @param props - ProviderProps<IconProps>
 * @param props.children - Child components to receive context.
 * @returns The rendered IconProvider component.
 *
 * @example
 * ```tsx
 * <IconProvider size="small">
 *   <Icon><Home /></Icon>
 *   <Icon><Search /></Icon>
 * </IconProvider>
 * ```
 */
export function IconProvider({ children, ...props }: ProviderProps<IconProps>) {
  return <IconContext.Provider value={props}>{children}</IconContext.Provider>;
}
