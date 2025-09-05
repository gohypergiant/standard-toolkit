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

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Defaults } from './defaults';
import './globals.css';
import { Nav } from './nav';
import { DSTheme, DTKTheme } from './theme';

export const metadata: Metadata = {
  title: 'Next App',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    // Note: if theme state is coming from some persisted store, that will need to be handled
    // from https://tailwindcss.com/docs/dark-mode#with-system-theme-support
    //
    //   // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    //   document.documentElement.classList.toggle(
    //     "dark",
    //     localStorage.theme === "dark" ||
    //       (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    //   );
    <html
      lang='en'
      className='bg-surface-overlay fg-info-bold font-primary dark'
    >
      <body className='w-full h-dvh flex flex-col'>
        <DSTheme>
          <Defaults>
            <DTKTheme>
              <Nav />
              <div className='grow'>{children}</div>
            </DTKTheme>
          </Defaults>
        </DSTheme>
      </body>
    </html>
  );
}
