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

import {
  type HotkeyOptions,
  type KeyCombination,
  type KeyCombinationId,
  Keycode,
  registerHotkey,
} from '@accelint/hotkey-manager';
import { persist, retrieve, STORAGE_ID } from './storage';
import type { MapViewState } from '@deck.gl/core';
import type { RequireAllOrNone } from 'type-fest';

type BaseOptions = {
  uniqueIdentifier?: string;
  threshold?: number;
  getCurrentViewport: () => MapViewState;
  setCurrentViewport: (viewport: MapViewState) => void;
};

type PersistOptions = RequireAllOrNone<{
  getSavedViewport: (
    id: KeyCombinationId,
    uniqueIdentifier?: string,
  ) => MapViewState;
  setSavedViewport: (
    id: KeyCombinationId,
    viewport: MapViewState,
    uniqueIdentifier?: string,
  ) => void;
}>;

type SavedViewportOptions = Partial<HotkeyOptions> &
  BaseOptions &
  PersistOptions;

export const createSavedViewport = (
  options: SavedViewportOptions,
): ReturnType<typeof registerHotkey> => {
  const setFn = options.setSavedViewport ?? persist;
  const getFn = options.getSavedViewport ?? retrieve;

  return registerHotkey({
    id: STORAGE_ID,
    heldThresholdMs: options.threshold,
    key: options.key ?? [
      {
        code: Keycode.Digit0,
      },
      {
        code: Keycode.Digit1,
      },
      {
        code: Keycode.Digit2,
      },
      {
        code: Keycode.Digit3,
      },
      {
        code: Keycode.Digit4,
      },
      {
        code: Keycode.Digit5,
      },
      {
        code: Keycode.Digit6,
      },
      {
        code: Keycode.Digit7,
      },
      {
        code: Keycode.Digit8,
      },
      {
        code: Keycode.Digit9,
      },
    ],
    onKeyHeld: (e: KeyboardEvent, key: KeyCombination) => {
      e.preventDefault();
      const viewport = options.getCurrentViewport();
      setFn(key.id, viewport, options.uniqueIdentifier);
    },
    onKeyUp: (e: KeyboardEvent, key: KeyCombination) => {
      e.preventDefault();
      const viewport = getFn(key.id, options.uniqueIdentifier);
      if (viewport) {
        options.setCurrentViewport(viewport);
      }
    },
  });
};
