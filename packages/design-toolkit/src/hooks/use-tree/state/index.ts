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
'use client';

import 'client-only';
import { useState } from 'react';
import { useTreeActions } from '../actions';
import { processDroppedItems } from './utils';
import type {
  DragItem,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionRootDropEvent,
  Key,
  Selection,
} from '@react-types/shared';
import type {
  DragAndDropConfig,
  UseTreeState,
  UseTreeStateOptions,
} from '../types';

/**
 * Stateful tree manager with drag-and-drop, selection, expansion, and visibility controls.
 *
 * Manages tree state internally using React hooks. Returns tree nodes, manipulation actions,
 * and drag-and-drop configuration. Use this hook when you need a complete tree solution with
 * built-in state management. For stateless transformations, use {@link useTreeActions} instead.
 *
 * @template T - The type of custom values stored in tree nodes (accessed via `node.values`).
 *
 * @param options - Configuration options for the tree state.
 * @param options.items - Initial tree node items to populate the tree.
 * @param options.selectionCascade - Enable cascade selection mode. When true, selecting a parent
 *   automatically selects all descendants, and parent checkboxes show indeterminate state when
 *   partially selected. Useful for file system or hierarchical permission UIs. Default: false.
 * @returns Tree state object containing current nodes, manipulation actions, and drag-and-drop configuration.
 *
 * @example
 * ```tsx
 * // Basic tree without cascade
 * const { nodes, actions, dragAndDropConfig } = useTreeState({
 *   items: myTree,
 * });
 *
 * // Tree with cascade selection (file system-like behavior)
 * const { nodes, actions } = useTreeState({
 *   items: fileSystemTree,
 *   selectionCascade: true,
 * });
 *
 * // Using actions to manipulate tree
 * actions.expandAll(); // Expand all nodes
 * actions.onSelectionChange(new Set(['node-1', 'node-2'])); // Select specific nodes
 * ```
 */
export function useTreeState<T>({
  items,
  selectionCascade = false,
}: UseTreeStateOptions<T>): UseTreeState<T> {
  const [nodes, setNodes] = useState(items);
  const actions = useTreeActions<T>({ nodes, selectionCascade });

  const dragAndDropConfig: DragAndDropConfig = {
    getItems: (keys: Set<Key>): DragItem[] =>
      [...keys].map((key) => {
        const node = actions.getNode(key);

        return {
          key: `${key}`,
          'text/plain': JSON.stringify(node),
        };
      }),
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
    onMove: (e) => {
      if (e.target.dropPosition === 'before') {
        setNodes(actions.moveBefore(e.target.key, e.keys));
      } else if (e.target.dropPosition === 'after') {
        setNodes(actions.moveAfter(e.target.key, e.keys));
      } else if (e.target.dropPosition === 'on') {
        const targetNode = actions.getNode(e.target.key);
        if (targetNode) {
          setNodes(actions.moveInto(e.target.key, e.keys));
        }
      }
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
