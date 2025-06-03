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

import type { DragTarget, ItemInstance, SetStateFn } from '@headless-tree/core';
import type { ReactNode } from 'react';

export type TreeVariants = 'cozy' | 'compact' | 'tight';

export type TreeSelectionMode = 'visibility' | 'checkbox' | 'none';

export type TreeItemRenderProps<T> = {
  variant: TreeVariants;
  item: ItemInstance<T>;
};

export interface TreeProps<T extends TreeNode> {
  items: Record<string, T>;
  children: ReactNode | ((renderProps: TreeItemRenderProps<T>) => ReactNode);
  variant?: TreeVariants;
  selected?: string[];
  expanded?: string[];
  setSelected?: SetStateFn<string[]>;
  setExpanded?: SetStateFn<string[]>;
  onDrop?: (
    items: ItemInstance<T>[],
    target: DragTarget<T>,
  ) => void | Promise<void>;
  selectionMode?: TreeSelectionMode;
  allowsDragging?: boolean;
  showRuleLines?: boolean;
}

export interface TreeContextType {
  variant: TreeVariants;
  selectionMode?: TreeSelectionMode;
  allowsDragging: boolean;
  showRuleLines: boolean;
}

export type TreeNode = {
  key: string;
  label: string;
  description?: string;
  iconPrefix?: ReactNode;
  childNodes?: string[];
  isDisabled?: boolean;
  isExpanded?: boolean;
  isReadOnly?: boolean;
  isSelected?: boolean;
};
