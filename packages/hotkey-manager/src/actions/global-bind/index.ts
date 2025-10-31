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

import { handleOnKeyDown } from '@/actions/handle-on-key-down';
import { handleOnKeyUp } from '@/actions/handle-on-key-up';
import { isClient } from '@/lib/is-client';
import { eventStore } from '@/stores/event-store';

/**
 * Binds the hotkey listener to the global window object.
 *
 * Safe to call on the server.
 */
export function globalBind() {
  // Exit if running on a server
  if (!isClient) {
    return;
  }

  // Get the event store state
  const state = eventStore.getState();

  // Check if already bound
  if (state.bound) {
    return;
  }

  window.addEventListener('keydown', handleOnKeyDown);
  window.addEventListener('keyup', handleOnKeyUp);

  // Mark as bound
  state.setBound(true);
}
