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
import { useRef } from 'react';
import type {
  TreeActions,
  TreeData,
  TreeNode,
  TreeNodeBase,
  UseTreeActionsOptions,
} from '../types';
import {
  assert,
  addNodes,
  buildLookup,
  deleteNode,
  getAllNodes,
  getNode,
  getVisibilityChange,
  insert,
  move,
  moveNodes,
  setAllNodes,
  setNode,
  setViewable,
  toTree,
  validateCache,
} from './utils';

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
 * @param nodes
 */
export function useTreeActions<T extends object>({
  nodes,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const isFirstMount = useIsFirstMount();
  const lastBuild = useRef<TreeNode<T>[] | null>(null);

  if (isFirstMount) {
    buildLookup<T>(nodes ?? [], new Map());
    lastBuild.current = toTree();
  }

  validateCache<T>(nodes, lastBuild.current);

  function initialize() {
    return updateAndReturn();
  }

  function getTreeNode(key: Key): TreeNode<T> | undefined {
    const node = getNode<T>(key);

    if (!node) {
      return undefined;
    }

    return node;
  }

  /** REMOVE NODES **/
  function remove(...keys: Key[]) {
    if (keys.length === 0) {
      return lastBuild.current ?? updateAndReturn();
    }
    keys.map((key) => deleteNode(key));
    return updateAndReturn();
  }

  /** UPDATE NODES **/
  /**
   *
   * @param key
   * @param callback
   */
  function updateNode(
    key: Key,
    callback: (node: TreeNodeBase<T>) => TreeNodeBase<T>,
  ) {
    const node = getNode<T>(key);
    const newNode = callback(node);
    setNode<T>(key, newNode);
    return updateAndReturn();
  }

  /** INSERT NODES **/
  function insertInto(target: Key | null, nodes: TreeNode<T>[]) {
    nodes.map((node) => insert(target, node, 0));
    return updateAndReturn();
  }

  function insertBefore(target: Key | null, nodes: TreeNode<T>[]) {
    addNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  function insertAfter(target: Key | null, nodes: TreeNode<T>[]) {
    addNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** MOVE NODES **/
  function moveInto(target: Key | null, nodes: Set<Key>) {
    Array.from(nodes).map((key) => move(target, key, 0));
    return updateAndReturn();
  }

  function moveBefore(target: Key | null, nodes: Set<Key>) {
    moveNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  function moveAfter(target: Key | null, nodes: Set<Key>) {
    moveNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** SELECTION **/
  function getSelectedKeys() {
    return Array.from(getAllNodes()).reduce(
      (acc, node) => (node.isSelected ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onSelectionChange(keys: Set<Key>) {
    for (const key of new Set([...keys, ...getSelectedKeys()])) {
      const node = getNode<T>(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      setNode<T>(node.key, {
        ...node,
        isSelected: keys.has(key),
      });
    }

    return updateAndReturn();
  }

  function selectAll() {
    setAllNodes({ isSelected: true });
    return updateAndReturn();
  }

  function unselectAll() {
    setAllNodes({ isSelected: false });
    return updateAndReturn();
  }

  /** EXPANSION **/
  function getExpandedKeys() {
    return Array.from(getAllNodes()).reduce(
      (acc, node) => (node.isExpanded ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onExpandedChange(keys: Set<Key>): TreeNode<T>[] {
    for (const key of new Set([...keys, ...getExpandedKeys()])) {
      const node = getNode<T>(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      const isExpanded = keys.has(key);

      setNode(node.key, {
        ...node,
        isExpanded,
      });
    }

    return updateAndReturn();
  }

  function expandAll() {
    setAllNodes({ isExpanded: true });
    return updateAndReturn();
  }

  function collapseAll() {
    setAllNodes({ isExpanded: false });
    return updateAndReturn();
  }

  /** VISIBILITY **/
  /**
   * Visible keys are a Set of keys where isVisible is a boolean type
   */
  function getVisibleKeys() {
    return Array.from(getAllNodes()).reduce(
      (acc, node) => (node.isVisible ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  /**
   * Changes isVisible and isViewable node properties.
   * If the key is not in the Set<key>, then it is not visible.
   *
   * @returns TreeNode<T>[]
   * @param keys
   */
  function onVisibilityChange(keys: Set<Key>): TreeData<T> {
    const { key, state } = getVisibilityChange(keys, getVisibleKeys());

    if (key) {
      const node = getNode<T>(key);
      const isVisible = state;

      // update visibility for nodes
      setNode(node.key, {
        ...node,
        isVisible,
        isViewable: isVisible,
      });

      node.children?.map((child) => setViewable(child.key, isVisible));
    }

    return updateAndReturn();
  }

  function revealAll() {
    setAllNodes({ isVisible: true });
    return updateAndReturn();
  }

  function hideAll() {
    setAllNodes({ isVisible: false });
    return updateAndReturn();
  }

  function updateAndReturn() {
    lastBuild.current = toTree();
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
