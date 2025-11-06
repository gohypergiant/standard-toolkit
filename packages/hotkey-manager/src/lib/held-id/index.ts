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

import type { HeldId } from '@/types/held-id';
import type { HotkeyId } from '@/types/hotkey-id';
import type { KeyCombinationId } from '@/types/key-combination-id';

/**
 * Creates a standard id for tracking when a key is held down.
 *
 * @internal
 * @param keyId The standard key id
 * @param configId The hotkey id
 */
export function heldId(keyId: KeyCombinationId, configId: HotkeyId): HeldId {
  return `${keyId}::${configId}`;
}
