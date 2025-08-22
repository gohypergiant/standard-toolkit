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
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { designTokens } from '../tokens/tokens';

type Mode = 'dark' | 'light';

type UseThemeContext = {
  mode: Mode;
  tokens: (typeof designTokens)[Mode];
  toggleMode: (mode: Mode) => void;
} | null;
const ThemeContext = createContext<UseThemeContext>(null);

type ThemeProviderProps = PropsWithChildren & {
  defaultMode?: Mode;
  onChange?: (mode: Mode) => void;
  /** override existing values in the theme */
  overrides?: Partial<typeof designTokens>;
};
export function ThemeProvider({
  children,
  defaultMode,
  onChange,
  overrides,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(defaultMode ?? 'dark');

  useEffect(() => {
    if (document) {
      const { documentElement } = document;
      documentElement.classList.remove('dark', 'light');
      documentElement.classList.add(mode);
    }
  }, [mode]);

  const tokens = useMemo(() => {
    return merge(designTokens[mode], overrides);
  }, [mode, overrides]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        tokens,
        toggleMode: (mode: Mode) => {
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
