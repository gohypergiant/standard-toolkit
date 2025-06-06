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
  propMemoizationFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { type VariantProps, cva } from 'cva';
import { type ReactNode, memo } from 'react';
import { Icon } from '../icon';
import type {
  TreeItemRenderProps,
  TreeNode as TreeNodeType,
  TreeSelectionMode,
  TreeViewProps,
} from './types';

/**
 * TODO: async loading?


const TreeContext = createContext<TreeContextType>({
  variant: 'cozy',
  allowsDragging: true,
  showRuleLines: true,
  selectionMode: 'visibility',
});
 */

export function TreeView<T extends TreeNodeType>(props: TreeViewProps<T>) {
  const {
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
    customChild,
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
      getItem: (key) => ({
        ...(items[key] as T),
        variant,
        selectionMode,
        allowsDragging,
        showRuleLines,
      }),
      getChildren: (key) => items[key]?.childNodes ?? [],
    },
    canReorder: allowsDragging,
    canDrag: () => allowsDragging,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
      propMemoizationFeature,
    ],
  });

  if (!items) {
    return null;
  }

  return (
    <div
      {...tree.getContainerProps()}
      className='fg-default-light overflow-x flex w-full flex-col outline-hidden'
    >
      {tree.getItems().map((item) => {
        const lastOfSet =
          item.getItemMeta().setSize - 1 === item.getItemMeta().posInSet;
        return (
          <div key={item.getId()} data-last-of-set={lastOfSet}>
            <TreeView.Node
              {...item.getProps()}
              {...item.getItemData()}
              customChild={customChild}
              isExpanded={item.isExpanded()}
              isSelected={item.isSelected()}
              toggleSelect={item.toggleSelect}
              isFolder={item.isFolder()}
              expand={item.expand}
              collapse={item.collapse}
            />
          </div>
        );
      })}

      <div
        className='absolute border border-highlight-hover'
        style={{ ...tree.getDragLineStyle() }}
      />
    </div>
  );
}

TreeView.displayName = 'TreeView';

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

export interface TreeNodeProps<T extends TreeNodeType>
  extends VariantProps<typeof treeNodeStyles>,
    Pick<
      ReturnType<ItemInstance<T>['getItemData']>,
      'isDisabled' | 'selectionMode' | 'allowsDragging' | 'showRuleLines'
    >,
    Omit<ItemInstance<T>, 'isDragTarget' | 'isSelected' | 'isExpanded'> {
  customChild?:
    | ReactNode
    | ((renderProps: TreeItemRenderProps<T>) => ReactNode);
  isExpanded?: boolean;
  isFolder?: boolean;
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

  // selection === 'none'
  return null;
}

const TreeNode = memo(
  <T extends TreeNodeType>({
    isExpanded,
    isSelected,
    isFolder,
    variant,
    expand,
    collapse,
    selectionMode,
    allowsDragging,
    showRuleLines,
    customChild,
    ...htmlProps
  }: TreeNodeProps<T>) => {
    const { onClick, ...props } = htmlProps;

    const expander = isExpanded ? (
      <button type='button' onClick={expand} {...props}>
        <Icon>
          <ChevronUp />
        </Icon>
      </button>
    ) : (
      <button type='button' onClick={collapse} {...props}>
        <Icon>
          <ChevronDown />
        </Icon>
      </button>
    );

    const spacer = (
      <span className='group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]' />
    );

    const folder = isFolder ? expander : spacer;

    const lines = Array.from({ length: item.getItemMeta().level }).map(
      (_, i) => (
        <span
          key={`${item.getId()}-level-${i}`}
          className={cn(
            'relative',
            'self-stretch group-data-[variant=compact]:w-[15px] group-data-[variant=cozy]:w-[20px] group-data-[variant=tight]:w-[10px]',
            showRuleLines &&
              (i !== item.getItemMeta().level - 1 ? 'vert-line' : 'tree-line'),
          )}
        />
      ),
    );

    const rightSlot =
      typeof customChild === 'function' ? customChild() : customChild; // pass through custom child component

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
          <button
            {...getProps()}
            onClick={toggleSelect}
            disabled={item.getItemData().isDisabled}
          >
            <SelectionIcons
              selectionMode={selectionMode ?? 'none'}
              isSelected={!!isSelected}
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
          {customChild()}
          {allowsDragging && (
            <Icon>
              <DragVert />
            </Icon>
          )}
        </div>
      </div>
    );
  },
);

TreeNode.displayName = 'TreeNode';
TreeView.Node = TreeNode;
