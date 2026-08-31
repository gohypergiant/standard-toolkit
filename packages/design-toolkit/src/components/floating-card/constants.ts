// __private-exports
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

/** Size a card opens at when `initialDimensions` is omitted. */
export const DEFAULT_DIMENSIONS = { width: 300, height: 400 } as const;

/** Position a card opens at when `initialPosition` is omitted. */
export const DEFAULT_POSITION = { x: 100, y: 100 } as const;

/** Smallest size a card can be resized to. */
export const MIN_DIMENSIONS = { width: 150, height: 100 } as const;

/**
 * Pointer travel, in pixels, before a press on the header becomes a drag.
 * Keeps a click from nudging the card.
 */
export const DRAG_THRESHOLD = 5;

/** Stacking order the first card in a provider receives. */
export const BASE_Z_INDEX = 1;
