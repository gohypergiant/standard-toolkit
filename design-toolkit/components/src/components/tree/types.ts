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
  DroppableCollectionDropEvent,
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

export type TreeSelectionType = 'visibility' | 'checkbox' | 'none';

export type TreeItemProps = Omit<AriaTreeItemProps, 'textValue'> & {
  id: Key;
  label: string;
  isParentVisible?: boolean;
  isLastOfSet?: boolean;
};

type VariantProps = Pick<TreeStyleVariants, 'variant' | 'selectionType'>;

export type DragItem = AriaDragItem;

export type DragAndDropConfig = {
  getItems: (key: Set<Key>) => DragItem[];
  onDrop?: (e: DroppableCollectionDropEvent) => void;
  onRootDrop?: (e: DroppableCollectionRootDropEvent) => void;
  onReorder?: (e: DroppableCollectionReorderEvent) => void;
  renderDragPreview?: (items: DragItem[]) => ReactElement;
  renderDropIndicator?: (target: DropTarget) => ReactElement;
};

export type TreeProps<T> = AriaTreeProps<T> &
  VariantProps & {
    dragAndDropConfig?: DragAndDropConfig;
    selectionType?: TreeSelectionType;
    showRuleLines?: boolean;
  };

export type ItemTextProps = AriaTextProps & PropsWithChildren;

export type ItemContentProps = Pick<
  RenderProps<ItemContentRenderProps>,
  'children'
>;

export type ItemContentRenderProps = AriaTreeItemContentRenderProps &
  VariantProps;
