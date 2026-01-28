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

import { getLogger } from '@accelint/logger';
import type { MapViewState } from '@deck.gl/core';

const logger = getLogger({
  enabled:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[SavedViewports]',
  pretty: true,
});

/**
 * Base storage key for saved viewports in localStorage.
 */
export const STORAGE_ID = 'deckgl-saved-viewports';

/**
 * Generates a storage key, optionally namespaced by unique identifier.
 *
 * @param uniqueIdentifier - Optional namespace for multiple map instances
 * @returns Storage key string
 */
const getContainerKey = (uniqueIdentifier?: string) =>
  uniqueIdentifier ? `${STORAGE_ID}-${uniqueIdentifier}` : STORAGE_ID;

/**
 * Retrieves the storage container from localStorage.
 * Returns empty object if parsing fails or key doesn't exist.
 *
 * @param containerKey - The storage key to retrieve
 * @returns Parsed storage container object
 */
const getContainer = (containerKey: string) => {
  try {
    return JSON.parse(localStorage.getItem(containerKey) ?? '{}');
  } catch {
    logger.warn(
      `Failed to parse storage container for key: ${containerKey}, returning empty container.`,
    );
    return {};
  }
};

/**
 * Persists a viewport state to localStorage.
 *
 * Saves the viewport under the given ID within a namespaced container.
 * If the container doesn't exist, creates it. If the ID already exists, overwrites it.
 *
 * @param id - Unique identifier for this viewport (typically a key combination ID)
 * @param obj - The MapViewState to persist
 * @param uniqueIdentifier - Optional namespace for multiple map instances
 *
 * @example
 * ```typescript
 * import { persist } from '@accelint/map-toolkit/deckgl/saved-viewports/storage';
 *
 * const viewport = {
 *   latitude: 38.9072,
 *   longitude: -77.0369,
 *   zoom: 10,
 *   pitch: 0,
 *   bearing: 0,
 * };
 *
 * persist('Digit1', viewport);
 * persist('Digit2', viewport, 'main-map');
 * ```
 */
export const persist = (
  id: string,
  obj: MapViewState,
  uniqueIdentifier?: string,
) => {
  const containerKey = getContainerKey(uniqueIdentifier);
  const container = getContainer(containerKey);
  container[id] = obj;
  localStorage.setItem(containerKey, JSON.stringify(container));
};

/**
 * Retrieves a saved viewport state from localStorage.
 *
 * Returns the viewport associated with the given ID, or undefined if not found.
 * Logs a warning if the viewport doesn't exist.
 *
 * @param id - Unique identifier for the viewport to retrieve
 * @param uniqueIdentifier - Optional namespace for multiple map instances
 * @returns The saved MapViewState or undefined if not found
 *
 * @example
 * ```typescript
 * import { retrieve } from '@accelint/map-toolkit/deckgl/saved-viewports/storage';
 *
 * const viewport = retrieve('Digit1');
 * if (viewport) {
 *   console.log('Restored viewport:', viewport);
 * }
 *
 * const mainMapViewport = retrieve('Digit1', 'main-map');
 * ```
 */
export const retrieve = (id: string, uniqueIdentifier?: string) => {
  const containerKey = getContainerKey(uniqueIdentifier);
  const container = getContainer(containerKey);
  const obj = container[id];
  if (!obj) {
    logger.warn(`Object with id: ${id} does not exist`);
  }
  return obj;
};
