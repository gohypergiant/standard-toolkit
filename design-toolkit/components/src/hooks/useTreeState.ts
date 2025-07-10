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

import { type TreeNode, useTreeData } from '@react-stately/data';
import type { DroppableCollectionReorderEvent, Key } from '@react-types/shared';
import { useCallback, useMemo, useState } from 'react';
import type { Selection } from 'react-aria-components';
import type { DragAndDropConfig } from '../components/tree/types';
import type { UseTreeState, UseTreeStateOptions } from './types';

type TreeMap<T extends object> = Map<
  Key,
  {
    node: TreeNode<T>;
    ancestorKeys: Set<Key>;
    descendantKeys: Set<Key>;
  }
>;

export function useTreeState<T extends object>(
  options: UseTreeStateOptions<T>,
): UseTreeState<T> {
  const {
    initialItems,
    initialSelectedKeys,
    initialExpandedKeys,
    getKey,
    getChildren,
  } = options;

  const tree = useTreeData({
    initialItems,
    initialSelectedKeys,
    getKey,
    getChildren,
  });

  const { items: nodes, setSelectedKeys: setSelected, ...actions } = tree;

  const [expandedKeys, setExpandedKeys] = useState<Selection>(
    new Set(initialExpandedKeys ?? []),
  );

  function setSelectedKeys(keys: Selection) {
    if (keys === 'all') {
      selectAll();
    } else {
      const childKeys = Array.from(keys).reduce((acc, key) => {
        const childKeys = lookup.get(key)?.descendantKeys ?? [];
        for (const child of childKeys) {
          acc.add(child);
        }
        return acc;
      }, new Set<Key>());

      setSelected(new Set([...keys, ...childKeys]));
    }
  }

  const lookup = useMemo(
    () => buildLookup(tree.items, new Map()),
    [tree.items],
  );

  function walkAncestry(
    lookup: TreeMap<T>,
    ancestors: Set<Key>,
    parentKey?: Key | null,
  ) {
    if (parentKey) {
      ancestors.add(parentKey);
      const parent = lookup.get(parentKey)?.node.parentKey;
      if (parent) {
        walkAncestry(lookup, ancestors, parent);
      }
    }
    return ancestors;
  }

  function walkDescendants(
    children: TreeNode<T>[] | null,
    descendants: Set<Key>,
  ) {
    if (children?.length) {
      for (const child of children) {
        descendants.add(child.key);
        if (child.children?.length) {
          walkDescendants(child.children, descendants);
        }
      }
    }
    return descendants;
  }

  function buildLookup(items: TreeNode<T>[], lookup: TreeMap<T>) {
    items.map((item) => {
      lookup.set(item.key, {
        node: item,
        ancestorKeys: walkAncestry(lookup, new Set(), item.parentKey),
        descendantKeys: walkDescendants(item.children, new Set()),
      });
      if (item.children) {
        buildLookup(item.children, lookup);
      }
    });
    return lookup;
  }

  const dragAndDropConfig: DragAndDropConfig = {
    getItems: (keys: Set<Key>) =>
      [...keys].map((key) => ({
        'text/plain': `${key}`,
      })),
    onReorder: (e: DroppableCollectionReorderEvent) => {
      console.log(e);
      if (e.target.dropPosition === 'before') {
        tree.moveBefore(e.target.key, e.keys);
      } else {
        tree.moveBefore(e.target.key, e.keys); // TODO
      }
    },
    onDrop: (e) => {
      console.log(e);
      tree.moveBefore('blue-jay', ['gray-catbird']);
    },
  };

  const hasAncestorSelected = useCallback(
    (key: Key) => {
      const ancestors = lookup.get(key)?.ancestorKeys;
      return Array.from(tree.selectedKeys).some((item) => ancestors?.has(item));
    },
    [lookup, tree.selectedKeys],
  );

  const expandAll = useCallback(() => {
    setExpandedKeys(new Set(lookup.keys()));
  }, [lookup]);

  const collapseAll = useCallback(() => {
    setExpandedKeys(new Set());
  }, []);

  const selectAll = useCallback(() => {
    tree.setSelectedKeys(new Set(lookup.keys()));
  }, [lookup, tree.setSelectedKeys]);

  const unselectAll = useCallback(() => {
    tree.setSelectedKeys(new Set());
  }, [tree.setSelectedKeys]);

  return {
    nodes,
    selectedKeys: tree.selectedKeys,
    expandedKeys,
    hasAncestorSelected,
    dragAndDropConfig,
    actions: {
      expandAll,
      setExpandedKeys,
      setSelectedKeys,
      collapseAll,
      selectAll,
      unselectAll,
      ...actions,
    },
  };
}
