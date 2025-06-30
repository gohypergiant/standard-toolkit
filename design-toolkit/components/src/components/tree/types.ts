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
  DragItem as AriaDragItem,
  DroppableCollectionDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  Key,
} from '@react-types/shared';
import type { VariantProps } from 'cva';
import type { ReactElement, ReactNode } from 'react';
import type {
  DropTarget,
  TreeItemProps as RACTreeItemProps,
  TreeProps as RACTreeProps,
} from 'react-aria-components';
import type { treeStyles } from './index';

export type TreeSelectionType = 'visibility' | 'checkbox' | 'none';

type BaseItemProps = {
  id: Key;
  label: string;
  description?: string;
  iconPrefix?: ReactNode;
  treeActions?: (renderProps: TreeActionRenderProps) => ReactNode;
  nodes?: TreeItem[];
  isReadOnly?: boolean;
  isParentVisible?: boolean;
  isLastOfSet?: boolean;
};

export type TreeItem = BaseItemProps & {
  isExpanded?: boolean;
  isSelected?: boolean;
  nodes?: TreeItem[];
};

export type TreeItemProps = Omit<RACTreeItemProps, 'textValue' | 'children'> &
  BaseItemProps & {
    iconPrefix?: ReactNode;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
  };

export type TreeNodeProps = BaseItemProps;

export type TreeActionRenderProps = {
  variant?: 'cozy' | 'compact' | 'tight' | null;
  selectionType?: TreeSelectionType;
};

export type DragItem = AriaDragItem;

export type DragAndDropConfig = {
  getItems: (key: Set<Key>) => DragItem[];
  onDrop?: (e: DroppableCollectionDropEvent) => void;
  onRootDrop?: (e: DroppableCollectionRootDropEvent) => void;
  onReorder?: (e: DroppableCollectionReorderEvent) => void;
  renderDragPreview?: (items: DragItem[]) => ReactElement;
  renderDropIndicator?: (target: DropTarget) => ReactElement;
};

export type TreeProps<T extends TreeItem = TreeItem> = RACTreeProps<T> &
  VariantProps<typeof treeStyles> & {
    dragAndDropConfig?: DragAndDropConfig;
    selectionType?: TreeSelectionType;
    showRuleLines?: boolean;
  };
