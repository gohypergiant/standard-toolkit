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

import type { CleanupFunction } from '@/types/cleanup-function';
import type { HotkeyConfig } from '@/types/hotkey-config';
import type { HotkeyId } from '@/types/hotkey-id';

export type HotkeyHook = {
  /**
   * A React hook that manages a hotkey. When mounted, it will activate the hotkey. When all instances are unmounted, it
   * will deactivate the hotkey.
   */
  (): void;
  /**
   * The id of the hotkey
   */
  id: HotkeyId;
  /**
   * The full hotkey config
   */
  config: HotkeyConfig;
  /**
   * Force bind the hotkey. Ignores the hooks mounted state.
   */
  forceBind(): CleanupFunction;
  /**
   * Force unbind the hotkey. Ignores the hooks mounted state.
   */
  forceUnbind(): void;
  /**
   * Whether the hotkey is currently bound
   */
  isBound: boolean;
};
