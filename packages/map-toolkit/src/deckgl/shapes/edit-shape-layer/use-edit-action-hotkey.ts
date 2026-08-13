/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use client';

import 'client-only';
import { useEffectEvent } from '@accelint/bus/react';
import {
  type Keycode,
  registerHotkey,
  unregisterHotkey,
} from '@accelint/hotkey-manager';
import { useEffect } from 'react';
import type { UniqueId } from '@accelint/core';
import type { EditingState } from './types';

export type EditActionHotkeyOptions = {
  /** Map instance the hotkey is scoped to. */
  mapId: UniqueId;
  /** Hotkey-manager id prefix; the hook appends `-${mapId}` to build the full id. */
  id: string;
  /** Keyboard code that triggers the action (e.g. `Keycode.Enter`). */
  keyCode: Keycode;
  /** Edit-store action to dispatch on key-up while editing (e.g. save / cancel). */
  action: (mapId: UniqueId) => void;
  /** Cancels any pending RAF batch before the action fires. */
  cancelPendingUpdate: () => void;
  /** Current edit session; handler no-ops when no shape is being edited. */
  editingState: EditingState | null;
};

/**
 * Registers a keyUp hotkey that fires an edit-store action while a shape is
 * being edited. Shared between the Save (Enter) and Cancel (Escape) bindings;
 * both follow the same guard-and-dispatch shape and lifecycle (register →
 * bind → unbind → unregister). Remounting without unregistering throws a
 * duplicate-id error, so the cleanup is mandatory.
 *
 * `useEffectEvent` keeps the keyUp handler referentially stable so the effect
 * only re-subscribes when the hotkey identity changes (`mapId`/`id`/`keyCode`),
 * while still calling the latest closure over `editingState` at key-press time.
 */
export function useEditActionHotkey({
  mapId,
  id,
  keyCode,
  action,
  cancelPendingUpdate,
  editingState,
}: EditActionHotkeyOptions): void {
  const handleKeyUp = useEffectEvent(() => {
    if (editingState?.editingShape) {
      cancelPendingUpdate();
      action(mapId);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleKeyUp is stable via useEffectEvent.
  useEffect(() => {
    const manager = registerHotkey({
      id: `${id}-${mapId}`,
      key: { code: keyCode },
      onKeyUp: handleKeyUp,
    });

    const unbind = manager.bind();

    return () => {
      unbind();
      unregisterHotkey(manager);
    };
  }, [mapId, id, keyCode]);
}
