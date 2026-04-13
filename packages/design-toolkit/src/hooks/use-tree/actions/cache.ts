// __private-exports
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

import type { Key } from '@react-types/shared';
import type { TreeNode } from '../types';

type CacheTreeNode<T> = Omit<TreeNode<T>, 'children'> & {
  children?: Key[];
  isIndeterminate?: boolean;
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
export class Cache<T> {
  protected cache: { lookup: Map<Key, CacheTreeNode<T>>; roots: Key[] } = {
    lookup: new Map(),
    roots: [],
  };

  constructor(nodes: TreeNode<T>[] = []) {
    this.rebuild(nodes);
  }

  /**
   * Recursively creates the cache object from tree data
   */
  rebuild(
    nodes: TreeNode<T>[],
    lookup: Map<Key, CacheTreeNode<T>> = new Map(),
    parentKey: Key | null = null,
  ) {
    nodes.forEach((node) => {
      const { children, ...rest } = node;

      lookup.set(node.key, {
        isDisabled: false,
        isExpanded: false,
        isSelected: false,
        isVisible: false,
        isVisibleComputed: false,
        isIndeterminate: false,
        ...rest,
        parentKey,
        ...(children
          ? {
              children: children
                .map((child) => child.key)
                .filter((k) => k != null),
            }
          : {}),
      });

      if (node.children) {
        this.rebuild(node.children, lookup, node.key);
      }
    });

    const cache = {
      lookup,
      roots: nodes.map((node) => node.key).filter((key) => key != null),
    };

    if (!parentKey) {
      this.cache = cache;
    }

    this.deriveVisibility();
    return cache;
  }

  protected get(key: Key) {
    if (key == null) {
      console.error('Attempted to get node with null/undefined key');
      console.trace();
      throw new Error(`Key is ${key} (null/undefined) - this is invalid`);
    }

    const node = this.cache.lookup.get(key);

    if (node === undefined) {
      throw new Error(
        `Key of ${key} does not exist in tree. Available keys: ${[...this.cache.lookup.keys()].join(', ')}`,
      );
    }

    return node;
  }

  protected set(key: Key, node: CacheTreeNode<T>) {
    this.cache.lookup.set(key, node);
  }

  protected delete(key: Key) {
    this.cache.lookup.delete(key);
  }

  protected addToParent(parentKey: Key, childKey: Key, idx: number) {
    const parent = this.get(parentKey);
    const child = this.get(childKey);
    const index = Math.max(0, idx);

    this.set(childKey, {
      ...child,
      parentKey,
    });

    const children = (parent.children ?? []).slice(0);

    children.splice(index, 0, childKey);

    this.set(parentKey, {
      ...parent,
      children,
    });
  }

  protected addToRoot(key: Key, idx: number) {
    const node = this.get(key);
    const index = Math.max(0, idx);

    this.set(key, {
      ...node,
      parentKey: null,
    });

    this.cache.roots.splice(index, 0, key);
  }

  protected removeFromParent(parentKey: Key, childKey: Key) {
    const parent = this.get(parentKey);
    const child = this.get(childKey);

    this.set(childKey, {
      ...child,
      parentKey: null,
    });

    this.cache.lookup.set(parentKey, {
      ...parent,
      children: parent.children?.filter((key) => key !== childKey),
    });
  }

  protected removeFromRoot(key: Key) {
    const node = this.get(key);
    const idx = this.cache.roots.indexOf(key);

    if (idx >= 0) {
      this.set(key, {
        ...node,
        parentKey: null,
      });

      this.cache.roots.splice(idx, 1);
    }
  }

  /**
   * Get the parent key for a target position
   */
  getParentForPosition(
    target: Key | null,
    position: 'before' | 'after',
  ): Key | null {
    const { parentKey } = this.parentOrSibling(target, position);
    return parentKey;
  }

  protected parentOrSibling(target: Key | null, position: 'before' | 'after') {
    let index: number;
    let parentKey: Key | null = null;

    if (target === null) {
      index = position === 'before' ? 0 : this.cache.roots.length;
    } else {
      const targetNode = this.get(target);

      if (targetNode.parentKey) {
        const parent = this.get(targetNode.parentKey);

        parentKey = parent.key;
        index = parent.children?.indexOf(target) ?? 0;
      } else {
        index = this.cache.roots.indexOf(target);
      }
    }

    return { parentKey, index };
  }

  protected traverse(key: Key) {
    const node = this.get(key);

    this.cache.lookup.set(key, {
      ...node,
      isVisibleComputed: this.calculateVisibility(key),
    });

    node.children
      ?.filter((child) => child != null)
      .map((child) => this.traverse(child));
  }

  protected calculateVisibility(key: Key) {
    let current = this.get(key);
    const ancestry = [current];

    while (current.parentKey) {
      const parent = this.get(current.parentKey);
      if (parent) {
        ancestry.push(parent);
      }
      current = parent;
    }

    return ancestry.every((n) => n.isVisible);
  }

  protected deriveVisibility() {
    return this.cache.roots
      .filter((key) => key != null)
      .map((key) => this.traverse(key));
  }
  /**
   * Recursively builds a TreeNode from a key
   *
   * @param key
   */
  protected buildNode(key: Key): TreeNode<T> {
    const node = this.get(key);

    const children = (node.children ?? [])
      .filter((child) => child != null)
      .reduce((acc: TreeNode<T>[], child) => {
        const childNode = this.cache.lookup.get(child);

        if (childNode && childNode.parentKey === key) {
          acc.push(this.buildNode(child));
        }

        return acc;
      }, []);

    return {
      ...node,
      children,
    };
  }

  /**
   * Builds a tree structure from cache
   *
   * TODO: optimization - rebuild only from change to root
   * Rebuild only from the changed node up the tree to avoid
   * rebuilding the entire tree
   *
   * @param deriveVisible boolean - if true, will recompute visibility for nodes based on ancestry
   */
  toTree(deriveVisible?: boolean): TreeNode<T>[] {
    if (deriveVisible) {
      this.deriveVisibility();
    }
    return this.cache.roots
      .filter((key) => key != null)
      .map((key) => this.buildNode(key));
  }

  /**
   * CACHE FUNCTIONS
   * These manage cache operations. No cache operations should ever be done
   * outside this file.
   **/
  getNode(key: Key): TreeNode<T> {
    const node = this.get(key);

    return {
      ...node,
      children: node.children?.map((key) => this.buildNode(key)),
    };
  }

  getAllKeys() {
    return this.cache.lookup.keys();
  }

  getAllNodes() {
    return this.cache.lookup.values();
  }

  setNode(key: Key, node: TreeNode<T> | CacheTreeNode<T>) {
    // Check if children are already Keys (from cache.get) or TreeNode objects (from external calls)
    let childKeys: Key[] | undefined;

    if (node.children && node.children.length > 0) {
      const firstChild = node.children[0];
      // If first child is an object with a 'key' property, it's a TreeNode, so extract keys
      if (
        typeof firstChild === 'object' &&
        firstChild != null &&
        'key' in firstChild
      ) {
        childKeys = (node.children as TreeNode<T>[])
          .map((child) => child.key)
          .filter((k) => k != null);
      } else {
        // Already keys
        childKeys = (node.children as Key[]).filter((k) => k != null);
      }
    }

    this.set(key, {
      ...node,
      ...(childKeys !== undefined ? { children: childKeys } : {}),
    } as CacheTreeNode<T>);
  }

  setAllNodes({ parentKey, children, ...rest }: Partial<TreeNode<T>>) {
    for (const node of this.cache.lookup.values()) {
      this.set(node.key, {
        ...node,
        ...rest,
      });
    }
  }

  deleteNode(key: Key) {
    const node = this.cache.lookup.get(key);

    if (!node) {
      return;
    }

    // remove children
    node.children?.map((key) => this.deleteNode(key));

    // remove node from previous parent or root
    node.parentKey
      ? this.removeFromParent(node.parentKey, key)
      : this.removeFromRoot(key);

    // remove the actual node
    this.delete(key);
  }

  addNodes(
    target: Key | null,
    nodes: TreeNode<T>[],
    position: 'before' | 'after',
  ) {
    const { parentKey, index } = this.parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    nodes.map((node, i) => this.insertNode(parentKey, node, idx + i));
  }

  insertNode(parentKey: Key | null, node: TreeNode<T>, idx: number) {
    const { children, ...rest } = node;

    this.set(node.key, {
      isDisabled: false,
      isExpanded: false,
      isSelected: false,
      isVisible: false,
      isVisibleComputed: false,
      isIndeterminate: false,
      ...rest,
      parentKey,
      ...(children
        ? {
            children: children
              .map((child) => child.key)
              .filter((k) => k != null),
          }
        : {}),
    });

    node.children?.map((child, i) => this.insertNode(node.key, child, i));

    parentKey === null
      ? this.addToRoot(node.key, idx)
      : this.addToParent(parentKey, node.key, idx);
  }

  moveNodes(target: Key | null, nodes: Set<Key>, position: 'before' | 'after') {
    const { parentKey, index } = this.parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    Array.from(nodes).map((key, i) => this.moveNode(parentKey, key, idx + i));
  }

  moveNode(parentKey: Key | null, key: Key, idx: number) {
    const node = this.get(key);

    // remove from previous parent
    node.parentKey
      ? this.removeFromParent(node.parentKey, key)
      : this.removeFromRoot(key);

    // add as child to new parent or root at position
    parentKey
      ? this.addToParent(parentKey, key, idx)
      : this.addToRoot(key, idx);
  }

  /**
   * Cascade selection down through descendants
   */
  cascadeSelection(key: Key, selected: boolean): void {
    try {
      const node = this.get(key);

      // Update this node (skip if disabled)
      if (!node.isDisabled) {
        this.set(key, {
          ...node,
          isSelected: selected,
          isIndeterminate: false,
        });
      }

      // Recurse to children
      if (node.children) {
        for (const childKey of node.children) {
          if (childKey != null) {
            this.cascadeSelection(childKey, selected);
          }
        }
      }
    } catch {
      // Key doesn't exist, skip
      return;
    }
  }

  /**
   * Bubble up selection state through ancestors
   */
  bubbleUpSelection(key: Key): void {
    try {
      let current = this.get(key);

      while (current.parentKey) {
        const parent = this.get(current.parentKey);
        const newState = this.computeSelectionState(parent);

        // Early termination: if parent state unchanged, ancestors won't change
        if (
          parent.isSelected === newState.isSelected &&
          parent.isIndeterminate === newState.isIndeterminate
        ) {
          break;
        }

        // Update parent
        this.set(parent.key, {
          ...parent,
          isSelected: newState.isSelected,
          isIndeterminate: newState.isIndeterminate,
        });

        current = parent;
      }
    } catch {
      // Key doesn't exist, skip
      return;
    }
  }

  /**
   * Compute selection state for a node based on its children
   */
  private computeSelectionState(node: CacheTreeNode<T>): {
    isSelected: boolean;
    isIndeterminate: boolean;
  } {
    // Leaf nodes: use their own state
    if (!node.children || node.children.length === 0) {
      return {
        isSelected: node.isSelected ?? false,
        isIndeterminate: false,
      };
    }

    // Get selectable children (exclude disabled)
    const selectableChildren = node.children
      .filter((k) => {
        try {
          const child = this.get(k);
          return !child.isDisabled;
        } catch {
          return false;
        }
      })
      .map((k) => this.get(k));

    // If all children disabled, treat as leaf
    if (selectableChildren.length === 0) {
      return {
        isSelected: node.isSelected ?? false,
        isIndeterminate: false,
      };
    }

    // Check if all/none/some selected
    const selectedCount = selectableChildren.filter((c) => c.isSelected).length;
    const indeterminateCount = selectableChildren.filter(
      (c) => c.isIndeterminate,
    ).length;

    // If any child is indeterminate, parent is indeterminate
    if (indeterminateCount > 0) {
      return {
        isSelected: false,
        isIndeterminate: true,
      };
    }

    // All children selected
    if (selectedCount === selectableChildren.length) {
      return {
        isSelected: true,
        isIndeterminate: false,
      };
    }

    // No children selected
    if (selectedCount === 0) {
      return {
        isSelected: false,
        isIndeterminate: false,
      };
    }

    // Some children selected (indeterminate)
    return {
      isSelected: false,
      isIndeterminate: true,
    };
  }

  /**
   * Sync cascade state for parents after a move operation
   */
  syncParentsAfterMove(oldParents: Set<Key>, newParent: Key | null): void {
    // Update old parents (lost children)
    for (const parentKey of oldParents) {
      try {
        const parent = this.get(parentKey);
        const newState = this.computeSelectionState(parent);

        this.set(parentKey, {
          ...parent,
          isSelected: newState.isSelected,
          isIndeterminate: newState.isIndeterminate,
        });

        // Bubble up to ancestors
        if (parent.parentKey) {
          this.bubbleUpSelection(parentKey);
        }
      } catch {
        // Parent doesn't exist, skip
      }
    }

    // Update new parent (gained children)
    if (newParent) {
      try {
        const parent = this.get(newParent);
        const newState = this.computeSelectionState(parent);

        this.set(newParent, {
          ...parent,
          isSelected: newState.isSelected,
          isIndeterminate: newState.isIndeterminate,
        });

        // Bubble up to ancestors
        if (parent.parentKey) {
          this.bubbleUpSelection(newParent);
        }
      } catch {
        // Parent doesn't exist, skip
      }
    }
  }
}
