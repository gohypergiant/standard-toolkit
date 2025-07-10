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

import type { TreeNode as AriaTreeNode, TreeData } from '@react-stately/data';
import type { Key } from '@react-types/shared';
import type { Selection } from 'react-aria-components';
import type { DragAndDropConfig } from '../components/tree/types';

/**
 * The TreeNode is a wrapper that describes the relationship of this node
 * to other nodes in the tree.
 * TreeNode properties describe the metadata - state and position of the node.
 * The item property represents the action tree item data.
 */
export type TreeNode<T extends object> = AriaTreeNode<T>;

export type UseTreeStateOptions<T> = {
  /** Initial root items in the tree. If omitted, will return an empty tree. */
  initialItems: T[];

  /** An accessor function that returns a unique key for an item object. */
  getKey: (item: T) => Key;

  /** An accessor function that returns the children for an item object. */
  getChildren: (item: T) => T[];

  /** Keys for the initially selected items. */
  initialSelectedKeys?: Key[];

  /** Keys for the initially expanded items. */
  initialExpandedKeys?: Key[];
};

export type TreeActions<T extends object> = {
  expandAll: () => void;
  collapseAll: () => void;
  selectAll: () => void;
  unselectAll: () => void;
  setExpandedKeys: (keys: Selection) => void;
  setSelectedKeys: (keys: Selection) => void;
} & Omit<TreeData<T>, 'selectedKeys' | 'setSelectedKeys' | 'items'>;

export type UseTreeState<T extends object> = {
  nodes: TreeNode<T>[];
  selectedKeys: Selection;
  expandedKeys: Selection;
  hasAncestorSelected: (key: Key) => boolean;
  dragAndDropConfig: DragAndDropConfig;
  actions: TreeActions<T>;
};
