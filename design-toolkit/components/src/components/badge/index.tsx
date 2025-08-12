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
import type { ProviderProps } from '@/lib/types';
import { createContext } from 'react';
import { type ContextValue, useContextProps } from 'react-aria-components';
import { BadgeStyles, BadgeStylesDefaults } from './styles';
import type { BadgeProps } from './types';

export const BadgeContext =
  createContext<ContextValue<BadgeProps, HTMLSpanElement>>(null);

function BadgeProvider({ children, ...props }: ProviderProps<BadgeProps>) {
  return (
    <BadgeContext.Provider value={props}>{children}</BadgeContext.Provider>
  );
}
BadgeProvider.displayName = 'Badge.Provider';

export function Badge({ ref, ...props }: BadgeProps) {
  [props, ref] = useContextProps(props, ref ?? null, BadgeContext);

  const {
    className,
    offset,
    placement,
    variant = BadgeStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      ref={ref}
      className={BadgeStyles({
        className,
        variant,
      })}
      data-offset-x={typeof offset === 'number' ? offset : offset?.x}
      data-offset-y={typeof offset === 'number' ? offset : offset?.y}
      data-placement={placement || null}
    />
  );
}
Badge.displayName = 'Badge';
Badge.Provider = BadgeProvider;
