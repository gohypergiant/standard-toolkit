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

import { type TreeOptions, useTreeData } from '@react-stately/data';
import { useDragAndDrop } from 'react-aria-components';

/**
 * Optional tree state management to provide convenience methods
 * for working with tree data
 *
 * Features:
 * - optimistic rendering
 * - drag and drop operations
 * - filtering and sorting?
 *
 * @param options
 */

type UseTreeOptions<T> = {
  dataAdapter: () => T[]; //adapter function to return data in desired format?
};

export function useTree<T extends object>(options: TreeOptions<T>) {
  // optimistic rendering
  // pass in state and it is externalized here

  const { initialItems, getKey, getChildren } = options;

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        'text/plain': tree.getItem(key)?.value.label,
      })),
    onMove(e) {
      if (e.target.dropPosition === 'before') {
        tree.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === 'after') {
        tree.moveAfter(e.target.key, e.keys);
      } else if (e.target.dropPosition === 'on') {
        // Move items to become children of the target
        const targetNode = tree.getItem(e.target.key);
        if (targetNode) {
          const targetIndex = targetNode.children
            ? targetNode.children.length
            : 0;
          const keyArray = Array.from(e.keys);
          for (let i = 0; i < keyArray.length; i++) {
            tree.move(keyArray[i], e.target.key, targetIndex + i);
          }
        }
      }
    },
  });

  const tree = useTreeData({
    initialItems,
    getKey,
    getChildren,
  });

  return {
    tree,
    dragAndDropHooks,
  };
}
