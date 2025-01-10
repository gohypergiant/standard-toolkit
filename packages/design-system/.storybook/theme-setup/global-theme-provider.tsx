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

// biome-ignore lint/correctness/noUnusedImports: TODO fix later
import React, { type PropsWithChildren, useMemo } from 'react';
import { clsx } from 'clsx';
import {
  type DefaultsContext,
  DefaultsProvider,
  ThemeProvider,
  bodies,
  families,
  pixelValueAsNumberValidator,
  sizeVars,
  surfaces,
  useTheme,
} from '../../src';
import { theme as themeConfig, vars } from './theme.css';

function Defaults({ children }: PropsWithChildren) {
  const theme = useTheme({ size: sizeVars });

  const defaults = useMemo<DefaultsContext>(
    () => ({
      // biome-ignore lint/style/useNamingConvention: intentional
      Tooltip: {
        containerPadding: pixelValueAsNumberValidator
          .catch(0)
          .parse(theme.contract?.size.v04),
      },
    }),
    [theme.contract?.size.v04],
  );

  return <DefaultsProvider defaults={defaults}>{children}</DefaultsProvider>;
}

const style = {
  height: '100%',
  display: 'block',
  padding: sizeVars.v08,
};

export const GlobalThemeProvider = ({ children }) => (
  <ThemeProvider
    className={clsx(families.sans, bodies.md)}
    theme={themeConfig}
    vars={vars}
  >
    <Defaults>
      <div className={surfaces.default.flush} style={style}>
        {children}
      </div>
    </Defaults>
  </ThemeProvider>
);
