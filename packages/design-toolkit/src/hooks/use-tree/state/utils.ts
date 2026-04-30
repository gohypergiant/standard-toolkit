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

import { isTextDropItem } from 'react-aria';
import type { DropItem, TextDropItem } from '@react-types/shared';

/**
 * Filters and processes an array of drop items into parsed tree node data.
 *
 * Filters to text items only, then processes each using supported drag types.
 *
 * @param items - Drop items from a drag-and-drop event.
 * @param acceptedDragTypes - MIME types to accept when reading item payloads.
 * @returns Array of parsed node objects from the dropped items.
 */
export async function processDroppedItems(
  items: DropItem[],
  acceptedDragTypes: string[],
) {
  return await Promise.all(
    items
      .filter(isTextDropItem)
      .map((item) => processDroppedItem(item, acceptedDragTypes)),
  );
}

/**
 * Processes a single text drop item into parsed tree node data.
 *
 * @param item - A text drop item from a drag-and-drop event.
 * @param acceptedDragTypes - MIME types to attempt reading from the item.
 * @returns Parsed node object from the first matching drag type payload.
 * @throws {Error} When no payload matching any accepted drag type is found.
 */
export async function processDroppedItem(
  item: TextDropItem,
  acceptedDragTypes: string[],
) {
  const payload = await getDroppedItemPayload(item, acceptedDragTypes);

  return payload
    ? JSON.parse(payload)
    : Promise.reject(new Error('No supported type payload'));
}

/**
 * Reads the text payload from a drop item for the first matching drag type.
 *
 * Uses `Promise.any` — returns the payload from whichever accepted drag type
 * resolves first.
 *
 * @param item - A text drop item from a drag-and-drop event.
 * @param acceptedDragTypes - MIME types to attempt reading in order.
 * @returns The raw text payload string for the first matching drag type.
 * @throws {AggregateError} When no accepted drag type has a payload.
 */
export async function getDroppedItemPayload(
  item: TextDropItem,
  acceptedDragTypes: string[],
) {
  return await Promise.any(
    acceptedDragTypes.map(
      async (type) =>
        (await item.getText(type)) ??
        Promise.reject(new Error('Unsupported type')),
    ),
  );
}
