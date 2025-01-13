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

import { useCachedChildren } from '@react-aria/collections';
import type { Collection, ItemDropTarget, Node } from '@react-types/shared';
import type { ReactNode } from 'react';

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
    // biome-ignore lint/style/noNonNullAssertion: intentional
    items: parent ? collection.getChildren!(parent.key) : collection,
    dependencies: [renderDropIndicator],
    children(node) {
      // biome-ignore lint/style/noNonNullAssertion: intentional
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
