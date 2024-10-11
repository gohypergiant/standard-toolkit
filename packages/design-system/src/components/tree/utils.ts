import {
  type DropItem,
  type DropOperation,
  type Key,
  type TextDropItem,
  isTextDropItem,
} from 'react-aria';
import type { DragAndDropOptions } from 'react-aria-components';
import type { TreeNode, UseTreeResult } from '../../types';

export function createDragAndDropHandlers<T>(
  id: Key,
  acceptedDragTypes: string[],
  lookup: Record<Key, TreeNode<T>>,
  actions: UseTreeResult<T>['actions'],
): DragAndDropOptions {
  return {
    acceptedDragTypes,
    getDropOperation,
    getItems: (keys: Set<Key>) =>
      [...keys].map((key) => {
        const node = lookup[key]?.value;

        if (!node) {
          return {};
        }

        const payload = JSON.stringify(node);

        return [
          'all',
          'type' in node ? node.type : undefined,
          ...('types' in node ? (node.types ?? []) : []),
        ].reduce<Record<string, string>>((acc, type) => {
          if (!type) return acc;

          acc[`tree-${type}`] = payload;

          return acc;
        }, {});
      }),
    onDragEnd: () => actions.revertIsExpanded(),
    onDragStart: ({ keys }) => actions.toggleIsExpanded(keys, false, true),
    onInsert: ({ items, target }) => {
      // Wrap async return function where void expected, fuck SQ
      (async () => {
        const processedItems = await processDroppedItems(
          items,
          acceptedDragTypes,
        );

        actions.remove(...processedItems.map((item) => item.id));

        if (target.dropPosition === 'before') {
          actions.insertBefore(target.key, ...processedItems);
        } else if (target.dropPosition === 'after') {
          actions.insertAfter(target.key, ...processedItems);
        }
      })();
    },
    onReorder({ keys, target }) {
      const values = Array.from(keys).flatMap((key) => {
        const value = lookup[key]?.value;

        if (value) {
          return [value];
        }

        return [];
      });

      actions.remove(...keys);

      if (target.dropPosition === 'before') {
        actions.insertBefore(target.key, ...values);
      } else if (target.dropPosition === 'after') {
        actions.insertAfter(target.key, ...values);
      }
    },
    onRootDrop: ({ items }) => {
      // See above, thanks SQ for ensuring high quality code
      (async () => {
        const processedItems = await processDroppedItems(
          items,
          acceptedDragTypes,
        );

        actions.remove(...processedItems.map((item) => item.id));

        actions.append(id, ...processedItems);
      })();
    },
  };
}

export function getDropOperation(): DropOperation {
  return 'move';
}

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
