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
import { useRef } from 'react';
import { Cache } from './cache';
import type { Key } from '@react-types/shared';
import type {
  TreeActions,
  TreeData,
  TreeNode,
  TreeNodeBase,
  UseTreeActionsOptions,
} from '../types';

/**
 * Stateless hook that transforms tree data according to actions
 * it takes in nodes and returns a new version of the tree.
 *
 * Note: each operation returns the whole tree. Future iterations
 * might want to return only the changed portion of the tree.
 *
 * @param options - {@link UseTreeActionsOptions}
 * @param options.nodes - Current tree nodes to operate on.
 * @returns {@link TreeActions} Object containing all tree manipulation functions.
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
 * ]);
 * ```
 */
export function useTreeActions<T>({
  nodes,
  selectionCascade = false,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const cache = useRef(new Cache<T>(nodes)).current;

  /**
   * Collects parent keys for a set of nodes before a move operation
   */
  function getParents(keys: Set<Key>): Set<Key> {
    const prevParents = new Set<Key>();
    for (const key of keys) {
      const node = cache.getNode(key);
      if (node.parentKey) {
        prevParents.add(node.parentKey);
      }
    }
    return prevParents;
  }

  /** CASCADE SELECTION **/

  /**
   * Selection change with cascade logic
   */
  function onSelectionChangeCascade(keys: Set<Key>): TreeNode<T>[] {
    // Detect changes
    const previouslySelected = new Set<Key>();
    for (const k of cache.getAllKeys()) {
      try {
        const node = cache.getNode(k);
        if (node.isSelected) {
          previouslySelected.add(k);
        }
      } catch {
        // Skip invalid keys
      }
    }

    const validKeys = [...keys].filter((k) => k != null);
    const added = validKeys.filter((k) => !previouslySelected.has(k));
    const removed = [...previouslySelected].filter(
      (k) => !validKeys.includes(k),
    );

    // Cascade down
    for (const key of added) {
      cache.cascadeSelection(key, true);
    }

    for (const key of removed) {
      cache.cascadeSelection(key, false);
    }

    // Bubble up
    const affectedKeys = new Set([...added, ...removed]);
    for (const key of affectedKeys) {
      cache.bubbleUpSelection(key);
    }

    return cache.toTree();
  }

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
    if (!selectionCascade) {
      cache.moveNodes(target, keys, 'after');
      return cache.toTree();
    }

    // Collect old parents before move
    const prevParents = getParents(keys);

    // Get new parent before move
    const newParent = cache.getParentForPosition(target, 'after');

    // Perform move
    cache.moveNodes(target, keys, 'after');

    // Sync cascade state
    cache.syncParentsAfterMove(prevParents, newParent);

    return cache.toTree();
  }

  function moveBefore(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
    if (!selectionCascade) {
      cache.moveNodes(target, keys, 'before');
      return cache.toTree();
    }

    // Collect old parents before move
    const prevParents = getParents(keys);

    // Get new parent before move
    const newParent = cache.getParentForPosition(target, 'before');

    // Perform move
    cache.moveNodes(target, keys, 'before');

    // Sync cascade state
    cache.syncParentsAfterMove(prevParents, newParent);

    return cache.toTree();
  }

  function moveInto(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
    if (!selectionCascade) {
      for (const key of keys) {
        cache.moveNode(target, key, 0);
      }
      return cache.toTree();
    }

    // Collect old parents before move
    const prevParents = getParents(keys);

    // Perform move
    for (const key of keys) {
      cache.moveNode(target, key, 0);
    }

    // Sync cascade state (target IS the new parent for moveInto)
    cache.syncParentsAfterMove(prevParents, target);

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
    if (!selectionCascade) {
      // Current behavior (no cascade)
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

    // Cascade behavior
    return onSelectionChangeCascade(keys);
  }

  function selectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: true, isIndeterminate: false });

    return cache.toTree();
  }

  function unselectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: false, isIndeterminate: false });

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
