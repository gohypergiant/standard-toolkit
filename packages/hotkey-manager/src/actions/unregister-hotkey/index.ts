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

import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyId } from '@/types/hotkey-id';

import type { HotkeyManager } from '@/types/hotkey-manager';

/**
 * Unregisters a hotkey.
 *
 * @param id - The hotkey id.
 * @returns void
 *

 * @example

 * ```typescript
 * import { unregisterHotkey } from '@accelint/hotkey-manager';
 *
 * unregisterHotkey('my-hotkey-id');
 * ```
 */
export function unregisterHotkey(id: HotkeyId): void;

/**
 * Unregisters a hotkey.
 *
 * @param config - The hotkey config.
 * @returns void
 *
 * @example

 * ```typescript
 * import { unregisterHotkey } from '@accelint/hotkey-manager';
 *
 * const config = { id: 'my-hotkey', key: { code: 'KeyA' } };
 * unregisterHotkey(config);
 * ```
 */
export function unregisterHotkey(config: HotkeyConfig): void;

/**
 * Unregisters a hotkey.
 *
 * @param manager - The hotkey manager.
 * @returns void
 *
 * @example
 * ```typescript

 * import { unregisterHotkey } from '@accelint/hotkey-manager';
 *
 * const manager = registerHotkey({ key: { code: 'KeyA' } });
 * unregisterHotkey(manager);
 * ```
 */
export function unregisterHotkey(manager: HotkeyManager): void;
export function unregisterHotkey(
  idOrConfigOrManager: HotkeyId | HotkeyConfig | HotkeyManager,
): void {
  let id: HotkeyId;

  if (
    (typeof idOrConfigOrManager === 'object' ||
      typeof idOrConfigOrManager === 'function') &&
    'id' in idOrConfigOrManager
  ) {
    id = idOrConfigOrManager.id;
  } else {
    id = idOrConfigOrManager;
  }

  hotkeyStore.getState().unregisterHotkey(id);
}
