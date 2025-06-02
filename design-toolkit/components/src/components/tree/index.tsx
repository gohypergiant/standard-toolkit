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

import { cn } from '@/lib/utils';
import './tree.css';
import {
  ChevronDown,
  ChevronRight,
  DragVert,
  Hide,
  Show,
} from '@accelint/icons';
import {
  type ItemInstance,
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { type VariantProps, cva } from 'cva';
import { type ReactNode, createContext, useContext } from 'react';
import { Icon } from '../icon';
import type {
  TreeContextType,
  TreeNode as TreeNodeType,
  TreeProps,
} from './types';

/**
 * TODO:
 * - tree icons
 * - disentangle select/expand
 * - disabled behavior
 * - async loading
 * - read only behavior
 * - write usage example docs
 * - write tests for rando corner cases
 */

const TreeContext = createContext<TreeContextType>({
  variant: 'cozy',
  allowsDragging: true,
  showRuleLines: true,
});

export function Tree<T extends TreeNodeType>(props: TreeProps<T>) {
  const {
    children,
    items,
    variant = 'cozy',
    selected = [],
    expanded = [],
    setSelected,
    setExpanded,
    onDrop,
    allowsDragging = true,
    showRuleLines = true,
  } = props;

  const tree = useTree<T>({
    state: { selectedItems: selected, expandedItems: expanded },
    setSelectedItems: setSelected,
    setExpandedItems: setExpanded,
    rootItemId: 'root',
    getItemName: (item) => item.getItemData().label,
    isItemFolder: (item) => {
      const nodes = item.getItemData().childNodes;
      if (!nodes) {
        return false;
      }
      return Array.isArray(nodes) && nodes.length > 0;
    },
    dataLoader: {
      getItem: (key) => items[key],
      getChildren: (key) => items[key].childNodes ?? [],
    },
    canReorder: allowsDragging,
    canDrag: () => allowsDragging,
    onDrop,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
    ],
  });

  if (!items) {
    return null;
  }

  return (
    <TreeContext.Provider value={{ variant, allowsDragging, showRuleLines }}>
      <div
        {...tree.getContainerProps()}
        className='fg-default-light flex w-full flex-col overflow-auto outline-hidden'
      >
        {typeof children === 'function'
          ? tree.getItems().map((item) => {
              const lastOfSet =
                item.getItemMeta().setSize - 1 === item.getItemMeta().posInSet;
              return (
                <button
                  {...item.getProps()}
                  key={item.getId()}
                  data-last-of-set={lastOfSet}
                >
                  {children({ item, variant })}
                </button>
              );
            })
          : children}
      </div>
    </TreeContext.Provider>
  );
}
Tree.displayName = 'Tree';

const treeNodeStyles = cva(
  'flex items-center border-1 border-transparent hover:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        cozy: 'icon-size-xl gap-s text-header-m',
        compact: 'icon-size-l gap-s text-header-s', //icons
        tight: 'icon-size-l gap-xxs text-header-s',
      },
      isDragTarget: {
        true: 'bg-interactive-hover-dark',
      },
      isDragAbove: {
        true: 'border-highlight-hover border-t-2',
      },
      isDragBelow: {
        true: 'border-highlight-hover border-b-2',
      },
    },
  },
);

export interface TreeNodeProps<T> extends VariantProps<typeof treeNodeStyles> {
  children: ReactNode;
  item: ItemInstance<T>;
}

function TreeNode<T extends TreeNodeType>({
  children,
  item,
}: TreeNodeProps<T>) {
  const { variant, allowsDragging, showRuleLines } = useContext(TreeContext);

  const folder = item.isFolder() ? (
    <Icon>{item.isExpanded() ? <ChevronDown /> : <ChevronRight />}</Icon>
  ) : (
    <span className='group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]' />
  );

  const lines = Array.from({ length: item.getItemMeta().level }).map((_, i) => (
    <span
      key={i}
      className={cn(
        'relative',
        'self-stretch group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]',
        showRuleLines &&
          (i !== item.getItemMeta().level - 1 ? 'vert-line' : 'tree-line'),
      )}
    />
  ));

  return (
    <div
      data-variant={variant}
      className={cn(
        'group',
        treeNodeStyles({
          variant,
          isDragTarget: item.isDragTarget() || item.isDraggingOver(),
          isDragAbove: item.isDragTargetAbove(),
          isDragBelow: item.isDragTargetBelow(),
        }),
      )}
    >
      <Icon>{item.isSelected() ? <Show /> : <Hide />}</Icon>
      {lines}
      {folder}
      <div
        className={cn(
          'flex-1 items-center text-start',
          'group-data-[variant=compact]:py-xs group-data-[variant=cozy]:py-s group-data-[variant=tight]:py-xxs',
        )}
      >
        {item.getItemName()}
        {item.getItemData().description && (
          <div className='fg-default-dark text-body-s'>
            {item.getItemData().description}
          </div>
        )}
      </div>
      <div className='flex justify-end gap-s align-middle'>
        {children}
        {allowsDragging && (
          <Icon>
            <DragVert />
          </Icon>
        )}
      </div>
    </div>
  );
}
TreeNode.displayName = 'TreeNode';
Tree.Node = TreeNode;
