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

import { createContext } from 'react';
import { type ContextValue, useContextProps } from 'react-aria-components';
import {
  ClassificationBannerStyles,
  ClassificationBannerStylesDefaults,
} from './styles';
import type {
  ClassificationBannerProps,
  ClassificationBannerProviderProps,
} from './types';

export const ClassificationBannerContext =
  createContext<ContextValue<ClassificationBannerProps, HTMLSpanElement>>(null);

function ClassificationBannerProvider({
  children,
  ...props
}: ClassificationBannerProviderProps) {
  return (
    <ClassificationBannerContext.Provider value={props}>
      {children}
    </ClassificationBannerContext.Provider>
  );
}
ClassificationBannerProvider.displayName = 'ClassificationBanner.Provider';

export function ClassificationBanner({
  ref,
  ...props
}: ClassificationBannerProps) {
  [props, ref] = useContextProps(
    props,
    ref ?? null,
    ClassificationBannerContext,
  );

  const {
    className,
    variant = ClassificationBannerStylesDefaults.variant,
    children,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      className={ClassificationBannerStyles({
        variant,
        className,
      })}
    >
      {children}
    </span>
  );
}
ClassificationBanner.displayName = 'ClassificationBanner';
ClassificationBanner.Provider = ClassificationBannerProvider;
