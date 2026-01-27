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

import type { KeyCombination } from '@/types/key-combination';

/**
 * Converts a key combination to a human-readable string representation.
 *
 * @internal
 * @param key - The key combination to convert.
 * @returns A human-readable string like "[CTRL] + [SHIFT] + [KeyA]".
 *
 * @example
 * ```typescript
 * import { keyToString } from '@/lib/key-to-string';
 *
 * const keyString = keyToString({
 *   code: 'KeyS',
 *   alt: false,
 *   ctrl: false,
 *   meta: true,
 *   shift: false,
 *   autoMacStyle: false,
 *   id: 'KeyS_meta',
 * });
 * console.log(keyString); // "[Win/⌘] + [KeyS]"
 * ```
 */
export function keyToString(key: KeyCombination): string {
  return [
    key.ctrl ? '[CTRL]' : undefined,
    key.meta ? '[Win/⌘]' : undefined,
    key.alt ? '[ALT]' : undefined,
    key.shift ? '[SHIFT]' : undefined,
    `[${key.code}]`,
  ]
    .filter(Boolean)
    .join(' + ');
}
