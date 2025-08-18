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
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { ParamsProvider } from '~/modules/providers/params';
import { QueryProvider } from '~/modules/providers/query';
import { RouterProvider } from '~/modules/providers/router';

import './global.css';

// biome-ignore lint/style/useNamingConvention: nextjs convention
export const experimental_ppr = true;

export const metadata: Metadata = {
  title: 'Launchpad',
  other: {
    // NOTE: fallback provided in next.config.ts
    'build-git-sha': process.env.CI_COMMIT_SHORT_SHA as string,
  },
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        {/* <script src='https://unpkg.com/react-scan/dist/auto.global.js' async /> */}
      </head>
      <body className='fg-default-light min-h-dvh bg-surface-default'>
        <ParamsProvider>
          <QueryProvider>
            <RouterProvider>{props.children}</RouterProvider>
          </QueryProvider>
        </ParamsProvider>
      </body>
    </html>
  );
}
