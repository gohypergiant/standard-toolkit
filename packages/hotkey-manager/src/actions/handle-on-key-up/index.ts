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

import { eventToId } from '@/lib/event-to-id';
import { heldId } from '@/lib/held-id';
import { isInputField } from '@/lib/is-input-field';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';

/**
 * Handles the `keyup` event.
 *
 * @internal
 * @param event The `keyup` event.
 */
export function handleOnKeyUp(event: KeyboardEvent) {
  const keyId = eventToId(event);

  const configs = hotkeyStore.getState().getHotkeysForKeyCombination(keyId);
  if (!configs) {
    return;
  }

  const isInput = isInputField(event);

  for (const config of configs) {
    // Skip if the hotkey is not allowed to fire on input fields
    if (isInput && !config.allowInputFields) {
      continue;
    }

    const key = config.key.find((key) => key.id === keyId);

    /* istanbul ignore if -- @preserve */
    if (!key) {
      console.warn(
        `Hotkey ${config.id} was activated to ${keyId} but no matching key was found.`,
      );
      continue;
    }

    const eventState = eventStore.getState();

    const configHeldId = heldId(key.id, config.id);

    if (
      config.onKeyUp &&
      (config.alwaysTriggerKeyUp || !eventState.heldTriggered.has(configHeldId))
    ) {
      config.onKeyUp(event, key, config);
    }

    // Clean up held info
    eventState.removeHeldTriggered(configHeldId);
    eventState.removeHeldTimeout(configHeldId);
  }
}
