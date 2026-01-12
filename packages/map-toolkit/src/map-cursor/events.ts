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

/**
 * Event keys for map cursor state changes.
 * These events are used for communication between cursor stores and consumers.
 */
export const MapCursorEvents = {
  /** Emitted when a component requests a cursor change */
  changeRequest: 'cursor:change-request',
  /** Emitted when the cursor has been changed */
  changed: 'cursor:changed',
  /** Emitted when a cursor change request is rejected */
  rejected: 'cursor:rejected',
} as const;
