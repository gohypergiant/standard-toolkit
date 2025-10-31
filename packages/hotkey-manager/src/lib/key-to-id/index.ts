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

import { isMac } from '@/lib/is-mac';
import type { KeyCombination } from '@/types/key-combination';
import type { KeyCombinationId } from '@/types/key-combination-id';

/**
 * Converts a key combination to a standard key id.
 *
 * Handles auto mac style
 *
 * @internal
 * @param key Key combination
 */
export function keyToId(key: KeyCombination): KeyCombinationId {
  const ctrl =
    isMac && key.autoMacStyle
      ? key.meta
        ? 'ctrl'
        : 'no-ctrl'
      : key.ctrl
        ? 'ctrl'
        : 'no-ctrl';

  const meta =
    isMac && key.autoMacStyle
      ? key.ctrl
        ? 'meta'
        : 'no-meta'
      : key.meta
        ? 'meta'
        : 'no-meta';

  return [
    key.code,
    key.alt ? 'alt' : 'no-alt',
    ctrl,
    meta,
    key.shift ? 'shift' : 'no-shift',
  ].join('|');
}
