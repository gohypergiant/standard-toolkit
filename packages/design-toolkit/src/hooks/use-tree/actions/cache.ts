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

/**
 * Internal cache representation of a tree node.
 *
 * Differs from TreeNode by storing only child keys (not full child objects)
 * for efficient cache lookups and memory usage.
 *
 * @template T - The type of data stored in the node.
 */
export type CacheTreeNode<T> = Omit<TreeNode<T>, 'children'> & {
  children?: Key[];
};

/**
 * Performance-optimized cache for tree node operations.
 *
 * Maintains a flat lookup map and roots array for O(1) node access. The cache
 * is a temporary mirror of tree data and must stay synchronized with the source
 * tree structure. If inconsistencies occur, the cache is invalidated and rebuilt.
 *
 * Initializes once on construction with tree data, then updates incrementally
 * with each tree operation (add, move, delete, select).
 *
 * @template T - The type of data stored in tree nodes.
 *
 * @example
 * ```typescript
 * const cache = new Cache<UserData>(initialNodes);
 *
 * // Get a node
 * const node = cache.getNode('node-1');
 *
 * // Update selection
 * cache.cascadeSelection('node-1', true);
 *
 * // Rebuild tree structure
 * const tree = cache.toTree();
 * ```
 */
export class Cache<T> {
  protected cache: { lookup: Map<Key, CacheTreeNode<T>>; roots: Key[] } = {
    lookup: new Map(),
    roots: [],
  };

  /**
   * Creates a new cache instance and populates it with tree nodes.
   *
   * @param nodes - Initial tree nodes to cache (defaults to empty array).
   *
   * @example
   * ```typescript
   * const cache = new Cache(treeData);
   * ```
   */
  constructor(nodes: TreeNode<T>[] = []) {
    this.rebuild(nodes);
  }

  /**
   * Rebuilds the entire cache from tree nodes.
   *
   * Recursively flattens the tree structure into a lookup map and roots array.
   * Initializes all node properties with defaults (isDisabled: false, isExpanded: false, etc.)
   * and converts nested children to key references. After rebuilding, recomputes visibility
   * for all nodes based on ancestor state.
   *
   * Called automatically in the constructor and whenever external tree state changes.
   * This is an expensive operation - prefer incremental cache updates when possible.
   *
   * @param nodes - Tree nodes to build cache from.
   * @param lookup - Internal lookup map (used for recursion, typically omitted).
   * @param parentKey - Parent key for current recursion level (used for recursion, typically omitted).
   *
   * @example
   * ```typescript
   * // Rebuild cache from new tree data
   * cache.rebuild(newTreeNodes);
   * ```
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
        ...(children ? { children: children.map((child) => child.key) } : {}),
      });

      if (node.children) {
        this.rebuild(node.children, lookup, node.key);
      }
    });

    const cache = { lookup, roots: nodes.map((node) => node.key) };

    if (!parentKey) {
      this.cache = cache;
    }

    this.deriveVisibility();
    return cache;
  }

  /**
   * Retrieves a cache node by key.
   *
   * @param key - The node key to retrieve.
   * @returns The cached node.
   * @throws {Error} If key is null/undefined or doesn't exist in cache.
   */
  protected get(key: Key) {
    if (key == null) {
      throw new Error(`Key is ${key} (null/undefined) - this is invalid`);
    }

    const node = this.cache.lookup.get(key);

    if (node === undefined) {
      throw new Error(`Key of ${key} does not exist in tree`);
    }

    return node;
  }

  /**
   * Updates a cache node by key.
   *
   * @param key - The node key to update.
   * @param node - The cache node data to store.
   */
  protected set(key: Key, node: CacheTreeNode<T>) {
    this.cache.lookup.set(key, node);
  }

  /**
   * Removes a node from the cache lookup.
   *
   * @param key - The node key to remove.
   */
  protected delete(key: Key) {
    this.cache.lookup.delete(key);
  }

  /**
   * Adds a child key to a parent's children array at a specific index.
   *
   * @param parentKey - The parent node key.
   * @param childKey - The child node key to add.
   * @param idx - The index position within parent's children.
   */
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

  /**
   * Adds a node key to the roots array at a specific index.
   *
   * @param key - The node key to add to roots.
   * @param idx - The index position within roots array.
   */
  protected addToRoot(key: Key, idx: number) {
    const node = this.get(key);
    const index = Math.max(0, idx);

    this.set(key, {
      ...node,
      parentKey: null,
    });

    this.cache.roots.splice(index, 0, key);
  }

  /**
   * Removes a child key from a parent's children array.
   *
   * @param parentKey - The parent node key.
   * @param childKey - The child node key to remove.
   */
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

  /**
   * Removes a node key from the roots array.
   *
   * @param key - The node key to remove from roots.
   */
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
   * Calculates parent key and index for positioning relative to a target.
   *
   * @param target - The target node key, or null for root level.
   * @param position - Whether positioning before or after target.
   * @returns Object with parentKey and index for insertion.
   */
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

  /**
   * Recursively updates computed visibility for a node and all descendants.
   *
   * @param key - The node key to traverse from.
   */
  protected traverse(key: Key) {
    const node = this.get(key);

    this.cache.lookup.set(key, {
      ...node,
      isVisibleComputed: this.calculateVisibility(key),
    });

    node.children?.map((child) => this.traverse(child));
  }

  /**
   * Calculates if a node is actually visible based on all ancestors' visibility.
   *
   * @param key - The node key to calculate visibility for.
   * @returns True if node and all ancestors have isVisible: true.
   */
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

  /**
   * Recomputes visibility for all nodes in the tree.
   */
  protected deriveVisibility() {
    return this.cache.roots.map((key) => this.traverse(key));
  }

  /**
   * Recursively builds a TreeNode from a cache key.
   *
   * Converts the flat cache representation back into nested TreeNode structure
   * by recursively building child nodes from child keys.
   *
   * @param key - The node key to build from.
   * @returns Complete TreeNode with nested children.
   */
  protected buildNode(key: Key): TreeNode<T> {
    const node = this.get(key);

    const children = (node.children ?? []).reduce(
      (acc: TreeNode<T>[], child) => {
        const childNode = this.cache.lookup.get(child);

        if (childNode && childNode.parentKey === key) {
          acc.push(this.buildNode(child));
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
   * Rebuilds the tree structure from the flattened cache.
   *
   * Converts the internal flat lookup map back into hierarchical TreeNode objects.
   * Optionally recomputes visibility state based on ancestor expansion before building.
   *
   * @param deriveVisible - If true, recomputes visibility for all nodes based on ancestry before building.
   * @returns Array of root TreeNode objects with nested children.
   *
   * @example
   * ```typescript
   * // Build tree with current visibility
   * const tree = cache.toTree();
   *
   * // Build tree and recompute visibility
   * const tree = cache.toTree(true);
   * ```
   */
  toTree(deriveVisible?: boolean): TreeNode<T>[] {
    if (deriveVisible) {
      this.deriveVisibility();
    }
    return this.cache.roots.map((key) => this.buildNode(key));
  }

  /**
   * CACHE FUNCTIONS
   * These are the public functions to manage cache operations. No cache operations should ever be done
   * outside this file since it risks corruption of the data.
   **/

  /**
   * Retrieves a node from cache and builds its full TreeNode representation.
   *
   * Differs from internal `get()` by recursively building child nodes into
   * full TreeNode objects instead of returning just child keys.
   *
   * @param key - The unique key of the node to retrieve.
   * @returns The full TreeNode with nested children.
   * @throws {Error} If key doesn't exist in cache.
   *
   * @example
   * ```typescript
   * const node = cache.getNode('node-1');
   * console.log(node.children); // Full TreeNode objects, not keys
   * ```
   */
  getNode(key: Key): TreeNode<T> {
    const node = this.get(key);

    return {
      ...node,
      children: node.children?.map((key) => this.buildNode(key)),
    };
  }

  /**
   * Returns an iterator of all node keys in the cache.
   *
   * @returns Iterator over all cached node keys.
   *
   * @example
   * ```typescript
   * for (const key of cache.getAllKeys()) {
   *   console.log(key);
   * }
   * ```
   */
  getAllKeys() {
    return this.cache.lookup.keys();
  }

  /**
   * Returns an iterator of all cached nodes.
   *
   * Note: Returns CacheTreeNode objects (with child keys, not full children objects).
   *
   * @returns Iterator over all cached nodes.
   *
   * @example
   * ```typescript
   * for (const node of cache.getAllNodes()) {
   *   if (node.isSelected) {
   *     console.log(node.key);
   *   }
   * }
   * ```
   */
  getAllNodes() {
    return this.cache.lookup.values();
  }

  /**
   * Determines the parent key for inserting a node at a position relative to a target.
   *
   * Used to calculate where a new node should be inserted when positioned
   * 'before' or 'after' a target node.
   *
   * @param target - The target node key to position relative to, or null for root level.
   * @param position - Whether to position before or after the target.
   * @returns The parent key where insertion should occur, or null for root level.
   *
   * @example
   * ```typescript
   * // Find parent for inserting before node-2
   * const parent = cache.getParentForPosition('node-2', 'before');
   * ```
   */
  getParentForPosition(
    target: Key | null,
    position: 'before' | 'after',
  ): Key | null {
    const { parentKey } = this.parentOrSibling(target, position);
    return parentKey;
  }

  /**
   * Updates a node in the cache.
   *
   * Accepts a TreeNode<T>. Automatically converts TreeNode children to keys for
   * internal cache storage.
   *
   * @param key - The unique key of the node to update.
   * @param node - The node data to store.
   *
   * @example
   * ```typescript
   * // Update with TreeNode
   * cache.setNode('node-1', { key: 'node-1', isSelected: true, children: [...] });
   *
   * // Update with CacheTreeNode (child keys)
   * cache.setNode('node-1', { key: 'node-1', isSelected: true, children: ['child-1', 'child-2'] });
   * ```
   */
  setNode(key: Key, node: TreeNode<T>) {
    this.set(key, {
      ...node,
      children: (node.children ?? []).map((child) => child.key),
    });
  }

  /**
   * Updates all nodes in the cache with shared properties.
   *
   * Applies partial updates to every cached node. Useful for bulk operations
   * like clearing all selections or resetting visibility states.
   *
   * Note: `parentKey` and `children` properties are ignored (not applied to nodes).
   *
   * @param props - Partial node properties to apply to all nodes.
   *
   * @example
   * ```typescript
   * // Clear all selections
   * cache.setAllNodes({ isSelected: false, isIndeterminate: false });
   *
   * // Reset visibility
   * cache.setAllNodes({ isVisible: false });
   * ```
   */
  setAllNodes({ parentKey, children, ...rest }: Partial<TreeNode<T>>) {
    for (const node of this.cache.lookup.values()) {
      this.set(node.key, {
        ...node,
        ...rest,
      });
    }
  }

  /**
   * Removes a node and all its descendants from the cache.
   *
   * Recursively deletes the node and all child nodes, then removes
   * the node from its parent's children array (or roots array if top-level).
   * Silently returns if the node doesn't exist.
   *
   * @param key - The unique key of the node to delete.
   *
   * @example
   * ```typescript
   * // Delete node and all its children
   * cache.deleteNode('node-1');
   * ```
   */
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

  /**
   * Inserts multiple nodes at a position relative to a target node.
   *
   * Nodes are inserted in array order at the calculated position. If target is null,
   * nodes are inserted at root level.
   *
   * @param target - The target node key to position relative to, or null for root level.
   * @param nodes - Array of TreeNode objects to insert.
   * @param position - Whether to insert before or after the target.
   *
   * @example
   * ```typescript
   * // Insert nodes before node-2
   * cache.addNodes('node-2', [newNode1, newNode2], 'before');
   *
   * // Insert nodes at end of root level
   * cache.addNodes(null, [newNode], 'after');
   * ```
   */
  addNodes(
    target: Key | null,
    nodes: TreeNode<T>[],
    position: 'before' | 'after',
  ) {
    const { parentKey, index } = this.parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    nodes.map((node, i) => this.insertNode(parentKey, node, idx + i));
  }

  /**
   * Inserts a node and its descendants into the cache at a specific index.
   *
   * Initializes node with default property values (isDisabled: false, isSelected: false, etc.)
   * and recursively inserts all child nodes. Children are converted to key references
   * for internal cache storage.
   *
   * @param parentKey - The parent node key, or null to insert at root level.
   * @param node - The TreeNode to insert (with nested children).
   * @param idx - The index position to insert at within the parent's children.
   *
   * @example
   * ```typescript
   * // Insert as first child of parent-1
   * cache.insertNode('parent-1', newNode, 0);
   *
   * // Insert at root level
   * cache.insertNode(null, newNode, 0);
   * ```
   */
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
            children: children.map((child) => child.key),
          }
        : {}),
    });

    node.children?.map((child, i) => this.insertNode(node.key, child, i));

    parentKey === null
      ? this.addToRoot(node.key, idx)
      : this.addToParent(parentKey, node.key, idx);
  }

  /**
   * Moves multiple nodes to a position relative to a target node.
   *
   * Nodes are moved in Set iteration order to the calculated position.
   * Each node is removed from its current parent and added to the new parent.
   *
   * @param target - The target node key to position relative to, or null for root level.
   * @param nodes - Set of node keys to move.
   * @param position - Whether to position before or after the target.
   *
   * @example
   * ```typescript
   * // Move nodes before node-5
   * cache.moveNodes('node-5', new Set(['node-1', 'node-2']), 'before');
   *
   * // Move to end of root level
   * cache.moveNodes(null, new Set(['node-3']), 'after');
   * ```
   */
  moveNodes(target: Key | null, nodes: Set<Key>, position: 'before' | 'after') {
    const { parentKey, index } = this.parentOrSibling(target, position);
    const idx = index + (position === 'before' ? 0 : 1);

    Array.from(nodes).map((key, i) => this.moveNode(parentKey, key, idx + i));
  }

  /**
   * Moves a single node to a new parent and position.
   *
   * First removes the node from its current parent (or roots), then inserts
   * it at the specified index under the new parent. The node's parentKey is updated.
   *
   * @param parentKey - The new parent node key, or null to move to root level.
   * @param key - The node key to move.
   * @param idx - The index position within the new parent's children.
   *
   * @example
   * ```typescript
   * // Move node-1 to be first child of parent-2
   * cache.moveNode('parent-2', 'node-1', 0);
   *
   * // Move node-1 to root level
   * cache.moveNode(null, 'node-1', 0);
   * ```
   */
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
   * Recursively applies selection state to a node and all its descendants.
   *
   * Disabled nodes are skipped (their selection state is not changed).
   * Indeterminate state is cleared when selection is applied.
   *
   * @param key - The node key to cascade selection from.
   * @param selected - Whether to select (true) or deselect (false).
   *
   * @example
   * ```typescript
   * // Select node and all children
   * cache.cascadeSelection('node-1', true);
   *
   * // Deselect node and all children
   * cache.cascadeSelection('node-1', false);
   * ```
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
   * Propagates selection state changes up through all ancestor nodes.
   *
   * Starting from a node, walks up the ancestor chain and recomputes each
   * parent's selection state based on its children (all selected → selected,
   * some selected → indeterminate, none selected → deselected).
   *
   * Includes early termination: stops walking up when a parent's state doesn't
   * change, since ancestors won't be affected.
   *
   * @param key - The node key to bubble selection from.
   *
   * @example
   * ```typescript
   * // After updating a child's selection, update parents
   * cache.setNode('child-1', { ...node, isSelected: true });
   * cache.bubbleUpSelection('child-1');
   * ```
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
   * Computes selection state for a node based on its children's states.
   *
   * Returns selected if all selectable children are selected, indeterminate if some
   * are selected, and deselected if none are selected. Disabled children are excluded
   * from computation. Leaf nodes use their own selection state.
   *
   * @param node - The node to compute state for.
   * @returns Object with isSelected and isIndeterminate flags.
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
   * Updates selection state for all affected parents after moving nodes.
   *
   * When nodes are moved, both old parents (lost children) and new parent (gained children)
   * may have their selection state invalidated. This method recomputes selection state
   * for all affected parents and bubbles changes up the ancestor chain.
   *
   * @param oldParents - Set of parent keys that lost children during the move.
   * @param newParent - The parent key that gained children, or null if moved to root.
   *
   * @example
   * ```typescript
   * // After moving nodes from parent-1 to parent-2
   * cache.syncParentsAfterMove(new Set(['parent-1']), 'parent-2');
   *
   * // After moving nodes to root level
   * cache.syncParentsAfterMove(new Set(['parent-1']), null);
   * ```
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
