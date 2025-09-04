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

import type { DragAndDropConfig, TreeNode } from '@/hooks/use-tree/types';
import type { Key } from '@react-types/shared';
import type {
  TreeItemContentRenderProps as AriaTreeItemContentRenderProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
  RenderProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { TreeStyles } from './styles';

export type TreeProps<T> = Omit<
  AriaTreeProps<TreeNode<T>>,
  | 'defaultExpandedKeys'
  | 'defaultSelectedKeys'
  | 'disabledKeys'
  | 'expandedKeys'
  | 'selectedKeys'
  | 'onSelectionChange'
> &
  VariantProps<typeof TreeStyles> & {
    disabledKeys?: Set<Key>;
    dragAndDropConfig?: DragAndDropConfig;
    expandedKeys?: Set<Key>;
    selectedKeys?: Set<Key>;
    visibleKeys?: Set<Key>;
    showRuleLines?: boolean;
    showVisibility?: boolean;
    onVisibilityChange?: (keys: Set<Key>) => void;
    onSelectionChange?: (keys: Set<Key>) => void;
  };

export type TreeItemProps = Omit<AriaTreeItemProps, 'id'> & {
  id: Key;
};

export type TreeItemContentProps = Pick<
  RenderProps<TreeItemContentRenderProps>,
  'children'
>;

export type TreeItemContentRenderProps = AriaTreeItemContentRenderProps &
  VariantProps<typeof TreeStyles> & {
    isViewable?: boolean;
    isVisible?: boolean;
  };

export type TreeContextValue = Required<
  Pick<
    TreeProps<unknown>,
    'showRuleLines' | 'showVisibility' | 'variant' | 'onVisibilityChange'
  >
> & {
  disabledKeys?: Set<Key>;
  expandedKeys?: Set<Key>;
  selectedKeys?: Set<Key>;
  visibleKeys?: Set<Key>;
  visibilityComputedKeys?: Set<Key>;
  isStatic: boolean;
};

export type TreeItemContextValue = {
  isVisible?: boolean;
  isViewable?: boolean;
  ancestors: Key[];
};
