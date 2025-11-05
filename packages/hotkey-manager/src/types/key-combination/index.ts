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

import type { Keycode } from '@/enums/keycode';
import type { KeyCombinationId } from '@/types/key-combination-id';

export type KeyCombination = {
  /**
   * The id of the key combination.
   */
  id: KeyCombinationId;
  /**
   * The primary key to trigger on. Use the Keycode enum to ensure compatibility.
   */
  code: Keycode;
  /**
   * When `true` requires the control key to be press.
   *
   * If `autoMacStyle` is `true` then this will switch to the command key.
   *
   * @default false
   */
  ctrl: boolean;
  /**
   * When `true` requires the alt/option key to be press.
   *
   * @default false
   */
  alt: boolean;
  /**
   * When `true` requires the shift key to be press.
   *
   * @default false
   */
  shift: boolean /**
   * When `true` requires the Windows key to be press. This setting is not recommended.
   *
   * If `autoMacStyle` is `true` then this will switch to the control key otherwise this will be the command key.
   *
   * @default false
   */;
  meta: boolean;
  /**
   * Automatically convert the hotkey to the common macOS style, e.g. `ctl+shift+g` becomes `cmd+shift+g` to better
   * align with user expectations.
   */
  autoMacStyle: boolean;
};
