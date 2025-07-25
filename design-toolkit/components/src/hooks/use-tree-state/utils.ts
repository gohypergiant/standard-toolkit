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

import { isTextDropItem } from '@react-aria/dnd';
import type { DropItem, TextDropItem } from '@react-types/shared';

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

export async function processDroppedItem(
  item: TextDropItem,
  acceptedDragTypes: string[],
) {
  const payload = await getDroppedItemPayload(item, acceptedDragTypes);

  return payload
    ? JSON.parse(payload)
    : Promise.reject(new Error('No supported type payload'));
}

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
