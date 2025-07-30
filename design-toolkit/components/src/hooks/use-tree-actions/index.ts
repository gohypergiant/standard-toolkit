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

import type { Key } from '@react-types/shared';
import { useMemo, useRef } from 'react';
import type {
  TreeActions,
  TreeData,
  TreeNode,
  TreeNodeBase,
  UseTreeActionsOptions,
} from '../types';
import { treeCache } from './treeCache';

/**
 * Hook that tracks whether this is the first mount of the component
 * @returns {boolean} True if this is the first mount, false otherwise
 */
function useIsFirstMount(): boolean {
  const isFirst = useRef(true);
  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }
  return isFirst.current;
}

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
 * ]);
 * ```
 */
export function useTreeActions<T extends object>({
  nodes,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const isFirstMount = useIsFirstMount();
  const lastBuild = useRef<TreeNode<T>[] | null>(null);

  const cache = useMemo(() => treeCache(), []);

  if (isFirstMount) {
    cache.buildLookup<T>(nodes ?? [], new Map());
    lastBuild.current = cache.toTree();
  }

  cache.validateCache<T>(nodes, lastBuild.current);

  function initialize(): TreeNode<T>[] {
    return updateAndReturn();
  }

  function getTreeNode(key: Key): TreeNode<T> | undefined {
    const node = cache.getNode<T>(key);

    if (!node) {
      return undefined;
    }

    return node;
  }

  /** REMOVE NODES **/
  function remove(...keys: Key[]): TreeNode<T>[] {
    if (keys.length === 0) {
      return lastBuild.current ?? updateAndReturn();
    }
    keys.map((key) => cache.deleteNode(key));
    return updateAndReturn();
  }

  /** UPDATE NODES **/
  function updateNode(
    key: Key,
    callback: (node: TreeNodeBase<T>) => TreeNodeBase<T>,
  ): TreeNode<T>[] {
    const node = cache.getNode<T>(key);
    const newNode = callback(node);
    cache.setNode<T>(key, newNode);
    return updateAndReturn();
  }

  /** INSERT NODES **/
  function insertInto(target: Key | null, nodes: TreeNode<T>[]): TreeNode<T>[] {
    nodes.map((node) => cache.insert(target, node, 0));
    return updateAndReturn();
  }

  function insertBefore(
    target: Key | null,
    nodes: TreeNode<T>[],
  ): TreeNode<T>[] {
    cache.addNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  function insertAfter(
    target: Key | null,
    nodes: TreeNode<T>[],
  ): TreeNode<T>[] {
    cache.addNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** MOVE NODES **/
  function moveInto(target: Key | null, nodes: Set<Key>): TreeNode<T>[] {
    Array.from(nodes).map((key) => cache.move(target, key, 0));
    return updateAndReturn();
  }

  function moveBefore(target: Key | null, nodes: Set<Key>): TreeNode<T>[] {
    cache.moveNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  function moveAfter(target: Key | null, nodes: Set<Key>): TreeNode<T>[] {
    cache.moveNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** SELECTION **/
  function getSelectedKeys(): Set<Key> {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isSelected ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onSelectionChange(keys: Set<Key>): TreeNode<T>[] {
    for (const key of new Set([...keys, ...getSelectedKeys()])) {
      const node = cache.getNode<T>(key);
      cache.setNode<T>(node.key, {
        ...node,
        isSelected: keys.has(key),
      });
    }

    return updateAndReturn();
  }

  function selectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: true });
    return updateAndReturn();
  }

  function unselectAll(): TreeNode<T>[] {
    cache.setAllNodes({ isSelected: false });
    return updateAndReturn();
  }

  /** EXPANSION **/
  function getExpandedKeys(): Set<Key> {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isExpanded ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onExpandedChange(keys: Set<Key>): TreeNode<T>[] {
    for (const key of new Set([...keys, ...getExpandedKeys()])) {
      const node = cache.getNode<T>(key);
      const isExpanded = keys.has(key);
      cache.setNode(node.key, {
        ...node,
        isExpanded,
      });
    }
    return updateAndReturn();
  }

  function expandAll(): TreeNode<T>[] {
    cache.setAllNodes({ isExpanded: true });
    return updateAndReturn();
  }

  function collapseAll(): TreeNode<T>[] {
    cache.setAllNodes({ isExpanded: false });
    return updateAndReturn();
  }

  /** VISIBILITY **/
  function getVisibleKeys(): Set<Key> {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isVisible ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onVisibilityChange(keys: Set<Key>): TreeData<T> {
    const { key, state } = cache.getVisibilityChange(keys, getVisibleKeys());

    if (key) {
      const node = cache.getNode<T>(key);
      const isVisible = state;

      // update visibility for nodes
      cache.setNode(node.key, {
        ...node,
        isVisible,
        isViewable: isVisible,
      });

      node.children?.map((child) => cache.setViewable(child.key, isVisible));
    }

    return updateAndReturn();
  }

  function revealAll(): TreeNode<T>[] {
    cache.setAllNodes({ isVisible: true });
    return updateAndReturn();
  }

  function hideAll(): TreeNode<T>[] {
    cache.setAllNodes({ isVisible: false });
    return updateAndReturn();
  }

  /**
   * Internal function to update the last build reference and return the current tree
   * @returns {TreeNode<T>[]} The current tree structure
   */
  function updateAndReturn(): TreeNode<T>[] {
    lastBuild.current = cache.toTree();
    return lastBuild.current;
  }

  return {
    initialize,
    getTreeNode,
    insertInto,
    insertAfter,
    insertBefore,
    remove,
    updateNode,
    moveAfter,
    moveBefore,
    moveInto,
    getSelectedKeys,
    onSelectionChange,
    selectAll,
    unselectAll,
    getExpandedKeys,
    onExpandedChange,
    expandAll,
    collapseAll,
    getVisibleKeys,
    onVisibilityChange,
    revealAll,
    hideAll,
  };
}
