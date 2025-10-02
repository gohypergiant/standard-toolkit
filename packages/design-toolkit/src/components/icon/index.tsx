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
import { IconStyles } from './styles';
import type { ProviderProps } from '@/lib/types';
import type { IconProps } from './types';

export const IconContext =
  createContext<ContextValue<IconProps, HTMLSpanElement>>(null);

function IconProvider({ children, ...props }: ProviderProps<IconProps>) {
  return <IconContext.Provider value={props}>{children}</IconContext.Provider>;
}
IconProvider.displayName = 'Icon.Provider';

/**
 * Icon - A wrapper component for displaying SVG icons with consistent sizing
 *
 * Provides a standardized container for SVG icons with built-in size variants and
 * proper accessibility support. Works seamlessly with the Accelint icon library
 * and supports custom SVG elements with consistent styling and alignment.
 *
 * @example
 * // Basic icon usage
 * <Icon>
 *   <Settings />
 * </Icon>
 *
 * @example
 * // Icon with different sizes
 * <Icon size="small">
 *   <User />
 * </Icon>
 * <Icon size="large">
 *   <Dashboard />
 * </Icon>
 *
 * @example
 * // Icon in button context (automatically inherits sizing)
 * <Button>
 *   <Icon><Plus /></Icon>
 *   Add Item
 * </Button>
 */
export function Icon({ ref, ...props }: IconProps) {
  [props, ref] = useContextProps(props, ref ?? null, IconContext);

  const { children, className, size = 'medium', ...rest } = props;

  return (
    <span
      {...rest}
      ref={ref}
      className={IconStyles({ className })}
      data-size={size}
    >
      {children}
    </span>
  );
}
Icon.displayName = 'Icon';
Icon.Provider = IconProvider;
