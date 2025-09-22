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
'use client';

import 'client-only';
import { useState } from 'react';
import { useTreeActions } from '../actions';
import { processDroppedItems } from './utils';
import type {
  DragItem,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  Key,
  Selection,
} from '@react-types/shared';
import type {
  DragAndDropConfig,
  UseTreeState,
  UseTreeStateOptions,
} from '../types';

export function useTreeState<T>({
  items,
}: UseTreeStateOptions<T>): UseTreeState<T> {
  const [nodes, setNodes] = useState(items);
  const actions = useTreeActions<T>({ nodes });

  const dragAndDropConfig: DragAndDropConfig = {
    getItems: (keys: Set<Key>): DragItem[] =>
      [...keys].map((key) => {
        const node = actions.getNode(key);

        return {
          key: `${key}`,
          'text/plain': JSON.stringify(node),
        };
      }),
    onReorder: (e: DroppableCollectionReorderEvent) => {
      if (e.target.dropPosition === 'before') {
        setNodes(actions.moveBefore(e.target.key, e.keys));
      } else {
        setNodes(actions.moveAfter(e.target.key, e.keys));
      }
    },
    onInsert: ({ items, target }: DroppableCollectionInsertDropEvent) => {
      (async () => {
        const processedItems = await processDroppedItems(
          items,
          dragAndDropConfig.acceptedDragTypes ?? [],
        );

        setNodes(
          actions.remove(new Set(processedItems.map((item) => item.id))),
        );

        if (target.dropPosition === 'before') {
          setNodes(actions.insertBefore(target.key, processedItems));
        } else if (target.dropPosition === 'after') {
          setNodes(actions.insertAfter(target.key, processedItems));
        }
      })();
    },
    onItemDrop: ({ target, items }: DroppableCollectionOnItemDropEvent) => {
      (async () => {
        const targetNode = actions.getNode(target.key);
        const [item] = items;

        if (
          target.dropPosition === 'on' &&
          targetNode &&
          item &&
          item.kind !== 'directory'
        ) {
          const key = await item.getText('key');

          if (key) {
            setNodes(actions.moveInto(target.key, new Set([key])));
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

        setNodes(
          actions.remove(new Set(processedItems.map((item) => item.key))),
        );
        setNodes(actions.insertAfter(null, processedItems));
      })();
    },
  };

  function collapseAll() {
    setNodes(actions.collapseAll());
  }

  function expandAll() {
    setNodes(actions.expandAll());
  }

  function onExpandedChange(keys: Set<Key>) {
    setNodes(actions.onExpandedChange(keys));
  }

  function selectAll() {
    setNodes(actions.selectAll());
  }

  function unselectAll() {
    setNodes(actions.unselectAll());
  }

  function onSelectionChange(keys: Selection) {
    if (keys === 'all') {
      return selectAll();
    }

    setNodes(actions.onSelectionChange(keys));
  }

  function hideAll() {
    setNodes(actions.hideAll());
  }

  function revealAll() {
    setNodes(actions.revealAll());
  }

  function onVisibilityChange(keys: Set<Key>) {
    setNodes(actions.onVisibilityChange(keys));
  }

  return {
    nodes,
    actions: {
      // Expansion
      collapseAll,
      expandAll,
      onExpandedChange,

      // Selection
      selectAll,
      unselectAll,
      onSelectionChange,

      // Visibility
      hideAll,
      revealAll,
      onVisibilityChange,
    },
    dragAndDropConfig,
  };
}
