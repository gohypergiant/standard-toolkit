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
import type {
  TreeItemContentRenderProps as AriaTreeItemContentRenderProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
  RenderProps,
} from 'react-aria-components';
import type { DragAndDropConfig, TreeNode } from '@/hooks/use-tree/types';

/** Visual density variant for Tree components. */
export type TreeStyleVariant = 'cozy' | 'compact' | 'crammed';

/**
 * Props for the Tree component.
 */
export type TreeProps<T> = Omit<
  AriaTreeProps<TreeNode<T>>,
  | 'defaultExpandedKeys'
  | 'defaultSelectedKeys'
  | 'disabledKeys'
  | 'expandedKeys'
  | 'selectedKeys'
  | 'onSelectionChange'
> & {
  disabledKeys?: Set<Key>;
  dragAndDropConfig?: DragAndDropConfig;
  expandedKeys?: Set<Key>;
  selectedKeys?: Set<Key>;
  visibleKeys?: Set<Key>;
  showRuleLines?: boolean;
  showVisibility?: boolean;
  onVisibilityChange?: (keys: Set<Key>) => void;
  onSelectionChange?: (keys: Set<Key>) => void;
  variant?: TreeStyleVariant;
};

/**
 * Props for the TreeItem component.
 */
export type TreeItemProps = Omit<AriaTreeItemProps, 'id'> & {
  /** Unique identifier for the tree item. */
  id: Key;
};

/**
 * Props for the TreeItemContent component.
 */
export type TreeItemContentProps = Pick<
  RenderProps<TreeItemContentRenderProps>,
  'children'
>;

/**
 * Render props passed to TreeItemContent children.
 */
export type TreeItemContentRenderProps = AriaTreeItemContentRenderProps & {
  /** Whether the item is viewable based on ancestor visibility. */
  isViewable?: boolean;
  /** Whether the item is currently visible. */
  isVisible?: boolean;
  /** Visual density variant. */
  variant?: TreeStyleVariant;
};

/**
 * Context value for the Tree component.
 */
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

/**
 * Context value for a TreeItem component.
 */
export type TreeItemContextValue = {
  /** Whether the item is currently visible. */
  isVisible?: boolean;
  /** Whether the item is viewable based on ancestor visibility. */
  isViewable?: boolean;
  /** Array of ancestor item keys. */
  ancestors: Key[];
};
