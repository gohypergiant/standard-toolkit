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

/**
 * A framework-agnostic hotkey manager that can be used to activate and deactivate hotkeys
 * outside of React or any other framework.
 */
export type HotkeyManager = {
  /**
   * The id of the hotkey
   */
  id: HotkeyId;
  /**
   * The full hotkey config
   */
  config: HotkeyConfig;
  /**
   * Bind the hotkey with ref-counting. Multiple binds require multiple cleanups to fully unbind.
   * Returns a cleanup function to unbind this specific activation.
   */
  bind(): CleanupFunction;
  /**
   * Force bind the hotkey. Ignores normal activation tracking.
   * Any cleanup or forceUnbind() will immediately unbind.
   */
  forceBind(): CleanupFunction;
  /**
   * Force unbind the hotkey, ignoring normal activation tracking.
   */
  forceUnbind(): void;
  /**
   * Whether the hotkey is currently bound (has active activations)
   */
  readonly isBound: boolean;
};
