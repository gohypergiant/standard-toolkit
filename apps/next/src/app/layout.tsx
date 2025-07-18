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

import { Defaults } from './defaults';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import './globals.css';
import { Nav } from './nav';
import { Theme } from './theme';

export const metadata: Metadata = {
  title: 'Next App',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='bg-surface-raised font-primary w-full h-full'>
      <body className='w-full h-full'>
        <Theme>
          <Defaults>
            <Nav />
            {children}
          </Defaults>
        </Theme>
      </body>
    </html>
  );
}
