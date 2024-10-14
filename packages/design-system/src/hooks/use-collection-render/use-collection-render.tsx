import { useCachedChildren } from '@react-aria/collections';
import type { ItemDropTarget } from '@react-types/shared';
import type { ReactNode } from 'react';
import type { Collection, Node } from 'react-stately';

/**
 * Copied from RAC, unexported hook: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Collection.tsx#L148
 *
 * Hook serves as the basis of the root and branch renderers for Collections: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Collection.tsx#L139
 */
export function useCollectionRender(
  collection: Collection<Node<unknown>>,
  parent: Node<unknown> | null,
  renderDropIndicator?: (target: ItemDropTarget) => ReactNode,
) {
  return useCachedChildren({
    items: parent ? collection.getChildren!(parent.key) : collection,
    dependencies: [renderDropIndicator],
    children(node) {
      const rendered = node.render!(node);

      if (!renderDropIndicator || node.type !== 'item') {
        return rendered;
      }

      const { key } = node;
      const keyAfter = collection.getKeyAfter(key);

      return (
        <>
          {renderDropIndicator({ type: 'item', key, dropPosition: 'before' })}
          {rendered}
          {(keyAfter == null ||
            collection.getItem(keyAfter)?.type !== 'item') &&
            renderDropIndicator({ type: 'item', key, dropPosition: 'after' })}
        </>
      );
    },
  });
}
