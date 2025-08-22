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
import type { PropsWithChildren } from 'react';
import type {
  TextProps as AriaTextProps,
  TreeItemContentRenderProps as AriaTreeItemContentRenderProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
  RenderProps,
} from 'react-aria-components';
import type { TreeStyleVariants } from './styles';

export type TreeSelectionType = 'visibility' | 'checkbox' | 'none';

export type TreeItemProps = Omit<AriaTreeItemProps, 'textValue'> & {
  id: Key;
  label: string;
  isLastOfSet?: boolean;
};

type VariantProps = Pick<
  TreeStyleVariants,
  'variant' | 'isViewable' | 'isVisible'
>;

export type TreeProps<T> = AriaTreeProps<TreeNode<T>> &
  VariantProps & {
    visibleKeys?: Set<Key>;
    viewableKeys?: Set<Key>;
    onVisibilityChange?: (keys: Set<Key>) => void;
    dragAndDropConfig?: DragAndDropConfig;
    showRuleLines?: boolean;
    showVisibility?: boolean;
  };

export type ItemTextProps = AriaTextProps & PropsWithChildren;

export type ItemContentProps = Pick<
  RenderProps<ItemContentRenderProps>,
  'children'
>;

export type ItemContentRenderProps = AriaTreeItemContentRenderProps &
  VariantProps;
