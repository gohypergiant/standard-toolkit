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
'use client';

import { Cache } from '@/hooks/use-tree/actions/cache';
import type { Key, Selection } from '@react-types/shared';
import 'client-only';
import { useMemo } from 'react';
import {
  Tree as AriaTree,
  composeRenderProps,
  DropIndicator,
  type DropTarget,
  useDragAndDrop,
} from 'react-aria-components';
import { TreeContext } from './context';
import { TreeStyles, TreeStylesDefaults } from './styles';
import type { TreeProps } from './types';

const { tree } = TreeStyles();

const defaultRenderDropIndicator = (target: DropTarget) => (
  <DropIndicator target={target} className='border border-highlight-hover' />
);

/**
 * Tree - Hierarchical tree view with optional drag-and-drop and visibility
 *
 * Renders a selectable tree with support for nested items, drag-and-drop,
 * selection modes, and visibility controls. Use TreeItem to define nodes.
 *
 * @example
 * <Tree items={items} expandedKeys={expandedKeys}>
 *   {(node) => <Node key={node.key} node={node} />}
 * </Tree>
 *
 * @example
 * <Tree>
 *   <TreeItem id='one' textValue='one'>
 *     <TreeItemContent>One</TreeItemContent>
 *     <TreeItem id='two' textValue='two'>
 *       <TreeItemContent>Two</TreeItemContent>
 *     </TreeItem>
 *   </TreeItem>
 * </Tree>
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
  variant = TreeStylesDefaults.variant,
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
  } = useMemo(() => {
    const acc = {
      disabledKeys: nodes ? new Set<Key>() : disabledKeysProp,
      expandedKeys: nodes ? new Set<Key>() : expandedKeysProp,
      selectedKeys: nodes ? new Set<Key>() : selectedKeysProp,
      visibleKeys: nodes ? new Set<Key>() : visibleKeysProp,
      visibilityComputedKeys: new Set<Key>(),
    };

    if (!nodes) {
      return acc;
    }

    return nodes.reduce(
      (
        acc,
        {
          key,
          isDisabled,
          isExpanded,
          isSelected,
          isVisible,
          isVisibleComputed,
        },
      ) => {
        if (isDisabled) {
          acc.disabledKeys?.add(key);
        }
        if (isExpanded) {
          acc.expandedKeys?.add(key);
        }
        if (isSelected) {
          acc.selectedKeys?.add(key);
        }
        if (isVisible) {
          acc.visibleKeys?.add(key);
        }
        if (isVisibleComputed) {
          acc.visibilityComputedKeys.add(key);
        }
        return acc;
      },
      acc,
    );
  }, [
    nodes,
    disabledKeysProp,
    expandedKeysProp,
    selectedKeysProp,
    visibleKeysProp,
  ]);

  const handleSelectionChange = selectedKeys
    ? (selection: Selection) => {
        if (selection !== 'all') {
          onSelectionChange?.(selection);
        }
      }
    : undefined;

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
        isStatic: typeof children !== 'function',
        onVisibilityChange: onVisibilityChange ?? (() => undefined), // TODO: improve
      }}
    >
      <AriaTree
        {...rest}
        className={composeRenderProps(className, (className) =>
          tree({ className, variant }),
        )}
        disabledKeys={disabledKeys}
        dragAndDropHooks={dragAndDropHooks}
        expandedKeys={expandedKeys}
        items={items}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        selectionMode={selectionMode}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}
