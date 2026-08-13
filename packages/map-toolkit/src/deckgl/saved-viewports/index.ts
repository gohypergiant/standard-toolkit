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

/**
 * Base options required for saved viewport functionality.
 */
type BaseOptions = {
  /** Optional identifier to namespace saved viewports for multiple map instances */
  uniqueIdentifier?: string;
  /** Milliseconds to hold a key before saving (default: 1000) */
  threshold?: number;
  /** Function that returns the current map viewport state */
  getCurrentViewport: () => MapViewState;
  /** Function that receives a viewport state and applies it to the map */
  setCurrentViewport: (viewport: MapViewState) => void;
};

/**
 * Optional custom storage functions for persisting viewports.
 * Both functions must be provided together or omitted entirely.
 */
type PersistOptions = RequireAllOrNone<{
  /** Custom function to retrieve saved viewports from storage */
  getSavedViewport: (
    id: KeyCombinationId,
    uniqueIdentifier?: string,
  ) => MapViewState;
  /** Custom function to persist saved viewports to storage */
  setSavedViewport: (
    id: KeyCombinationId,
    viewport: MapViewState,
    uniqueIdentifier?: string,
  ) => void;
}>;

/**
 * Configuration options for creating a saved viewport hotkey system.
 * Combines hotkey options with viewport management callbacks and optional custom storage.
 */
export type SavedViewportOptions = Partial<HotkeyOptions> &
  BaseOptions &
  PersistOptions;

/**
 * Creates a React hook that registers hotkeys for saving and restoring map viewports.
 *
 * By default, uses number keys 0-9 where:
 * - **Hold** a key for the threshold duration (default 1s) to save the current viewport
 * - **Tap** a key to restore the saved viewport
 *
 * Viewports are persisted to localStorage by default but can be customized with
 * `getSavedViewport` and `setSavedViewport` options.
 *
 * @param options - Configuration for viewport saving behavior and storage
 * @returns A React hook function that must be called within a component to activate hotkeys
 *
 * @example
 * ```tsx
 * import { Broadcast } from '@accelint/bus';
 * import { useOn } from '@accelint/bus/react';
 * import { uuid } from '@accelint/core';
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 * import { MapEvents } from '@accelint/map-toolkit/deckgl/base-map';
 * import { CameraEventTypes } from '@accelint/map-toolkit/camera';
 * import { createSavedViewport } from '@accelint/map-toolkit/deckgl/saved-viewports';
 * import { globalBind } from '@accelint/hotkey-manager';
 * import type { MapViewState } from '@deck.gl/core';
 * import type { CameraEvent } from '@accelint/map-toolkit/camera';
 * import type { MapViewportEvent, MapViewportPayload } from '@accelint/map-toolkit/deckgl/base-map';
 *
 * globalBind();
 *
 * const MAP_ID = uuid();
 * const cameraBus = Broadcast.getInstance<CameraEvent>();
 * let currentViewport: MapViewportPayload;
 *
 * const useSavedViewportHotkey = createSavedViewport({
 *   threshold: 1000,
 *   getCurrentViewport: () => currentViewport,
 *   setCurrentViewport: (newState: MapViewState) => {
 *     currentViewport = { ...currentViewport, ...newState };
 *     cameraBus.emit(CameraEventTypes.setCenter, {
 *       id: MAP_ID,
 *       latitude: newState.latitude ?? currentViewport.latitude,
 *       longitude: newState.longitude ?? currentViewport.longitude,
 *       zoom: newState.zoom,
 *     });
 *   },
 * });
 *
 * export function MapView() {
 *   useSavedViewportHotkey();
 *
 *   useOn<MapViewportEvent>(MapEvents.viewport, (event) => {
 *     currentViewport = { ...currentViewport, ...event.payload };
 *   });
 *
 *   return <BaseMap id={MAP_ID} className="w-full h-full" />;
 * }
 * ```
 */
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
