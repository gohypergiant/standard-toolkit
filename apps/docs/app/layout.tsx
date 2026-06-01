/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import './global.css';
import 'server-only';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from '~/modules/providers/theme';
import { RouterProvider } from '~/modules/providers/router';

import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className='font-primary dark'>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <RouterProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </RouterProvider>
        </RootProvider>
      </body>
    </html>
  );
}