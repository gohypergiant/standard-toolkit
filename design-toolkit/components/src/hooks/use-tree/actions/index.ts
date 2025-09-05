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
import { useUpdateEffect } from '@react-aria/utils';
import type { Key } from '@react-types/shared';
import { useRef } from 'react';
import type {
  TreeActions,
  TreeData,
  TreeNode,
  TreeNodeBase,
  UseTreeActionsOptions,
} from '../types';
import { Cache } from './cache';

/**
 * Stateless hook that transforms tree data according to actions
 * it takes in nodes and returns a new version of the tree.
 *
 * Note: each operation returns the whole tree. Future iterations
 * might want to return only the changed portion of the tree.
 *
 * @returns {TreeActions<T>} Object containing all tree manipulation functions
 *
 * @example
 * ```tsx
 * const treeActions = useTreeActions({
 *   nodes: [
 *     {
 *       key: 'root',
 *       label: 'Root',
 *       children: [
 *         { key: 'child1', label: 'Child 1' },
 *         { key: 'child2', label: 'Child 2' }
 *       ]
 *     }
 *   ]
 * });
 *
 * // Use tree actions
 * const updatedTree = treeActions.insertAfter('child1', [
 *   { key: 'newChild', label: 'New Child' }
 * ]);Type T | undefined is not assignable to type T | undefined. Two different types with this name exist, but they are unrelated.
 * ```
 */
export function useTreeActions<T>({
  nodes,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const cache = useRef(new Cache<T>(nodes)).current;

  useUpdateEffect(() => {
    cache.rebuild(nodes);
  }, [nodes]);

  /** GET NODE **/
  function getNode(key: Key) {
    return cache.getNode(key);
  }

  /** INSERT NODES **/
  function insertAfter(
    target: Key | null,
    nodes: TreeNode<T>[],
  ): TreeNode<T>[] {
    cache.addNodes(target, nodes, 'after');

    return cache.toTree(true);
  }

  function insertBefore(
    target: Key | null,
    nodes: TreeNode<T>[],
  ): TreeNode<T>[] {
    cache.addNodes(target, nodes, 'before');

    return cache.toTree(true);
  }

  function insertInto(target: Key | null, nodes: TreeNode<T>[]): TreeNode<T>[] {
    for (const node of nodes) {
      cache.insertNode(target, node, 0);
    }

    return cache.toTree(true);
  }

  /** MOVE NODES **/
  function moveAfter(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
    cache.moveNodes(target, keys, 'after');

    return cache.toTree();
  }

  function moveBefore(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
    cache.moveNodes(target, keys, 'before');

    return cache.toTree();
  }

  function moveInto(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
    for (const key of keys) {
      cache.moveNode(target, key, 0);
    }

    return cache.toTree();
  }

  /** UPDATE NODES **/
  function updateNode(
    key: Key,
    callback: (node: TreeNodeBase<T>) => TreeNodeBase<T>,
  ): TreeNode<T>[] {
    const node = cache.getNode(key);

    cache.setNode(key, callback(node));

    return cache.toTree(true);
  }

  /** REMOVE NODES **/
  function remove(keys: Set<Key>): TreeNode<T>[] {
    for (const key of keys.values()) {
      cache.deleteNode(key);
    }

    return cache.toTree(true);
  }

  /** SELECTION **/
  function onSelectionChange(keys: Set<Key>): TreeNode<T>[] {
    unselectAll();

    for (const key of keys) {
      const node = cache.getNode(key);

      cache.setNode(node.key, {
        ...node,
        isSelected: true,
      });
    }

    return cache.toTree();
  }

  function selectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: true });

    return cache.toTree();
  }

  function unselectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: false });

    return cache.toTree();
  }

  /** EXPANSION **/
  function onExpandedChange(keys: Set<Key>): TreeNode<T>[] {
    collapseAll();

    for (const key of keys) {
      const node = cache.getNode(key);

      cache.setNode(node.key, {
        ...node,
        isExpanded: true,
      });
    }

    return cache.toTree();
  }

  function expandAll(): TreeNode<T>[] {
    cache.setAllNodes({ isExpanded: true });

    return cache.toTree();
  }

  function collapseAll(): TreeNode<T>[] {
    cache.setAllNodes({ isExpanded: false });

    return cache.toTree();
  }

  /** VISIBILITY **/
  function onVisibilityChange(keys: Set<Key>): TreeData<T> {
    hideAll();

    for (const key of keys) {
      const node = cache.getNode(key);
      cache.setNode(node.key, {
        ...node,
        isVisible: true,
      });
    }
    return cache.toTree(true);
  }

  function revealAll(): TreeNode<T>[] {
    cache.setAllNodes({ isVisible: true });

    return cache.toTree(true);
  }

  function hideAll(): TreeNode<T>[] {
    cache.setAllNodes({ isVisible: false });

    return cache.toTree(true);
  }

  return {
    getNode,
    insertAfter,
    insertBefore,
    insertInto,
    moveAfter,
    moveBefore,
    moveInto,
    remove,
    updateNode,

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
  };
}
