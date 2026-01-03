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

'use client';

import { Broadcast } from '@accelint/bus';
import { MapCursorEvents } from '../../../../map-cursor/events';
import { getOrCreateClearCursor } from '../../../../map-cursor/store';
import { MapModeEvents } from '../../../../map-mode/events';
import type { UniqueId } from '@accelint/core';
import type {
  CSSCursorType,
  MapCursorEventType,
} from '../../../../map-cursor/types';
import type { MapModeEventType } from '../../../../map-mode/types';

/**
 * Typed event bus instances for mode and cursor communication.
 */
const mapModeBus = Broadcast.getInstance<MapModeEventType>();
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

/**
 * Request a map mode change.
 *
 * Emits a mode change request through the event bus. The mode store will
 * handle authorization and apply the change if approved.
 *
 * @param mapId - The map instance ID
 * @param desiredMode - The mode to switch to
 * @param owner - The identifier of the component requesting the change
 */
export function requestModeChange(
  mapId: UniqueId,
  desiredMode: string,
  owner: string,
): void {
  mapModeBus.emit(MapModeEvents.changeRequest, {
    desiredMode,
    owner,
    id: mapId,
  });
}

/**
 * Release mode back to default.
 *
 * Convenience function to request a mode change back to 'default'.
 *
 * @param mapId - The map instance ID
 * @param owner - The identifier of the component releasing the mode
 */
export function releaseMode(mapId: UniqueId, owner: string): void {
  requestModeChange(mapId, 'default', owner);
}

/**
 * Request a cursor change.
 *
 * Emits a cursor change request through the event bus.
 *
 * @param mapId - The map instance ID
 * @param cursor - The CSS cursor type to set
 * @param owner - The identifier of the component requesting the change
 */
export function requestCursorChange(
  mapId: UniqueId,
  cursor: CSSCursorType,
  owner: string,
): void {
  mapCursorBus.emit(MapCursorEvents.changeRequest, {
    cursor,
    owner,
    id: mapId,
  });
}

/**
 * Release cursor back to default.
 *
 * Uses the cursor store's clear function to release the cursor.
 *
 * @param mapId - The map instance ID
 * @param owner - The identifier of the component releasing the cursor
 */
export function releaseCursor(mapId: UniqueId, owner: string): void {
  getOrCreateClearCursor(mapId)(owner);
}

/**
 * Request both mode and cursor changes together.
 *
 * Common pattern when starting an operation that needs both mode and cursor.
 *
 * @param mapId - The map instance ID
 * @param desiredMode - The mode to switch to
 * @param cursor - The CSS cursor type to set
 * @param owner - The identifier of the component requesting the changes
 */
export function requestModeAndCursor(
  mapId: UniqueId,
  desiredMode: string,
  cursor: CSSCursorType,
  owner: string,
): void {
  requestModeChange(mapId, desiredMode, owner);
  requestCursorChange(mapId, cursor, owner);
}

/**
 * Release both mode and cursor back to defaults.
 *
 * Common pattern when ending an operation.
 *
 * @param mapId - The map instance ID
 * @param owner - The identifier of the component releasing mode and cursor
 */
export function releaseModeAndCursor(mapId: UniqueId, owner: string): void {
  releaseMode(mapId, owner);
  releaseCursor(mapId, owner);
}
