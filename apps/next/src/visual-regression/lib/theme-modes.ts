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

import type { ThemeMode } from './types';

/**
 * Theme modes for visual tests - always test both dark and light
 */
export const THEME_MODES: ThemeMode[] = ['dark', 'light'];

/**
 * Insert theme mode into screenshot filename before the extension.
 *
 * @example
 * insertModeInFilename('button-variants.png', 'dark')
 * // => 'button-variants-dark.png'
 *
 * @example
 * insertModeInFilename('button-hover.png', 'light')
 * // => 'button-hover-light.png'
 */
export function insertModeInFilename(
  filename: string,
  mode: ThemeMode,
): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${filename}-${mode}`;
  }
  const baseName = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);
  return `${baseName}-${mode}${extension}`;
}
