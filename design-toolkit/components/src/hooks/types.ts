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

  /** An accessor function that returns a unique key for an item object. */
  getKey?: (item: T) => Key;

  /** An accessor function that returns the children for an item object. */
  getChildren?: (item: T) => T[];

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
  };
};

export type TreeMap<T extends object> = Map<Key, TreeNode<T>>;

export type TreeData<T> = TreeNode<T>[];

export type TreeRef<T extends object> = {
  lookup: TreeMap<T>;
  roots: Key[];
};

/**
 * The TreeNode is a wrapper that describes the relationship of this node
 * to other nodes in the tree.
 * TreeNode properties describe the metadata - state and position of the node.
 * The item property represents the action tree item data.
 */
export type TreeNode<T> = {
  /** A unique key for the tree node. */
  key: Key;
  /** Label string **/
  label: string;
  /** The key of the parent node. */
  parentKey?: Key | null;
  /** Children of the tree node. */
  children?: TreeNode<T>[] | null;
  values?: T;
  isExpanded?: boolean;
  isSelected?: boolean;
  isVisible?: boolean;
  isViewable?: boolean;
  isReadOnly?: boolean;
};

export type UseTreeActionsOptions<T> = {
  nodes: TreeNode<T>[];
};

/**
 * Set of actions returned from useTreeActions
 * that are a stateless collection of transform functions
 *
 * You pass in your data from the database ish (see data format)
 * and it returns to you tree nodes that you can update your
 * database with and also pipe into the tree view?
 *
 */
export type TreeActions<T> = {
  getTreeNode: (key: Key) => TreeNode<T> | undefined;
  // inserting
  insertBefore: (target: Key | null, ...items: TreeNode<T>[]) => TreeData<T>;
  insertAfter: (target: Key | null, ...items: TreeNode<T>[]) => TreeData<T>;

  // removing
  remove: (...keys: Key[]) => TreeData<T>;

  // update
  update: (key: Key, patch: Partial<TreeNode<T>>) => TreeData<T>;

  // moving
  moveAfter: (target: Key | null, items: Set<Key>) => TreeData<T>;
  moveBefore: (target: Key | null, items: Set<Key>) => TreeData<T>;
  moveInto: (target: Key | null, items: Set<Key>) => TreeData<T>;

  // expansion
  getExpandedKeys: () => Set<Key>;
  onExpandedChange: (keys: Set<Key>) => TreeData<T>;
  expandAll: () => TreeData<T>;
  collapseAll: () => TreeData<T>;

  // selection
  getSelectedKeys: () => Set<Key>;
  onSelectionChange: (keys: Set<Key>) => TreeData<T>;
  selectAll: () => TreeData<T>;
  unselectAll: () => TreeData<T>;

  // visibility
  getVisibleKeys: () => Set<Key>;
  onVisibilityChange: (keys: Set<Key>) => TreeData<T>;
  revealAll: () => TreeData<T>;
  hideAll: () => TreeData<T>;
};
