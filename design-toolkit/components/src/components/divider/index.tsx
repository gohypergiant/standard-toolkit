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
import { type ContextValue, useContextProps } from 'react-aria-components';
import { DividerStyles } from './styles';
import type { ProviderProps } from '@/lib/types';
import type { DividerProps } from './types';

export const DividerContext =
  createContext<ContextValue<DividerProps, HTMLHRElement>>(null);

function DividerProvider({ children, ...props }: ProviderProps<DividerProps>) {
  return (
    <DividerContext.Provider value={props}>{children}</DividerContext.Provider>
  );
}
DividerProvider.displayName = 'Divider.Provider';

/**
 * Divider - A simple horizontal or vertical rule component
 *
 * Provides a visual separator between content sections with support for both
 * horizontal and vertical orientations.
 *
 * @example
 * // Basic horizontal divider
 * <Divider />
 *
 * @example
 * // Vertical divider
 * <Divider orientation="vertical" />
 */
export function Divider({ ref, ...props }: DividerProps) {
  [props, ref] = useContextProps(props, ref ?? null, DividerContext);

  const { className, orientation = 'horizontal', ...rest } = props;

  return (
    <hr
      {...rest}
      ref={ref}
      className={DividerStyles({ className })}
      data-orientation={orientation}
    />
  );
}
Divider.displayName = 'Divider';
Divider.Provider = DividerProvider;
