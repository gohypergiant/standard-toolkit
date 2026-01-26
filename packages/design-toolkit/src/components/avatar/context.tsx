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
import type { AvatarProps } from './types';

/**
 * React context for sharing avatar configuration across components.
 */
export const AvatarContext =
  createContext<ContextValue<AvatarProps, HTMLSpanElement>>(null);

/**
 * Context provider for setting default props across multiple Avatar components.
 *
 * @param props - The provider props.
 * @param props.children - Child components that will receive the avatar context.
 * @returns The avatar context provider wrapping children.
 *
 * @example
 * <AvatarProvider size="small">
 *   <Avatar imageProps={{ alt: "User 1", src: "avatar1.jpg" }} />
 *   <Avatar imageProps={{ alt: "User 2", src: "avatar2.jpg" }} />
 * </AvatarProvider>
 */
export function AvatarProvider({
  children,
  ...props
}: ProviderProps<AvatarProps>) {
  return (
    <AvatarContext.Provider value={props}>{children}</AvatarContext.Provider>
  );
}
