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

import type { TreeStyleVariants } from '@/components/tree/styles';
import type {
  DragItem as AriaDragItem,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  Key,
} from '@react-types/shared';
import type { PropsWithChildren, ReactElement } from 'react';
import type {
  TextProps as AriaTextProps,
  TreeItemContentRenderProps as AriaTreeItemContentRenderProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
  DropTarget,
  RenderProps,
} from 'react-aria-components';
import type { TreeNode } from '../../hooks/types';

export type TreeSelectionType = 'visibility' | 'checkbox' | 'none';

export type TreeItemProps = Omit<AriaTreeItemProps, 'textValue'> & {
  id: Key;
  label: string;
  isLastOfSet?: boolean;
};

type VariantProps = Pick<TreeStyleVariants, 'variant'>;

export type DragItem = AriaDragItem;

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

export type TreeProps<T> = AriaTreeProps<TreeNode<T>> &
  VariantProps & {
    visibleKeys?: Set<Key>;
    viewableKeys?: Set<Key>;
    onVisibilityChange?: (keys: Set<Key>) => void;
    dragAndDropConfig?: DragAndDropConfig;
    showRuleLines?: boolean;
  };

export type ItemTextProps = AriaTextProps & PropsWithChildren;

export type ItemContentProps = Pick<
  RenderProps<ItemContentRenderProps>,
  'children'
>;

export type ItemContentRenderProps = AriaTreeItemContentRenderProps &
  VariantProps;
