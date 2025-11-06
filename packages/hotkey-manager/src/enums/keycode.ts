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

import type { SafeEnum } from '@accelint/core';

/**
 * Common keycodes for the {@link KeyboardEvent}.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values | Keyboard event code values}
 */
export const Keycode = Object.freeze({
  KeyA: 'KeyA',
  KeyB: 'KeyB',
  KeyC: 'KeyC',
  KeyD: 'KeyD',
  KeyE: 'KeyE',
  KeyF: 'KeyF',
  KeyG: 'KeyG',
  KeyH: 'KeyH',
  KeyI: 'KeyI',
  KeyJ: 'KeyJ',
  KeyK: 'KeyK',
  KeyL: 'KeyL',
  KeyM: 'KeyM',
  KeyN: 'KeyN',
  KeyO: 'KeyO',
  KeyP: 'KeyP',
  KeyQ: 'KeyQ',
  KeyR: 'KeyR',
  KeyS: 'KeyS',
  KeyT: 'KeyT',
  KeyU: 'KeyU',
  KeyV: 'KeyV',
  KeyW: 'KeyW',
  KeyX: 'KeyX',
  KeyY: 'KeyY',
  KeyZ: 'KeyZ',
  Digit0: 'Digit0',
  Digit1: 'Digit1',
  Digit2: 'Digit2',
  Digit3: 'Digit3',
  Digit4: 'Digit4',
  Digit5: 'Digit5',
  Digit6: 'Digit6',
  Digit7: 'Digit7',
  Digit8: 'Digit8',
  Digit9: 'Digit9',
  Slash: 'Slash',
  IntlBackslash: 'IntlBackslash',
  Equal: 'Equal',
  Minus: 'Minus',
  BracketRight: 'BracketRight',
  BracketLeft: 'BracketLeft',
  Enter: 'Enter',
  Quote: 'Quote',
  Semicolon: 'Semicolon',
  Tab: 'Tab',
  Space: 'Space',
  Backquote: 'Backquote',
  Backspace: 'Backspace',
  Escape: 'Escape',
  CapsLock: 'CapsLock',
  MetaLeft: 'MetaLeft',
  MetaRight: 'MetaRight',
  AltLeft: 'AltLeft',
  AltRight: 'AltRight',
  ControlLeft: 'ControlLeft',
  ControlRight: 'ControlRight',
  ShiftLeft: 'ShiftLeft',
  ShiftRight: 'ShiftRight',
  NumpadDecimal: 'NumpadDecimal',
  NumpadMultiply: 'NumpadMultiply',
  NumpadAdd: 'NumpadAdd',
  NumLock: 'NumLock',
  AudioVolumeUp: 'AudioVolumeUp',
  AudioVolumeDown: 'AudioVolumeDown',
  AudioVolumeMute: 'AudioVolumeMute',
  NumpadDivide: 'NumpadDivide',
  NumpadEnter: 'NumpadEnter',
  NumpadSubtract: 'NumpadSubtract',
  NumpadEqual: 'NumpadEqual',
  Numpad0: 'Numpad0',
  Numpad1: 'Numpad1',
  Numpad2: 'Numpad2',
  Numpad3: 'Numpad3',
  Numpad4: 'Numpad4',
  Numpad5: 'Numpad5',
  Numpad6: 'Numpad6',
  Numpad7: 'Numpad7',
  Numpad8: 'Numpad8',
  Numpad9: 'Numpad9',
  IntlYen: 'IntlYen',
  IntlRo: 'IntlRo',
  NumpadComma: 'NumpadComma',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  Insert: 'Insert',
  Home: 'Home',
  PageUp: 'PageUp',
  Delete: 'Delete',
  End: 'End',
  PageDown: 'PageDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
} as const);

/**
 * A [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) code.
 */
export type Keycode = SafeEnum<typeof Keycode>;
