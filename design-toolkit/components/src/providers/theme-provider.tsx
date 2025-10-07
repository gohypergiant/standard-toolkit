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
import { merge } from 'lodash';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { designTokens } from '../tokens/tokens';
import type { PartialDeep } from 'type-fest';
import type {
  SemanticColorTokens,
  StaticColorTokens,
  ThemeTokens,
} from '@/tokens/types';

export type ThemeMode = 'dark' | 'light';
type ContextColorTokens = SemanticColorTokens & StaticColorTokens;

type ThemeContextValue = {
  mode: ThemeMode;
  tokens: ContextColorTokens;
  toggleMode: (mode: ThemeMode) => void;
};
/** provide default context value to avoid optional chaining and null checks on the client */
const defaultContextValue: ThemeContextValue = {
  mode: 'dark',
  tokens: { ...designTokens.dark, ...designTokens.static },
  toggleMode: (_mode) => {
    // no-op
  },
};
const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

type ThemeProviderProps = PropsWithChildren & {
  defaultMode?: ThemeMode;
  onChange?: (mode: ThemeMode) => void;
  /** override existing values in the theme */
  overrides?: PartialDeep<ThemeTokens>;
};

export function ThemeProvider({
  children,
  defaultMode,
  onChange,
  overrides,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode ?? 'dark');

  useEffect(() => {
    if (document) {
      const { documentElement } = document;
      documentElement.classList.remove('dark', 'light');
      documentElement.classList.add(mode);
    }
  }, [mode]);

  const tokens: ContextColorTokens = useMemo(() => {
    const tokensWithOverrides = merge(designTokens, overrides);
    return {
      ...tokensWithOverrides[mode],
      ...tokensWithOverrides.static,
    };
  }, [mode, overrides]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        tokens,
        toggleMode: (mode: ThemeMode) => {
          setMode(mode);
          onChange?.(mode);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
