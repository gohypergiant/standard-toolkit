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

export { globalBind } from '@/actions/global-bind';
export { globalUnbind } from '@/actions/global-unbind';
export { registerHotkey } from '@/actions/register-hotkey';
export { unregisterHotkey } from '@/actions/unregister-hotkey';
export { Keycode } from '@/enums/keycode';
export { isMac } from '@/lib/is-mac';
export type { CleanupFunction } from '@/types/cleanup-function';
export type { HotkeyAction } from '@/types/hotkey-action';
export type { HotkeyConfig } from '@/types/hotkey-config';
export type { HotkeyEvents } from '@/types/hotkey-events';
export type { HotkeyExtra } from '@/types/hotkey-extra';
export type { HotkeyHook } from '@/types/hotkey-hook';
export type { HotkeyId } from '@/types/hotkey-id';
export type { HotkeyOptions } from '@/types/hotkey-options';
export type { KeyCombination } from '@/types/key-combination';
export type { KeyCombinationId } from '@/types/key-combination-id';
export type { KeyOption } from '@/types/key-option';
