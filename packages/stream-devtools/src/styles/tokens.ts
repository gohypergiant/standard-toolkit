// __private-exports

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

/**
 * Vendored copy of the TanStack devtools palette (form-devtools does the
 * same) so the panel's own surfaces match `@tanstack/devtools-ui` in both
 * themes without importing that package's private token module.
 */
export const tokens = {
  colors: {
    gray: {
      50: '#f9fafb',
      100: '#f2f4f7',
      200: '#eaecf0',
      300: '#d0d5dd',
      400: '#98a2b3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1d2939',
      900: '#101828',
    },
    darkGray: {
      50: '#525c7a',
      100: '#49536e',
      200: '#414962',
      300: '#394056',
      400: '#313749',
      500: '#292e3d',
      600: '#212530',
      700: '#191c24',
      800: '#111318',
      900: '#0b0d10',
    },
    blue: {
      100: '#D1E9FF',
      300: '#84CAFF',
      500: '#2E90FA',
      600: '#1570EF',
      700: '#175CD3',
      900: '#194185',
    },
    green: {
      100: '#D1FADF',
      300: '#6CE9A6',
      500: '#12B76A',
      600: '#039855',
      700: '#027A48',
      900: '#054F31',
    },
    red: {
      100: '#fee2e2',
      300: '#fca5a5',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      900: '#7f1d1d',
    },
    yellow: {
      100: '#FEF0C7',
      400: '#FDB022',
      500: '#F79009',
      600: '#DC6803',
      700: '#B54708',
    },
  },
  font: {
    /** Chrome text/labels — the devtools shell's sans stack. */
    sans: 'ui-sans-serif, Inter, system-ui, sans-serif, sans-serif',
    /** Stream hashes, timestamps, payloads. */
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  /**
   * From @tanstack/query-devtools constants.ts. Measured against the PANEL
   * root, not the window. Below `second` the list/detail columns stack and
   * chip labels hide; below `first` labels also hide while a detail pane
   * is open.
   */
  breakpoints: {
    first: 1024,
    second: 796,
  },
} as const;
