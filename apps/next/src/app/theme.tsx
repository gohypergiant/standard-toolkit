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

import {
  ThemeProvider as DSThemeProvider,
  bodies,
  families,
} from '@accelint/design-system';
import { ThemeProvider as DTKThemeProvider } from '@accelint/design-toolkit';
import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { Defaults } from './defaults';
import { theme, vars } from './theme.css';

export function DSTheme({ children }: PropsWithChildren) {
  return (
    <DSThemeProvider
      className={clsx(families.sans, bodies.md)}
      theme={theme}
      vars={vars}
    >
      <Defaults>{children}</Defaults>
    </DSThemeProvider>
  );
}

export function DTKTheme({ children }: PropsWithChildren) {
  return (
    <DTKThemeProvider
      overrides={{
        light: {
          bg: {
            accent: {
              primary: {
                bold: [255, 107, 26, 1],
              },
            },
          },
        },
        dark: {
          bg: {
            accent: {
              primary: {
                bold: [196, 211, 0, 1],
              },
            },
          },
        },
      }}
    >
      {children}
    </DTKThemeProvider>
  );
}
