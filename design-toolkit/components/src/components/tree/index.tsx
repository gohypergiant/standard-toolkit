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

import { DragVert, LockFill } from '@accelint/icons';
import { cva } from 'cva';
import { createContext, memo, useContext } from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  DropIndicator,
  type DropTarget,
  type TreeItemContentRenderProps,
  useDragAndDrop,
} from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import './tree.css';
import { cn } from '@/lib/utils';
import { ExpandToggle } from './expand-toggle';
import { SelectionToggle } from './selection-toggle';
import type {
  TreeItemProps,
  TreeItem as TreeItemType,
  TreeNodeProps,
  TreeProps,
} from './types';

const DEFAULT_VARIANT = 'cozy';
const DEFAULT_SELECTION = 'visibility';

export const TreeContext = createContext<Partial<TreeProps>>({
  variant: DEFAULT_VARIANT,
  selectionType: DEFAULT_SELECTION,
  showRuleLines: true,
});

export const treeStyles = cva(
  'fg-default-light flex flex-col overflow-auto outline-hidden',
  {
    variants: {
      variant: {
        cozy: 'text-body-m',
        compact: 'text-body-s',
        tight: 'text-body-s',
      },
    },
    defaultVariants: {
      variant: 'cozy',
    },
  },
);

const defaultRenderDropIndicator = (target: DropTarget) => (
  <DropIndicator target={target} className='border border-highlight-hover' />
);

export function Tree<T extends TreeItemType = TreeItemType>(
  props: TreeProps<T>,
) {
  const {
    children,
    className,
    variant = DEFAULT_VARIANT,
    selectionType = DEFAULT_SELECTION,
    selectionMode = 'multiple',
    showRuleLines = true,
    dragAndDropConfig,
    ...rest
  } = props;

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: dragAndDropConfig?.getItems,
    onDrop: dragAndDropConfig?.onDrop,
    onReorder: dragAndDropConfig?.onReorder,
    onRootDrop: dragAndDropConfig?.onRootDrop,
    renderDragPreview: dragAndDropConfig?.renderDragPreview,
    renderDropIndicator:
      dragAndDropConfig?.renderDropIndicator ?? defaultRenderDropIndicator,
  });

  return (
    <TreeContext.Provider value={{ selectionType, variant, showRuleLines }}>
      <AriaTree
        selectionMode={selectionMode}
        dragAndDropHooks={dragAndDropHooks}
        className={cn(className, treeStyles({ variant }))}
        {...rest}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}

const Lines = memo(function Lines({
  level,
  showRuleLines,
}: { level: number; showRuleLines: boolean }) {
  return Array.from({ length: level }).map((_, i) => (
    <div
      key={i}
      className={cn([
        'relative self-stretch group-data-[variant=compact]:w-l group-data-[variant=cozy]:w-xl group-data-[variant=tight]:w-l',
        showRuleLines && (i !== level - 1 ? 'vert-line' : 'branching-line'),
      ])}
    />
  ));
});

const treeItemStyles = cva(
  'fg-default-light overflow-x group flex w-full items-center justify-items-start rounded-medium outline-hidden hover:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        cozy: 'icon-size-xl gap-s text-header-m',
        compact: 'icon-size-l gap-xs text-header-s',
        tight: 'icon-size-l gap-xs text-header-s',
      },
      isParentVisible: {
        false: 'fg-default-dark',
      },
    },
    defaultVariants: {
      variant: DEFAULT_VARIANT,
    },
  },
);

const treeItemLabelStyles = cva('flex flex-1 items-center', {
  variants: {
    variant: {
      cozy: 'min-h-xxl gap-xs',
      compact: 'min-h-[36px] gap-xs',
      tight: 'min-h-xl gap-xs',
    },
  },
});

/**
 * Handles display of an individual item in a tree
 */
export const TreeItem = (props: TreeItemProps) => {
  const { selectionType, variant, showRuleLines } = useContext(TreeContext);

  const {
    id,
    children,
    description,
    iconPrefix,
    label,
    treeActions,
    isLastOfSet = false,
    isReadOnly,
    isParentVisible,
    ...rest
  } = props;

  return (
    <AriaTreeItem
      id={id}
      key={id}
      className='rounded-medium border border-transparent data-[drop-target=true]:border-highlight-hover'
      textValue={label}
      {...rest}
    >
      <AriaTreeItemContent>
        {({
          hasChildItems,
          selectionBehavior,
          selectionMode,
          allowsDragging,
          isExpanded,
          isSelected,
          isDisabled,
          level,
        }: TreeItemContentRenderProps) => {
          const shouldShowSelection =
            selectionBehavior === 'toggle' && selectionMode !== 'none';
          const isNotRoot = level > 1;
          const sizeTranslated = variant === 'cozy' ? 'medium' : 'small';

          return (
            <div
              className={treeItemStyles({ variant, isParentVisible })}
              data-variant={variant}
              data-last-of-set={isLastOfSet}
            >
              {shouldShowSelection && (
                <SelectionToggle
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  selectionType={selectionType ?? DEFAULT_SELECTION}
                  isParentVisible={isParentVisible}
                  size={sizeTranslated}
                  slot='selection'
                />
              )}
              {isNotRoot && (
                <Lines level={level} showRuleLines={showRuleLines ?? true} />
              )}
              <ExpandToggle
                hasChildItems={hasChildItems}
                isExpanded={isExpanded}
                size={sizeTranslated}
                isDisabled={isDisabled}
              />
              <div className={treeItemLabelStyles({ variant })}>
                {iconPrefix && <Icon size={sizeTranslated}>{iconPrefix}</Icon>}
                <div className='items-center text-start'>
                  {label}
                  {description && (
                    <div className='fg-default-dark text-body-s'>
                      {description}
                    </div>
                  )}
                </div>
              </div>
              {isReadOnly && (
                <Icon
                  className='fg-default-dark aspect-square rounded-full bg-interactive-hover-dark p-xs'
                  size={sizeTranslated}
                >
                  <LockFill />
                </Icon>
              )}
              {treeActions?.({ variant, selectionType })}
              {allowsDragging && (
                <IconButton slot='drag' size={sizeTranslated}>
                  <Icon>
                    <DragVert />
                  </Icon>
                </IconButton>
              )}
            </div>
          );
        }}
      </AriaTreeItemContent>

      {/* @ts-expect-error package version mismatch TODO */}
      {children}
    </AriaTreeItem>
  );
};

/**
 * Provides a recursive helper to map over tree items
 * to simplify displaying tree data.
 */
function TreeNode(props: TreeNodeProps) {
  const {
    id,
    label,
    isLastOfSet = false,
    nodes,
    description,
    iconPrefix,
    treeActions,
    isReadOnly,
    isParentVisible,
  } = props;

  const hasChildren = nodes && nodes.length > 0;

  return (
    <TreeItem
      key={id}
      id={id}
      label={label}
      isLastOfSet={isLastOfSet}
      description={description}
      iconPrefix={iconPrefix}
      treeActions={treeActions}
      isReadOnly={isReadOnly}
      isParentVisible={isParentVisible}
    >
      {hasChildren &&
        nodes.map((child, idx) => (
          <TreeNode
            key={child.id}
            id={child.id}
            description={child.description}
            label={child.label}
            iconPrefix={child.iconPrefix}
            nodes={child.nodes}
            treeActions={treeActions}
            isLastOfSet={nodes.length - 1 === idx}
            isParentVisible={child.isParentVisible}
            isReadOnly={child.isReadOnly}
          />
        ))}
    </TreeItem>
  );
}

Tree.Item = TreeItem;
Tree.Node = TreeNode;
