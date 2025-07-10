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

import { DragVert } from '@accelint/icons';
import { createContext, memo, useContext } from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type ContextValue,
  DropIndicator,
  type DropTarget,
  composeRenderProps,
  useDragAndDrop,
} from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import './tree.css';
import { TreeStyles, TreeStylesDefaults } from '@/components/tree/styles';
import { isSlottedContextValue } from '@/lib/utils';
import { ExpandToggle } from './expand-toggle';
import { SelectionToggle } from './selection-toggle';
import type {
  ItemContentProps,
  ItemContentRenderProps,
  ItemTextProps,
  TreeItemProps,
  TreeProps,
} from './types';

const { tree, lines, item, label } = TreeStyles();

export const TreeContext =
  createContext<ContextValue<TreeProps<unknown>, HTMLDivElement>>(null);

const defaultRenderDropIndicator = (target: DropTarget) => (
  <DropIndicator target={target} className='border border-highlight-hover' />
);

export function Tree<T extends object>(props: TreeProps<T>) {
  const {
    children,
    className,
    variant = TreeStylesDefaults.variant,
    selectionType = 'visibility',
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
        className={composeRenderProps(className, (className) =>
          tree({ className, variant }),
        )}
        {...rest}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}

const Lines = memo(function Lines({ level }: { level: number }) {
  const context = useContext(TreeContext);
  const showRuleLines =
    (isSlottedContextValue(context) ? undefined : context?.showRuleLines) ??
    TreeStylesDefaults.hasRuleLines;

  return Array.from({ length: level }).map((_, i) => {
    const isBranch = i === level - 1;
    return (
      <div
        key={i}
        className={lines({ hasRuleLines: showRuleLines, isBranch })}
      />
    );
  });
});

export function ItemContent({ children }: ItemContentProps) {
  const context = useContext(TreeContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    TreeStylesDefaults.variant;

  const selectionType =
    (isSlottedContextValue(context) ? undefined : context?.selectionType) ??
    TreeStylesDefaults.selectionType;

  return (
    <AriaTreeItemContent>
      {(renderProps: ItemContentRenderProps) => {
        const {
          hasChildItems,
          isExpanded,
          isDisabled,
          selectionBehavior,
          selectionMode,
          allowsDragging,
          isSelected,
          level,
        } = renderProps;

        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';
        const isNotRoot = level > 1;

        return (
          <div
            className={item({ variant })}
            data-variant={variant}
            data-last-of-set={false}
          >
            {shouldShowSelection && (
              <SelectionToggle
                isSelected={isSelected}
                isDisabled={isDisabled}
                slot='selection'
              />
            )}

            {isNotRoot && <Lines level={level} />}

            <ExpandToggle
              hasChildItems={hasChildItems}
              isExpanded={isExpanded}
              size='medium'
              isDisabled={isDisabled}
            />
            <div className={label({ variant })}>
              {typeof children === 'function'
                ? children({
                    ...renderProps,
                    variant,
                    selectionType,
                    defaultChildren: null,
                  })
                : children}
            </div>
            {allowsDragging && (
              <IconButton
                slot='drag'
                size={variant === 'cozy' ? 'medium' : 'small'}
              >
                <Icon>
                  <DragVert />
                </Icon>
              </IconButton>
            )}
          </div>
        );
      }}
    </AriaTreeItemContent>
  );
}

/**
 * Handles display of an individual item in a tree
 */
export function TreeItem(props: TreeItemProps) {
  const { id, children, label, isLastOfSet = false, ...rest } = props;

  return (
    <AriaTreeItem
      id={id}
      className='rounded-medium border border-transparent data-[drop-target=true]:border-highlight-hover'
      textValue={label}
      {...rest}
    >
      {children}
    </AriaTreeItem>
  );
}

function ItemDescription({ children }: ItemTextProps) {
  return <div className='fg-default-dark text-body-s'>{children}</div>;
}
ItemDescription.displayName = 'Tree.ItemDescription';

function ItemIcon({ children }: ItemTextProps) {
  return <Icon size='medium'>{children}</Icon>;
}
ItemIcon.displayName = 'Tree.ItemIcon';

Tree.Content = ItemContent;
Tree.Item = TreeItem;
Tree.Description = ItemDescription;
Tree.Icon = ItemIcon;
