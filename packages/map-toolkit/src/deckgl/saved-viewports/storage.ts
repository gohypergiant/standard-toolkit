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

import { getLogger } from '@accelint/logger';
import type { MapViewState } from '@deck.gl/core';

const logger = getLogger({
  enabled:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[SavedViewports]',
  pretty: true,
});

export const STORAGE_ID = 'deckgl-saved-viewports';

const getContainerKey = (uniqueIdentifier?: string) =>
  uniqueIdentifier ? `${STORAGE_ID}-${uniqueIdentifier}` : STORAGE_ID;

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

export const retrieve = (id: string, uniqueIdentifier?: string) => {
  const containerKey = getContainerKey(uniqueIdentifier);
  const container = getContainer(containerKey);
  const obj = container[id];
  if (!obj) {
    logger.warn(`Object with id: ${id} does not exist`);
  }
  return obj;
};
