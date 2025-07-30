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

import type {
  DragItem,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  Key,
  Selection,
} from '@react-types/shared';
import { useEffect, useState } from 'react';
import type { DragAndDropConfig } from '../../components/tree/types';
import type { UseTreeState, UseTreeStateOptions } from '../types';
import { useTreeActions } from '../use-tree-actions';
import { processDroppedItems } from './utils';

export function useTreeState<T extends object>(
  options: UseTreeStateOptions<T>,
): UseTreeState<T> {
  const {
    items,
    initialExpandedKeys,
    initialSelectedKeys,
    initialVisibleKeys,
  } = options;
  const [tree, setTree] = useState(items);
  const actions = useTreeActions({ nodes: tree });

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this once
  useEffect(() => {
    initialSelectedKeys?.length &&
      setTree(actions.onSelectionChange(new Set(initialSelectedKeys)));

    initialExpandedKeys?.length &&
      setTree(actions.onExpandedChange(new Set(initialExpandedKeys)));

    initialVisibleKeys?.length &&
      setTree(actions.onVisibilityChange(new Set(initialVisibleKeys)));
  }, []);

  const handleSelection = (keys: Selection) =>
    setTree(actions.onSelectionChange(new Set(keys)));

  const handleExpansion = (keys: Set<Key>) =>
    setTree(actions.onExpandedChange(keys));

  const handleExpandAll = () => setTree(actions.expandAll());

  const handleCollapseAll = () => setTree(actions.collapseAll());

  const handleSelectAll = () => setTree(actions.selectAll());

  const handleUnselectAll = () => setTree(actions.unselectAll());

  const handleVisibility = (keys: Set<Key>) =>
    setTree(actions.onVisibilityChange(keys));

  const handleRevealAll = () => setTree(actions.revealAll());

  const handleHideAll = () => setTree(actions.hideAll());

  const dragAndDropConfig: DragAndDropConfig = {
    getItems: (keys: Set<Key>): DragItem[] =>
      [...keys].map((key) => {
        const node = actions.getTreeNode(key);
        return {
          key: String(key),
          'text/plain': JSON.stringify(node ?? ''),
        };
      }),
    onReorder: (e: DroppableCollectionReorderEvent) => {
      if (e.target.dropPosition === 'before') {
        setTree(actions.moveBefore(e.target.key, e.keys));
      } else {
        setTree(actions.moveAfter(e.target.key, e.keys));
      }
    },
    onInsert: ({ items, target }: DroppableCollectionInsertDropEvent) => {
      (async () => {
        const processedItems = await processDroppedItems(
          items,
          dragAndDropConfig.acceptedDragTypes ?? [],
        );
        setTree(actions.remove(...processedItems.map((item) => item.id)));

        if (target.dropPosition === 'before') {
          setTree(actions.insertBefore(target.key, processedItems));
        } else if (target.dropPosition === 'after') {
          setTree(actions.insertAfter(target.key, processedItems));
        }
      })();
    },
    onItemDrop: ({ target, items }: DroppableCollectionOnItemDropEvent) => {
      (async () => {
        if (target.dropPosition === 'on') {
          // @ts-ignore TODO
          const key = await items[0]?.getText('key');
          if (key) {
            setTree(actions.moveInto(target.key, new Set([key])));
          }
        }
      })();
    },
    onRootDrop: ({ items }: DroppableCollectionRootDropEvent) => {
      (async () => {
        const processedItems = await processDroppedItems(
          items,
          dragAndDropConfig.acceptedDragTypes ?? [],
        );

        setTree(actions.remove(...processedItems.map((item) => item.key)));

        setTree(actions.insertAfter(null, processedItems));
      })();
    },
  };

  return {
    nodes: tree,
    selectedKeys: actions.getSelectedKeys(),
    expandedKeys: actions.getExpandedKeys(),
    visibleKeys: actions.getVisibleKeys(),
    dragAndDropConfig,
    actions: {
      selectAll: handleSelectAll,
      unselectAll: handleUnselectAll,
      expandAll: handleExpandAll,
      collapseAll: handleCollapseAll,
      onExpandedChange: handleExpansion,
      onSelectionChange: handleSelection,
      onVisibilityChange: handleVisibility,
      revealAll: handleRevealAll,
      hideAll: handleHideAll,
    },
  };
}
