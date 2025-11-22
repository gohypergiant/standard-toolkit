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
import 'server-only';
import { Nav } from '~/modules/nav';
import { RouterProvider } from '~/modules/providers/router';
import { ThemeProvider } from '~/modules/providers/theme';
import type { PropsWithChildren } from 'react';
import './globals.css';

// biome-ignore lint/style/useNamingConvention: nextjs convention
export const experimental_ppr = true;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='font-primary dark'>
      <body className='w-full h-full p-l top-xxl relative'>
        <RouterProvider>
          <ThemeProvider>
            {children}
            <Nav />
          </ThemeProvider>
        </RouterProvider>
      </body>
    </html>
  );
}
