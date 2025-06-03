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
  CheckboxSelected,
  CheckboxUnselected,
  ChevronDown,
  ChevronUp,
  DragVert,
  Hide,
  LockFill,
  Show,
} from '@accelint/icons';
import {
  type ItemInstance,
  type TreeConfig,
  type TreeState,
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { type VariantProps, cva } from 'cva';
import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { Icon } from '../icon';
import type {
  TreeContextType,
  TreeNode as TreeNodeType,
  TreeProps,
  TreeSelectionMode,
} from './types';

/**
 * TODO: disabled behavior?
 * TODO: async loading?
 * - write usage example docs
 * - write tests for rando corner cases
 */

const TreeContext = createContext<TreeContextType>({
  variant: 'cozy',
  allowsDragging: true,
  showRuleLines: true,
  selectionMode: 'visibility',
});

export function Tree<T extends TreeNodeType>(props: TreeProps<T>) {
  const {
    children,
    items,
    variant = 'cozy',
    selected,
    expanded,
    setSelected,
    setExpanded,
    onDrop,
    selectionMode = 'visibility',
    allowsDragging = true,
    showRuleLines = true,
  } = props;

  const options: Partial<TreeConfig<T>> = {};
  const state: Partial<TreeState<T>> = {};

  if (selected && setSelected && selectionMode !== 'none') {
    state.selectedItems = selected;
    options.setSelectedItems = setSelected;
  }

  if (expanded && setExpanded) {
    state.expandedItems = expanded;
    options.setExpandedItems = setExpanded;
  }

  if (allowsDragging && onDrop) {
    options.canReorder = true;
    options.canDrag = () => true;
    options.onDrop = onDrop;
  }

  const tree = useTree<T>({
    state,
    ...options,
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
      getChildren: (key) => items[key]?.childNodes ?? [],
    },
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
    <TreeContext.Provider
      value={{ variant, selectionMode, allowsDragging, showRuleLines }}
    >
      <div
        {...tree.getContainerProps()}
        className='fg-default-light overflow-x flex w-full flex-col outline-hidden'
      >
        {typeof children === 'function'
          ? tree.getItems().map((item) => {
              const lastOfSet =
                item.getItemMeta().setSize - 1 === item.getItemMeta().posInSet;
              return (
                <div key={item.getId()} data-last-of-set={lastOfSet}>
                  {children({ item, variant })}
                </div>
              );
            })
          : children}
        <div
          className='absolute border border-highlight-hover'
          style={{ ...tree.getDragLineStyle() }}
        />
      </div>
    </TreeContext.Provider>
  );
}

Tree.displayName = 'Tree';

const treeNodeStyles = cva(
  'flex items-center border-transparent border-t border-b hover:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        cozy: 'icon-size-xl gap-s text-header-m',
        compact: 'icon-size-l gap-s text-header-s', //icons
        tight: 'icon-size-l gap-xxs text-header-s',
      },
      isSelected: {
        false: 'fg-default-dark',
      },
      isReadOnly: {
        true: 'fg-default-dark',
      },
      isDragTarget: {
        true: 'bg-interactive-hover-dark',
      },
    },
  },
);

export interface TreeNodeProps<T> extends VariantProps<typeof treeNodeStyles> {
  children: ReactNode;
  item: ItemInstance<T>;
}

function SelectionIcons({
  selectionMode,
  isSelected,
}: { selectionMode: TreeSelectionMode; isSelected: boolean }) {
  if (selectionMode === 'visibility') {
    return <Icon>{isSelected ? <Show /> : <Hide />}</Icon>;
  }

  if (selectionMode === 'checkbox') {
    return (
      <Icon>{isSelected ? <CheckboxSelected /> : <CheckboxUnselected />}</Icon>
    );
  }

  // no selection
  return null;
}

function TreeNode<T extends TreeNodeType>({
  children,
  item,
}: TreeNodeProps<T>) {
  const { variant, selectionMode, allowsDragging, showRuleLines } =
    useContext(TreeContext);

  const {
    getProps,
    toggleSelect,
    isSelected,
    isFolder,
    expand,
    collapse,
    isExpanded,
  } = item;

  const { onClick, ...props } = getProps();

  const expandAction = isExpanded() ? (
    <button type='button' onClick={expand} {...getProps()}>
      <Icon>
        <ChevronUp />
      </Icon>
    </button>
  ) : (
    <button type='button' onClick={collapse} {...getProps()}>
      <Icon>
        <ChevronDown />
      </Icon>
    </button>
  );

  const folder = isFolder() ? (
    expandAction
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
      {...props}
      data-variant={variant}
      className={cn(
        'group',
        treeNodeStyles({
          variant,
          isDragTarget: item.isDragTarget() || item.isDraggingOver(),
          isSelected: item.isSelected(),
          isReadOnly: item.getItemData().isReadOnly,
        }),
      )}
    >
      {selectionMode !== 'none' && item.getItemData().isReadOnly ? (
        <Icon>
          <LockFill />
        </Icon>
      ) : (
        <button {...getProps()} onClick={toggleSelect}>
          <SelectionIcons
            selectionMode={selectionMode ?? 'none'}
            isSelected={isSelected()}
          />
        </button>
      )}
      {lines}
      {folder}
      {item.getItemData().iconPrefix && (
        <Icon>{item.getItemData().iconPrefix}</Icon>
      )}
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
