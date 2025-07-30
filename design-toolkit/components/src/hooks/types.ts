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
import type { Selection } from 'react-aria-components';
import type { DragAndDropConfig } from '../components/tree/types';

export type UseTreeStateOptions<T> = {
  /** Initial root items in the tree. If omitted, will return an empty tree. */
  items: TreeNode<T>[];

  /** Keys for the initially selected items. */
  initialSelectedKeys?: Key[];

  /** Keys for the initially expanded items. */
  initialExpandedKeys?: Key[];

  /** Keys for the initially visible items. */
  initialVisibleKeys?: Key[];
};

export type UseTreeState<T extends object> = {
  nodes: TreeNode<T>[];
  selectedKeys: Selection;
  expandedKeys: Set<Key>;
  visibleKeys: Set<Key>;
  dragAndDropConfig: DragAndDropConfig;
  actions: {
    onSelectionChange: (keys: Selection) => void;
    selectAll: () => void;
    unselectAll: () => void;
    onExpandedChange: (keys: Set<Key>) => void;
    expandAll: () => void;
    collapseAll: () => void;
    onVisibilityChange: (keys: Set<Key>) => void;
    revealAll: () => void;
    hideAll: () => void;
  };
};

export type TreeData<T> = TreeNode<T>[];

export type Position = 'before' | 'after' | 'under';

/**
 * The TreeNode is a wrapper that describes the relationship of this node
 * to other nodes in the tree.
 * TreeNode properties describe the metadata - state and position of the node.
 * The item property represents the action tree item data.
 */
export type TreeNodeBase<T> = {
  /** A unique key for the tree node. */
  key: Key;
  /** Label string **/
  label: string;
  values?: T;
  isExpanded?: boolean;
  isSelected?: boolean;
  isVisible?: boolean;
  isViewable?: boolean;
  isReadOnly?: boolean;
};

export type TreeNode<T> = TreeNodeBase<T> & {
  /** The key of the parent node. */
  parentKey?: Key | null;
  /** Children of the tree node. */
  children?: TreeNode<T>[] | null;
};

export type UseTreeActionsOptions<T> = {
  nodes: TreeNode<T>[];
};

/**
 * Set of actions returned from useTreeActions
 * that are a stateless collection of transform functions
 */
export type TreeActions<T> = {
  /**
   * Initializes the tree cache and returns the current tree structure,
   * with complete properties and defaults for TreeNode<T>.
   * Use this to ensure nodes are complete.
   */
  initialize: () => TreeData<T>;

  /**
   * Retrieves a specific tree node by key
   * If not found, throws error
   */
  getTreeNode: (key: Key) => TreeNode<T> | undefined;

  /**
   * Inserts nodes as children of the target node
   */
  insertInto: (target: Key | null, nodes: TreeNode<T>[]) => TreeData<T>;

  /**
   * Inserts nodes before the target node
   */
  insertBefore: (target: Key | null, nodes: TreeNode<T>[]) => TreeData<T>;

  /**
   * Inserts nodes after the target node
   */
  insertAfter: (target: Key | null, nodes: TreeNode<T>[]) => TreeData<T>;

  /**
   * Removes one or more nodes from the tree by their keys.
   * Does nothing if the key is not found.
   */
  remove: (...keys: Key[]) => TreeData<T>;

  /**
   * Updates a specific node using a callback function
   */
  updateNode: (
    key: Key,
    callback: (node: TreeNode<T>) => TreeNode<T>,
  ) => TreeData<T>;

  /**
   * Moves nodes as children of the target node
   */
  moveInto: (target: Key | null, nodes: Set<Key>) => TreeData<T>;

  /**
   * Moves nodes before the target node
   */
  moveBefore: (target: Key | null, nodes: Set<Key>) => TreeData<T>;

  /**
   * Moves nodes after the target node
   */
  moveAfter: (target: Key | null, nodes: Set<Key>) => TreeData<T>;

  /**
   * Gets all currently expanded node keys
   */
  getExpandedKeys: () => Set<Key>;

  /**
   * Updates the expansion state of nodes. If a key is not
   * in the set, it is collapsed.
   */
  onExpandedChange: (keys: Set<Key>) => TreeData<T>;

  /**
   * Expands all nodes in the tree
   */
  expandAll: () => TreeData<T>;

  /**
   * Collapses all nodes in the tree
   */
  collapseAll: () => TreeData<T>;

  /**
   * Gets all currently selected node keys
   */
  getSelectedKeys: () => Set<Key>;

  /**
   * Updates the selection state of nodes. If a key is
   * not in the Set, it is unselected.
   */
  onSelectionChange: (keys: Set<Key>) => TreeData<T>;

  /**
   * Selects all nodes in the tree
   */
  selectAll: () => TreeData<T>;

  /**
   * Unselects all nodes in the tree
   */
  unselectAll: () => TreeData<T>;

  /**
   * Gets all currently visible node keys
   */
  getVisibleKeys: () => Set<Key>;

  /**
   * Changes visibility of nodes. Updates both isVisible and isViewable properties.
   * If a key is not in the Set, it will be hidden.
   */
  onVisibilityChange: (keys: Set<Key>) => TreeData<T>;

  /**
   * Makes all nodes visible in the tree
   */
  revealAll: () => TreeData<T>;

  /**
   * Hides all nodes in the tree
   */
  hideAll: () => TreeData<T>;
};
