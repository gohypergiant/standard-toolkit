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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';

/**
 * Built-in CSS cursor types
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
 */
export type CSSCursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'zoom-in'
  | 'zoom-out';

/**
 * Payload for cursor change request events
 */
export type CursorChangeRequestPayload = {
  /** The desired cursor CSS string */
  cursor: CSSCursorType;
  /** The unique identifier of the requester */
  owner: string;
  /** The map instance ID this request targets */
  id: UniqueId;
};

/**
 * Payload for cursor changed events
 */
export type CursorChangedPayload = {
  /** The previous cursor value */
  previousCursor: CSSCursorType;
  /** The new cursor value */
  currentCursor: CSSCursorType;
  /** The owner of the new cursor */
  owner: string;
  /** The map instance ID */
  id: UniqueId;
};

/**
 * Payload for cursor rejection events
 */
export type CursorRejectionPayload = {
  /** The cursor that was rejected */
  rejectedCursor: CSSCursorType;
  /** The owner whose request was rejected */
  rejectedOwner: string;
  /** The current cursor owner */
  currentOwner: string;
  /** Reason for rejection */
  reason: string;
  /** The map instance ID */
  id: UniqueId;
};

/**
 * Union of all cursor event payloads
 */
export type MapCursorEventType =
  | Payload<'cursor:change-request', CursorChangeRequestPayload>
  | Payload<'cursor:changed', CursorChangedPayload>
  | Payload<'cursor:rejected', CursorRejectionPayload>;
