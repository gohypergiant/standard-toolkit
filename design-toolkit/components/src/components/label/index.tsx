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
import {
  Label as AriaLabel,
  type ContextValue,
  useContextProps,
} from 'react-aria-components';
import { LabelStyles } from './styles';
import type { LabelProps, LabelProviderProps } from './types';

export const LabelContext =
  createContext<ContextValue<LabelProps, HTMLLabelElement>>(null);

function LabelProvider({ children, ...props }: LabelProviderProps) {
  return (
    <LabelContext.Provider value={props}>{children}</LabelContext.Provider>
  );
}
LabelProvider.displayName = 'Label.Provider';

export function Label({ ref, ...props }: LabelProps) {
  [props, ref] = useContextProps(props, ref ?? null, LabelContext);

  const { children, className, isDisabled, isRequired, ...rest } = props;

  return (
    <AriaLabel
      {...rest}
      className={LabelStyles({ className, isDisabled, isRequired })}
    >
      {children}
      {!isRequired && ' (optional)'}
    </AriaLabel>
  );
}
Label.displayName = 'Label';
Label.Provider = LabelProvider;
