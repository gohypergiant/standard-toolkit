/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
'use client';

import { Cache, type CacheTreeNode } from '@/hooks/use-tree/actions/cache';
import type { Key, Selection } from '@react-types/shared';
import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { useCallback, useMemo } from 'react';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { Tree as AriaTree, type DropTarget } from 'react-aria-components/Tree';
import {
  DropIndicator,
  useDragAndDrop,
} from 'react-aria-components/useDragAndDrop';
import { TreeContext } from './context';
import styles from './styles.module.css';
import type { TreeProps } from './types';
import { noop } from '@accelint/core';

const defaultRenderDropIndicator = (target: DropTarget) => {
  const isBetweenItems =
    target.type === 'item' &&
    (target.dropPosition === 'before' || target.dropPosition === 'after');
  return (
    <DropIndicator
      target={target}
      className={
        isBetweenItems ? styles.dropIndicatorBetween : styles.dropIndicator
      }
    />
  );
};

/**
 * Helper to collect node state keys from cache tree nodes.
 * Reduces cognitive complexity by extracting the iteration logic.
 */
function collectNodeKeys<T>(
  nodes: MapIterator<CacheTreeNode<T>>,
  acc: {
    disabledKeys?: Set<Key>;
    expandedKeys?: Set<Key>;
    selectedKeys?: Set<Key>;
    visibleKeys?: Set<Key>;
    visibilityComputedKeys: Set<Key>;
    indeterminateKeys: Set<Key>;
  },
) {
  for (const node of nodes) {
    if (node.isDisabled) {
      acc.disabledKeys?.add(node.key);
    }
    if (node.isExpanded) {
      acc.expandedKeys?.add(node.key);
    }
    if (node.isSelected) {
      acc.selectedKeys?.add(node.key);
    }
    if (node.isVisible) {
      acc.visibleKeys?.add(node.key);
    }
    if (node.isVisibleComputed) {
      acc.visibilityComputedKeys.add(node.key);
    }
    if (node.isIndeterminate) {
      acc.indeterminateKeys.add(node.key);
    }
  }
  return acc;
}

/**
 * Tree - Hierarchical tree view with selection, visibility, and drag-and-drop
 *
 * Supports static or dynamic collections with keyboard navigation and accessibility.
 *
 * @template T - The type of custom values stored in tree nodes (accessed via `node.values`).
 *
 * @param props - {@link TreeProps}
 * @param props.children - Tree items or render function for dynamic collections.
 * @param props.className - CSS class for the tree container.
 * @param props.disabledKeys - Set of disabled item keys.
 * @param props.dragAndDropConfig - Configuration for drag and drop behavior.
 * @param props.expandedKeys - Set of expanded item keys.
 * @param props.items - Data source for dynamic collections.
 * @param props.selectedKeys - Set of selected item keys.
 * @param props.showRuleLines - Whether to show connecting lines between items.
 * @param props.showVisibility - Whether to show visibility toggle buttons.
 * @param props.selectionMode - Selection mode for the tree.
 * @param props.variant - Visual density variant.
 * @param props.visibleKeys - Set of visible item keys.
 * @param props.onVisibilityChange - Callback when item visibility changes.
 * @param props.onSelectionChange - Callback when selection changes.
 * @returns The rendered Tree component.
 *
 * @example
 * // Dynamic collection
 * ```tsx
 * <Tree items={items} expandedKeys={expandedKeys}>
 *   {(node) => <TreeItem key={node.key}>{node.label}</TreeItem>}
 * </Tree>
 * ```
 *
 * @example
 * ```tsx
 * // Static collection
 * <Tree>
 *   <TreeItem id="one" textValue="one">
 *     <TreeItemContent>One</TreeItemContent>
 *     <TreeItem id="two" textValue="two">
 *       <TreeItemContent>Two</TreeItemContent>
 *     </TreeItem>
 *   </TreeItem>
 * </Tree>
 * ```
 */
export function Tree<T>({
  children,
  className,
  disabledKeys: disabledKeysProp,
  dragAndDropConfig,
  expandedKeys: expandedKeysProp,
  items,
  selectedKeys: selectedKeysProp,
  showRuleLines = true,
  showVisibility = true,
  selectionMode = 'multiple',
  variant = 'cozy',
  visibleKeys: visibleKeysProp,
  onVisibilityChange,
  onSelectionChange,
  ...rest
}: TreeProps<T>) {
  /**
   * A static collection is hard-coded. Dynamic is data-driven from an external source.
   * https://react-spectrum.adobe.com/react-aria/Tree.html#content
   *
   * Controlled state should only be used on a static tree.
   */
  if (
    items &&
    (disabledKeysProp ||
      expandedKeysProp ||
      selectedKeysProp ||
      visibleKeysProp)
  ) {
    throw new Error(
      'Tree should only be controlled with state from either `items` or keys props, not both',
    );
  }

  /**
   * A static tree won't support the node iterator pattern.
   */
  if (!!items !== (typeof children === 'function')) {
    throw new Error(
      'Tree `items` and node iterator `children` must be used together',
    );
  }

  const { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator: defaultRenderDropIndicator,
    getAllowedDropOperations: () => ['move'],
    getDropOperation: () => 'move',
    ...dragAndDropConfig,
  });
  const cache = useMemo(() => (items ? new Cache([...items]) : null), [items]);
  const nodes = useMemo(() => cache?.getAllNodes(), [cache]);
  const {
    disabledKeys,
    expandedKeys,
    selectedKeys,
    visibleKeys,
    visibilityComputedKeys,
    indeterminateKeys,
  } = useMemo(() => {
    const acc = {
      disabledKeys: nodes ? new Set<Key>() : disabledKeysProp,
      expandedKeys: nodes ? new Set<Key>() : expandedKeysProp,
      selectedKeys: nodes ? new Set<Key>() : selectedKeysProp,
      visibleKeys: nodes ? new Set<Key>() : visibleKeysProp,
      visibilityComputedKeys: new Set<Key>(),
      indeterminateKeys: new Set<Key>(),
    };

    if (!nodes) {
      return acc;
    }

    return collectNodeKeys<T>(nodes, acc);
  }, [
    nodes,
    disabledKeysProp,
    expandedKeysProp,
    selectedKeysProp,
    visibleKeysProp,
  ]);

  const handleSelectionChange = useCallback(
    (selection: Selection) => {
      if (selection !== 'all') {
        onSelectionChange?.(selection);
      }
    },
    [onSelectionChange],
  );

  return (
    <TreeContext.Provider
      value={{
        disabledKeys,
        expandedKeys,
        selectedKeys,
        showRuleLines,
        showVisibility,
        variant,
        visibleKeys,
        visibilityComputedKeys,
        indeterminateKeys,
        isStatic: typeof children !== 'function',
        onVisibilityChange: onVisibilityChange ?? noop,
      }}
    >
      <AriaTree
        {...rest}
        className={composeRenderProps(className, (className) =>
          clsx(styles.tree, className),
        )}
        disabledKeys={disabledKeys}
        dragAndDropHooks={dragAndDropHooks}
        expandedKeys={expandedKeys}
        items={items}
        selectedKeys={selectedKeys}
        onSelectionChange={selectedKeys ? handleSelectionChange : undefined}
        selectionMode={selectionMode}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}
