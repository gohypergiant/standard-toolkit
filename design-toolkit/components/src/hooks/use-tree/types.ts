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

import type {
  DragItem,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  Key,
} from '@react-types/shared';
import type { ReactElement } from 'react';
import type { Selection } from 'react-aria-components';
import type { DropTarget } from 'react-aria-components';

export type DragAndDropConfig = {
  getItems: (key: Set<Key>) => DragItem[];
  /**
   * Handler that is called when external items are dropped on the droppable collection's root.
   */
  onRootDrop?: (e: DroppableCollectionRootDropEvent) => void;
  /**
   * Handler that is called when items are reordered within the collection.
   * This handler only allows dropping between items, not on items.
   * It does not allow moving items to a different parent item within a tree.
   */
  onReorder?: (e: DroppableCollectionReorderEvent) => void;
  /**
   * Handler that is called when items are moved within the source collection.
   * This handler allows dropping both on or between items, and items may be
   * moved to a different parent item within a tree.
   */
  onMove?: (e: DroppableCollectionReorderEvent) => void;
  renderDragPreview?: (items: DragItem[]) => ReactElement;
  renderDropIndicator?: (target: DropTarget) => ReactElement;
  acceptedDragTypes?: string[];
  /**
   * Handler that is called when external items are dropped "between" items.
   */
  onInsert?: (e: DroppableCollectionInsertDropEvent) => void;
  /**
   * Handler that is called when items are dropped "on" an item.
   */
  onItemDrop?: (e: DroppableCollectionOnItemDropEvent) => void;
};

export type UseTreeStateOptions<T> = {
  /** Initial root items in the tree. If omitted, will return an empty tree. */
  items: TreeNode<T>[];
};

export type UseTreeState<T> = {
  nodes: TreeNode<T>[];
  dragAndDropConfig: DragAndDropConfig;
  actions: {
    collapseAll: () => void;
    expandAll: () => void;
    onExpandedChange: (keys: Set<Key>) => void;

    selectAll: () => void;
    unselectAll: () => void;
    onSelectionChange: (keys: Selection) => void;

    hideAll: () => void;
    revealAll: () => void;
    onVisibilityChange: (keys: Set<Key>) => void;
  };
};

export type TreeData<T> = TreeNode<T>[];

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

  /** Application specific values in node **/
  values?: T;

  /** Whether node has interactive capability **/
  isDisabled?: boolean;

  /** Whether node children are rendered **/
  isExpanded?: boolean;

  /** Node selection marker **/
  isSelected?: boolean;

  /** Whether node visibility is marked on or off **/
  isVisible?: boolean;

  /** Computed actual visibility based on ancestors and self visibility **/
  isVisibleComputed?: boolean; //
};

export type TreeNode<T> = TreeNodeBase<T> & {
  /** The key of the parent node. */
  parentKey?: Key | null;

  /** Children of the tree node. */
  children?: TreeNode<T>[];
};

export type UseTreeActionsOptions<T> = {
  nodes: TreeNode<T>[];
};

/**
 * Stateless collection of transform actions to simplify tree operations
 */
export type TreeActions<T> = {
  /**
   * Retrieves a specific tree node by key
   * If not found, throws error
   */
  getNode: (key: Key) => TreeNode<T>;

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
  remove: (keys: Set<Key>) => TreeData<T>;

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
