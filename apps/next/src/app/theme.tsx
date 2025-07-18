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

import { bodies, families, ThemeProvider } from '@accelint/design-system';
import { clsx } from 'clsx';
import { Defaults } from './defaults';
import { theme, vars } from './theme.css';
import type { PropsWithChildren } from 'react';

export function Theme({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      className={clsx(families.sans, bodies.md)}
      theme={theme}
      vars={vars}
    >
      <Defaults>{children}</Defaults>
    </ThemeProvider>
  );
}
