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

import { createContext, useContext, useMemo } from 'react';
import { mergeProps } from '../../utils/props';
import type { DefaultsContext, DefaultsProviderProps } from './types';

const defaultsContext = createContext<DefaultsContext>({});

/**
 * Access globally established component prop defaults
 */
export function useDefaults() {
  return useContext(defaultsContext);
}

/**
 * Select default props from context and merge with provided props
 * with provided props taking precedence
 */
export function useDefaultProps<
  K extends keyof DefaultsContext,
  P extends DefaultsContext[K],
>(props: P, key: K): P {
  const defaults = useDefaults();

  const defaultProps = useMemo(
    () => (defaults[key] ?? {}) as Partial<P>,
    [defaults, key],
  );

  return useMemo(
    () => mergeProps(defaultProps, props) as P,
    [defaultProps, props],
  );
}

/**
 * Set default props for any component, to be merged in with props at point
 * of implementation. Global defaults take lower priority than props from
 * composition context or props attached to instance
 *
 * Nested instances of this provider will shallow merge defaults from parent
 * context, with the defaults prop taking precedence
 */
export function DefaultsProvider({
  children,
  defaults: defaultsProp,
}: DefaultsProviderProps) {
  const defaults = useDefaults();

  const context = useMemo(
    () => ({ ...defaults, ...defaultsProp }),
    [defaults, defaultsProp],
  );

  const { Provider } = defaultsContext;

  return <Provider value={context}>{children}</Provider>;
}
