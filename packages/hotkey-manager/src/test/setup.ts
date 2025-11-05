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

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { FORCE_BOUND } from '@/constants';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';
import type { HotkeyConfig } from '@/types/hotkey-config';

expect.extend(matchers);

export const addHotkey = (hotkeyConfig: HotkeyConfig) => {
  hotkeyStore.getState().registerHotkey(hotkeyConfig);
  hotkeyStore.getState().activateHotkey(hotkeyConfig.id, FORCE_BOUND);
};

export const initStore = () => {
  hotkeyStore.setState(hotkeyStore.getInitialState());
  eventStore.setState(eventStore.getInitialState());
};

afterEach(() => {
  cleanup();
});
