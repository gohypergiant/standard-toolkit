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

import { useEffect } from 'react';
import type { HotkeyManager } from '@/types/hotkey-manager';

/**
 * A React hook that binds a HotkeyManager on mount and unbinds on unmount.
 *
 * @param manager - The hotkey manager to bind.
 * @returns void
 *
 * @example
 * ```tsx
 * const myHotkey = registerHotkey({ key: { code: Keycode.KeyA }, onKeyUp: handler });
 *
 * function MyComponent() {
 *   useHotkey(myHotkey);
 *   return <div />;
 * }
 * ```
 */
export function useHotkey(manager: HotkeyManager): void {
  useEffect(() => manager.bind(), [manager]);
}

/**
 * Creates a React hook from a HotkeyManager for module-level usage.
 * This is useful when you want to define the hotkey at module scope and use it as a hook.
 *
 * @param manager - The hotkey manager to wrap.
 * @returns A React hook that binds the hotkey on mount.
 *
 * @example
 * ```tsx
 * const myHotkey = registerHotkey({ key: { code: Keycode.KeyA }, onKeyUp: handler });
 * const useMyHotkey = createUseHotkey(myHotkey);
 *
 * function MyComponent() {
 *   useMyHotkey();
 *   return <div />;
 * }
 * ```
 */
export function createUseHotkey(manager: HotkeyManager): () => void {
  return function useHotkeyHook() {
    // biome-ignore lint/correctness/useExhaustiveDependencies: manager is a stable reference from closure
    useEffect(() => manager.bind(), []);
  };
}
