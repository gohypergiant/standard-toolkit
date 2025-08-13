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

import type { ProviderProps } from '@/lib/types';
import { createContext } from 'react';
import { type ContextValue, useContextProps } from 'react-aria-components';
import {
  ClassificationBadgeStyles,
  ClassificationBadgeStylesDefaults,
} from './styles';
import type { ClassificationBadgeProps } from './types';

export const ClassificationBadgeContext =
  createContext<ContextValue<ClassificationBadgeProps, HTMLSpanElement>>(null);

function ClassificationBadgeProvider({
  children,
  ...props
}: ProviderProps<ClassificationBadgeProps>) {
  return (
    <ClassificationBadgeContext.Provider value={props}>
      {children}
    </ClassificationBadgeContext.Provider>
  );
}
ClassificationBadgeProvider.displayName = 'ClassificationBadge.Provider';

/**
 * ClassificationBadge - A specialized badge for security and data classification
 *
 * Provides standardized visual indicators for data classification levels such as
 * confidential, secret, or public information. Designed for compliance with
 * security standards and information governance requirements.
 *
 * @example
 * // Basic classification badge
 * <ClassificationBadge level="confidential" />
 *
 * @example
 * // Classification with custom styling
 * <ClassificationBadge level="secret" />
 */
export function ClassificationBadge({
  ref,
  ...props
}: ClassificationBadgeProps) {
  [props, ref] = useContextProps(
    props,
    ref ?? null,
    ClassificationBadgeContext,
  );

  const {
    children,
    className,
    size = 'medium',
    variant = ClassificationBadgeStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      className={ClassificationBadgeStyles({
        variant,
        className,
      })}
      data-size={size}
    >
      {children}
    </span>
  );
}
ClassificationBadge.displayName = 'ClassificationBadge';
ClassificationBadge.Provider = ClassificationBadgeProvider;
