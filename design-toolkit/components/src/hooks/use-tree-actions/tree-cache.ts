// __private-exports
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
import { isEqual } from 'lodash';
import type { TreeNode } from '../types';

type CacheTreeNode<T> = Omit<TreeNode<T>, 'children'> & {
  children?: Key[];
};

/**
 * This is a cache created only for performance reasons and is considered
 * to be only a temporary mirror of the data. The data is *always* correct
 * cache should be updated according to the data, only. If the data and
 * the cache do not match, the cache is invalidated and rebuilt.
 *
 * This will initialize once on load with data, then
 * updated with each tree operation.
 */
export function treeCache<T>() {
  let cache: { lookup: Map<Key, CacheTreeNode<T>>; roots: Key[] } = {
    lookup: new Map(),
    roots: [],
  };

  /**
   * Validates the cache against incoming tree data
   * If they don't match the cache, rebuild
   *
   * TODO: optimization - invalidate sections, not the whole cache
   */
  function validateCache(
    nodes: TreeNode<T>[],
    lastBuild: TreeNode<T>[] | null,
  ) {
    if (!isEqual(nodes, lastBuild)) {
      buildLookup(nodes, new Map());
    }
  }

  /**
   * Builds a tree structure from cache
   *
   * TODO: optimization - rebuild only from change to root
   * Rebuild only from the changed node up the tree to avoid
   * rebuilding the entire tree
   */
  function toTree(): TreeNode<T>[] {
    return cache.roots.map((key) => buildNode(key));
  }

  /**
   * Recursively creates the cache object from tree data
   *
   * @param nodes
   * @param lookup
   * @param parentKey
   */
  function buildLookup(
    nodes: TreeNode<T>[],
    lookup: Map<Key, CacheTreeNode<T>>,
    parentKey: Key | null = null,
  ) {
    nodes.map((node) => {
      lookup.set(node.key, {
        parentKey,
        isVisible: false,
        isViewable: false,
        isSelected: false,
        isExpanded: false,
        isReadOnly: false,
        ...node,
        children: (node.children ?? []).map((child) => child.key),
      });

      if (node.children) {
        buildLookup(node.children, lookup, node.key);
      }
    });

    cache = { lookup, roots: nodes.map((node) => node.key) };
  }

  /**
   * Recursively builds a TreeNode from a key
   *
   * @param key
   */
  function buildNode(key: Key): TreeNode<T> {
    const node = _getNode(key);

    const children = (node.children ?? []).reduce(
      (acc: TreeNode<T>[], child) => {
        const childNode = cache.lookup.get(child);

        if (childNode && childNode.parentKey === key) {
          acc.push(buildNode(child));
        }

        return acc;
      },
      [],
    );

    return {
      ...node,
      children,
    };
  }

  /**
   * CACHE FUNCTIONS
   * These manage cache operations. No cache operations should ever be done
   * outside this file.
   **/
  function getNode(key: Key): TreeNode<T> {
    const node = _getNode(key);

    return {
      ...node,
      children: node.children?.map((key) => buildNode(key)),
    };
  }

  function getAllNodes() {
    return cache.lookup.values();
  }

  function setNode(key: Key, node: TreeNode<T>) {
    _setNode(key, {
      ...node,
      children: (node.children ?? []).map((child) => child.key),
    });
  }

  function setAllNodes({ parentKey, children, ...rest }: Partial<TreeNode<T>>) {
    for (const node of cache.lookup.values()) {
      _setNode(node.key, {
        ...node,
        ...rest,
      });
    }
  }

  function deleteNode(key: Key) {
    const node = cache.lookup.get(key);

    if (!node) {
      return;
    }

    // remove children
    node.children?.map((key) => deleteNode(key));

    // remove node from previous parent or root
    node.parentKey
      ? _removeFromParent(node.parentKey, key)
      : _removeFromRoot(key);

    // remove the actual node
    _deleteNode(key);
  }

  function addNodes(
    target: Key | null,
    nodes: TreeNode<T>[],
    position: 'before' | 'after',
  ) {
    const { parentKey, index } = _parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    nodes.map((node, i) => insert(parentKey, node, idx + i));
  }

  function insert(parentKey: Key | null, node: TreeNode<T>, idx: number) {
    const { children, ...rest } = node;

    _setNode(node.key, {
      parentKey,
      isVisible: false,
      isViewable: false,
      isSelected: false,
      isExpanded: false,
      isReadOnly: false,
      children: children?.map((child) => child.key),
      ...rest,
    });

    node.children?.map((child, i) => insert(node.key, child, i));

    parentKey === null
      ? _addToRoot(node.key, idx)
      : _addToParent(parentKey, node.key, idx);
  }

  function moveNodes(
    target: Key | null,
    nodes: Set<Key>,
    position: 'before' | 'after',
  ) {
    const { parentKey, index } = _parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    Array.from(nodes).map((key, i) => move(parentKey, key, idx + i));
  }

  function move(parentKey: Key | null, key: Key, idx: number) {
    const node = _getNode(key);

    // remove from previous parent
    node.parentKey
      ? _removeFromParent(node.parentKey, key)
      : _removeFromRoot(key);

    // add as child to new parent or root at position
    parentKey ? _addToParent(parentKey, key, idx) : _addToRoot(key, idx);
  }

  function setViewable(key: Key, state: boolean) {
    const node = cache.lookup.get(key);

    if (node) {
      _setNode(key, {
        ...node,
        isViewable: state,
      });

      node.children?.map((key) => setViewable(key, state));
    }
  }

  // TODO: Has nothing to do with the cache
  function getVisibilityChange(
    current: Set<Key>,
    previous: Set<Key>,
  ): { key: Key | undefined; state: boolean } {
    const removed = previous.difference(current);
    const added = current.difference(previous);

    if (removed.size) {
      return { key: removed.keys().next().value, state: false };
    }

    if (added.size) {
      return { key: added.keys().next().value, state: true };
    }

    return { key: undefined, state: false };
  }

  /** INTERNAL CACHE HELPER FUNCTIONS **/

  function _getNode(key: Key) {
    const node = cache.lookup.get(key);

    if (node === undefined) {
      throw new Error(`Key of ${key} does not exist in tree`);
    }

    return node;
  }

  function _setNode(key: Key, node: CacheTreeNode<T>) {
    cache.lookup.set(key, node);
  }

  function _deleteNode(key: Key) {
    cache.lookup.delete(key);
  }

  function _addToParent(parentKey: Key, childKey: Key, idx: number) {
    const parent = _getNode(parentKey);
    const child = _getNode(childKey);
    const index = Math.max(0, idx);

    _setNode(childKey, {
      ...child,
      parentKey,
    });

    const children = (parent.children ?? []).slice(0);

    children.splice(index, 0, childKey);

    _setNode(parentKey, {
      ...parent,
      children,
    });
  }

  function _addToRoot(key: Key, idx: number) {
    const node = _getNode(key);
    const index = idx < 0 ? 0 : idx;

    _setNode(key, {
      ...node,
      parentKey: null,
    });

    cache.roots.splice(index, 0, key);
  }

  function _removeFromParent(parentKey: Key, childKey: Key) {
    const parent = _getNode(parentKey);
    const child = _getNode(childKey);

    _setNode(childKey, {
      ...child,
      parentKey: null,
    });

    cache.lookup.set(parentKey, {
      ...parent,
      children: parent.children?.filter((key) => key !== childKey),
    });
  }

  function _removeFromRoot(key: Key) {
    const node = _getNode(key);
    const idx = cache.roots.indexOf(key);

    if (idx >= 0) {
      _setNode(key, {
        ...node,
        parentKey: null,
      });

      cache.roots.splice(idx, 1);
    }
  }

  function _parentOrSibling(target: Key | null, position: 'before' | 'after') {
    let index: number;
    let parentKey: Key | null = null;

    if (target === null) {
      index = position === 'before' ? 0 : cache.roots.length;
    } else {
      const targetNode = _getNode(target);

      if (targetNode.parentKey) {
        const parent = _getNode(targetNode.parentKey);

        parentKey = parent.key;
        index = parent.children?.findIndex((key) => key === target) ?? 0;
      } else {
        index = cache.roots.findIndex((rootKey) => rootKey === target);
      }
    }

    return { parentKey, index };
  }

  return {
    addNodes,
    buildLookup,
    deleteNode,
    getAllNodes,
    getNode,
    getVisibilityChange,
    insert,
    move,
    moveNodes,
    setNode,
    setAllNodes,
    setViewable,
    toTree,
    validateCache,
  };
}
